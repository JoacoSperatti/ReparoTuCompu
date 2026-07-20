import { initializeApp } from "firebase/app";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzSknvroKdtHJaomKULhsjp3td_c0K06o",
  authDomain: "reparotucompu-632ab.firebaseapp.com",
  projectId: "reparotucompu-632ab",
  storageBucket: "reparotucompu-632ab.firebasestorage.app",
  messagingSenderId: "152258978747",
  appId: "1:152258978747:web:7fa3054c20b2e753e49a9e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  console.log("Attempting to delete RTC-1001...");
  try {
    await deleteDoc(doc(db, "tickets", "RTC-1001"));
    console.log("Successfully deleted RTC-1001!");
  } catch (err) {
    console.error("Failed to delete RTC-1001:", err);
  }
}

main();
