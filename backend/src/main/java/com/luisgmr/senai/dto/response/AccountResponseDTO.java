package com.luisgmr.senai.dto.response;

import com.luisgmr.senai.dto.PersonDTO;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record AccountResponseDTO(
        Long id,
        @Pattern(regexp = "\\d+") String accountNumber,
        BigDecimal balance,
        PersonDTO owner
) {
}
