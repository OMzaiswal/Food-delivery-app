"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = void 0;
// src/firebase.ts
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const app_1 = require("firebase-admin/app");
const path = __importStar(require("path"));
let appOptions;
if (process.env.NODE_ENV === 'production') {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountString) {
        throw new Error("Missing FIREBASE_CREDENTIALS env variable");
    }
    const serviceAccount = JSON.parse(Buffer.from(serviceAccountString, "base64").toString("utf-8"));
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
        storageBucket: "food-delivery-app-39717.firebasestorage.app",
    });
}
else {
    const serviceAccount = require(path.resolve(__dirname, 'food-delivery-app-serviceAccountKey.json'));
    appOptions = {
        credential: (0, app_1.cert)(serviceAccount),
        storageBucket: 'food-delivery-app-39717.firebasestorage.app',
    };
    (0, app_1.initializeApp)(appOptions);
    // bucket = getStorage().bucket();
}
exports.bucket = firebase_admin_1.default.storage().bucket();
