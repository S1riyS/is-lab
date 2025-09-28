package com.itmo.ticketsystem.common.exceptions;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public abstract class ApiException extends RuntimeException {
    protected HttpStatus status;
    protected String title;

    public ApiException(String title, String message, HttpStatus status) {
        super(message);
        this.title = title;
        this.status = status;
    }
}
