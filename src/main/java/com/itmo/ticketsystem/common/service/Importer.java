package com.itmo.ticketsystem.common.service;

import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itmo.ticketsystem.user.User;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public abstract class Importer<T> {
    private final Class<T> type;
    private final ObjectMapper objectMapper;
    private final Validator validator;

    private T[] fromJsonNode(JsonNode dataNode) throws Exception {
        return objectMapper.treeToValue(dataNode, objectMapper.getTypeFactory().constructArrayType(type));
    }

    protected abstract int doImportInternal(T[] data, User currentUser) throws Exception;

    public int doImport(JsonNode dataNode, User currentUser) throws Exception {
        // Convert from JSON
        T[] dtos = fromJsonNode(dataNode);

        // Validate
        if (dtos == null || dtos.length == 0)
            throw new IllegalArgumentException("Import file has no entities");

        return doImportInternal(dtos, currentUser);
    }

    protected void validateDto(T dto, int index) {
        Set<ConstraintViolation<T>> violations = validator.validate(dto);
        if (!violations.isEmpty()) {
            String errors = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));

            String prefix = index >= 0 ? "Record " + index + ": " : "";
            throw new IllegalArgumentException(prefix + errors);
        }
    }
}
