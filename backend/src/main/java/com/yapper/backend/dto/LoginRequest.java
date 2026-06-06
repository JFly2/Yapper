package com.yapper.backend.dto;

public record LoginRequest(
        String username,
        String password
) {}
