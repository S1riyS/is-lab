package com.itmo.ticketsystem.common.ws;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEvent {
    public enum Operation {
        CREATE,
        UPDATE,
        DELETE
    }

    private String entity;
    private Operation operation;
    private Long id;
}
