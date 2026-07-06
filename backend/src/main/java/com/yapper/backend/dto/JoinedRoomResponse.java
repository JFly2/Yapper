package com.yapper.backend.dto;

import com.yapper.backend.model.RoomMembership;

public record JoinedRoomResponse(
        Long id,
        String name,
        String joinCode,
        boolean publicRoom,
        String category,
        RoomMembership.RoomRole role
) {
}
