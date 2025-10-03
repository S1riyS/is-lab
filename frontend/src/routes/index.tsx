import React from "react";

import NotFoundPage from "@common/pages/NotFoundPage";
import CoordinatesDetailPage from "@coordinates/pages/CoordinatesDetailPage";
import CoordinatesPage from "@coordinates/pages/CoordinatesPage";
import EventDetailPage from "@events/pages/EventDetailPage";
import EventsPage from "@events/pages/EventsPage";
import LocationDetailPage from "@locations/pages/LocationDetailPage";
import LocationsPage from "@locations/pages/LocationsPage";
import PersonDetailPage from "@persons/pages/PersonDetailPage";
import PersonsPage from "@persons/pages/PersonsPage";
import TicketDetailPage from "@tickets/pages/TicketDetailPage";
import TicketsPage from "@tickets/pages/TicketsPage";
import UsersPage from "@users/pages/UsersPage";
import VenueDetailPage from "@venues/pages/VenueDetailPage";
import VenuesPage from "@venues/pages/VenuesPage";

export type AppRoute = { path: string; element: React.ReactNode };

const routes: AppRoute[] = [
  { path: "/", element: <TicketsPage /> },
  { path: "/tickets", element: <TicketsPage /> },
  { path: "/tickets/:id", element: <TicketDetailPage /> },
  { path: "/events", element: <EventsPage /> },
  { path: "/events/:id", element: <EventDetailPage /> },
  { path: "/venues", element: <VenuesPage /> },
  { path: "/venues/:id", element: <VenueDetailPage /> },
  { path: "/persons", element: <PersonsPage /> },
  { path: "/persons/:id", element: <PersonDetailPage /> },
  { path: "/locations", element: <LocationsPage /> },
  { path: "/locations/:id", element: <LocationDetailPage /> },
  { path: "/coordinates", element: <CoordinatesPage /> },
  { path: "/coordinates/:id", element: <CoordinatesDetailPage /> },
  { path: "/users", element: <UsersPage /> },
  { path: "/*", element: <NotFoundPage /> },
];

export default routes;
