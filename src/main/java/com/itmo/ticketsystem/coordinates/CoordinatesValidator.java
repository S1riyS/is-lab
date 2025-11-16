package com.itmo.ticketsystem.coordinates;

import org.springframework.stereotype.Component;

import com.itmo.ticketsystem.common.exceptions.BusinessValidationException;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CoordinatesValidator {
    private final float R = 10;

    public void validateAreaBelonging(Coordinates coordinates) {
        // Does points belong to specified area?
        float x = coordinates.getX();
        float y = coordinates.getY();

        boolean triangle = (x <= 0 && y >= 0) && (y <= x + R);
        boolean rect = (x >= 0 && x <= R) && (y >= 0 && y <= R / 2);
        boolean circle = (x >= 0 && y <= 0) && (x * x + y * y <= R * R);

        if (!(triangle || rect || circle)) {
            System.out.println("Coordinates do not belong to specified area: x=" + x + ", y=" + y);
            throw new BusinessValidationException("Coordinates do not belong to specified area");
        }
    }
}
