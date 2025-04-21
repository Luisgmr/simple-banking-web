package com.luisgmr.senai.controller;

import com.luisgmr.senai.domain.Transaction;
import com.luisgmr.senai.dto.request.TransactionRequestDTO;
import com.luisgmr.senai.dto.response.PageResponseDTO;
import com.luisgmr.senai.dto.response.TransactionResponseDTO;
import com.luisgmr.senai.mapper.TransactionMapper;
import com.luisgmr.senai.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

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
    public PageResponseDTO<TransactionResponseDTO> extract(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<Transaction> result = service.extract(accountId, pageable);

        return new PageResponseDTO<>(
                result.stream().map(mapper::toResponse).toList(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements()
        );
    }
}