package com.luisgmr.senai.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        FieldError firstError = exception.getBindingResult().getFieldErrors().get(0);
        String field = firstError.getField();

        String message = switch (field) {
            case "cpf" -> "CPF inválido. Deve conter 11 dígitos numéricos";
            case "name" -> "Nome é obrigatório";
            case "address" -> "Endereço é obrigatório";
            case "accountNumber" -> "O número da conta deve conter apenas números";
            default -> firstError.getDefaultMessage();
        };

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", ZonedDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", message);
        body.put("path", request.getRequestURI());

        return ResponseEntity.badRequest().body(body);
    }
}
