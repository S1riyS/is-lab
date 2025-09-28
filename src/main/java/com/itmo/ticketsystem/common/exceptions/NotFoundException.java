package com.itmo.ticketsystem.common.exceptions;

import org.springframework.http.HttpStatus;

public class NotFoundException extends ApiException {
    public NotFoundException(String message) {
        super("Not Found", message, HttpStatus.NOT_FOUND);
    }
}
