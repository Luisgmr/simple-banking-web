package com.luisgmr.senai.dto.request;

import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record AccountRequestDTO(
        Long id,

        @Pattern(regexp = "\\d+", message = "O número da conta deve conter apenas números")
        String accountNumber,

        BigDecimal balance,

        Long ownerId
) {}
