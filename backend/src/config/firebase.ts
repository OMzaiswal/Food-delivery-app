// src/firebase.ts
import admin from "firebase-admin";
import { initializeApp, cert, applicationDefault, AppOptions } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';

let appOptions: AppOptions;

if (process.env.NODE_ENV === 'production') {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountString) {
    throw new Error("Missing FIREBASE_CREDENTIALS env variable");
  }
  
  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountString, "base64").toString("utf-8")
  );
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "food-delivery-app-39717.firebasestorage.app",
  });
  
 
  
} else {
  const serviceAccount = require(path.resolve(__dirname, 'food-delivery-app-serviceAccountKey.json'));
  appOptions = {
    credential: cert(serviceAccount),
    storageBucket: 'food-delivery-app-39717.firebasestorage.app',
  };
  initializeApp(appOptions);
  // bucket = getStorage().bucket();
}

export const bucket = admin.storage().bucket();





