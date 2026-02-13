import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "150m" },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "missing_token" });
  }

  try {
    const token = header.slice(7);

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ ok: false, error: "invalid_or_expired_token" });
  }
}
