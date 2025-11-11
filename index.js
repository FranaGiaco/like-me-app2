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

// ✅ GET: obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener posts:", error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

// ✅ POST: crear un nuevo post
app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion, likes } = req.body;
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *",
      [titulo, img, descripcion, likes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al crear post:", error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

// ✅ PUT: sumar un like al post
app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error al actualizar likes:", error);
    res.status(500).json({ error: "Error al actualizar likes" });
  }
});

// ✅ DELETE: eliminar un post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.json({ message: "🗑️ Post eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar post:", error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});

app.listen(3000, () => console.log("✅ Servidor encendido en puerto 3000"));

