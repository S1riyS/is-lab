package com.itmo.ticketsystem.common.dto;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {
    @Builder.Default
    private Date timestamp = new Date();
    private String error;
    private String title;
    private List<String> details;
}
