// Application submission and admin helpers.
import { getFirestoreClient } from "./firebaseClient";
import { uploadMultipleFiles } from "./storage";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

type ApplicationData = {
  userId: string;
  schemeName: string;
  landArea?: string;
  village?: string;
  district?: string;
  state?: string;
  [key: string]: any;
};

// Submit an application. files is a map like { aadhaar: File, patta: File, certificate: File }
export async function submitApplication(
  userId: string,
  appData: ApplicationData,
  files: Record<string, File | null | undefined>
) {
  const db = getFirestoreClient();

  // Build a base path for storage
  const basePath = `users/${userId}/applications`;

  // Upload files and get URLs
  const uploaded = await uploadMultipleFiles(basePath, files);

  // Combine data to save
  const payload = {
    ...appData,
    userId,
    files: uploaded,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  // Save to Firestore `applications` collection
  const applicationsRef = collection(db, "applications");
  const docRef = await addDoc(applicationsRef, payload);

  return { success: true, id: docRef.id };
}

// Admin: fetch all applications (most recent first)
export async function fetchAllApplications() {
  const db = getFirestoreClient();
  const applicationsRef = collection(db, "applications");
  const q = query(applicationsRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const apps: any[] = [];
  snap.forEach((d) => apps.push({ id: d.id, ...d.data() }));
  return apps;
}

// Update an application's status (approve / reject / pending)
export async function updateApplicationStatus(applicationId: string, status: string) {
  const db = getFirestoreClient();
  const appRef = doc(db, "applications", applicationId);
  await updateDoc(appRef, { status, updatedAt: serverTimestamp() });
  return { success: true };
}
