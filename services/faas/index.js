import express from "express";

const app = express();

app.get("/random-image", (req, res) => {
  const _seed = Math.floor(Math.random() * (5000 - 100 + 1)) + 100;

  res.json({ url: `https://picsum.photos/seed/${_seed}/400/400` });
});

const PORT = Number(process.env.PORT || 8083);
app.listen(PORT, "0.0.0.0", () => console.log("random image faas", PORT));
