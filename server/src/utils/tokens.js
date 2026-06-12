import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function signAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
}

export function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
