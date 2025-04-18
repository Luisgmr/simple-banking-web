package com.luisgmr.senai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PersonDTO(
        Long id,
        @NotBlank String name,
        @Pattern(regexp = "\\d{11}") String cpf,
        @NotBlank String address
) {}
