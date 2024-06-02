import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlw0gi8J-kStCdLl8fBshyTypDdK0VLm0",
  authDomain: "reactapp-7082d.firebaseapp.com",
  databaseURL: "gs://reactapp-7082d.appspot.com",
  projectId: "reactapp-7082d",
  storageBucket: "reactapp-7082d.appspot.com",
  messagingSenderId: "9179729229",
  appId: "1:9179729229:web:c1b651498513deeea87b04",
  measurementId: "G-8B5JSPWFSQ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
