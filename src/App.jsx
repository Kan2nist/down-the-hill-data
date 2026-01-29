import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TablesList from './pages/TablesList';
import TableEditor from './pages/TableEditor';
import CalculationsList from './pages/CalculationsList';
import CalculationEditor from './pages/CalculationEditor';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TablesList />} />
          <Route path="tables/:id" element={<TableEditor />} />
          <Route path="calculations" element={<CalculationsList />} />
          <Route path="calculations/:id" element={<CalculationEditor />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default App;
