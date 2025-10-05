// src/modules/locations/pages/LocationDetailPage.tsx
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import DetailPageActions from "@common/components/DetailPageActions";
import EntityDetail from "@common/components/EntityDetail";

import {
  useDeleteLocationMutation,
  useGetLocationQuery,
  useUpdateLocationMutation,
} from "../api/locationsApi";
import { createLocationFields } from "../config/locationFieldsConfig";
import { locationFormFields } from "../config/locationFormConfig";

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const locationId = parseInt(id || "0", 10);

  const {
    data: location,
    isLoading: locationLoading,
    error: locationError,
    refetch: refetchLocation,
  } = useGetLocationQuery(locationId, { skip: !locationId });

  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

  // Use shared form configuration

  const locationFields = createLocationFields(location);

  if (locationLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading location...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (locationError || !location) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {locationError ? "Error loading location" : "Location not found"}
        </Alert>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/locations")}
        >
          Back to Locations
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-2">
        <Col lg={4}>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/locations")}
          >
            ← Back to Locations
          </Button>
        </Col>
        <Col lg={8}>
          <div className="d-flex justify-content-end">
            {location && (
              <DetailPageActions
                entity={location}
                entityName="Location"
                formFields={locationFormFields}
                useUpdateMutation={useUpdateLocationMutation}
                useDeleteMutation={useDeleteLocationMutation}
                onDeleteSuccess={() => navigate("/locations")}
                refetch={refetchLocation}
              />
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <EntityDetail
            title="Location"
            fields={locationFields}
            isLoading={locationLoading}
            error={locationError ? "Error loading location" : undefined}
            className="mb-2"
            entityId={location?.id}
            entityType="location"
          />
        </Col>
      </Row>
    </Container>
  );
}
