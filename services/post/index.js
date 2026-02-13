import express from "express";
import { pool } from "./db.js";
import { requireAuth } from "./jwthelper.js";

const app = express();
app.use(express.json());

app.get("/", requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.sub;

    if (!ownerId) {
      return res.status(401).json({ ok: false, error: "invali id" });
    }

    const { rows } = await pool.query(
      `SELECT 
        p.id,
        p.details,
        p.created_at,
        u.name AS owner_name
      FROM posts p
      JOIN users u ON p.owner_id = $1;`,
      [ownerId],
    );

    return res.json({ ok: true, posts: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

app.post("/", requireAuth, async (req, res) => {
  try {
    const ownerId = req.user.sub;
    const { details } = req.body;

    if (!ownerId) {
      return res.status(401).json({ ok: false, error: "invalid id" });
    }

    if (!details || typeof details !== "string") {
      return res.status(400).json({ ok: false, error: "details_required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO posts (owner_id, details)
       VALUES ($1, $2)
       RETURNING id, owner_id, details, created_at`,
      [ownerId, details],
    );

    return res.status(201).json({ ok: true, post: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

const PORT = Number(process.env.PORT || 8082);
app.listen(PORT, "0.0.0.0", () => console.log("posts servic run on", PORT));
