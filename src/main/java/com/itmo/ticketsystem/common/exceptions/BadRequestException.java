package com.itmo.ticketsystem.common.exceptions;

import org.springframework.http.HttpStatus;

public class BadRequestException extends ApiException {
    public BadRequestException(String title, String message) {
        super(title, message, HttpStatus.BAD_REQUEST);
    }
}