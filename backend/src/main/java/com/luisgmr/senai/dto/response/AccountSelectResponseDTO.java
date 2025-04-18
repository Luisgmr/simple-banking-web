package com.luisgmr.senai.dto.response;


import java.math.BigDecimal;

public record AccountSelectResponseDTO(
        Long id,
        String accountNumber,
        BigDecimal balance
) {
}