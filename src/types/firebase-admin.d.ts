import { App, Auth } from "firebase-admin/app";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FIREBASE_ADMIN_CLIENT_EMAIL: string;
      FIREBASE_ADMIN_PRIVATE_KEY: string;
      FIREBASE_PROJECT_ID: string;
    }
  }

  // Extend global namespace if needed
  interface Global {
    firebaseAdmin: {
      app?: App;
      auth?: Auth;
    };
  }
}

export {};
