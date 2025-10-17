// src/modules/persons/pages/PersonDetailPage.tsx
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import DetailPageActions from "@common/components/DetailPageActions";
import EntityDetail, { EntityField } from "@common/components/EntityDetail";
import { canEditEntity, canDeleteEntity } from "@common/utils/permissions";
import { RootState } from "@store/index";
import { useGetLocationQuery } from "@locations/api/locationsApi";
import { createLocationFields } from "@locations/config/locationFieldsConfig";

import {
  useDeletePersonMutation,
  useGetPersonQuery,
  useUpdatePersonMutation,
} from "../api/personsApi";
import { createPersonFields } from "../config/personFieldsConfig";
import { personFormFields } from "../config/personFormConfig";

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const personId = parseInt(id || "0", 10);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const {
    data: person,
    isLoading: personLoading,
    error: personError,
    refetch: refetchPerson,
  } = useGetPersonQuery(personId, { skip: !personId });

  const {
    data: location,
    isLoading: locationLoading,
    error: locationError,
  } = useGetLocationQuery(person?.locationId || 0, {
    skip: !person?.locationId,
  });

  // Create nested component for location
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

  // Create person fields with nested component
  const personFields: EntityField[] = [
    { key: "id", label: "ID", value: person?.id },
    { key: "passportID", label: "Passport ID", value: person?.passportID },
    {
      key: "nationality",
      label: "Nationality",
      value: person?.nationality,
      type: "enum",
    },
    {
      key: "eyeColor",
      label: "Eye Color",
      value: person?.eyeColor,
      type: "enum",
    },
    {
      key: "hairColor",
      label: "Hair Color",
      value: person?.hairColor,
      type: "enum",
    },
    {
      key: "location",
      label: "Location",
      value: null,
      nestedComponent: locationComponent,
    },
  ];

  if (personLoading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading person...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (personError || !person) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {personError ? "Error loading person" : "Person not found"}
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate("/persons")}>
          Back to Persons
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
            onClick={() => navigate("/persons")}
          >
            ← Back to Persons
          </Button>
        </Col>
        <Col lg={8}>
          <div className="d-flex justify-content-end">
            {person && (
              <DetailPageActions
                entity={person}
                entityName="Person"
                formFields={personFormFields}
                useUpdateMutation={useUpdatePersonMutation}
                useDeleteMutation={useDeletePersonMutation}
                onDeleteSuccess={() => navigate("/persons")}
                refetch={refetchPerson}
                canEdit={canEditEntity(person, currentUser?.id ?? null, currentUser?.role ?? null)}
                canDelete={canDeleteEntity(person, currentUser?.id ?? null, currentUser?.role ?? null)}
              />
            )}
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <EntityDetail
            title="Person"
            fields={personFields}
            isLoading={personLoading}
            error={personError ? "Error loading person" : undefined}
            className="mb-4"
            entityId={person?.id}
            entityType="person"
          />
        </Col>
      </Row>
    </Container>
  );
}
