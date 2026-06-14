package com.yapper.backend.dto;

public record CreateRoomRequest(
        String name,
        boolean publicRoom,
        String category
) {
}
