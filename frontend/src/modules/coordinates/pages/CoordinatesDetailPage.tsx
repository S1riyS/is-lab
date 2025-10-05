// src/modules/coordinates/pages/CoordinatesDetailPage.tsx
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import DetailPageActions from "@common/components/DetailPageActions";
import EntityDetail from "@common/components/EntityDetail";

import {
  useDeleteCoordinatesMutation,
  useGetCoordinatesQuery,
  useUpdateCoordinatesMutation,
} from "../api/coordinatesApi";
import { createCoordinatesFields } from "../config/coordinatesFieldsConfig";
import { coordinatesFormFields } from "../config/coordinatesFormConfig";

export default function CoordinatesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const coordinatesId = parseInt(id || "0", 10);

  const {
    data: coordinates,
    isLoading: coordinatesLoading,
    error: coordinatesError,
    refetch: refetchCoordinates,
  } = useGetCoordinatesQuery(coordinatesId, { skip: !coordinatesId });

  const [updateCoordinates] = useUpdateCoordinatesMutation();
  const [deleteCoordinates] = useDeleteCoordinatesMutation();

  // Use shared form configuration

  const coordinatesFields = createCoordinatesFields(coordinates);

  if (coordinatesLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading coordinates...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (coordinatesError || !coordinates) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {coordinatesError
            ? "Error loading coordinates"
            : "Coordinates not found"}
        </Alert>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/coordinates")}
        >
          Back to Coordinates
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
            onClick={() => navigate("/coordinates")}
          >
            ← Back to Coordinates
          </Button>
        </Col>
        {coordinates && (
          <Col className="text-end">
            <DetailPageActions
              entity={coordinates}
              entityName="Coordinates"
              formFields={coordinatesFormFields}
              useUpdateMutation={useUpdateCoordinatesMutation}
              useDeleteMutation={useDeleteCoordinatesMutation}
              onDeleteSuccess={() => navigate("/coordinates")}
              refetch={refetchCoordinates}
            />
          </Col>
        )}
      </Row>

      <Row>
        <Col lg={12}>
          <EntityDetail
            title="Coordinates"
            fields={coordinatesFields}
            isLoading={coordinatesLoading}
            error={coordinatesError ? "Error loading coordinates" : undefined}
            className="mb-4"
            entityId={coordinates?.id}
            entityType="coordinate"
          />
        </Col>
      </Row>
    </Container>
  );
}
