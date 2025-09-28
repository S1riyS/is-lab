import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Tabs,
    Tab
} from '@mui/material';
import { Visibility as VisibilityIcon, TableChart as TableChartIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import EntityTabs from './EntityTabs';
import TicketTable from './TicketTable';
import TicketVisualization from './TicketVisualization';
import SpecialOperations from './SpecialOperations';

const Layout: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [visualizationOpen, setVisualizationOpen] = useState(false);
    const [mainTabValue, setMainTabValue] = useState(0);

    const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setMainTabValue(newValue);
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Ticket Management System
                    </Typography>
                    {isAuthenticated && user && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Button
                                color="inherit"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setVisualizationOpen(true)}
                            >
                                Visualization
                            </Button>
                            <Typography variant="body2">
                                Welcome, {user.username} ({user.role})
                            </Typography>
                            <Button color="inherit" onClick={logout}>
                                Logout
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={mainTabValue} onChange={handleMainTabChange} aria-label="main tabs">
                    <Tab
                        icon={<TableChartIcon />}
                        label="Entity Management"
                        iconPosition="start"
                    />
                    <Tab
                        icon={<AnalyticsIcon />}
                        label="Legacy Views"
                        iconPosition="start"
                    />
                </Tabs>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                {mainTabValue === 0 && <EntityTabs />}
                {mainTabValue === 1 && (
                    <Box>
                        <Box mb={4}>
                            <TicketTable />
                        </Box>
                        <Box>
                            <SpecialOperations />
                        </Box>
                    </Box>
                )}
            </Container>

            <TicketVisualization
                open={visualizationOpen}
                onClose={() => setVisualizationOpen(false)}
            />
        </Box>
    );
};

export default Layout;
