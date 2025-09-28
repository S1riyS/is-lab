import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    IconButton,
    Chip,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { Ticket, Page } from '../types';
import { ticketsAPI } from '../services';
import { useAuth } from '../contexts/AuthContext';
import AddTicketDialog from './AddTicketDialog';

const TicketTable: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const { isAuthenticated, isAdmin } = useAuth();

    const loadTickets = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response: Page<Ticket> = await ticketsAPI.getAll(
                page,
                rowsPerPage,
                'id',
                'asc',
                search || undefined
            );
            setTickets(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError('Failed to load tickets');
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search]);

    useEffect(() => {
        if (isAuthenticated) {
            loadTickets();
        }
    }, [isAuthenticated, loadTickets]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleViewDetails = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setDetailsOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            try {
                await ticketsAPI.delete(id);
                loadTickets();
            } catch (err) {
                setError('Failed to delete ticket');
                console.error('Error deleting ticket:', err);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography variant="h6">Please log in to view tickets</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Tickets</Typography>
                <Box display="flex" gap={1}>
                    <TextField
                        placeholder="Search tickets..."
                        value={search}
                        onChange={handleSearch}
                        size="small"
                        InputProps={{
                            startAdornment: <SearchIcon />
                        }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={loadTickets}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddDialogOpen(true)}
                    >
                        Add Ticket
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : tickets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No tickets found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tickets.map((ticket) => (
                                    <TableRow key={ticket.id} hover>
                                        <TableCell>{ticket.id}</TableCell>
                                        <TableCell>{ticket.name}</TableCell>
                                        <TableCell>{formatCurrency(ticket.price)}</TableCell>
                                        <TableCell>
                                            {ticket.type && (
                                                <Chip label={ticket.type} size="small" />
                                            )}
                                        </TableCell>
                                        <TableCell>{ticket.discount}%</TableCell>
                                        <TableCell>{formatDate(ticket.creationDate)}</TableCell>
                                        <TableCell>User {ticket.createdById || 'N/A'}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewDetails(ticket)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            {(isAdmin || ticket.createdById === 1) && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(ticket.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            {/* Ticket Details Dialog */}
            <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Ticket Details</DialogTitle>
                <DialogContent>
                    {selectedTicket && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                {selectedTicket.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                ID: {selectedTicket.id}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Price: {formatCurrency(selectedTicket.price)}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Discount: {selectedTicket.discount}%
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Type: {selectedTicket.type || 'N/A'}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Comment: {selectedTicket.comment}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Created: {formatDate(selectedTicket.creationDate)}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Created By: User {selectedTicket.createdById || 'N/A'}
                            </Typography>

                            {selectedTicket.personId && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Person Details
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Person ID: {selectedTicket.personId}
                                    </Typography>
                                </Box>
                            )}

                            {selectedTicket.eventId && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Event Details
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Event ID: {selectedTicket.eventId}
                                    </Typography>
                                </Box>
                            )}

                            {selectedTicket.venueId && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Venue Details
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Venue ID: {selectedTicket.venueId}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Add Ticket Dialog */}
            <AddTicketDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onTicketAdded={loadTickets}
            />
        </Box>
    );
};

export default TicketTable;

