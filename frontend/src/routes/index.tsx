import React from 'react';
import TicketsPage from 'src/modules/tickets/pages/TicketsPage';
import HomePage from 'src/modules/common/pages/HomePage';
import NotFoundPage from 'src/modules/common/pages/NotFoundPage';
import EventsPage from 'src/modules/events/pages/EventsPage';
import VenuesPage from 'src/modules/venues/pages/VenuesPage';
import PersonsPage from 'src/modules/persons/pages/PersonsPage';
import LocationsPage from 'src/modules/locations/pages/LocationsPage';
import CoordinatesPage from 'src/modules/coordinates/pages/CoordinatesPage';
import UsersPage from 'src/modules/users/pages/UsersPage';

export type AppRoute = { path: string; element: React.ReactNode };

const routes: AppRoute[] = [
    { path: '/', element: <HomePage /> },
    { path: '/tickets', element: <TicketsPage /> },
    { path: '/events', element: <EventsPage /> },
    { path: '/venues', element: <VenuesPage /> },
    { path: '/persons', element: <PersonsPage /> },
    { path: '/locations', element: <LocationsPage /> },
    { path: '/coordinates', element: <CoordinatesPage /> },
    { path: '/users', element: <UsersPage /> },
    { path: '/*', element: <NotFoundPage /> },
];

export default routes;




