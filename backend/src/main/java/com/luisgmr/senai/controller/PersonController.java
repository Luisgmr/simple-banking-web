package com.luisgmr.senai.controller;

import com.luisgmr.senai.dto.PersonDTO;
import com.luisgmr.senai.dto.response.AccountSelectResponseDTO;
import com.luisgmr.senai.mapper.AccountMapper;
import com.luisgmr.senai.mapper.PersonMapper;
import com.luisgmr.senai.service.PersonService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService service;
    private final PersonMapper personMapper;
    private final AccountMapper accountMapper;

    @GetMapping
    public List<PersonDTO> list() {
        return service.list().stream().map(personMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public PersonDTO get(@PathVariable Long id) {
        return personMapper.toDto(service.find(id));
    }

    @GetMapping("/{id}/accounts")
    public List<AccountSelectResponseDTO> getAccounts(@PathVariable Long id) {
        return service.findAccounts(id).stream().map(accountMapper::toSelectResponse).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonDTO create(@Valid @RequestBody PersonDTO dto) {
        return personMapper.toDto(service.create(personMapper.toEntity(dto)));
    }

    @PutMapping("/{id}")
    public PersonDTO update(@PathVariable Long id, @Valid @RequestBody PersonDTO dto) {
        return personMapper.toDto(service.update(id, personMapper.toEntity(dto)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

