# Firebase Integration (client-side)

This file documents how to use the Firebase modules added under `lib/`.

Files added
- `lib/firebaseClient.ts` - initializes Firebase app and exports lazy getters.
- `lib/auth.ts` - signup, login, signOut, getCurrentUser helpers.
- `lib/storage.ts` - upload single/multiple files to Firebase Storage.
- `lib/applications.ts` - submit application, fetch and update applications.

Important: all functions that rely on Firebase Auth or Storage should be called from client-side code (React components that run in the browser). Firestore reads/writes are safe to call from server or client depending on your rules, but `getAuthClient()` and `getStorageClient()` are guarded to return null server-side.

Example usages (client component)

1) Signup

```ts
import { signup } from "@/lib/auth";

async function onSignup() {
  const res = await signup({ name: "Ravi", email: "ravi@example.com", password: "secret123", phone: "9123456789" });
  if (!res.success) alert(`Signup failed: ${res.error}`);
  else alert("Signed up! UID: " + res.uid);
}
```

2) Login

```ts
import { login } from "@/lib/auth";

async function onLogin() {
  const res = await login("ravi@example.com", "secret123");
  if (!res.success) alert(`Login failed: ${res.error}`);
  else alert("Logged in: " + res.uid);
}
```

3) File upload and application submission

```ts
import { submitApplication } from "@/lib/applications";
import { getCurrentUser } from "@/lib/auth";

async function onSubmit(formValues, files) {
  const user = getCurrentUser();
  if (!user) { alert('Please login'); return; }

  // files example: { aadhaar: File, patta: File, certificate: File }
  const res = await submitApplication(user.uid, formValues, files);
  if (!res.success) alert('Submission failed');
  else alert('Application submitted: ' + res.id);
}
```

4) Admin fetch and update

```ts
import { fetchAllApplications, updateApplicationStatus } from "@/lib/applications";

async function loadApps() {
  const apps = await fetchAllApplications();
  console.log(apps);
}

async function approve(appId) {
  await updateApplicationStatus(appId, 'approved');
}
```

Error handling
- All functions return simple objects with `success: boolean` or throw on misuse (e.g. calling client-only APIs on server). Wrap calls in try/catch and show user-friendly messages.

Firebase Hosting / Deployment
- Ensure `NEXT_PUBLIC_FIREBASE_*` env vars are set in your Vercel or Firebase Hosting environment if you don't want to embed the config directly.

Security
- Configure Firestore and Storage security rules in Firebase console to ensure only authenticated users can create applications and only admins can update statuses. This code does not include security rules; implement them in the Firebase console.
