package com.itmo.ticketsystem.importhistory.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.itmo.ticketsystem.common.EntityType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRequestDto {

    @NotNull(message = "Entity type cannot be null")
    private EntityType entityType;

    @NotNull(message = "Data cannot be null")
    private JsonNode data;
}
