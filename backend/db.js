import mysql from "mysql2/promise";

// Connexion MariaDB
export const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",           
  database: "email_app",   
  port: 3306               
});

console.log("📦 Connecté à MariaDB !");
