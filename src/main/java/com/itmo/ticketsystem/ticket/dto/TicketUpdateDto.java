package com.itmo.ticketsystem.ticket.dto;

import com.itmo.ticketsystem.common.TicketType;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketUpdateDto {

    private String name;
    private Long coordinatesId;
    private Date creationDate;
    private Long personId;
    private Long eventId;

    @Positive(message = "Price must be positive")
    private Float price;

    private TicketType type;

    @DecimalMin(value = "0.0", inclusive = false, message = "Discount must be greater than 0")
    @DecimalMax(value = "100.0", message = "Discount must not exceed 100")
    private Double discount;

    @Positive(message = "Number must be positive")
    private Double number;

    private String comment;
    private Long venueId;
}
