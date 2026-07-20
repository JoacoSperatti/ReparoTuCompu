import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  collection 
} from "firebase/firestore";
import { INITIAL_TICKETS } from "./data/initialData";

// Configuración de Firebase para el proyecto Reparo Tu Compu usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db = null;
export let isFirebaseConfigured = false;

// Check if configuration is configured and not default placeholders
if (
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.error("❌ Error initializing Firebase, falling back to LocalStorage:", error);
  }
}

// -------------------------------------------------------------
// PRODUCTS SERVICES
// -------------------------------------------------------------

export const getDbProducts = async () => {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = [];
      querySnapshot.forEach((doc) => {
        productsList.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort by ID or creation to maintain order
      return productsList.sort((a, b) => Number(a.id) - Number(b.id));
    } catch (error) {
      console.error("❌ Error fetching products from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_products");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("rtc_products", JSON.stringify([]));
  return [];
};

export const saveDbProduct = async (product) => {
  const { id, ...data } = product;
  const strId = String(id);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "products", strId), data);
      return;
    } catch (error) {
      console.error("❌ Error saving product to Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_products");
  const products = saved ? JSON.parse(saved) : [];
  const exists = products.some(p => String(p.id) === strId);
  
  let updated;
  if (exists) {
    updated = products.map(p => String(p.id) === strId ? product : p);
  } else {
    updated = [product, ...products];
  }
  localStorage.setItem("rtc_products", JSON.stringify(updated));
};

export const deleteDbProduct = async (id) => {
  const strId = String(id);

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "products", strId));
      return;
    } catch (error) {
      console.error("❌ Error deleting product from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_products");
  if (saved) {
    const products = JSON.parse(saved);
    const updated = products.filter(p => String(p.id) !== strId);
    localStorage.setItem("rtc_products", JSON.stringify(updated));
  }
};

// -------------------------------------------------------------
// TICKETS SERVICES
// -------------------------------------------------------------

export const getDbTickets = async () => {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const ticketsMap = {};
      querySnapshot.forEach((doc) => {
        ticketsMap[doc.id] = { ticketId: doc.id, ...doc.data() };
      });
      return ticketsMap;
    } catch (error) {
      console.error("❌ Error fetching tickets from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_tickets");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("rtc_tickets", JSON.stringify(INITIAL_TICKETS));
  return INITIAL_TICKETS;
};

export const getDbTicket = async (ticketId) => {
  const cleanId = String(ticketId).trim().toUpperCase();

  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, "tickets", cleanId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { ticketId: cleanId, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("❌ Error fetching single ticket from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_tickets");
  const tickets = saved ? JSON.parse(saved) : INITIAL_TICKETS;
  return tickets[cleanId] || null;
};

export const saveDbTicket = async (ticket) => {
  const cleanId = String(ticket.ticketId).trim().toUpperCase();

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "tickets", cleanId), ticket);
      return;
    } catch (error) {
      console.error("❌ Error saving ticket to Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_tickets");
  const tickets = saved ? JSON.parse(saved) : INITIAL_TICKETS;
  const updated = { ...tickets, [cleanId]: ticket };
  localStorage.setItem("rtc_tickets", JSON.stringify(updated));
};

export const deleteDbTicket = async (ticketId) => {
  const cleanId = String(ticketId).trim().toUpperCase();

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "tickets", cleanId));
      return;
    } catch (error) {
      console.error("❌ Error deleting ticket from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_tickets");
  if (saved) {
    const tickets = JSON.parse(saved);
    delete tickets[cleanId];
    localStorage.setItem("rtc_tickets", JSON.stringify(tickets));
  }
};
