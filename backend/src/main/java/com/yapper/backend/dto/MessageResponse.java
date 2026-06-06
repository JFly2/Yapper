package com.yapper.backend.dto;

import java.time.Instant;

public record MessageResponse(Long id,
                              String sender,
                              String content,
                              Long roomId,
                              Instant timestamp) {
}
