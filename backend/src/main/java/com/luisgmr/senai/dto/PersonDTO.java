package com.luisgmr.senai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record PersonDTO(
        Long id,

        @NotNull (message = "Nome é obrigatório")
        @NotBlank (message = "Nome deve ser preenchido")
        String name,

        @NotNull(message = "CPF é obrigatório")
        @NotBlank(message = "CPF deve ser preenchido")
        @Pattern(regexp = "\\d{11}", message = "CPF inválido. Deve conter 11 dígitos numéricos")
        String cpf,

        @NotNull(message = "Endereço é obrigatório")
        @NotBlank(message = "Endereço deve ser preenchido")
        String address
) {}
