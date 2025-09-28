import React, { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Alert
} from '@mui/material';
import GenericTable from './GenericTable';
import {
    ticketsAPI,
    usersAPI,
    eventsAPI,
    venuesAPI,
    personsAPI,
    locationsAPI,
    coordinatesAPI
} from '../services';
import {
    Ticket,
    User,
    Event,
    Venue,
    Person,
    Location,
    Coordinates,
    TicketType,
    Color,
    Country,
    VenueType,
    UserRole,
    Page
} from '../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`entity-tabpanel-${index}`}
            aria-labelledby={`entity-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const EntityTabs: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [error, setError] = useState<{ [key: string]: string | null }>({});
    const [data, setData] = useState<{
        tickets: Ticket[];
        users: User[];
        events: Event[];
        venues: Venue[];
        persons: Person[];
        locations: Location[];
        coordinates: Coordinates[];
    }>({
        tickets: [],
        users: [],
        events: [],
        venues: [],
        persons: [],
        locations: [],
        coordinates: []
    });

    const entityKeys = ['tickets', 'users', 'events', 'venues', 'persons', 'locations', 'coordinates'] as const;

    const loadData = async (entity: typeof entityKeys[number]) => {
        setLoading(prev => ({ ...prev, [entity]: true }));
        setError(prev => ({ ...prev, [entity]: null }));

        try {
            let response: Page<any>;
            switch (entity) {
                case 'tickets':
                    response = await ticketsAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, tickets: response.content || [] }));
                    break;
                case 'users':
                    response = await usersAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, users: response.content || [] }));
                    break;
                case 'events':
                    response = await eventsAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, events: response.content || [] }));
                    break;
                case 'venues':
                    response = await venuesAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, venues: response.content || [] }));
                    break;
                case 'persons':
                    response = await personsAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, persons: response.content || [] }));
                    break;
                case 'locations':
                    response = await locationsAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, locations: response.content || [] }));
                    break;
                case 'coordinates':
                    response = await coordinatesAPI.getAll(0, 1000);
                    setData(prev => ({ ...prev, coordinates: response.content || [] }));
                    break;
            }
        } catch (err: any) {
            setError(prev => ({ ...prev, [entity]: err.message || 'An error occurred' }));
        } finally {
            setLoading(prev => ({ ...prev, [entity]: false }));
        }
    };

    const handleCreate = async (entity: typeof entityKeys[number], data: any) => {
        switch (entity) {
            case 'tickets':
                await ticketsAPI.create(data);
                break;
            case 'users':
                await usersAPI.create(data);
                break;
            case 'events':
                await eventsAPI.create(data);
                break;
            case 'venues':
                await venuesAPI.create(data);
                break;
            case 'persons':
                await personsAPI.create(data);
                break;
            case 'locations':
                await locationsAPI.create(data);
                break;
            case 'coordinates':
                await coordinatesAPI.create(data);
                break;
        }
    };

    const handleUpdate = async (entity: typeof entityKeys[number], id: number, data: any) => {
        switch (entity) {
            case 'tickets':
                await ticketsAPI.update(id, data);
                break;
            case 'users':
                await usersAPI.update(id, data);
                break;
            case 'events':
                await eventsAPI.update(id, data);
                break;
            case 'venues':
                await venuesAPI.update(id, data);
                break;
            case 'persons':
                await personsAPI.update(id, data);
                break;
            case 'locations':
                await locationsAPI.update(id, data);
                break;
            case 'coordinates':
                await coordinatesAPI.update(id, data);
                break;
        }
    };

    const handleDelete = async (entity: typeof entityKeys[number], id: number) => {
        switch (entity) {
            case 'tickets':
                await ticketsAPI.delete(id);
                break;
            case 'users':
                await usersAPI.delete(id);
                break;
            case 'events':
                await eventsAPI.delete(id);
                break;
            case 'venues':
                await venuesAPI.delete(id);
                break;
            case 'persons':
                await personsAPI.delete(id);
                break;
            case 'locations':
                await locationsAPI.delete(id);
                break;
            case 'coordinates':
                await coordinatesAPI.delete(id);
                break;
        }
    };

    useEffect(() => {
        // Load initial data for the first tab
        loadData('tickets');
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        const entity = entityKeys[newValue];
        if (data[entity].length === 0) {
            loadData(entity);
        }
    };

    const columns = {
        tickets: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'name', label: 'Name', minWidth: 150 },
            { id: 'price', label: 'Price', minWidth: 80, type: 'number' as const },
            { id: 'type', label: 'Type', minWidth: 100, type: 'select' as const, options: Object.values(TicketType).map(t => ({ value: t, label: t })) },
            { id: 'discount', label: 'Discount', minWidth: 80, type: 'number' as const },
            { id: 'number', label: 'Number', minWidth: 80, type: 'number' as const },
            { id: 'comment', label: 'Comment', minWidth: 200 },
            { id: 'creationDate', label: 'Created', minWidth: 120, type: 'date' as const }
        ],
        users: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'username', label: 'Username', minWidth: 150 },
            { id: 'role', label: 'Role', minWidth: 100, type: 'select' as const, options: Object.values(UserRole).map(r => ({ value: r, label: r })) },
            { id: 'isActive', label: 'Active', minWidth: 80, format: (value: boolean) => value ? 'Yes' : 'No' },
            { id: 'createdAt', label: 'Created', minWidth: 120, type: 'date' as const }
        ],
        events: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'name', label: 'Name', minWidth: 200 },
            { id: 'date', label: 'Date', minWidth: 150, type: 'date' as const },
            { id: 'minAge', label: 'Min Age', minWidth: 80, type: 'number' as const },
            { id: 'description', label: 'Description', minWidth: 300 }
        ],
        venues: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'name', label: 'Name', minWidth: 200 },
            { id: 'capacity', label: 'Capacity', minWidth: 100, type: 'number' as const },
            { id: 'type', label: 'Type', minWidth: 120, type: 'select' as const, options: Object.values(VenueType).map(t => ({ value: t, label: t })) }
        ],
        persons: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'passportID', label: 'Passport ID', minWidth: 150 },
            { id: 'eyeColor', label: 'Eye Color', minWidth: 100, type: 'select' as const, options: Object.values(Color).map(c => ({ value: c, label: c })) },
            { id: 'hairColor', label: 'Hair Color', minWidth: 100, type: 'select' as const, options: Object.values(Color).map(c => ({ value: c, label: c })) },
            { id: 'nationality', label: 'Nationality', minWidth: 120, type: 'select' as const, options: Object.values(Country).map(c => ({ value: c, label: c })) }
        ],
        locations: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'x', label: 'X', minWidth: 80, type: 'number' as const },
            { id: 'y', label: 'Y', minWidth: 80, type: 'number' as const },
            { id: 'z', label: 'Z', minWidth: 80, type: 'number' as const },
            { id: 'name', label: 'Name', minWidth: 200 }
        ],
        coordinates: [
            { id: 'id', label: 'ID', minWidth: 50 },
            { id: 'x', label: 'X', minWidth: 80, type: 'number' as const },
            { id: 'y', label: 'Y', minWidth: 80, type: 'number' as const }
        ]
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="entity tabs">
                    <Tab label="Tickets" />
                    <Tab label="Users" />
                    <Tab label="Events" />
                    <Tab label="Venues" />
                    <Tab label="Persons" />
                    <Tab label="Locations" />
                    <Tab label="Coordinates" />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                <GenericTable
                    title="Tickets"
                    columns={columns.tickets}
                    data={data.tickets}
                    loading={loading.tickets || false}
                    error={error.tickets}
                    onRefresh={() => loadData('tickets')}
                    onCreate={(data) => handleCreate('tickets', data)}
                    onUpdate={(id, data) => handleUpdate('tickets', id, data)}
                    onDelete={(id) => handleDelete('tickets', id)}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <GenericTable
                    title="Users"
                    columns={columns.users}
                    data={data.users}
                    loading={loading.users || false}
                    error={error.users}
                    onRefresh={() => loadData('users')}
                    onCreate={(data) => handleCreate('users', data)}
                    onUpdate={(id, data) => handleUpdate('users', id, data)}
                    onDelete={(id) => handleDelete('users', id)}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <GenericTable
                    title="Events"
                    columns={columns.events}
                    data={data.events}
                    loading={loading.events || false}
                    error={error.events}
                    onRefresh={() => loadData('events')}
                    onCreate={(data) => handleCreate('events', data)}
                    onUpdate={(id, data) => handleUpdate('events', id, data)}
                    onDelete={(id) => handleDelete('events', id)}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <GenericTable
                    title="Venues"
                    columns={columns.venues}
                    data={data.venues}
                    loading={loading.venues || false}
                    error={error.venues}
                    onRefresh={() => loadData('venues')}
                    onCreate={(data) => handleCreate('venues', data)}
                    onUpdate={(id, data) => handleUpdate('venues', id, data)}
                    onDelete={(id) => handleDelete('venues', id)}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
                <GenericTable
                    title="Persons"
                    columns={columns.persons}
                    data={data.persons}
                    loading={loading.persons || false}
                    error={error.persons}
                    onRefresh={() => loadData('persons')}
                    onCreate={(data) => handleCreate('persons', data)}
                    onUpdate={(id, data) => handleUpdate('persons', id, data)}
                    onDelete={(id) => handleDelete('persons', id)}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
                <GenericTable
                    title="Locations"
                    columns={columns.locations}
                    data={data.locations}
                    loading={loading.locations || false}
                    error={error.locations}
                    onRefresh={() => loadData('locations')}
                    onCreate={(data) => handleCreate('locations', data)}
                    onUpdate={(id, data) => handleUpdate('locations', id, data)}
                    onDelete={(id) => handleDelete('locations', id)}
                />
            </TabPanel>

            <TabPanel value={tabValue} index={6}>
                <GenericTable
                    title="Coordinates"
                    columns={columns.coordinates}
                    data={data.coordinates}
                    loading={loading.coordinates || false}
                    error={error.coordinates}
                    onRefresh={() => loadData('coordinates')}
                    onCreate={(data) => handleCreate('coordinates', data)}
                    onUpdate={(id, data) => handleUpdate('coordinates', id, data)}
                    onDelete={(id) => handleDelete('coordinates', id)}
                />
            </TabPanel>
        </Box>
    );
};

export default EntityTabs;
