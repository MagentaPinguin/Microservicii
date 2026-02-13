import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "./db.js";
import { requireAuth, signAccessToken } from "./jwthelper.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) =>
  res.json({ ok: true, service: process.env.INSTANCE_NAME }),
);

app.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body ?? {};
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ ok: false, error: "email_password_name_required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ ok: false, error: "password_too_short" });
    }

    const emailNorm = String(email).toLowerCase().trim();
    const nameNorm = String(name).trim();
    const hash = await bcrypt.hash(String(password), 12);

    const q = `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, role, created_at;
    `;
    const { rows } = await pool.query(q, [emailNorm, hash, nameNorm]);
    const user = rows[0];

    const accessToken = signAccessToken(user);
    return res.status(201).json({ ok: true, accessToken, user });
  } catch (e) {
    if (e?.code === "23505")
      return res.status(409).json({ ok: false, error: "email_already_exists" });
    console.error("register error:", e);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "email_password_required" });
    }

    const emailNorm = String(email).toLowerCase().trim();
    const q = `SELECT id, email, password, role FROM users WHERE email = $1`;
    const { rows } = await pool.query(q, [emailNorm]);

    if (rows.length === 0)
      return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok)
      return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const accessToken = signAccessToken(user);
    return res.json({
      ok: true,
      accessToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

app.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;

    const q = `
      SELECT id, email, name, role, created_at
      FROM users
      WHERE id = $1
    `;

    const { rows } = await pool.query(q, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "user_not_found" });
    }

    return res.json({
      ok: true,
      user: rows[0],
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

const PORT = Number(process.env.PORT || 8081);
app.listen(PORT, "0.0.0.0", () => console.log("auth listening on", PORT));
