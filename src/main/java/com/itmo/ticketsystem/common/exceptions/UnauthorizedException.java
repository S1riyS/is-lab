package com.itmo.ticketsystem.common.exceptions;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends ApiException {
    public UnauthorizedException(String message) {
        super("Unauthorized", message, HttpStatus.UNAUTHORIZED);
    }
}
