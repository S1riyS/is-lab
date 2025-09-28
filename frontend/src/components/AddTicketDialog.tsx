import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Typography,
    Stack
} from '@mui/material';
import { Ticket, TicketType, Color, Country, VenueType, TicketCreateDto } from '../types';
import { ticketsAPI } from '../services';

interface AddTicketDialogProps {
    open: boolean;
    onClose: () => void;
    onTicketAdded: () => void;
}

const AddTicketDialog: React.FC<AddTicketDialogProps> = ({ open, onClose, onTicketAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        discount: '',
        number: '',
        comment: '',
        type: '',
        // Coordinates
        x: '',
        y: '',
        // Person
        passportID: '',
        nationality: '',
        eyeColor: '',
        hairColor: '',
        // Location
        locationX: '',
        locationY: '',
        locationZ: '',
        locationName: '',
        // Event
        eventName: '',
        eventDate: '',
        eventMinAge: '',
        eventDescription: '',
        // Venue
        venueName: '',
        venueCapacity: '',
        venueType: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSelectChange = (field: string) => (event: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.price || !formData.passportID || !formData.nationality) {
                setError('Please fill in all required fields');
                return;
            }

            const ticketData: Partial<Ticket> = {
                name: formData.name,
                price: parseFloat(formData.price),
                discount: parseFloat(formData.discount) || 0,
                number: parseInt(formData.number) || 1,
                comment: formData.comment,
                type: formData.type as TicketType || undefined,
                coordinates: {
                    id: 0, // Will be set by backend
                    x: parseFloat(formData.x) || 0,
                    y: parseFloat(formData.y) || 0
                },
                person: {
                    id: 0, // Will be set by backend
                    passportID: formData.passportID,
                    nationality: formData.nationality as Country,
                    eyeColor: formData.eyeColor as Color || undefined,
                    hairColor: formData.hairColor as Color || undefined,
                    location: {
                        id: 0, // Will be set by backend
                        x: parseFloat(formData.locationX) || 0,
                        y: parseFloat(formData.locationY) || 0,
                        z: parseFloat(formData.locationZ) || 0,
                        name: formData.locationName || undefined
                    }
                }
            };

            // Add event if provided
            if (formData.eventName) {
                ticketData.event = {
                    id: 0, // Will be set by backend
                    name: formData.eventName,
                    date: formData.eventDate || undefined,
                    minAge: parseInt(formData.eventMinAge) || 0,
                    description: formData.eventDescription
                };
            }

            // Add venue if provided
            if (formData.venueName) {
                ticketData.venue = {
                    id: 0, // Will be set by backend
                    name: formData.venueName,
                    capacity: parseInt(formData.venueCapacity) || 0,
                    type: formData.venueType as VenueType
                };
            }

            // Fix: Ensure ticketData matches TicketCreateDto (no undefined for required fields)
            await ticketsAPI.create(ticketData as TicketCreateDto);
            onTicketAdded();
            onClose();

            // Reset form
            setFormData({
                name: '',
                price: '',
                discount: '',
                number: '',
                comment: '',
                type: '',
                x: '',
                y: '',
                passportID: '',
                nationality: '',
                eyeColor: '',
                hairColor: '',
                locationX: '',
                locationY: '',
                locationZ: '',
                locationName: '',
                eventName: '',
                eventDate: '',
                eventMinAge: '',
                eventDescription: '',
                venueName: '',
                venueCapacity: '',
                venueType: ''
            });
        } catch (err) {
            setError('Failed to create ticket. Please try again.');
            console.error('Error creating ticket:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Add New Ticket</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        {/* Basic Ticket Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Name *"
                                    value={formData.name}
                                    onChange={handleInputChange('name')}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Price *"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange('price')}
                                    required
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Discount %"
                                    type="number"
                                    value={formData.discount}
                                    onChange={handleInputChange('discount')}
                                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                                />
                                <TextField
                                    fullWidth
                                    label="Number"
                                    type="number"
                                    value={formData.number}
                                    onChange={handleInputChange('number')}
                                    inputProps={{ min: 1 }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        value={formData.type}
                                        onChange={handleSelectChange('type')}
                                        label="Type"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value={TicketType.VIP}>VIP</MenuItem>
                                        <MenuItem value={TicketType.USUAL}>Usual</MenuItem>
                                        <MenuItem value={TicketType.BUDGETARY}>Budgetary</MenuItem>
                                        <MenuItem value={TicketType.CHEAP}>Cheap</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                            <TextField
                                fullWidth
                                label="Comment"
                                multiline
                                rows={2}
                                value={formData.comment}
                                onChange={handleInputChange('comment')}
                                sx={{ mt: 2 }}
                            />
                        </Box>

                        {/* Coordinates */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Coordinates
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="X Coordinate"
                                    type="number"
                                    value={formData.x}
                                    onChange={handleInputChange('x')}
                                />
                                <TextField
                                    fullWidth
                                    label="Y Coordinate"
                                    type="number"
                                    value={formData.y}
                                    onChange={handleInputChange('y')}
                                />
                            </Stack>
                        </Box>

                        {/* Person Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Person Information
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Passport ID *"
                                    value={formData.passportID}
                                    onChange={handleInputChange('passportID')}
                                    required
                                />
                                <FormControl fullWidth required>
                                    <InputLabel>Nationality *</InputLabel>
                                    <Select
                                        value={formData.nationality}
                                        onChange={handleSelectChange('nationality')}
                                        label="Nationality *"
                                    >
                                        <MenuItem value={Country.USA}>USA</MenuItem>
                                        <MenuItem value={Country.SPAIN}>Spain</MenuItem>
                                        <MenuItem value={Country.SOUTH_KOREA}>South Korea</MenuItem>
                                        <MenuItem value={Country.JAPAN}>Japan</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Eye Color</InputLabel>
                                    <Select
                                        value={formData.eyeColor}
                                        onChange={handleSelectChange('eyeColor')}
                                        label="Eye Color"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value={Color.RED}>Red</MenuItem>
                                        <MenuItem value={Color.YELLOW}>Yellow</MenuItem>
                                        <MenuItem value={Color.ORANGE}>Orange</MenuItem>
                                        <MenuItem value={Color.WHITE}>White</MenuItem>
                                        <MenuItem value={Color.BROWN}>Brown</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Hair Color</InputLabel>
                                    <Select
                                        value={formData.hairColor}
                                        onChange={handleSelectChange('hairColor')}
                                        label="Hair Color"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value={Color.RED}>Red</MenuItem>
                                        <MenuItem value={Color.YELLOW}>Yellow</MenuItem>
                                        <MenuItem value={Color.ORANGE}>Orange</MenuItem>
                                        <MenuItem value={Color.WHITE}>White</MenuItem>
                                        <MenuItem value={Color.BROWN}>Brown</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Box>

                        {/* Location */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Location
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="X"
                                    type="number"
                                    value={formData.locationX}
                                    onChange={handleInputChange('locationX')}
                                />
                                <TextField
                                    fullWidth
                                    label="Y"
                                    type="number"
                                    value={formData.locationY}
                                    onChange={handleInputChange('locationY')}
                                />
                                <TextField
                                    fullWidth
                                    label="Z"
                                    type="number"
                                    value={formData.locationZ}
                                    onChange={handleInputChange('locationZ')}
                                />
                                <TextField
                                    fullWidth
                                    label="Location Name"
                                    value={formData.locationName}
                                    onChange={handleInputChange('locationName')}
                                />
                            </Stack>
                        </Box>

                        {/* Event (Optional) */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Event (Optional)
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Event Name"
                                    value={formData.eventName}
                                    onChange={handleInputChange('eventName')}
                                />
                                <TextField
                                    fullWidth
                                    label="Event Date"
                                    type="date"
                                    value={formData.eventDate}
                                    onChange={handleInputChange('eventDate')}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    label="Minimum Age"
                                    type="number"
                                    value={formData.eventMinAge}
                                    onChange={handleInputChange('eventMinAge')}
                                    inputProps={{ min: 0 }}
                                />
                            </Stack>
                            <TextField
                                fullWidth
                                label="Event Description"
                                multiline
                                rows={2}
                                value={formData.eventDescription}
                                onChange={handleInputChange('eventDescription')}
                                sx={{ mt: 2 }}
                            />
                        </Box>

                        {/* Venue (Optional) */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                Venue (Optional)
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Venue Name"
                                    value={formData.venueName}
                                    onChange={handleInputChange('venueName')}
                                />
                                <TextField
                                    fullWidth
                                    label="Capacity"
                                    type="number"
                                    value={formData.venueCapacity}
                                    onChange={handleInputChange('venueCapacity')}
                                    inputProps={{ min: 1 }}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Venue Type</InputLabel>
                                    <Select
                                        value={formData.venueType}
                                        onChange={handleSelectChange('venueType')}
                                        label="Venue Type"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem value={VenueType.OPEN_AREA}>Open Area</MenuItem>
                                        <MenuItem value={VenueType.CINEMA}>Cinema</MenuItem>
                                        <MenuItem value={VenueType.STADIUM}>Stadium</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTicketDialog;
