package com.itmo.ticketsystem.coordinates;

import com.itmo.ticketsystem.coordinates.dto.CoordinatesCreateDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesDto;
import com.itmo.ticketsystem.coordinates.dto.CoordinatesUpdateDto;
import com.itmo.ticketsystem.common.dto.DeleteResponse;
import com.itmo.ticketsystem.common.exceptions.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CoordinatesService {

    @Autowired
    private CoordinatesRepository coordinatesRepository;

    @Autowired
    private CoordinatesMapper coordinatesMapper;

    public Page<CoordinatesDto> getAllCoordinates(Pageable pageable) {
        return coordinatesRepository.findAll(pageable).map(coordinatesMapper::toDto);
    }

    public CoordinatesDto getCoordinatesById(Long id) {
        return coordinatesRepository.findById(id)
                .map(coordinatesMapper::toDto)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));
    }

    @Transactional
    public CoordinatesDto createCoordinates(CoordinatesCreateDto coordinatesCreateDto) {
        Coordinates coordinates = coordinatesMapper.toEntity(coordinatesCreateDto);
        Coordinates savedCoordinates = coordinatesRepository.save(coordinates);
        return coordinatesMapper.toDto(savedCoordinates);
    }

    @Transactional
    public CoordinatesDto updateCoordinates(Long id, CoordinatesUpdateDto coordinatesUpdateDto) {
        Coordinates existingCoordinates = coordinatesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Coordinates not found with ID: " + id));

        coordinatesMapper.updateEntity(existingCoordinates, coordinatesUpdateDto);
        Coordinates savedCoordinates = coordinatesRepository.save(existingCoordinates);
        return coordinatesMapper.toDto(savedCoordinates);
    }

    @Transactional
    public DeleteResponse deleteCoordinates(Long id) {
        if (!coordinatesRepository.existsById(id)) {
            throw new NotFoundException("Coordinates not found with ID: " + id);
        }
        coordinatesRepository.deleteById(id);
        return DeleteResponse.builder()
                .message("Coordinates deleted successfully")
                .build();
    }
}
