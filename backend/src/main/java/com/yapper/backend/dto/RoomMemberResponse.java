package com.yapper.backend.dto;

import com.yapper.backend.model.RoomMembership;

import java.time.Instant;

public record RoomMemberResponse(
        Long userId,
        String username,
        RoomMembership.RoomRole role,
        Instant joinedAt
) {}
