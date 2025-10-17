// src/modules/venues/pages/VenueDetailPage.tsx
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DetailPageActions from "@common/components/DetailPageActions";
import EntityDetail from "@common/components/EntityDetail";
import { canEditEntity, canDeleteEntity } from "@common/utils/permissions";
import { RootState } from "@store/index";

import {
  useDeleteVenueMutation,
  useGetVenueQuery,
  useUpdateVenueMutation,
} from "../api/venuesApi";
import { createVenueFields } from "../config/venueFieldsConfig";
import { venueFormFields } from "../config/venueFormConfig";

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const venueId = parseInt(id || "0", 10);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const {
    data: venue,
    isLoading: venueLoading,
    error: venueError,
    refetch: refetchVenue,
  } = useGetVenueQuery(venueId, { skip: !venueId });

  // Use shared form configuration

  const venueFields = createVenueFields(venue);

  if (venueLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading venue...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (venueError || !venue) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {venueError ? "Error loading venue" : "Venue not found"}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate("/venues")}>
          Back to Venues
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-2">
        <Col lg={4}>
          <Button variant="outline-primary" onClick={() => navigate("/venues")}>
            ← Back to Venues
          </Button>
        </Col>
        <Col lg={8}>
          <div className="d-flex justify-content-end">
            {venue && (
              <DetailPageActions
                entity={venue}
                entityName="Venue"
                formFields={venueFormFields}
                useUpdateMutation={useUpdateVenueMutation}
                useDeleteMutation={useDeleteVenueMutation}
                onDeleteSuccess={() => navigate("/venues")}
                refetch={refetchVenue}
                canEdit={canEditEntity(venue, currentUser?.id ?? null, currentUser?.role ?? null)}
                canDelete={canDeleteEntity(venue, currentUser?.id ?? null, currentUser?.role ?? null)}
              />
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <EntityDetail
            title="Venue"
            fields={venueFields}
            isLoading={venueLoading}
            error={venueError ? "Error loading venue" : undefined}
            className="mb-4"
            entityId={venue?.id}
            entityType="venue"
          />
        </Col>
      </Row>
    </Container>
  );
}
