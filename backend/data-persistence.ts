
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type AgendaData = {
  items: Record<string, any>;
};

function createInitialData(): AgendaData {
  return {
    items: {},
  };
}


// ====================
// Encryption Utilities
// --------------------

const ALGORITHM = "aes-256-cbc";
const FIXED_SALT = "my-app-salt-2024"; // any constant string

function deriveKeyAndIV(password: string) {
  const key = crypto.scryptSync(password, FIXED_SALT, 32);
  const iv  = crypto.scryptSync(password, FIXED_SALT + "-iv", 16);
  return { key, iv };
}

function encrypt(data: string, file: string, password: string) {
  const { key, iv } = deriveKeyAndIV(password);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(data),
    cipher.final()
  ]);
  fs.writeFileSync(file, ciphertext);
}

function decrypt(file: string, password: string) {
  const { key, iv } = deriveKeyAndIV(password);
  const ciphertext = fs.readFileSync(file);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
  ]);

  return plaintext.toString('utf-8');
}


// ==============
// File Utilities
// --------------

export const DATA_DIR = './data';

function resolvePath(username: string) {
  if (username.includes('.')) {
    throw new Error("Invalid username: cannot contain dots.");
  }
  return path.resolve(DATA_DIR, username);
}

export function createDataFile(username: string, password: string) {
  const path = resolvePath(username);
  if (fs.existsSync(path)) {
    throw new Error("File already exists: " + path);
  }
  try {
    encrypt(JSON.stringify(createInitialData()), path, password);
  } catch (err) {
    throw new Error("Failed to encrypt.");
  }
}

export function loadDataFile(username: string, password: string) {
  const path = resolvePath(username);
  if (!fs.existsSync(path)) {
    throw new Error("File does not exist: " + path);
  }
  const data = decrypt(path, password);
  try {
    return JSON.parse(data) as AgendaData;
  } catch (err) {
    throw new Error("Invalid password.");
  }
}

export function persistDataFile(username: string, password: string, data: AgendaData) {
  const path = resolvePath(username);
  if (!fs.existsSync(path)) {
    throw new Error("File does not exist: " + path);
  }
  try {
    encrypt(JSON.stringify(data), path, password);
  } catch (err) {
    throw new Error("Failed to encrypt.");
  }
}