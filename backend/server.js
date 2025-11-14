import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { addUser } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir le frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Transporteur mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});



const PORT = process.env.PORT || 3000;
// Route d'inscription
app.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    await addUser(email);

    res.json({ message: "Inscription enregistrée ! Tu recevras un mail dans 1 minute." });

    // Envoi du mail après 1 minute
    setTimeout(() => {
      transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Bienvenue🎉",
          text: "OUI ! Tu t'es fait hacker, Mouahahah ! Ceci est un mail automatique envoyé après 1 minute."
        },
        (err) => {
          if (err) console.log("❌ Erreur envoi mail:", err);
          else console.log("📩 Email envoyé à", email);
        }
      );
    }, 60000);

  } catch (err) {
    if (err.message === "DUPLICATE_EMAIL") {
      return res.status(400).json({ message: "Cet email est déjà enregistré." });
    }
    return res.status(500).json({ message: "Erreur serveur." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});