import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sert les fichiers statiques depuis la racine
app.use(express.static(path.join(__dirname, "../")));

// Route principale
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Config email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "joelmoyo249@gmail.com", pass: "kqcv npen xrbe oahg" }
});

// Route d'inscription
app.post("/register", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email requis." });

  try {
    await db.execute("INSERT INTO users (email) VALUES (?)", [email]);
    res.json({ message: "Inscription reussie ! Vous allez recevoir un mail dans 1 minute." });

    setTimeout(() => {
      transporter.sendMail({
        from: "joelmoyo249@gmail.com",
        to: email,
        subject: "Je suis lààààà !!! ",
        text: "Je suis navré de vous apprendre que vous avez été piraté !"
      }, (err) => {
        if (err) console.log("❌ Erreur envoi mail:", err);
      });
    }, 60000);

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Email déjà enregistré." });
    res.status(500).json({ message: "Erreur serveur." });
  }
});

app.listen(3000, () => console.log("🚀 Serveur démarré sur http://localhost:3000"));
