// src/modules/tickets/pages/TicketDetailPage.tsx
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import DetailPageActions from "@common/components/DetailPageActions";
import EntityDetail, { EntityField } from "@common/components/EntityDetail";
import {
  createCoordinatesFields,
  createEventFields,
  createLocationFields,
  createPersonFields,
  createVenueFields,
} from "@common/utils/entityFields";
import { useGetCoordinatesQuery } from "@coordinates/api/coordinatesApi";
import { useGetEventQuery } from "@events/api/eventsApi";
import { useGetLocationQuery } from "@locations/api/locationsApi";
import { useGetPersonQuery } from "@persons/api/personsApi";
import { useGetVenueQuery } from "@venues/api/venuesApi";

import {
  useDeleteTicketMutation,
  useGetTicketQuery,
  useUpdateTicketMutation,
} from "../api/ticketsApi";
import { ticketFormFields } from "../config/ticketFormConfig";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ticketId = parseInt(id || "0", 10);

  const {
    data: ticket,
    isLoading: ticketLoading,
    error: ticketError,
    refetch: refetchTicket,
  } = useGetTicketQuery(ticketId, { skip: !ticketId });

  const [updateTicket] = useUpdateTicketMutation();
  const [deleteTicket] = useDeleteTicketMutation();

  // Use shared form configuration

  const {
    data: person,
    isLoading: personLoading,
    error: personError,
  } = useGetPersonQuery(ticket?.personId || 0, { skip: !ticket?.personId });

  const {
    data: location,
    isLoading: locationLoading,
    error: locationError,
  } = useGetLocationQuery(person?.locationId || 0, {
    skip: !person?.locationId,
  });

  const {
    data: coordinates,
    isLoading: coordinatesLoading,
    error: coordinatesError,
  } = useGetCoordinatesQuery(ticket?.coordinatesId || 0, {
    skip: !ticket?.coordinatesId,
  });

  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useGetEventQuery(ticket?.eventId || 0, { skip: !ticket?.eventId });

  const {
    data: venue,
    isLoading: venueLoading,
    error: venueError,
  } = useGetVenueQuery(ticket?.venueId || 0, { skip: !ticket?.venueId });

  // Create nested components for related entities
  const locationComponent = location ? (
    <EntityDetail
      title="Location"
      fields={createLocationFields(location)}
      showAsNested={true}
      entityId={location.id}
      entityType="location"
      onHeaderClick={() => navigate(`/locations/${location.id}`)}
    />
  ) : locationLoading ? (
    <div className="text-center p-3">
      <Spinner size="sm" animation="border" />
      <span className="ms-2">Loading location...</span>
    </div>
  ) : locationError ? (
    <Alert variant="danger" className="mb-0">
      Error loading location
    </Alert>
  ) : null;

  const personFields = person
    ? [
        ...createPersonFields(person),
        {
          key: "location",
          label: "Location",
          value: null,
          nestedComponent: locationComponent,
        },
      ]
    : [];

  const personComponent = person ? (
    <EntityDetail
      title="Person"
      fields={personFields}
      showAsNested={true}
      entityId={person.id}
      entityType="person"
      onHeaderClick={() => navigate(`/persons/${person.id}`)}
    />
  ) : personLoading ? (
    <div className="text-center p-3">
      <Spinner size="sm" animation="border" />
      <span className="ms-2">Loading person...</span>
    </div>
  ) : personError ? (
    <Alert variant="danger" className="mb-0">
      Error loading person
    </Alert>
  ) : null;

  const coordinatesComponent = coordinates ? (
    <EntityDetail
      title="Coordinates"
      fields={createCoordinatesFields(coordinates)}
      showAsNested={true}
      entityId={coordinates.id}
      entityType="coordinate"
      onHeaderClick={() => navigate(`/coordinates/${coordinates.id}`)}
    />
  ) : coordinatesLoading ? (
    <div className="text-center p-3">
      <Spinner size="sm" animation="border" />
      <span className="ms-2">Loading coordinates...</span>
    </div>
  ) : coordinatesError ? (
    <Alert variant="danger" className="mb-0">
      Error loading coordinates
    </Alert>
  ) : null;

  const eventComponent = event ? (
    <EntityDetail
      title="Event"
      fields={createEventFields(event)}
      showAsNested={true}
      entityId={event.id}
      entityType="event"
      onHeaderClick={() => navigate(`/events/${event.id}`)}
    />
  ) : eventLoading ? (
    <div className="text-center p-3">
      <Spinner size="sm" animation="border" />
      <span className="ms-2">Loading event...</span>
    </div>
  ) : eventError ? (
    <Alert variant="danger" className="mb-0">
      Error loading event
    </Alert>
  ) : null;

  const venueComponent = venue ? (
    <EntityDetail
      title="Venue"
      fields={createVenueFields(venue)}
      showAsNested={true}
      entityId={venue.id}
      entityType="venue"
      onHeaderClick={() => navigate(`/venues/${venue.id}`)}
    />
  ) : venueLoading ? (
    <div className="text-center p-3">
      <Spinner size="sm" animation="border" />
      <span className="ms-2">Loading venue...</span>
    </div>
  ) : venueError ? (
    <Alert variant="danger" className="mb-0">
      Error loading venue
    </Alert>
  ) : null;

  // Create ticket fields with nested components
  const ticketFields: EntityField[] = [
    { key: "id", label: "ID", value: ticket?.id },
    { key: "name", label: "Name", value: ticket?.name },
    { key: "price", label: "Price", value: ticket?.price, type: "number" },
    { key: "type", label: "Type", value: ticket?.type, type: "enum" },
    {
      key: "discount",
      label: "Discount (%)",
      value: ticket?.discount,
      type: "number",
    },
    { key: "number", label: "Number", value: ticket?.number, type: "number" },
    { key: "comment", label: "Comment", value: ticket?.comment },
    {
      key: "creationDate",
      label: "Creation Date",
      value: ticket?.creationDate,
      type: "date",
    },
    {
      key: "updatedAt",
      label: "Updated At",
      value: ticket?.updatedAt,
      type: "date",
    },
    {
      key: "person",
      label: "Person",
      value: null,
      nestedComponent: personComponent,
    },
    {
      key: "coordinates",
      label: "Coordinates",
      value: null,
      nestedComponent: coordinatesComponent,
    },
    ...(ticket?.eventId
      ? [
          {
            key: "event",
            label: "Event",
            value: null,
            nestedComponent: eventComponent,
          },
        ]
      : []),
    ...(ticket?.venueId
      ? [
          {
            key: "venue",
            label: "Venue",
            value: null,
            nestedComponent: venueComponent,
          },
        ]
      : []),
  ];

  if (ticketLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading ticket...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (ticketError || !ticket) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {ticketError ? "Error loading ticket" : "Ticket not found"}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate("/tickets")}>
          Back to Tickets
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-2">
        <Col>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/tickets")}
          >
            ← Back to Tickets
          </Button>
        </Col>
        {ticket && (
          <Col className="text-end">
            <DetailPageActions
              entity={ticket}
              entityName="Ticket"
              formFields={ticketFormFields}
              useUpdateMutation={useUpdateTicketMutation}
              useDeleteMutation={useDeleteTicketMutation}
              onDeleteSuccess={() => navigate("/tickets")}
              refetch={refetchTicket}
            />
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={8}>
          <EntityDetail
            title="Ticket"
            fields={ticketFields}
            isLoading={ticketLoading}
            error={ticketError ? "Error loading ticket" : undefined}
            className="mb-4"
            entityId={ticket?.id}
            entityType="ticket"
          />
        </Col>
      </Row>
    </Container>
  );
}
