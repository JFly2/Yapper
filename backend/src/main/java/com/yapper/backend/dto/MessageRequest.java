package com.yapper.backend.dto;

public record MessageRequest(Long roomId,
                             String content
) {}
