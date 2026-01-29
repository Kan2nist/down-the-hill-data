import React, { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, CardActions, Button,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CalculationsList = () => {
  const { calculations, saveCalculation, deleteCalculation } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    if (!newName) return;
    const id = newName.replace(/\s+/g, '') + '_' + Date.now();
    await saveCalculation({
      id,
      name: newName,
      code: '// Return an array of objects\n// tables object is available globally within this function\n\nreturn [];',
      chartConfig: { xKey: 'x', yKey: 'y', type: 'line' }
    });
    setOpen(false);
    setNewName('');
    navigate(`/calculations/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this calculation?')) {
      await deleteCalculation(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Typography variant="h4">Calculations</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>New Calculation</Button>
      </div>

      <Grid container spacing={3}>
        {calculations.map((calc) => (
          <Grid item xs={12} sm={6} md={4} key={calc.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{calc.name}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/calculations/${calc.id}`)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(calc.id)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Calculation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Name" fullWidth
            value={newName} onChange={(e) => setNewName(e.target.value)}
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

export default CalculationsList;
