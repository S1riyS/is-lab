import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    CircularProgress,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Group as GroupIcon,
    Search as SearchIcon,
    Add as AddIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { Ticket } from '../types';
import { ticketsAPI } from '../services';

const SpecialOperations: React.FC = () => {
    const [groupResults, setGroupResults] = useState<Array<[string, number]>>([]);
    const [commentResults, setCommentResults] = useState<Ticket[]>([]);
    const [commentSearch, setCommentSearch] = useState('');
    const [originalTicketId, setOriginalTicketId] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [eventId, setEventId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleGroupByName = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const results = await ticketsAPI.groupByName() as Array<[string, number]>;
            setGroupResults(results);
            setSuccess('Grouping completed successfully');
        } catch (err) {
            setError('Failed to group tickets by name');
            console.error('Error grouping tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchByComment = async () => {
        if (!commentSearch.trim()) {
            setError('Please enter a comment to search for');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const results = await ticketsAPI.getByCommentGreaterThan(commentSearch);
            setCommentResults(results);
            setSuccess(`Found ${results.length} tickets with comment greater than "${commentSearch}"`);
        } catch (err) {
            setError('Failed to search tickets by comment');
            console.error('Error searching tickets:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateWithDiscount = async () => {
        if (!originalTicketId || !discountPercent) {
            setError('Please enter both original ticket ID and discount percent');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await ticketsAPI.createWithDiscount(
                parseInt(originalTicketId),
                parseFloat(discountPercent)
            );
            setSuccess(`Ticket created with discount: ${result.name}`);
            setOriginalTicketId('');
            setDiscountPercent('');
        } catch (err) {
            setError('Failed to create ticket with discount');
            console.error('Error creating ticket:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEvent = async () => {
        if (!eventId) {
            setError('Please enter an event ID');
            return;
        }

        if (!window.confirm('Are you sure you want to cancel this event? This will delete all tickets for this event.')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await ticketsAPI.cancelEvent(parseInt(eventId));
            setSuccess(`Event ${eventId} cancelled and all tickets deleted`);
            setEventId('');
        } catch (err) {
            setError('Failed to cancel event');
            console.error('Error cancelling event:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Special Operations
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <GroupIcon />
                        <Typography>Group Tickets by Name</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Group all tickets by their name and show the count for each group.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleGroupByName}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <GroupIcon />}
                            sx={{ mt: 2 }}
                        >
                            Group by Name
                        </Button>

                        {groupResults.length > 0 && (
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Count</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {groupResults.map(([name, count], index) => (
                                            <TableRow key={index}>
                                                <TableCell>{name}</TableCell>
                                                <TableCell>
                                                    <Chip label={count} color="primary" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <SearchIcon />
                        <Typography>Search by Comment</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Find all tickets with comments greater than the specified value.
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center" mt={2}>
                            <TextField
                                label="Comment to search for"
                                value={commentSearch}
                                onChange={(e) => setCommentSearch(e.target.value)}
                                size="small"
                                sx={{ minWidth: 200 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearchByComment}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                            >
                                Search
                            </Button>
                        </Box>

                        {commentResults.length > 0 && (
                            <TableContainer component={Paper} sx={{ mt: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Comment</TableCell>
                                            <TableCell>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {commentResults.map((ticket) => (
                                            <TableRow key={ticket.id}>
                                                <TableCell>{ticket.id}</TableCell>
                                                <TableCell>{ticket.name}</TableCell>
                                                <TableCell>{ticket.comment}</TableCell>
                                                <TableCell>${ticket.price.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <AddIcon />
                        <Typography>Create Ticket with Discount</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Create a new ticket based on an existing one with a specified discount percentage.
                            The price will be increased by the same amount as the discount.
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center" mt={2}>
                            <TextField
                                label="Original Ticket ID"
                                type="number"
                                value={originalTicketId}
                                onChange={(e) => setOriginalTicketId(e.target.value)}
                                size="small"
                                sx={{ minWidth: 150 }}
                            />
                            <TextField
                                label="Discount %"
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                                size="small"
                                sx={{ minWidth: 120 }}
                                inputProps={{ min: 0, max: 100, step: 0.1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleCreateWithDiscount}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                            >
                                Create
                            </Button>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <CancelIcon />
                        <Typography>Cancel Event</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Cancel an event by deleting all tickets associated with it.
                        </Typography>
                        <Box display="flex" gap={2} alignItems="center" mt={2}>
                            <TextField
                                label="Event ID"
                                type="number"
                                value={eventId}
                                onChange={(e) => setEventId(e.target.value)}
                                size="small"
                                sx={{ minWidth: 150 }}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleCancelEvent}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <CancelIcon />}
                            >
                                Cancel Event
                            </Button>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default SpecialOperations;

