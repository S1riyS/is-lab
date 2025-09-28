package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.ticket.dto.TicketCreateDto;
import com.itmo.ticketsystem.ticket.dto.TicketDto;
import com.itmo.ticketsystem.ticket.dto.TicketUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public TicketDto toDto(Ticket ticket) {
        if (ticket == null) {
            return null;
        }

        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setName(ticket.getName());
        dto.setCoordinatesId(ticket.getCoordinates() != null ? ticket.getCoordinates().getId() : null);
        dto.setCreationDate(ticket.getCreationDate());
        dto.setPersonId(ticket.getPerson() != null ? ticket.getPerson().getId() : null);
        dto.setEventId(ticket.getEvent() != null ? ticket.getEvent().getId() : null);
        dto.setPrice(ticket.getPrice());
        dto.setType(ticket.getType());
        dto.setDiscount(ticket.getDiscount());
        dto.setNumber(ticket.getNumber());
        dto.setComment(ticket.getComment());
        dto.setVenueId(ticket.getVenue() != null ? ticket.getVenue().getId() : null);
        dto.setCreatedById(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getId() : null);
        dto.setUpdatedById(ticket.getUpdatedBy() != null ? ticket.getUpdatedBy().getId() : null);
        dto.setUpdatedAt(ticket.getUpdatedAt());
        return dto;
    }

    public Ticket toEntity(TicketCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        Ticket ticket = new Ticket();
        ticket.setName(createDto.getName());
        ticket.setCreationDate(
                createDto.getCreationDate() != null ? createDto.getCreationDate() : new java.util.Date());
        ticket.setPrice(createDto.getPrice());
        ticket.setType(createDto.getType());
        ticket.setDiscount(createDto.getDiscount());
        ticket.setNumber(createDto.getNumber());
        ticket.setComment(createDto.getComment());
        return ticket;
    }

    public void updateEntity(Ticket existingEntity, TicketUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getName() != null) {
            existingEntity.setName(updateDto.getName());
        }
        if (updateDto.getPrice() != null) {
            existingEntity.setPrice(updateDto.getPrice());
        }
        if (updateDto.getType() != null) {
            existingEntity.setType(updateDto.getType());
        }
        if (updateDto.getDiscount() != null) {
            existingEntity.setDiscount(updateDto.getDiscount());
        }
        if (updateDto.getNumber() != null) {
            existingEntity.setNumber(updateDto.getNumber());
        }
        if (updateDto.getComment() != null) {
            existingEntity.setComment(updateDto.getComment());
        }
        if (updateDto.getCreationDate() != null) {
            existingEntity.setCreationDate(updateDto.getCreationDate());
        }
    }
}
