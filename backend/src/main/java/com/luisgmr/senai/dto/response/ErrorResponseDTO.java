package com.luisgmr.senai.dto.response;

public record ErrorResponseDTO(
        String timestamp,
        int status,
        String error,
        String message
) {}
