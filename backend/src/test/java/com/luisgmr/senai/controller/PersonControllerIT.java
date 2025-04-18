package com.luisgmr.senai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.luisgmr.senai.TestcontainersConfiguration;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.dto.PersonDTO;
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

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(TestcontainersConfiguration.class)
class PersonControllerIT {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired
    private PersonRepository personRepository;

    @Test
    @DisplayName("Cria pessoa com sucesso")
    void createPerson() throws Exception {
        PersonDTO dto = PersonDTO.builder()
                .name("José Bezerra")
                .cpf(Generator.randomCpf())
                .address("Rua do Silva")
                .build();

        mvc.perform(post("/api/persons")
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("José Bezerra"));
    }

    @Test
    @DisplayName("Erro CPF duplicado")
    void createPersonDuplicateCpf() throws Exception {
        String cpf = Generator.randomCpf();
        personRepository.save(Person.builder()
                        .name("A")
                        .cpf(cpf)
                        .address("X")
                        .build());

        PersonDTO dto = PersonDTO.builder()
                .name("B")
                .cpf(cpf)
                .address("Y")
                .build();

        mvc.perform(post("/api/persons")
                        .contentType(APPLICATION_JSON)
                        .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("CPF já está cadastrado"));
    }
}
