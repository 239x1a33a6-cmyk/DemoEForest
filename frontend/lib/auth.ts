// Authentication helpers: signup, login, signOut and current user retrieval.
import { getAuthClient } from "./firebaseClient";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type UserCredential,
} from "firebase/auth";
import { getFirestoreClient } from "./firebaseClient";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  state?: string;
  district?: string;
  block?: string;
  village?: string;
  subdivision?: string;
};

// Signup: creates auth user and saves profile to Firestore `users/{uid}`
export async function signup(payload: SignupPayload) {
  const auth = getAuthClient();
  if (!auth) throw new Error("Auth is not available on server. Call from client-side.");

  try {
    const cred: UserCredential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );

    // update displayName on auth profile
    if (cred.user) {
      await updateProfile(cred.user, { displayName: payload.name });

      // Save user info in Firestore users collection
      const db = getFirestoreClient();
      const userRef = doc(db, "users", cred.user.uid);
      await setDoc(userRef, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        role: payload.role || 'TRIBAL', // Default to TRIBAL
        state: payload.state || null,
        district: payload.district || null,
        block: payload.block || null,
        village: payload.village || null,
        subdivision: payload.subdivision || null,
        createdAt: serverTimestamp(),
      });
    }

    return { success: true, uid: cred.user.uid };
  } catch (err: any) {
    // return structured error for frontend
    return { success: false, error: err?.message || String(err) };
  }
}

// Login with email/password
export async function login(email: string, password: string) {
  const auth = getAuthClient();
  if (!auth) throw new Error("Auth is not available on server. Call from client-side.");

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, uid: cred.user.uid, email: cred.user.email };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// Sign out currently logged-in user
export async function signOut() {
  const auth = getAuthClient();
  if (!auth) throw new Error("Auth is not available on server. Call from client-side.");
  await firebaseSignOut(auth);
}

// Get current user (client only). Returns null if executed server-side.
export function getCurrentUser() {
  const auth = getAuthClient();
  if (!auth) return null;
  return auth.currentUser;
}
// Imported from Multilingual Copy - Data Digitalization Module - Safe Integration
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12');
const SESSION_DURATION = process.env.ADMIN_SESSION_DURATION || '15m';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: any): string {
  // jsonwebtoken types can be strict depending on version; cast to any to avoid overload issues
  return (jwt as any).sign(payload, JWT_SECRET as any, {
    expiresIn: SESSION_DURATION,
    issuer: 'fra-atlas',
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any {
  try {
    return (jwt as any).verify(token, JWT_SECRET as any, {
      issuer: 'fra-atlas',
    });
  } catch (error) {
    return null;
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }

  return { valid: true };
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}
