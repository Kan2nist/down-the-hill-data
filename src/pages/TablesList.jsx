import React, { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, CardActions, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const TablesList = () => {
  const { tables, saveTable, deleteTable } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');

  const handleCreate = async () => {
    if (!newTableName) return;
    const id = newTableName.replace(/\s+/g, '');
    await saveTable({
      id,
      name: newTableName,
      columns: ['ID'],
      rows: []
    });
    setOpen(false);
    setNewTableName('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      await deleteTable(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Typography variant="h4">Game Balance Tables</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add New Table</Button>
      </div>

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {table.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {table.rows?.length || 0} rows | {table.columns?.length || 0} columns
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/tables/${table.id}`)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(table.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TablesList;
