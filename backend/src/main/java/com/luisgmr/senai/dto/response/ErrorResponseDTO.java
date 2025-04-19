package com.luisgmr.senai.dto.response;

import lombok.Builder;

@Builder
public record ErrorResponseDTO(
        String timestamp,
        int status,
        String error,
        String message,
        String path
) {}
