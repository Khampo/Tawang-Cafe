import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ==========================================
   FIREBASE CONFIG
========================================== */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/* ==========================================
   INITIALIZE
========================================== */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ==========================================
   MENU
========================================== */

export async function loadMenuItems() {
  try {

    const snapshot = await getDocs(
      collection(db, "menu")
    );

    const items = [];

    snapshot.forEach((docSnap) => {

      const data = docSnap.data();

      if (data.available !== false) {

        items.push({
          id: docSnap.id,
          ...data
        });

      }

    });

    return items;

  } catch (error) {

    console.error(
      "Menu Load Error:",
      error
    );

    return [];
  }
}

/* ==========================================
   CREATE ORDER
========================================== */

export async function createOrder(orderData) {

  try {

    const orderRef = await addDoc(
      collection(db, "orders"),
      {
        ...orderData,

        status: "New",

        paymentStatus: "Pending",

        createdAt: serverTimestamp()
      }
    );

    return {
      success: true,
      orderId: orderRef.id
    };

  } catch (error) {

    console.error(
      "Order Create Error:",
      error
    );

    return {
      success: false,
      error
    };
  }
}

/* ==========================================
   TRACK ORDER
========================================== */

export async function getOrder(orderId) {

  try {

    const orderRef = doc(
      db,
      "orders",
      orderId
    );

    const snapshot = await getDoc(
      orderRef
    );

    if (!snapshot.exists()) {

      return null;

    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    };

  } catch (error) {

    console.error(
      "Order Fetch Error:",
      error
    );

    return null;
  }
}

/* ==========================================
   UPI SETTINGS
========================================== */

export const UPI_CONFIG = {

  upiId:
    "geliriba11@oksbi",

  payeeName:
    "Tawang Cafe"

};

/* ==========================================
   QR LINK
========================================== */

export function generateUPILink(
  amount,
  customerName = ""
) {

  const params =
    new URLSearchParams({

      pa: UPI_CONFIG.upiId,

      pn: UPI_CONFIG.payeeName,

      am: amount,

      cu: "INR",

      tn:
        `Order by ${customerName}`
    });

  return (
    "upi://pay?" +
    params.toString()
  );
}

/* ==========================================
   QR IMAGE
========================================== */

export function generateQRCode(
  amount,
  customerName = ""
) {

  const upiLink =
    generateUPILink(
      amount,
      customerName
    );

  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(upiLink)
  );
}
