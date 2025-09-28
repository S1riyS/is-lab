package com.itmo.ticketsystem.event.dto;

import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.ZonedDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class EventDto extends BaseEntityDto {
    private String name;
    private ZonedDateTime date;
    private Long minAge;
    private String description;
}
