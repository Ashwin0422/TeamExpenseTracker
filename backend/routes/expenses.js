const router = require('express').Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const Team = require('../models/Team');
const { cloudinary, upload } = require('../config/cloudinary');
const { redisClient } = require('../config/redis');

// Add expense
router.post('/add', auth, upload.single('invoice'), async (req, res) => {
  try {
    const { teamId, title, amount, category } = req.body;

    const expense = new Expense({
      teamId,
      userId: req.user.id,
      title,
      amount,
      category,
      invoice: req.file
        ? {
            url:          req.file.path,
            publicId:     req.file.filename,
            resourceType: req.file.mimetype === 'application/pdf' ? 'raw' : 'image',
            originalName: req.file.originalname,
          }
        : undefined,
    });

    await expense.save();

    // Invalidate caches since new expense was added
    await redisClient.del(`team_expenses:${teamId}`);
    await redisClient.del(`my_expenses:${req.user.id}`);

    res.status(201).json(expense);
  } catch (err) {
    if (req.file?.filename) {
      await cloudinary.uploader.destroy(req.file.filename);
    }
    res.status(500).json({ message: err.message });
  }
});

// Get all expenses for a team
router.get('/team/:teamId', auth, async (req, res) => {
  try {
    const cacheKey = `team_expenses:${req.params.teamId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const expenses = await Expense.find({ teamId: req.params.teamId }).populate('userId', 'name');
    const team = await Team.findById(req.params.teamId);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const responseData = {
      expenses,
      totalSpent,
      budget: team.budget,
      remaining: team.budget - totalSpent,
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Not found' });

    if (expense.invoice?.publicId) {
      await cloudinary.uploader.destroy(expense.invoice.publicId, {
        resource_type: expense.invoice.resourceType,
      });
    }

    await expense.deleteOne();

    // Invalidate caches since expense was deleted
    await redisClient.del(`team_expenses:${expense.teamId}`);
    await redisClient.del(`my_expenses:${expense.userId}`);

    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my expenses
router.get("/my-expenses", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `my_expenses:${userId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) return res.status(200).json(JSON.parse(cached));

    const expenses = await Expense.find({ userId })
      .populate("teamId", "teamName budget")
      .populate("userId", "name email");

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const responseData = {
      success: true,
      totalExpenses: expenses.length,
      totalSpent,
      expenses,
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user expenses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;