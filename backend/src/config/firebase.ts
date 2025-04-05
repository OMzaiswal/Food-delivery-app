// src/firebase.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.resolve(__dirname, '../food-delivery-app-serviceAccountKey.json'));

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'food-delivery-app-39717.firebasestorage.app',
});

export const bucket = getStorage().bucket();
