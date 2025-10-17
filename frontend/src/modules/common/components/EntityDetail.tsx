// src/modules/common/components/EntityDetail.tsx
import React from "react";

import { Alert, Card, Col, Row, Spinner } from "react-bootstrap";

export type EntityField = {
  key: string;
  label: string;
  value: any;
  type?: "text" | "number" | "date" | "enum" | "nested";
  render?: (value: any) => React.ReactNode;
  nestedComponent?: React.ReactNode;
};

export type EntityDetailProps = {
  title: string;
  fields: EntityField[];
  isLoading?: boolean;
  error?: string;
  className?: string;
  showAsNested?: boolean;
  entityId?: number;
  entityType?: string;
  onHeaderClick?: () => void;
};

export default function EntityDetail({
  title,
  fields,
  isLoading = false,
  error,
  className = "",
  showAsNested = false,
  entityId,
  entityType,
  onHeaderClick,
}: EntityDetailProps) {
  const renderHeader = (headerTitle: string) => {
    const displayTitle = entityId ? `${headerTitle} #${entityId}` : headerTitle;

    if (onHeaderClick && entityId) {
      return (
        <h5
          className="mb-0 text-primary"
          style={{ cursor: "pointer" }}
          onClick={onHeaderClick}
        >
          {displayTitle}
        </h5>
      );
    }

    return <h5 className="mb-0">{displayTitle}</h5>;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <Card.Header>{renderHeader(title)}</Card.Header>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <Card.Header>{renderHeader(title)}</Card.Header>
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  if (showAsNested) {
    return (
      <div className={className}>
        <Card className="mb-2">
          <Card.Header className="bg-light">
            {entityId ? (
              <h6
                className="mb-0 text-primary"
                style={{ cursor: onHeaderClick ? "pointer" : "default" }}
                onClick={onHeaderClick}
              >
                {title} #{entityId}
              </h6>
            ) : (
              <h6 className="mb-0">{title}</h6>
            )}
          </Card.Header>
          <Card.Body>
            {fields.map((field) => (
              <div key={field.key} className="mb-2">
                {field.nestedComponent ? (
                  <>
                    <div className="mb-2">
                      <strong>{field.label}:</strong>
                    </div>
                    {field.nestedComponent}
                  </>
                ) : (
                  <Row className="mb-2">
                    <Col xs={12} sm={4} md={3}>
                      <strong>{field.label}:</strong>
                    </Col>
                    <Col xs={12} sm={8} md={9}>
                      {field.render ? (
                        field.render(field.value)
                      ) : (
                        <span>
                          {field.value !== null && field.value !== undefined
                            ? String(field.value)
                            : "N/A"}
                        </span>
                      )}
                    </Col>
                  </Row>
                )}
              </div>
            ))}
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <Card className={className}>
      <Card.Header>{renderHeader(title)}</Card.Header>
      <Card.Body>
        {fields.map((field) => (
          <div key={field.key} className="mb-2">
            {field.nestedComponent ? (
              <>
                <div className="mb-2">
                  <strong>{field.label}:</strong>
                </div>
                {field.nestedComponent}
              </>
            ) : (
              <Row className="mb-2">
                <Col xs={12} sm={4} md={3}>
                  <strong>{field.label}:</strong>
                </Col>
                <Col xs={12} sm={8} md={9}>
                  {field.render ? (
                    field.render(field.value)
                  ) : (
                    <span>
                      {field.value !== null && field.value !== undefined
                        ? String(field.value)
                        : "N/A"}
                    </span>
                  )}
                </Col>
              </Row>
            )}
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}
