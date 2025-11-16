package com.itmo.ticketsystem.common.exceptions;

public class BusinessValidationException extends BadRequestException {
    private static final String TITLE = "Business-layer constraint";

    public BusinessValidationException(String message) {
        super(TITLE, message);
    }
}
