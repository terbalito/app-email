import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Config email (Gmail + mot de passe application)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "joelmoyo249@gmail.com",
    pass: "kqcv npen xrbe oahg" 
  }
});

// Route d'inscription
app.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    // 1) Sauvegarde dans la base
    await db.execute("INSERT INTO users (email) VALUES (?)", [email]);

    console.log("Nouvel utilisateur enregistré :", email);

    res.json({ message: "Inscription enregistrée ! Tu recevras un email dans 1 minute." });

    // 2) Envoi du mail après 60 secondes
    setTimeout(() => {
      transporter.sendMail({
        from: "neoapp@gmail.com",
        to: email,
        subject: "Bienvenue 🎉",
        text: "Merci pour ton inscription ! Ceci est un mail automatique envoyé après 1 minute."
      }, (err) => {
        if (err) console.log("❌ Erreur envoi mail:", err);
        else console.log("📩 Email envoyé à", email);
      });
    }, 60000);

  } catch (error) {
    console.log("Erreur SQL:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Cet email est déjà enregistré." });
    }

    return res.status(500).json({ message: "Erreur serveur." });
  }
});

app.listen(3000, () => {
  console.log("🚀 Serveur démarré sur http://localhost:3000");
});
