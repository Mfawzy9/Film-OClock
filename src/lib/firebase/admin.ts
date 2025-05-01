import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function createFirebaseAdminApp() {
  if (getApps().length > 0) return getApp();

  const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  if (
    !serviceAccount.projectId ||
    !serviceAccount.clientEmail ||
    !serviceAccount.privateKey
  ) {
    throw new Error(
      "Missing Firebase admin credentials in environment variables.",
    );
  }

  return initializeApp({ credential: cert(serviceAccount) });
}

export const auth = getAuth(createFirebaseAdminApp());
