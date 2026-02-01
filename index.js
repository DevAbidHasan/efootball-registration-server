const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

async function startServer() {
  try {
    const db = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT,
    });

    console.log("MySQL connected successfully");

    app.get("/players", async (req, res) => {
      try {
        const [rows, entries ]= await db.execute("SELECT * FROM players");
        res.send(rows);;
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to fetch players",
          error: error.message,
        });
      }
    });

    app.get("/approved-players", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM players WHERE status = 'approved'"
    );

    res.send(rows); // send approved players
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved players",
      error: error.message,
    });
  }
});


    // post - players
   app.post("/players-registration", async (req, res) => {
  try {
    const { name, department, game_id, batch, mobile, transaction_id } = req.body;

    if (!name || !department || !game_id || !batch || !mobile || !transaction_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const query = `
      INSERT INTO players
      (name, department, game_id, batch, mobile, transaction_id, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;

    const [result] = await db.execute(query, [
      name, department, game_id, batch, mobile, transaction_id,
    ]);

    res.status(201).json({
      success: true,
      message: "Player registered successfully",
      playerId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting player:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


    app.get("/", (req, res) => {
      res.send("homepage");
    });

    app.listen(port, () => {
      console.log("Server is running on port:", port);
    });

  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
}
startServer();
