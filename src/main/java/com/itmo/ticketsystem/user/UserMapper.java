package com.itmo.ticketsystem.user;

import com.itmo.ticketsystem.user.dto.UserCreateDto;
import com.itmo.ticketsystem.user.dto.UserDto;
import com.itmo.ticketsystem.user.dto.UserUpdateDto;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setIsActive(user.getIsActive());
        return dto;
    }

    public User toEntity(UserCreateDto createDto) {
        if (createDto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(createDto.getUsername());
        user.setPassword(createDto.getPassword()); // Will be encoded in service
        user.setRole(createDto.getRole());
        user.setIsActive(true);
        return user;
    }

    public void updateEntity(User existingEntity, UserUpdateDto updateDto) {
        if (existingEntity == null || updateDto == null) {
            return;
        }

        if (updateDto.getUsername() != null) {
            existingEntity.setUsername(updateDto.getUsername());
        }
        if (updateDto.getPassword() != null) {
            existingEntity.setPassword(updateDto.getPassword()); // Will be encoded in service
        }
        if (updateDto.getRole() != null) {
            existingEntity.setRole(updateDto.getRole());
        }
        if (updateDto.getIsActive() != null) {
            existingEntity.setIsActive(updateDto.getIsActive());
        }
    }
}
