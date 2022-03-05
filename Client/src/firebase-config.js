import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9HHW2wvmBix1JHwvaaJuRYQO7gyt0sG0",
  authDomain: "devcord-42e82.firebaseapp.com",
  projectId: "devcord-42e82",
  storageBucket: "devcord-42e82.appspot.com",
  messagingSenderId: "269719448893",
  appId: "1:269719448893:web:31095c92e7ddb3e3eee954",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export { db };
