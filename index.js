import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "Agatha2025#",
  database: "likeme",
  port: 5432,
});

app.get("/posts", async (req, res) => {
  const result = await pool.query("SELECT * FROM posts");
  res.json(result.rows);
});

app.post("/posts", async (req, res) => {
  const { titulo, img, descripcion, likes } = req.body;
  const result = await pool.query(
    "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
    [titulo, img, descripcion, likes]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => console.log("✅ Servidor encendido en puerto 3000"));
