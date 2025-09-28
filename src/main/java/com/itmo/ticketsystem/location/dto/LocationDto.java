package com.itmo.ticketsystem.location.dto;

import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class LocationDto extends BaseEntityDto {
    private Long x;
    private Float y;
    private Long z;
    private String name;
}
