import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, type Firestore } from 'firebase/firestore';
import type { GameState, ProjectBreakdown } from '../types';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
}

const LOCAL_KEY = 'code-quest-tutor:progress';

export interface SavedProgress {
  gameState: GameState;
  breakdown: ProjectBreakdown | null;
  savedAt: number;
}

export async function ensureSignedIn(): Promise<string> {
  if (!isConfigured || !auth) return 'local-guest';
  return new Promise((resolve) => {
    onAuthStateChanged(auth!, async (user: User | null) => {
      if (user) {
        resolve(user.uid);
      } else {
        const cred = await signInAnonymously(auth!);
        resolve(cred.user.uid);
      }
    });
  });
}

export async function saveProgress(uid: string, progress: SavedProgress): Promise<void> {
  if (isConfigured && db) {
    await setDoc(doc(db, 'progress', uid), progress);
    return;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
}

export async function loadProgress(uid: string): Promise<SavedProgress | null> {
  if (isConfigured && db) {
    const snap = await getDoc(doc(db, 'progress', uid));
    return snap.exists() ? (snap.data() as SavedProgress) : null;
  }
  const raw = localStorage.getItem(LOCAL_KEY);
  return raw ? (JSON.parse(raw) as SavedProgress) : null;
}

export const firebaseEnabled = isConfigured;
