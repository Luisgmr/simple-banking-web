package com.luisgmr.senai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.luisgmr.senai.TestcontainersConfiguration;
import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.dto.request.AccountRequestDTO;
import com.luisgmr.senai.repository.AccountRepository;
import com.luisgmr.senai.repository.PersonRepository;
import com.luisgmr.senai.testutil.Generator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(TestcontainersConfiguration.class)
class AccountControllerIT {

    @Autowired MockMvc mvc;
    @Autowired PersonRepository personRepository;
    @Autowired AccountRepository accountRepository;
    @Autowired ObjectMapper mapper;

    private Person newPerson() {
        return personRepository.save(Person.builder()
                .name("Maria")
                .cpf(Generator.randomCpf())
                .address("Rua X")
                .build());
    }

    @Test
    @DisplayName("Cria conta com sucesso")
    void createAccount() throws Exception {
        Person owner = newPerson();

        AccountRequestDTO dto = AccountRequestDTO.builder()
                .accountNumber(Generator.randomAccountNumber())
                .ownerId(owner.getId())
                .balance(BigDecimal.ZERO)
                .build();

        mvc.perform(post("/api/accounts")
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.owner.id").value(owner.getId()));
    }

    @Test
    @DisplayName("Erro ao criar conta duplicada")
    void createAccountDuplicateNumber() throws Exception {
        Person owner = newPerson();

        String accountNumber = Generator.randomAccountNumber();

        accountRepository.save(Account.builder()
                .accountNumber(accountNumber)
                .owner(owner)
                .balance(BigDecimal.ZERO)
                .build());

        AccountRequestDTO dto = AccountRequestDTO.builder()
                .accountNumber(accountNumber)
                .ownerId(owner.getId())
                .balance(BigDecimal.ZERO)
                .build();

        mvc.perform(post("/api/accounts")
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Lista contas")
    void listAccounts() throws Exception {
        Person owner = newPerson();
        accountRepository.save(Account.builder()
                .accountNumber(Generator.randomAccountNumber())
                .owner(owner)
                .balance(BigDecimal.ZERO)
                .build());

        mvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0]").exists());
    }

    @Test
    @DisplayName("Busca conta por id")
    void getAccount() throws Exception {
        Person person = newPerson();

        String accountNumber = Generator.randomAccountNumber();
        Account account = accountRepository.save(Account.builder()
                .accountNumber(accountNumber)
                .owner(person)
                .balance(BigDecimal.ZERO)
                .build());

        mvc.perform(get("/api/accounts/{id}", account.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber").value(accountNumber));
    }

    @Test
    @DisplayName("Atualiza número da conta")
    void updateAccount() throws Exception {
        Person person = newPerson();
        Account account = accountRepository.save(Account.builder()
                .accountNumber(Generator.randomAccountNumber())
                .owner(person)
                .balance(BigDecimal.ZERO)
                .build());

        String newAccountNumber = Generator.randomAccountNumber();

        AccountRequestDTO dto = AccountRequestDTO.builder()
                .accountNumber(newAccountNumber)
                .ownerId(person.getId())
                .balance(BigDecimal.ZERO)
                .build();

        mvc.perform(put("/api/accounts/{id}", account.getId())
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accountNumber").value(newAccountNumber));
    }

    @Test
    @DisplayName("Deleta conta sem movimentações")
    void deleteAccount() throws Exception {
        Person person = newPerson();
        Account account = accountRepository.save(Account.builder()
                .accountNumber(Generator.randomAccountNumber())
                .owner(person)
                .balance(BigDecimal.ZERO)
                .build());

        mvc.perform(delete("/api/accounts/{id}", account.getId()))
                .andExpect(status().isNoContent());
    }
}
