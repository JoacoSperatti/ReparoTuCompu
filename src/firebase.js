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
import { INITIAL_TICKETS, INITIAL_TESTIMONIALS } from "./data/initialData";

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

const cleanUndefined = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};

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
  const cleanData = cleanUndefined(data);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "products", strId), cleanData);
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
  const cleanData = cleanUndefined(ticket);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "tickets", cleanId), cleanData);
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

// -------------------------------------------------------------
// TESTIMONIALS SERVICES (OPINIONES DE CLIENTES)
// -------------------------------------------------------------

export const getDbTestimonials = async () => {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort by position (ascending), then by ID descending
      return list.sort((a, b) => {
        const posA = a.position !== undefined ? Number(a.position) : 9999;
        const posB = b.position !== undefined ? Number(b.position) : 9999;
        if (posA !== posB) return posA - posB;
        return Number(b.id) - Number(a.id);
      });
    } catch (error) {
      console.error("❌ Error fetching testimonials from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_testimonials");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("rtc_testimonials", JSON.stringify(INITIAL_TESTIMONIALS));
  return INITIAL_TESTIMONIALS;
};

export const saveDbTestimonial = async (testimonial) => {
  const { id, ...data } = testimonial;
  const strId = String(id);
  const cleanData = cleanUndefined(data);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "testimonials", strId), cleanData);
      return;
    } catch (error) {
      console.error("❌ Error saving testimonial to Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_testimonials");
  const list = saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  const exists = list.some(t => String(t.id) === strId);
  
  let updated;
  if (exists) {
    updated = list.map(t => String(t.id) === strId ? testimonial : t);
  } else {
    updated = [testimonial, ...list];
  }
  localStorage.setItem("rtc_testimonials", JSON.stringify(updated));
};

export const deleteDbTestimonial = async (id) => {
  const strId = String(id);

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "testimonials", strId));
      return;
    } catch (error) {
      console.error("❌ Error deleting testimonial from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_testimonials");
  if (saved) {
    const list = JSON.parse(saved);
    const updated = list.filter(t => String(t.id) !== strId);
    localStorage.setItem("rtc_testimonials", JSON.stringify(updated));
  }
};

// -------------------------------------------------------------
// CLIENTS SERVICES (REGISTRO Y LOGIN DE CLIENTES)
// -------------------------------------------------------------

export const getDbClients = async () => {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsList = [];
      querySnapshot.forEach((doc) => {
        clientsList.push({ id: doc.id, ...doc.data() });
      });
      return clientsList;
    } catch (error) {
      console.error("❌ Error fetching clients from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_clients");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("rtc_clients", JSON.stringify([]));
  return [];
};

export const saveDbClient = async (client) => {
  const { id, ...data } = client;
  const strId = String(id);
  const cleanData = cleanUndefined(data);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "clients", strId), cleanData);
      return;
    } catch (error) {
      console.error("❌ Error saving client to Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_clients");
  const clients = saved ? JSON.parse(saved) : [];
  const exists = clients.some(c => String(c.id) === strId);

  let updated;
  if (exists) {
    updated = clients.map(c => String(c.id) === strId ? client : c);
  } else {
    updated = [client, ...clients];
  }
  localStorage.setItem("rtc_clients", JSON.stringify(updated));
};

export const deleteDbClient = async (id) => {
  const strId = String(id);

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "clients", strId));
      return;
    } catch (error) {
      console.error("❌ Error deleting client from Firestore, falling back to LocalStorage:", error);
    }
  }

  // LocalStorage Fallback
  const saved = localStorage.getItem("rtc_clients");
  if (saved) {
    const clients = JSON.parse(saved);
    const updated = clients.filter(c => String(c.id) !== strId);
    localStorage.setItem("rtc_clients", JSON.stringify(updated));
  }
};

// -------------------------------------------------------------
// APPOINTMENTS SERVICES
// -------------------------------------------------------------

export const getDbAppointments = async () => {
  if (isFirebaseConfigured) {
    try {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      return list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    } catch (error) {
      console.error("❌ Error fetching appointments from Firestore, falling back to LocalStorage:", error);
    }
  }

  const saved = localStorage.getItem("rtc_appointments");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("rtc_appointments", JSON.stringify([]));
  return [];
};

export const saveDbAppointment = async (appointment) => {
  const { id, ...data } = appointment;
  const strId = String(id);
  const cleanData = cleanUndefined(data);

  if (isFirebaseConfigured) {
    try {
      await setDoc(doc(db, "appointments", strId), cleanData);
      return;
    } catch (error) {
      console.error("❌ Error saving appointment to Firestore, falling back to LocalStorage:", error);
    }
  }

  const saved = localStorage.getItem("rtc_appointments");
  const appointments = saved ? JSON.parse(saved) : [];
  const existing = appointments.findIndex(a => String(a.id) === strId);
  let updated;
  if (existing >= 0) {
    updated = appointments.map(a => String(a.id) === strId ? appointment : a);
  } else {
    updated = [appointment, ...appointments];
  }
  localStorage.setItem("rtc_appointments", JSON.stringify(updated));
};

export const deleteDbAppointment = async (id) => {
  const strId = String(id);

  if (isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "appointments", strId));
      return;
    } catch (error) {
      console.error("❌ Error deleting appointment from Firestore, falling back to LocalStorage:", error);
    }
  }

  const saved = localStorage.getItem("rtc_appointments");
  if (saved) {
    const appointments = JSON.parse(saved);
    const updated = appointments.filter(a => String(a.id) !== strId);
    localStorage.setItem("rtc_appointments", JSON.stringify(updated));
  }
};
