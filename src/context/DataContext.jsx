import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  subscribeToTables,
  subscribeToCalculations,
  saveTable,
  deleteTable,
  seedDataIfNeeded,
  saveCalculation,
  deleteCalculation
} from '../services/db';

const DataContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await seedDataIfNeeded();
      } catch (e) {
        console.error("Failed to seed data (probably auth error or config missing):", e);
      }
    };
    init();

    const unsubscribeTables = subscribeToTables((data) => {
      setTables(data);
    });

    const unsubscribeCalculations = subscribeToCalculations((data) => {
      setCalculations(data);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);

    return () => {
      unsubscribeTables();
      unsubscribeCalculations();
    };
  }, []);

  const value = {
    tables,
    calculations,
    loading,
    saveTable,
    deleteTable,
    saveCalculation,
    deleteCalculation
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
