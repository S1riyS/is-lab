package com.itmo.ticketsystem.common.config;

import java.util.*;

import org.springframework.http.*;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.itmo.ticketsystem.common.dto.APIErrorResponse;
import com.itmo.ticketsystem.common.dto.ValidationErrorResponse;
import com.itmo.ticketsystem.common.exceptions.ApiException;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleRequestValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        List<String> details = new ArrayList<String>();
        for (ObjectError error : ex.getBindingResult().getAllErrors()) {
            details.add(error.getDefaultMessage());
        }

        ValidationErrorResponse error = ValidationErrorResponse.builder()
                .error(HttpStatus.BAD_REQUEST.name())
                .title("Validation error")
                .details(details)
                .build();

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ApiException.class)
    @ResponseBody
    public ResponseEntity<APIErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
        APIErrorResponse error = APIErrorResponse.builder()
                .error(ex.getStatus().name())
                .title(ex.getTitle())
                .details(ex.getMessage())
                .build();
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<APIErrorResponse> handleAnyException(Exception ex, HttpServletRequest request) {
        APIErrorResponse error = APIErrorResponse.builder()
                .error(HttpStatus.INTERNAL_SERVER_ERROR.name())
                .title("Internal error")
                .details("Internal error has occured")
                .build();
        System.out.println(ex);
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
