import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Layout = () => {
  const { tables, calculations } = useData();

  const handleExport = () => {
    const config = {
      tables,
      calculations,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "game_balance_config.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game Balance Tool
          </Typography>
          <Button color="inherit" component={Link} to="/">Tables</Button>
          <Button color="inherit" component={Link} to="/calculations">Calculations</Button>
          <Button color="secondary" variant="contained" onClick={handleExport} sx={{ ml: 2 }}>
            Export Config
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box sx={{ my: 2 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
};

export default Layout;
