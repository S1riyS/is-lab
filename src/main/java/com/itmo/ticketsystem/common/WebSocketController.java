package com.itmo.ticketsystem.common;

import com.itmo.ticketsystem.ticket.Ticket;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @MessageMapping("/ticket.create")
    @SendTo("/topic/tickets")
    public Ticket handleTicketCreate(Ticket ticket) {
        return ticket;
    }

    @MessageMapping("/ticket.update")
    @SendTo("/topic/tickets")
    public Ticket handleTicketUpdate(Ticket ticket) {
        return ticket;
    }

    @MessageMapping("/ticket.delete")
    @SendTo("/topic/tickets")
    public Long handleTicketDelete(Long ticketId) {
        return ticketId;
    }
}
