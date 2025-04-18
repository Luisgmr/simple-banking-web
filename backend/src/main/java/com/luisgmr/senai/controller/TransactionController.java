package com.luisgmr.senai.controller;

import com.luisgmr.senai.dto.request.TransactionRequestDTO;
import com.luisgmr.senai.dto.response.TransactionResponseDTO;
import com.luisgmr.senai.mapper.TransactionMapper;
import com.luisgmr.senai.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionService service;
    private final TransactionMapper mapper;

    @PostMapping("/{accountId}")
    public TransactionResponseDTO execute(@PathVariable Long accountId, @Valid @RequestBody TransactionRequestDTO dto) {
        return mapper.toResponse(service.execute(accountId, dto.type(), dto.amount()));
    }

    @GetMapping("/{accountId}")
    public List<TransactionResponseDTO> extract(@PathVariable Long accountId) {
        return service.extract(accountId).stream().map(mapper::toResponse).collect(Collectors.toList());
    }
}