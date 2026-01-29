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
  try {
    const levelingRef = doc(db, TABLES_COLLECTION, INITIAL_LEVELING_DATA.name);
    const levelingSnap = await getDoc(levelingRef);

    if (!levelingSnap.exists()) {
      console.log('Seeding LevelingData...');
      await saveTable({ id: INITIAL_LEVELING_DATA.name, ...INITIAL_LEVELING_DATA });
    }

    const missionRef = doc(db, TABLES_COLLECTION, INITIAL_MISSION_DATA.name);
    const missionSnap = await getDoc(missionRef);

    if (!missionSnap.exists()) {
      console.log('Seeding MissionData...');
      await saveTable({ id: INITIAL_MISSION_DATA.name, ...INITIAL_MISSION_DATA });
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
