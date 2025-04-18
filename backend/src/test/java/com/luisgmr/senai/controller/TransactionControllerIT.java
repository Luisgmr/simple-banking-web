package com.luisgmr.senai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.luisgmr.senai.TestcontainersConfiguration;
import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.domain.Transaction;
import com.luisgmr.senai.dto.request.TransactionRequestDTO;
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
class TransactionControllerIT {

    @Autowired MockMvc mvc;
    @Autowired PersonRepository personRepository;
    @Autowired AccountRepository accountRepository;
    @Autowired ObjectMapper mapper;

    private Account newAccount() {
        Person person = personRepository.save(Person.builder()
                .name("José")
                .cpf(Generator.randomCpf())
                .address("Rua Z")
                .build());

        return accountRepository.save(Account.builder()
                .accountNumber(Generator.randomAccountNumber())
                .owner(person)
                .balance(BigDecimal.ZERO)
                .build());
    }

    @Test
    @DisplayName("Depósito com sucesso")
    void deposit() throws Exception {
        Account account = newAccount();

        TransactionRequestDTO dto = TransactionRequestDTO.builder()
                .type(Transaction.Type.DEPOSIT)
                .amount(BigDecimal.TEN)
                .build();

        mvc.perform(post("/api/transactions/{accountId}", account.getId())
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(10.00))
                .andExpect(jsonPath("$.type").value("DEPOSIT"));
    }

    @Test
    @DisplayName("Impossibilitar saque com saldo insuficiente")
    void withdrawInsufficient() throws Exception {
        Account account = newAccount();

        TransactionRequestDTO dto = TransactionRequestDTO.builder()
                .type(Transaction.Type.WITHDRAW)
                .amount(new BigDecimal(5))
                .build();

        mvc.perform(post("/api/transactions/{accountId}", account.getId())
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isUnprocessableEntity());
    }
}
