package com.itmo.ticketsystem.coordinates.dto;

import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class CoordinatesDto extends BaseEntityDto {
    private Integer x;
    private Float y;
    private Long createdByUserId;
}
