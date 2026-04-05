const router = require('express').Router();
const auth = require('../middleware/auth');
const Team = require('../models/Team');
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { redisClient } = require('../config/redis');

// Create team
router.post('/create', auth, async (req, res) => {
  try {
    const { teamName, budget, startDate, endDate } = req.body;
    const teamCode = uuidv4().slice(0, 8).toUpperCase();
    const team = new Team({ teamName, budget, startDate, endDate, teamCode, leaderId: req.user.id, members: [req.user.id] });
    await team.save();
    await User.findByIdAndUpdate(req.user.id, { $push: { teams: team._id } });

    // Invalidate my-teams cache for this user
    await redisClient.del(`my_teams:${req.user.id}`);

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit team
router.put('/:teamId', auth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { teamName, budget, startDate, endDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: 'Invalid team ID' });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (team.leaderId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team leader can edit team details' });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (budget <= 0) {
      return res.status(400).json({ message: 'Budget must be greater than 0' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        ...(teamName && { teamName }),
        ...(budget && { budget }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      },
      { new: true }
    ).populate('leaderId', 'name email')
     .populate('members', 'name email');

    // Invalidate affected caches
    await redisClient.del(`team_overview:${teamId}`);
    await redisClient.del(`my_teams:${req.user.id}`);

    return res.status(200).json({
      message: 'Team updated successfully',
      team: {
        id: updatedTeam._id,
        teamName: updatedTeam.teamName,
        budget: updatedTeam.budget,
        startDate: updatedTeam.startDate,
        endDate: updatedTeam.endDate,
        teamCode: updatedTeam.teamCode,
        leader: updatedTeam.leaderId,
        members: updatedTeam.members,
      },
    });
  } catch (err) {
    console.error('Edit team error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Join via code
router.post('/join', auth, async (req, res) => {
  try {
    const team = await Team.findOne({ teamCode: req.body.teamCode });
    if (!team) return res.status(404).json({ msg: 'Team not found' });

    const existing = await JoinRequest.findOne({ teamId: team._id, userId: req.user.id });
    if (existing) return res.status(400).json({ msg: 'Request already sent' });

    await new JoinRequest({ teamId: team._id, userId: req.user.id }).save();

    // Invalidate join requests cache for the team leader
    await redisClient.del(`my_requests:${team.leaderId}`);

    res.json({ msg: 'Join request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/reject join request
router.put('/request/:id', auth, async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id).populate('teamId');
    if (request.teamId.leaderId.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized' });

    request.status = req.body.status;
    await request.save();

    if (req.body.status === 'approved') {
      await Team.findByIdAndUpdate(request.teamId, { $push: { members: request.userId } });
      await User.findByIdAndUpdate(request.userId, { $push: { teams: request.teamId } });

      // Invalidate caches for the newly added member and team
      await redisClient.del(`my_teams:${request.userId}`);
      await redisClient.del(`team_overview:${request.teamId._id}`);
    }

    // Always invalidate join requests cache
    await redisClient.del(`my_requests:${req.user.id}`);

    res.json({ msg: `Request ${req.body.status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my join requests (as leader)
router.get("/my-requests", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `my_requests:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const userTeams = await Team.find({ leaderId: userId }).select("_id");
    const teamIds = userTeams.map((team) => team._id);

    const joinRequests = await JoinRequest.find({
      teamId: { $in: teamIds },
      status: "pending",
    })
      .populate("teamId", "teamName budget startDate endDate teamCode")
      .populate("userId", "name email");

    const responseData = {
      success: true,
      totalRequests: joinRequests.length,
      joinRequests,
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user join requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get my teams
router.get("/my-teams", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `my_teams:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const user = await User.findById(userId).populate(
      "teams",
      "teamName budget startDate endDate teamCode"
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    const responseData = {
      success: true,
      totalTeams: user.teams.length,
      teams: user.teams,
    };

    await redisClient.setEx(cacheKey, 120, JSON.stringify(responseData));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user teams:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Team overview
router.get('/:teamId/overview', async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ success: false, message: 'Invalid team ID' });
    }

    const cacheKey = `team_overview:${teamId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const team = await Team.findById(teamId)
      .populate('leaderId', 'name email')
      .populate('members', 'name email');

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const expenses = await Expense.find({ teamId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = team.budget - totalSpent;
    const usedPercentage = team.budget > 0
      ? parseFloat(((totalSpent / team.budget) * 100).toFixed(2))
      : 0;

    const response = {
      success: true,
      data: {
        team: {
          id: team._id,
          teamName: team.teamName,
          teamCode: team.teamCode,
          startDate: team.startDate,
          endDate: team.endDate,
          leader: team.leaderId,
          members: team.members,
          totalMembers: team.members.length,
        },
        budget: {
          total: team.budget,
          spent: totalSpent,
          remaining,
          usedPercentage,
        },
        expenses: {
          total: expenses.length,
          items: expenses,
        },
      },
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

    return res.status(200).json(response);
  } catch (error) {
    console.error('Team overview error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;