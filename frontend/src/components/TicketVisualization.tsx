import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Chip,
    Tooltip,
    Alert
} from '@mui/material';
import { Ticket } from '../types';
import { ticketsAPI, coordinatesAPI } from '../services';
import { useAuth } from '../contexts/AuthContext';

interface TicketVisualizationProps {
    open: boolean;
    onClose: () => void;
}

const TicketVisualization: React.FC<TicketVisualizationProps> = ({ open, onClose }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [coordinatesMap, setCoordinatesMap] = useState<Map<number, { x: number; y: number }>>(new Map());
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadTickets = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await ticketsAPI.getAll(0, 1000); // Load all tickets for visualization
            setTickets(response.content);

            // Fetch coordinates for all tickets
            const coordinatesMap = new Map<number, { x: number; y: number }>();
            const uniqueCoordinatesIds = Array.from(new Set(response.content.map(ticket => ticket.coordinatesId).filter(Boolean)));

            for (const coordinatesId of uniqueCoordinatesIds) {
                try {
                    const coordinates = await coordinatesAPI.getById(coordinatesId);
                    coordinatesMap.set(coordinatesId, { x: coordinates.x || 0, y: coordinates.y });
                } catch (err) {
                    console.warn(`Failed to load coordinates for ID ${coordinatesId}:`, err);
                    coordinatesMap.set(coordinatesId, { x: 0, y: 0 });
                }
            }

            setCoordinatesMap(coordinatesMap);
        } catch (err) {
            setError('Failed to load tickets for visualization');
            console.error('Error loading tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            loadTickets();
        }
    }, [open]);

    const getTicketColor = (ticket: Ticket) => {
        // Different colors for different users
        const userId = ticket.createdById || 0;
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        return colors[userId % colors.length];
    };

    const getTicketSize = (ticket: Ticket) => {
        // Size based on price (normalized)
        const maxPrice = Math.max(...tickets.map(t => t.price));
        const minPrice = Math.min(...tickets.map(t => t.price));
        const normalizedPrice = (ticket.price - minPrice) / (maxPrice - minPrice);
        return Math.max(20, 20 + normalizedPrice * 30); // Size between 20 and 50
    };

    const handleTicketClick = (ticket: Ticket) => {
        setSelectedTicket(ticket);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (!open) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Ticket Visualization</DialogTitle>
            <DialogContent>
                {loading && (
                    <Box display="flex" justifyContent="center" p={4}>
                        <Typography>Loading tickets...</Typography>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {!loading && !error && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Click on a ticket to view details. Size represents price, color represents creator.
                        </Typography>

                        <Paper
                            sx={{
                                p: 2,
                                minHeight: 400,
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                            }}
                        >
                            {tickets.map((ticket) => (
                                <Tooltip
                                    key={ticket.id}
                                    title={`${ticket.name} - ${formatCurrency(ticket.price)}`}
                                    arrow
                                >
                                    <Box
                                        onClick={() => handleTicketClick(ticket)}
                                        sx={{
                                            position: 'absolute',
                                            left: `${(coordinatesMap.get(ticket.coordinatesId)?.x || 0) * 2}px`,
                                            top: `${(coordinatesMap.get(ticket.coordinatesId)?.y || 0) * 2}px`,
                                            width: getTicketSize(ticket),
                                            height: getTicketSize(ticket),
                                            borderRadius: '50%',
                                            backgroundColor: getTicketColor(ticket),
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: 'white',
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                zIndex: 1000
                                            }
                                        }}
                                    >
                                        {ticket.id}
                                    </Box>
                                </Tooltip>
                            ))}

                            {tickets.length === 0 && (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="100%"
                                    minHeight={400}
                                >
                                    <Typography variant="h6" color="text.secondary">
                                        No tickets to visualize
                                    </Typography>
                                </Box>
                            )}
                        </Paper>

                        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                            <Typography variant="body2" color="text.secondary">
                                Legend:
                            </Typography>
                            {Array.from(new Set(tickets.map(t => t.createdById).filter(Boolean))).map((userId, index) => {
                                const userTickets = tickets.filter(t => t.createdById === userId);
                                return (
                                    <Chip
                                        key={userId}
                                        label={`User ${userId} (${userTickets.length})`}
                                        size="small"
                                        sx={{
                                            backgroundColor: getTicketColor(userTickets[0]),
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>

            {/* Ticket Details Dialog */}
            <Dialog
                open={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                maxWidth="sm"
                fullWidth
            >
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

                            {selectedTicket.coordinatesId && coordinatesMap.has(selectedTicket.coordinatesId) && (
                                <Box mt={2}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Coordinates
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        X: {coordinatesMap.get(selectedTicket.coordinatesId)?.x}, Y: {coordinatesMap.get(selectedTicket.coordinatesId)?.y}
                                    </Typography>
                                </Box>
                            )}

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
                    <Button onClick={() => setSelectedTicket(null)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default TicketVisualization;

