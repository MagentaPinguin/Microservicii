import express from "express";
import pkg from "pg";
import bcrypt from "bcryptjs";
const { Client } = pkg;

const app = express();
app.use(express.json());
const PORT = process.env.PORT;

// PostgreSQL client
const client = new Client({
  host: "db",
  port: 5432 | process.env.DB_PORT,
  user: "postgres",
  password: "postgres",
  database: "mydb",
});

// Connect once at startup
client
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) =>
    console.error("❌ PostgreSQL connection error:", err.message)
  );

//Connection check endpoint
app.get("/users/status", async (req, res) => {
  try {
    // Simple query to check connection
    await client.query("SELECT 1");
    res.json({ status: "ok", message: "Connected to PostgreSQL" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

//Register endpoint
app.post("/users/register", async (req, res) => {
  const { email, nume, prenume, password, type } = req.body;

  if (!email || !nume || !prenume || !password || !type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Hash password
    const saltRounds = 6;

    const password_hash = await bcrypt.hash(password, saltRounds);
    console.log("Register request body:", req.body);
    console.log("Register request body:", password_hash);

    const result = await client.query(
      `INSERT INTO users (email, nume, prenume, password_hash, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, nume, prenume, type, created_at`,
      [email, nume, prenume, password_hash, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

//Login  endpoint
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      id: user.id,
      email: user.email,
      nume: user.nume,
      prenume: user.prenume,
      type: user.type,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
