package com.itmo.ticketsystem.ticket;

import com.itmo.ticketsystem.common.TicketType;
import com.itmo.ticketsystem.common.exceptions.BusinessValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketValidator {
    public void validateDiscountForType(TicketType type, Double discount) {
        if (type == null || discount == null) {
            return;
        }

        switch (type) {
            case VIP:
                if (discount < 10.0 || discount > 30.0) {
                    throw new BusinessValidationException("VIP tickets must have discount between 10% and 30%");
                }
                break;
            case BUDGETARY:
                if (discount < 5.0 || discount > 15.0) {
                    throw new BusinessValidationException("Budgetary tickets must have discount between 5% and 15%");
                }
                break;
            case USUAL:
            case CHEAP:
                // No additional validation for USUAL and CHEAP tickets
                break;
        }
    }
}
