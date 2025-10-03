import { EntityOption } from "@common/components/EntitySelect";
import { useListCoordinatesQuery } from "@coordinates/api/coordinatesApi";
import { useListEventsQuery } from "@events/api/eventsApi";
import { useListLocationsQuery } from "@locations/api/locationsApi";
import { useListPersonsQuery } from "@persons/api/personsApi";
import { useListTicketsQuery } from "@tickets/api/ticketsApi";
import { useListVenuesQuery } from "@venues/api/venuesApi";

export function usePersonOptions() {
  const {
    data: personsData,
    isLoading,
    error,
  } = useListPersonsQuery({
    page: 0,
    size: 1000, // Get all persons for dropdown
  });

  const options: EntityOption[] =
    personsData?.content?.map((person) => ({
      id: person.id,
      displayText: `Person #${person.id}`,
      additionalInfo: `Passport: ${person.passportID}`,
    })) || [];

  return { options, isLoading, error };
}

export function useEventOptions() {
  const {
    data: eventsData,
    isLoading,
    error,
  } = useListEventsQuery({
    page: 0,
    size: 1000, // Get all events for dropdown
  });

  const options: EntityOption[] =
    eventsData?.content?.map((event) => ({
      id: event.id,
      displayText: `Event #${event.id}`,
      additionalInfo: event.date
        ? `Name: ${event.name}, Date: ${new Date(event.date).toLocaleDateString()}`
        : undefined,
    })) || [];

  return { options, isLoading, error };
}

export function useVenueOptions() {
  const {
    data: venuesData,
    isLoading,
    error,
  } = useListVenuesQuery({
    page: 0,
    size: 1000, // Get all venues for dropdown
  });

  const options: EntityOption[] =
    venuesData?.content?.map((venue) => ({
      id: venue.id,
      displayText: `Venue #${venue.id}`,
      additionalInfo: `Name: ${venue.name}, Type: ${venue.type}`,
    })) || [];

  return { options, isLoading, error };
}

export function useCoordinatesOptions() {
  const {
    data: coordinatesData,
    isLoading,
    error,
  } = useListCoordinatesQuery({
    page: 0,
    size: 1000, // Get all coordinates for dropdown
  });

  const options: EntityOption[] =
    coordinatesData?.content?.map((coords) => ({
      id: coords.id,
      displayText: `Coordinates #${coords.id}`,
      additionalInfo: `(${coords.x}, ${coords.y})`,
    })) || [];

  return { options, isLoading, error };
}

export function useLocationOptions() {
  const {
    data: locationsData,
    isLoading,
    error,
  } = useListLocationsQuery({
    page: 0,
    size: 1000, // Get all locations for dropdown
  });

  const options: EntityOption[] =
    locationsData?.content?.map((location) => ({
      id: location.id,
      displayText: `Location #${location.id}${location.name ? `: ${location.name}` : ""}`,
      additionalInfo: `(${location.x}, ${location.y}, ${location.z})`,
    })) || [];

  return { options, isLoading, error };
}

export function useTicketOptions() {
  const {
    data: ticketsData,
    isLoading,
    error,
  } = useListTicketsQuery({
    page: 0,
    size: 1000, // Get all tickets for dropdown
  });

  const options: EntityOption[] =
    ticketsData?.content?.map((ticket) => ({
      id: ticket.id,
      displayText: `Ticket #${ticket.id}`,
      additionalInfo: `Name: ${ticket.name}, Price: ${ticket.price || "N/A"}`,
    })) || [];

  return { options, isLoading, error };
}
