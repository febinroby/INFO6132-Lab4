import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA1Wt4Di9sqH2O1_W8yMjzCxys5ktUymtM",
  authDomain: "info6132-lab4-bd89c.firebaseapp.com",
  projectId: "info6132-lab4-bd89c",
  storageBucket: "info6132-lab4-bd89c.firebasestorage.app",
  messagingSenderId: "209922750487",
  appId: "1:209922750487:web:1a9be5b9178c33cfc28452"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);