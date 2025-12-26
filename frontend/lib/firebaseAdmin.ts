// Server-side Firebase Admin initialization
import admin from 'firebase-admin';

// Expect service account details in env vars or use application default credentials.
// Recommended: set FIREBASE_ADMIN_PRIVATE_KEY (with newlines as \n), FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PROJECT_ID

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY_RAW;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        } as any),
        projectId,
      });
    } else {
      // Fallback to Application Default Credentials if available in the environment
      admin.initializeApp();
    }
  } catch (err) {
    // In serverless environments re-initialization may throw; ignore if already initialized
    console.warn('firebase-admin init error', err);
  }
}

export function getAdminAuth() {
  return admin.auth();
}

export default admin;
