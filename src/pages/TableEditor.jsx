import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useData } from '../context/DataContext';

const TableEditor = () => {
  const { id } = useParams();
  const { tables, saveTable } = useData();
  const [newColName, setNewColName] = useState('');
  const [openColDialog, setOpenColDialog] = useState(false);

  const table = tables.find(t => t.id === id);

  if (!table) return <Typography>Loading or Table not found...</Typography>;

  const handleAddRow = async () => {
    const newRows = [...(table.rows || []), {}];
    await saveTable({ ...table, rows: newRows });
  };

  const handleDeleteRow = async (rowIndex) => {
    const newRows = [...table.rows];
    newRows.splice(rowIndex, 1);
    await saveTable({ ...table, rows: newRows });
  };

  const handleAddColumn = async () => {
    if (newColName && !table.columns.includes(newColName)) {
      const newCols = [...table.columns, newColName];
      await saveTable({ ...table, columns: newCols });
      setNewColName('');
      setOpenColDialog(false);
    }
  };

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Typography variant="h4">{table.name}</Typography>
            <div>
                <Button variant="outlined" onClick={() => setOpenColDialog(true)} sx={{ mr: 1 }}>Add Column</Button>
                <Button variant="contained" onClick={handleAddRow}>Add Row</Button>
            </div>
        </div>

        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        {table.columns.map((col) => (
                            <TableCell key={col} style={{ fontWeight: 'bold' }}>{col}</TableCell>
                        ))}
                        <TableCell width={50}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table.rows && table.rows.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {table.columns.map((col) => (
                                <Cell
                                    key={`${rowIndex}-${col}`}
                                    value={row[col]}
                                    onChange={(val) => {
                                        const newRows = [...table.rows];
                                        // Attempt number conversion
                                        const num = Number(val);
                                        newRows[rowIndex] = {
                                            ...newRows[rowIndex],
                                            [col]: (val === '' || isNaN(num)) ? val : num
                                        };
                                        saveTable({ ...table, rows: newRows });
                                    }}
                                />
                            ))}
                            <TableCell>
                                <IconButton size="small" onClick={() => handleDeleteRow(rowIndex)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        <Dialog open={openColDialog} onClose={() => setOpenColDialog(false)}>
            <DialogTitle>Add New Column</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus margin="dense" label="Column Name" fullWidth
                    value={newColName} onChange={(e) => setNewColName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenColDialog(false)}>Cancel</Button>
                <Button onClick={handleAddColumn}>Add</Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};

const Cell = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(value === undefined ? '' : value);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalValue(value === undefined ? "" : value);
    }, [value]);

    const handleBlur = () => {
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    return (
        <TableCell padding="none">
            <input
                style={{
                    width: '100%', border: 'none', padding: '8px',
                    background: 'transparent', outline: 'none',
                    fontFamily: 'inherit', fontSize: 'inherit'
                }}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
            />
        </TableCell>
    );
};

export default TableEditor;
