package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.repository.AccountRepository;
import com.luisgmr.senai.repository.PersonRepository;
import com.luisgmr.senai.exception.UniqueColumnException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class AccountServiceTest {

    @Mock AccountRepository accountRepository;
    @Mock PersonRepository personRepository;

    @InjectMocks AccountService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test @DisplayName("Criar uma conta com saldo zero")
    void createAccount_success() {
        Person owner = new Person(); owner.setId(1L);
        when(personRepository.findById(1L)).thenReturn(Optional.of(owner));
        when(accountRepository.existsByAccountNumber("123")).thenReturn(false);

        service.create(1L, "123");

        ArgumentCaptor<Account> cap = ArgumentCaptor.forClass(Account.class);
        verify(accountRepository).save(cap.capture());
        assertThat(cap.getValue().getBalance()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(cap.getValue().getAccountNumber()).isEqualTo("123");
    }

    @Test @DisplayName("Verificação ao criar conta com um número existente")
    void createAccount_duplicateNumber() {
        when(accountRepository.existsByAccountNumber("123")).thenReturn(true);
        assertThatThrownBy(() -> service.create(99L, "123"))
                .isInstanceOf(UniqueColumnException.class);
    }
}
