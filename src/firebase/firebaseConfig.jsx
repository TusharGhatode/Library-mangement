// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyD6xjvmTX01b9xb6z0LoN77GcdRpdAzdu8",
    authDomain: "book-library-6cc11.firebaseapp.com",
    projectId: "book-library-6cc11",
    storageBucket: "book-library-6cc11.appspot.com",
    messagingSenderId: "96585304389",
    appId: "1:96585304389:web:96517a22e29a17d26a962c"
};


// const firebaseConfig = {
//     apiKey: "AIzaSyDWJJWo4S5u0DKZ578hUYWu7-ubibLzJms",
//     authDomain: "libraryx-770df.firebaseapp.com",
//     projectId: "libraryx-770df",
//     storageBucket: "libraryx-770df.appspot.com",
//     messagingSenderId: "14495940407",
//     appId: "1:14495940407:web:9692bc5afc255a6913a4b2"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// Initialize Firestore and Auth services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth,storage };
