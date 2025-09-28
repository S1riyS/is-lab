package com.itmo.ticketsystem.common.exceptions;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends ApiException {
    public ForbiddenException(String message) {
        super("Forbidden", message, HttpStatus.FORBIDDEN);
    }
}
