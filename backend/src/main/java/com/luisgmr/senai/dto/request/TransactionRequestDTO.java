package com.luisgmr.senai.dto.request;

import com.luisgmr.senai.domain.Transaction;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record TransactionRequestDTO(
        @NotNull(message = "O tipo da transação é obrigatório")
        Transaction.Type type,

        @DecimalMin(value = "0.01", message = "O valor mínimo da transação é de 1 centavo")
        @NotNull (message = "O valor da transação é obrigatório")
        BigDecimal amount
) {}