import { readFile, writeFile } from "fs/promises";

const DB_PATH = "./database.json";

// Charger la base
export async function loadDB() {
  const data = await readFile(DB_PATH, "utf8");
  return JSON.parse(data);
}

// Sauvegarder la base
export async function saveDB(db) {
  await writeFile(DB_PATH, JSON.stringify(db, null, 2));
  return true;
}

// Ajouter un user
export async function addUser(email) {
  const db = await loadDB();

  // Vérifier doublon
  if (db.users.some(user => user.email === email)) {
    throw new Error("DUPLICATE_EMAIL");
  }

  db.users.push({
    email,
    created_at: new Date().toISOString()
  });

  await saveDB(db);
}
