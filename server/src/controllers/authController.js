import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { hashToken, signAccessToken, signRefreshToken } from '../utils/tokens.js';

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    city: user.city,
    area: user.area,
    points: user.points,
    reportsSubmitted: user.reportsSubmitted
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, role = 'citizen', city = 'Bhopal', area = '' } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const normalizedRole = role === 'admin' ? 'admin' : 'citizen';
    const user = await User.create({ name, email, phone, password, role: normalizedRole, city, area });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.status(201).json({ user: publicUser(user), accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +refreshTokenHash');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    res.json({ user: publicUser(user), accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshTokenHash');

    if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    res.json({ accessToken: signAccessToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res) {
  res.json({ user: publicUser(req.user) });
}
