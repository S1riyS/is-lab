package com.itmo.ticketsystem.person.dto;

import com.itmo.ticketsystem.common.Color;
import com.itmo.ticketsystem.common.Country;
import com.itmo.ticketsystem.common.dto.BaseEntityDto;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class PersonDto extends BaseEntityDto {
    private Color eyeColor;
    private Color hairColor;
    private Long locationId;
    private String passportID;
    private Country nationality;
}
