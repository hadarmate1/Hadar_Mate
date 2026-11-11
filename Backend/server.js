
const express = require("express");
const mysql = require("mysql2/promise");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3307,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "fitness_db"
};
const pool = mysql.createPool(dbConfig);

app.get("/berletek", async (req, res) => {
    try {
        const [adatok] = await pool.query(
            "Select berletek.id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto, tipusok.nev FROM berletek INNER JOIN tipusok ON berletek.tipus_id = tipusok.id ORDER BY berletek.ar ASC;"
        );

        res.status(200).json(adatok);
    }
    catch (hiba) {
        res.status(500).send("Adatbazis hiba: " + hiba.message);
    }
});
app.get("/berletek/elerheto", async (req, res) => {
    try {
        const [adatok] = await pool.query(
            "SELECT berletek.id,berletek.tipus_id,berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto FROM berletek WHERE berletek.elerheto = 1 AND berletek.ervenyesseg_nap <=30;"
        );

        res.status(200).json(adatok);
    }
    catch (hiba) {
        res.status(500).send("Adatbazis hiba: " + hiba.message);
    }
});
app.get("/berletek/kereses/:Havi", async (req, res) => {
    try {
        const [adatok] = await pool.query(
            "SELECT berletek.id, berletek.tipus_id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto FROM berletek WHERE berletek.megnevezes LIKE '%Havi%';"
        );

        res.status(200).json(adatok);
    }
    catch (hiba) {
        res.status(500).send("Adatbazis hiba: " + hiba.message);
    }
});
app.get("/berletek/dragak", async (req, res) => {
    try {
        const [adatok] = await pool.query(
            "SELECT berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap FROM berletek WHERE berletek.ar > 20000 ORDER BY berletek.ervenyesseg_nap DESC;"
        );

        res.status(200).json(adatok);
    }
    catch (hiba) {
        res.status(500).send("Adatbazis hiba: " + hiba.message);
    }
});
app.get("/tipusok/statisztika", async (req, res) => {
    try {
        const [adatok] = await pool.query(
            "SELECT tipusok.nev,COUNT(tipusok.id) as 'darabszam' , ROUND(AVG(berletek.ar)) as 'kerekitett ar' FROM tipusok INNER JOIN berletek on tipusok.id = berletek.tipus_id GROUP BY tipusok.nev;"
        );

        res.status(200).json(adatok);
    }
    catch (hiba) {
        res.status(500).send("Adatbazis hiba: " + hiba.message);
    }
});


app.get("/", (req, res) => {
    res.status(200).send("A szerver mukodik!");
});

app.get("/teszt", (req, res) => {
    res.status(200).send("MUKODIK");
});

app.listen(PORT, () => {
    console.log("Szerver fut a " + PORT + " porton!");
});
