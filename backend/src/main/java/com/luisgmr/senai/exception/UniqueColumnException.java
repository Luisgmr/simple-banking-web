package com.luisgmr.senai.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class UniqueColumnException extends RuntimeException {
    public UniqueColumnException(String msg) { super(msg); }
}
