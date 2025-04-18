package com.luisgmr.senai.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionDTO(
        Long id,
        String type,
        BigDecimal amount,
        LocalDateTime timestamp,
        Long accountId
) {}
