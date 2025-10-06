package com.itmo.ticketsystem.common.ws;

public class ChangeEvent {
    public enum Operation {
        CREATE, UPDATE, DELETE
    }

    private String entity;
    private Operation operation;
    private Long id;

    public ChangeEvent() {
    }

    public ChangeEvent(String entity, Operation operation, Long id) {
        this.entity = entity;
        this.operation = operation;
        this.id = id;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public Operation getOperation() {
        return operation;
    }

    public void setOperation(Operation operation) {
        this.operation = operation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
