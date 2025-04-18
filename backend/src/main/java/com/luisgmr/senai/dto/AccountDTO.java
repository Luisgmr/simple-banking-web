package com.luisgmr.senai.dto;

import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record AccountDTO(
        Long id,
        @Pattern(regexp = "\\d+") String accountNumber,
        BigDecimal balance,
        Long ownerId,
        String ownerName
) {}
