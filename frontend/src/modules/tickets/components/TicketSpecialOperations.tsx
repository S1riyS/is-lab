// src/modules/tickets/components/TicketSpecialOperations.tsx
import { useState } from "react";

import { Alert, Button, Form, Modal, Stack, Table } from "react-bootstrap";
import { toast } from "react-toastify";

import { showErrorToast } from "@common/api/baseApi";
import { EntitySelect } from "@common/components/EntitySelect";
import {
  useEventOptions,
  useTicketOptions,
} from "@common/hooks/useEntityOptions";

import {
  useCancelEventMutation,
  useCreateTicketWithDiscountMutation,
  useGetTicketsByCommentGreaterThanQuery,
  useGroupTicketsByNameQuery,
} from "../api/ticketsApi";

export function GroupTicketsByNameModal() {
  const [show, setShow] = useState(false);
  const {
    data: groupedTickets,
    isLoading,
    error,
  } = useGroupTicketsByNameQuery(undefined, {
    skip: !show,
  });

  return (
    <>
      <Button variant="info" onClick={() => setShow(true)}>
        Group Tickets by Name
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Groups by Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && <Alert variant="info">Loading...</Alert>}
          {error && <Alert variant="danger">Error loading groups</Alert>}
          {groupedTickets && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Ticket Name</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {groupedTickets.map(([name, count], index) => (
                  <tr key={index}>
                    <td>{name}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export function TicketsByCommentModal() {
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const {
    data: tickets,
    isLoading,
    refetch,
  } = useGetTicketsByCommentGreaterThanQuery(comment, {
    skip: !show || !comment,
  });

  const handleSearch = () => {
    if (comment.trim()) {
      refetch();
    }
  };

  return (
    <>
      <Button variant="info" onClick={() => setShow(true)}>
        Find Tickets by Comment
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Find Tickets by Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label>Minimum Comment</Form.Label>
              <Form.Control
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter minimum comment to search for"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Form.Text className="text-muted">
                Finds tickets with comments greater than this value
              </Form.Text>
            </Form.Group>

            <Button onClick={handleSearch} disabled={!comment.trim()}>
              Search
            </Button>

            {isLoading && <Alert variant="info">Loading...</Alert>}
            {tickets && (
              <div>
                <h6>Found {tickets.length} tickets:</h6>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.name}</td>
                        <td>{ticket.comment}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
}

export function CreateTicketWithDiscountModal() {
  const [show, setShow] = useState(false);
  const [originalTicketId, setOriginalTicketId] = useState<number | string>("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [createWithDiscount, { isLoading }] =
    useCreateTicketWithDiscountMutation();
  const { options: ticketOptions, isLoading: ticketsLoading } =
    useTicketOptions();

  const handleSubmit = async () => {
    if (!originalTicketId || !discountPercent) return;

    try {
      await createWithDiscount({
        originalTicketId: Number(originalTicketId),
        discountPercent: parseFloat(discountPercent),
      }).unwrap();

      toast.success("Ticket created with discount successfully");
      setShow(false);
      setOriginalTicketId("");
      setDiscountPercent("");
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <>
      <Button variant="success" onClick={() => setShow(true)}>
        Create Ticket with Discount
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Ticket with Discount</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <EntitySelect
              value={originalTicketId}
              onChange={setOriginalTicketId}
              options={ticketOptions}
              placeholder="Select original ticket"
              label="Original Ticket"
              required
              helpText="Select the ticket to create a discounted copy from"
              isLoading={ticketsLoading}
            />
            <Form.Group>
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="Enter discount percentage (0-100)"
                min="0"
                max="100"
                step="1"
              />
            </Form.Group>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!originalTicketId || !discountPercent || isLoading}
          >
            {isLoading ? "Creating..." : "Create Ticket"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export function CancelEventButton() {
  const [show, setShow] = useState(false);
  const [eventId, setEventId] = useState<number | string>("");
  const [cancelEvent, { isLoading }] = useCancelEventMutation();
  const { options: eventOptions, isLoading: eventsLoading } = useEventOptions();

  const handleCancel = async () => {
    if (!eventId) return;

    if (
      !confirm(
        `Are you sure you want to cancel event ${eventId} and delete all associated tickets?`,
      )
    ) {
      return;
    }

    try {
      await cancelEvent({ eventId: Number(eventId) }).unwrap();
      toast.success("Event cancelled successfully");
      setShow(false);
      setEventId("");
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShow(true)}>
        Cancel Event
      </Button>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EntitySelect
            value={eventId}
            onChange={setEventId}
            options={eventOptions}
            placeholder="Select event to cancel"
            label="Event to Cancel"
            required
            helpText="Warning: This will delete all tickets associated with this event!"
            isLoading={eventsLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleCancel}
            disabled={!eventId || isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Event"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
