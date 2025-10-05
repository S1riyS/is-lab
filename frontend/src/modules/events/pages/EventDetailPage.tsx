// src/modules/events/pages/EventDetailPage.tsx
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import DetailPageActions from "@common/components/DetailPageActions";
import EntityDetail from "@common/components/EntityDetail";

import {
  useDeleteEventMutation,
  useGetEventQuery,
  useUpdateEventMutation,
} from "../api/eventsApi";
import { createEventFields } from "../config/eventFieldsConfig";
import { eventFormFields } from "../config/eventFormConfig";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = parseInt(id || "0", 10);

  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent,
  } = useGetEventQuery(eventId, { skip: !eventId });

  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  // Use shared form configuration

  const eventFields = createEventFields(event);

  if (eventLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading event...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (eventError || !event) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {eventError ? "Error loading event" : "Event not found"}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate("/events")}>
          Back to Events
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-2">
        <Col lg={4}>
          <Button variant="outline-primary" onClick={() => navigate("/events")}>
            ← Back to Events
          </Button>
        </Col>
        <Col lg={8}>
          <div className="d-flex justify-content-end">
            {event && (
              <DetailPageActions
                entity={event}
                entityName="Event"
                formFields={eventFormFields}
                useUpdateMutation={useUpdateEventMutation}
                useDeleteMutation={useDeleteEventMutation}
                onDeleteSuccess={() => navigate("/events")}
                refetch={refetchEvent}
              />
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <EntityDetail
            title="Event"
            fields={eventFields}
            isLoading={eventLoading}
            error={eventError ? "Error loading event" : undefined}
            className="mb-4"
            entityId={event?.id}
            entityType="event"
          />
        </Col>
      </Row>
    </Container>
  );
}
