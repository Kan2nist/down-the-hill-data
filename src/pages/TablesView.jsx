import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Tabs, Tab, Box, Button, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useData } from '../context/DataContext';
import TableEditor from './TableEditor';

const TablesView = () => {
  const { id } = useParams();
  const { tables, saveTable } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');

  // Handle redirect from root to first table if available
  useEffect(() => {
    if (location.pathname === '/' && tables.length > 0) {
      navigate(`/tables/${tables[0].id}`, { replace: true });
    }
  }, [location.pathname, tables, navigate]);

  const handleTabChange = (event, newValue) => {
    if (newValue === 'add_new_table_tab') {
      setIsDialogOpen(true);
    } else {
      navigate(`/tables/${newValue}`);
    }
  };

  const handleCreate = async () => {
    if (!newTableName) return;
    const newId = newTableName.replace(/\s+/g, '');

    // Check if ID already exists to avoid overwrite/confusion
    if (tables.some(t => t.id === newId)) {
        alert("Table with this name already exists");
        return;
    }

    await saveTable({
      id: newId,
      name: newTableName,
      columns: ['ID'],
      rows: []
    });

    setIsDialogOpen(false);
    setNewTableName('');
    navigate(`/tables/${newId}`);
  };

  // If we are at / and no tables exist, we show nothing or empty state
  // If we are at /tables/:id, currentTab is id.
  const currentTab = id || (tables.length > 0 ? tables[0].id : false);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, display: 'flex', alignItems: 'center' }}>
        <Tabs
            value={currentTab && tables.some(t => t.id === currentTab) ? currentTab : false}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
        >
          {tables.map((table) => (
            <Tab key={table.id} label={table.name} value={table.id} />
          ))}
          <Tab
            value="add_new_table_tab"
            icon={<AddIcon />}
            iconPosition="start"
            label="NEW"
            sx={{ minHeight: 'inherit' }}
          />
        </Tabs>
      </Box>

      {currentTab && tables.some(t => t.id === currentTab) ? (
         <TableEditor tableId={currentTab} />
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            {tables.length === 0 ? "No tables found. Create one!" : "Select a table."}
        </Box>
      )}

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Create New Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Table Name"
            fullWidth
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablesView;
