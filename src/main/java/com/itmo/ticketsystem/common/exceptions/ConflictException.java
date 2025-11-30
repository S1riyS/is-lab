package com.itmo.ticketsystem.common.exceptions;

import org.springframework.http.HttpStatus;

public class ConflictException extends ApiException {
    public ConflictException(String title, String message) {
        super(title, message, HttpStatus.CONFLICT);
    }
}
