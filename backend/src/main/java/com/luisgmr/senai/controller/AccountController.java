package com.luisgmr.senai.controller;

import com.luisgmr.senai.dto.AccountDTO;
import com.luisgmr.senai.dto.response.AccountResponseDTO;
import com.luisgmr.senai.mapper.AccountMapper;
import com.luisgmr.senai.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;
    private final AccountMapper mapper;

    @GetMapping
    public List<AccountResponseDTO> list() {
        return service.list().stream().map(mapper::toResponseDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AccountResponseDTO get(@PathVariable Long id) {
        return mapper.toResponseDto(service.find(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponseDTO create(@Valid @RequestBody AccountDTO dto) {
        return mapper.toResponseDto(service.create(dto.ownerId(), dto.accountNumber()));
    }

    @PutMapping("/{id}")
    public AccountResponseDTO update(@PathVariable Long id, @Valid @RequestBody AccountDTO dto) {
        return mapper.toResponseDto(service.update(id, dto.accountNumber()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}