package com.luisgmr.senai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY)
public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException() {
        super("Saldo insuficiente");
    }
}
