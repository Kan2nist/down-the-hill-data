import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import TablesView from './pages/TablesView';
import CalculationsList from './pages/CalculationsList';
import CalculationEditor from './pages/CalculationEditor';
import { DataProvider } from './context/DataContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<TablesView />} />
            <Route path="tables/:id" element={<TablesView />} />
            <Route path="calculations" element={<CalculationsList />} />
            <Route path="calculations/:id" element={<CalculationEditor />} />
          </Route>
        </Routes>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
