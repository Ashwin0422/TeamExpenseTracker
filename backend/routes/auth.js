const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Register ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, authProvider: 'local' });
    await user.save();

    res.json({ msg: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─── Login ──────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Block Google users from logging in with password
    if (user.authProvider === 'google') {
      return res.status(400).json({ msg: 'Please sign in with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, picture: user.picture } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─── Google Login ────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ msg: 'Token is required' });

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub: googleId } = ticket.getPayload();

    // Find user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // New user → create
      user = await User.create({
        name,
        email,
        picture,
        googleId,
        authProvider: 'google',
      });
    } else if (!user.googleId) {
      // Existing local user → link Google to their account
      user.googleId = googleId;
      user.picture = picture;
      user.authProvider = 'google';
      await user.save();
    }

    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token: sessionToken,
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ msg: 'Google authentication failed' });
  }
});

// ─── Get All Users ───────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;