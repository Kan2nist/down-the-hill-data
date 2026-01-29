import { db } from '../firebase-config';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  limit
} from 'firebase/firestore';
import { INITIAL_LEVELING_DATA, INITIAL_MISSION_DATA } from '../utils/initialData';

const TABLES_COLLECTION = 'tables';
const CALCULATIONS_COLLECTION = 'calculations';

export const subscribeToTables = (callback) => {
  const q = collection(db, TABLES_COLLECTION);
  return onSnapshot(q, (snapshot) => {
    const tables = [];
    snapshot.forEach((doc) => {
      tables.push({ id: doc.id, ...doc.data() });
    });
    callback(tables);
  });
};

export const subscribeToCalculations = (callback) => {
  const q = collection(db, CALCULATIONS_COLLECTION);
  return onSnapshot(q, (snapshot) => {
    const calculations = [];
    snapshot.forEach((doc) => {
      calculations.push({ id: doc.id, ...doc.data() });
    });
    callback(calculations);
  });
};

export const saveTable = async (table) => {
  const tableRef = doc(db, TABLES_COLLECTION, table.id || table.name);
  await setDoc(tableRef, table, { merge: true });
};

export const saveCalculation = async (calculation) => {
  // Use name as ID if no ID provided, or generate one if strictly new.
  // For simplicity, let's rely on passed ID or create a new doc ref if needed.
  // But here we'll assume the UI manages IDs or we use the name.
  // Using doc() without path generates ID.
  let calcRef;
  if (calculation.id) {
    calcRef = doc(db, CALCULATIONS_COLLECTION, calculation.id);
  } else {
    calcRef = doc(collection(db, CALCULATIONS_COLLECTION));
    calculation.id = calcRef.id;
  }
  await setDoc(calcRef, calculation, { merge: true });
};

export const deleteTable = async (tableId) => {
  await deleteDoc(doc(db, TABLES_COLLECTION, tableId));
};

export const deleteCalculation = async (calcId) => {
  await deleteDoc(doc(db, CALCULATIONS_COLLECTION, calcId));
};

export const seedDataIfNeeded = async () => {
  const seedTable = async (data) => {
      try {
        const ref = doc(db, TABLES_COLLECTION, data.name);
        let snap;
        try {
            snap = await getDoc(ref);
        } catch (e) {
             console.warn(`Could not check ${data.name} existence (offline?), attempting to seed...`, e);
        }

        if (!snap || !snap.exists()) {
            console.log(`Seeding ${data.name}...`);
            await saveTable({ id: data.name, ...data });
            console.log(`Seeding ${data.name} complete.`);
        }
      } catch (e) {
          console.error(`Error seeding ${data.name}:`, e);
      }
  };

  await Promise.all([
      seedTable(INITIAL_LEVELING_DATA),
      seedTable(INITIAL_MISSION_DATA)
  ]);
};
