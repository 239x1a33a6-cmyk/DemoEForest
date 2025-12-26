// Storage helpers: upload files and return download URLs
import { getStorageClient } from "./firebaseClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Upload a single File object to Firebase Storage at a given path and return the download URL
export async function uploadFile(path: string, file: File): Promise<string> {
  const storage = getStorageClient();
  if (!storage) throw new Error("Firebase Storage is not available on server. Call from client-side.");

  // Create a reference and upload
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);

  // Get and return the download URL
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

// Upload multiple named files (object with key -> File) and return map of key -> url
export async function uploadMultipleFiles(
  basePath: string,
  files: Record<string, File | null | undefined>
): Promise<Record<string, string | null>> {
  const result: Record<string, string | null> = {};

  for (const [key, file] of Object.entries(files)) {
    if (!file) {
      result[key] = null;
      continue;
    }

    // sanitize filename and build path
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const path = `${basePath}/${key}/${fileName}`;

    try {
      const url = await uploadFile(path, file);
      result[key] = url;
    } catch (err) {
      // on error, put null and continue; caller should handle
      console.error("upload error for", key, err);
      result[key] = null;
    }
  }

  return result;
}
