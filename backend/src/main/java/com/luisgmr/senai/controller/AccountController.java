package com.luisgmr.senai.controller;

import com.luisgmr.senai.dto.request.AccountRequestDTO;
import com.luisgmr.senai.dto.response.AccountResponseDTO;
import com.luisgmr.senai.dto.response.PageResponseDTO;
import com.luisgmr.senai.mapper.AccountMapper;
import com.luisgmr.senai.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService service;
    private final AccountMapper mapper;

    @GetMapping
    public PageResponseDTO<AccountResponseDTO> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        var result = service.list(pageable);
        return new PageResponseDTO<>(
                result.getContent().stream().map(mapper::toResponse).toList(),
                result.getNumber(),
                result.getTotalPages(),
                result.getTotalElements()
        );
    }

    @GetMapping("/{id}")
    public AccountResponseDTO get(@PathVariable Long id) {
        return mapper.toResponse(service.find(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponseDTO create(@Valid @RequestBody AccountRequestDTO dto) {
        return mapper.toResponse(service.create(dto.ownerId(), dto.accountNumber()));
    }

    @PutMapping("/{id}")
    public AccountResponseDTO update(@PathVariable Long id, @Valid @RequestBody AccountRequestDTO dto) {
        return mapper.toResponse(service.update(id, dto.accountNumber()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}