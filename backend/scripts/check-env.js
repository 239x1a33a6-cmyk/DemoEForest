#!/usr/bin/env node
// Simple environment validation script.
// Loads .env (if present) and checks required variables.

const fs = require('fs');
try {
  // Prefer loading .env.local then .env from the current working directory
  const path = require('path');
  // Try to load dotenv from the current working directory's node_modules first
  let dotenv;
  try {
    const dotenvPath = require.resolve('dotenv', { paths: [process.cwd()] });
    dotenv = require(dotenvPath);
  } catch (err) {
    // fallback to normal require
    dotenv = require('dotenv');
  }
  const localPath = path.resolve(process.cwd(), '.env.local');
  const envPath = path.resolve(process.cwd(), '.env');
  if (require('fs').existsSync(localPath)) {
    dotenv.config({ path: localPath });
  } else if (require('fs').existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    // fallback to default behavior
    dotenv.config();
  }
} catch (e) { /* dotenv not installed or other error — continue, env may be set in environment */ }

const required = [
  'JWT_SECRET',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  // DB vars only required if USE_DATABASE is true
  'USE_DATABASE'
];

function missing(keys) {
  return keys.filter(k => !process.env[k] || process.env[k].trim() === '');
}

const useDb = (process.env.USE_DATABASE || 'false').toLowerCase() === 'true';
let missingKeys = missing(required.filter(k => k !== 'USE_DATABASE'));
if (missingKeys.length === 0 && useDb) {
  const dbKeys = ['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASSWORD'];
  missingKeys = missingKeys.concat(missing(dbKeys));
}

if (missingKeys.length) {
  console.error('Missing required environment variables:');
  missingKeys.forEach(k => console.error(' -', k));
  console.error('\nPlease add them to your environment or create a `.env.local` file in the project root.');
  process.exitCode = 2;
} else {
  console.log('Environment validation passed.');
}
