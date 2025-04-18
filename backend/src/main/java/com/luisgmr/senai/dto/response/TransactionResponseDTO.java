package com.luisgmr.senai.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponseDTO(
        Long id,
        String type,
        BigDecimal amount,
        LocalDateTime timestamp
) {}
