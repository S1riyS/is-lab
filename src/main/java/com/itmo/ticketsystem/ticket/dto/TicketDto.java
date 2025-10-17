package com.itmo.ticketsystem.ticket.dto;

import com.itmo.ticketsystem.common.TicketType;
import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class TicketDto extends BaseEntityDto {
    private String name;
    private Long coordinatesId;
    private Date creationDate;
    private Long personId;
    private Long eventId;
    private Float price;
    private TicketType type;
    private Double discount;
    private Double number;
    private String comment;
    private Long venueId;
    private Long createdByUserId;
    private Long updatedByUserId;
    private Date updatedAt;
}
