import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9HHW2wvmBix1JHwvaaJuRYQO7gyt0sG0",
  authDomain: "devcord-42e82.firebaseapp.com",
  projectId: "devcord-42e82",
  storageBucket: "devcord-42e82.appspot.com",
  messagingSenderId: "269719448893",
  appId: "1:269719448893:web:31095c92e7ddb3e3eee954",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
