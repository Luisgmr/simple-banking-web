package com.luisgmr.senai.dto.response;

import com.luisgmr.senai.dto.PersonDTO;

import java.math.BigDecimal;

public record AccountResponseDTO(
        Long id,
        String accountNumber,
        BigDecimal balance,
        PersonDTO owner
) {
}
