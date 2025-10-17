package com.itmo.ticketsystem.common.ws;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class ChangeEventPublisher {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void publish(String entity, ChangeEvent.Operation op, Long id) {
        ChangeEvent event = new ChangeEvent(entity, op, id);
        messagingTemplate.convertAndSend("/topic/changes", event);
    }
}
