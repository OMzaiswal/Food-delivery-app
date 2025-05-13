// src/firebase.ts
import { initializeApp, cert, applicationDefault, AppOptions } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';
import * as path from 'path';

let appOptions: AppOptions;

if (process.env.NODE_ENV === 'production') {
  // Parse service account JSON from environment variable in prod
  // const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
  // Decode and parse Base64-encoded service account JSON from env
  const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT as string, 'base64').toString('utf8');
  const serviceAccount = JSON.parse(decoded);
  appOptions = {
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  };
} else {
  // Use local service account key JSON in development
  const serviceAccount = require(path.resolve(__dirname, 'food-delivery-app-serviceAccountKey.json'));
  appOptions = {
    credential: cert(serviceAccount),
    storageBucket: 'food-delivery-app-39717.appspot.com',
  };
}

initializeApp(appOptions);
export const bucket = getStorage().bucket();

