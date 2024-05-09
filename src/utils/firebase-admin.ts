"server-only";
import admin from "firebase-admin";
import { env } from "~/env.mjs";
interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  databaseURL: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey,
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId,
    databaseURL: params.databaseURL,
  });
}

export function initAdmin() {
  const params = {
    projectId: env.NEXT_PUBLIC_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
    databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  };

  return createFirebaseAdminApp(params);
}
