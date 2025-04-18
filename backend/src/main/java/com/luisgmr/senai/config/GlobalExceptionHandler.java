package com.luisgmr.senai.config;

import com.luisgmr.senai.dto.response.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        FieldError firstError = exception.getBindingResult().getFieldErrors().get(0);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", ZonedDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", firstError.getDefaultMessage());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleAny(Exception ex) {
        ResponseStatus statusAnnotation = AnnotationUtils.findAnnotation(ex.getClass(), ResponseStatus.class);
        HttpStatus status = (statusAnnotation != null ? statusAnnotation.value() : HttpStatus.BAD_REQUEST);

        ErrorResponseDTO error = new ErrorResponseDTO(
                Instant.now().toString(),
                status.value(),
                ex.getClass().getSimpleName(),
                ex.getMessage()
        );
        return ResponseEntity.status(status).body(error);
    }

}


