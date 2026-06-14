package com.yapper.backend.dto;

public record RoomResponse(
        Long id,
        String name,
        String joinCode,
        boolean publicRoom,
        String category
) {
}
