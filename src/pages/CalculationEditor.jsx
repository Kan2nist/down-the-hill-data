import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, Paper, Grid, MenuItem, Select, InputLabel, FormControl, Box, Tabs, Tab } from '@mui/material';
import Editor from '@monaco-editor/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

const CalculationEditor = () => {
  const { id } = useParams();
  const { calculations, tables, saveCalculation } = useData();

  const calculation = calculations.find(c => c.id === id);

  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Chart Config State
  const [chartType, setChartType] = useState('line');
  const [xKey, setXKey] = useState('');
  const [dataKeys, setDataKeys] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Initialize state from calculation when it loads or ID changes
  useEffect(() => {
    if (calculation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(calculation.code || "");
      if (calculation.chartConfig) {
        setChartType(calculation.chartConfig.type || 'line');
        setXKey(calculation.chartConfig.xKey || '');
        setDataKeys(calculation.chartConfig.dataKeys || []);
      }
    }
  }, [calculation]);
  // Dependency on ID ensures reset. Dependency on code/config ensures sync if remote changes (optional, but good)
  // But wait, if I edit code, `code` state updates. `calculation.code` doesn't until save.
  // So `calculation.code` in prop is stable until I save.
  // If I save, it updates. Effect runs -> sets code to same value. Safe.

  // Helper to get formatted tables for the script
  const tablesMap = useMemo(() => {
    const map = {};
    tables.forEach(t => {
      map[t.name] = t.rows;
      if (t.id !== t.name) map[t.id] = t.rows;
    });
    return map;
  }, [tables]);

  const handleSave = async () => {
    if (calculation) {
      await saveCalculation({
        ...calculation,
        code,
        chartConfig: { type: chartType, xKey, dataKeys }
      });
    }
  };

  const handleRun = () => {
    setError(null);
    setResult(null);
    try {
      const func = new Function('tables', code);
      const output = func(tablesMap);
      setResult(output);
      // Auto-detect keys if not set
      if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'object') {
         const keys = Object.keys(output[0]);
         if (!xKey && keys.length > 0) setXKey(keys[0]);
         if (dataKeys.length === 0 && keys.length > 1) setDataKeys([keys[1]]);
      }
    } catch (e) {
      setError(e.toString());
    }
  };

  const availableKeys = (result && Array.isArray(result) && result.length > 0)
    ? Object.keys(result[0])
    : [];

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;
  const DataComponent = chartType === 'bar' ? Bar : Line;

  // Generate distinct colors for lines
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#387908"];

  if (!calculation) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 100px)' }}>
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <Typography variant="h5">{calculation.name}</Typography>
            <div>
                <Button variant="contained" color="secondary" onClick={handleRun} sx={{ mr: 1 }}>Run</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </div>
        </div>
        <Paper sx={{ flexGrow: 1, border: '1px solid #ccc' }}>
            <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(val) => setCode(val)}
                options={{ minimap: { enabled: false } }}
            />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label="Chart" />
                <Tab label="JSON Output" />
                <Tab label="Config" />
            </Tabs>
        </Box>

        {activeTab === 0 && (
            <Paper sx={{ p: 2, flexGrow: 1, bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
                {result ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ChartComponent data={result}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xKey} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {dataKeys.map((key, index) => (
                                <DataComponent
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={colors[index % colors.length]}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </ChartComponent>
                    </ResponsiveContainer>
                ) : <Typography sx={{mt: 2}} color="text.secondary">Run code to generate chart.</Typography>}
            </Paper>
        )}

        {activeTab === 1 && (
            <Paper sx={{ p: 2, flexGrow: 1, overflow: 'auto', bgcolor: '#f5f5f5' }}>
                {error && <Typography color="error">{error}</Typography>}
                {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
            </Paper>
        )}

        {activeTab === 2 && (
            <Paper sx={{ p: 2, flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>Chart Configuration</Typography>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Chart Type</InputLabel>
                    <Select value={chartType} label="Chart Type" onChange={(e) => setChartType(e.target.value)}>
                        <MenuItem value="line">Line Chart</MenuItem>
                        <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>X Axis Key</InputLabel>
                    <Select value={xKey} label="X Axis Key" onChange={(e) => setXKey(e.target.value)}>
                        {availableKeys.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Data Keys (Y Axis)</InputLabel>
                    <Select
                        multiple
                        value={dataKeys}
                        label="Data Keys"
                        onChange={(e) => setDataKeys(e.target.value)}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {availableKeys.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
                    </Select>
                </FormControl>
                <Typography variant="caption">Run code first to populate keys.</Typography>
            </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default CalculationEditor;
