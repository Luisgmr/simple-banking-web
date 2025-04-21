package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Transaction;
import com.luisgmr.senai.exception.InsufficientBalanceException;
import com.luisgmr.senai.repository.AccountRepository;
import com.luisgmr.senai.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class TransactionServiceTest {
    @Mock private AccountRepository accountRepository;
    @Mock AccountService accountService;

    @Mock private TransactionRepository transactionRepository;
    @InjectMocks TransactionService service;

    Account account;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        account = new Account();
        account.setId(1L);
        account.setAccountNumber("123");
        account.setBalance(new BigDecimal("100.00"));
        when(accountService.find(1L)).thenReturn(account);
    }

    @Test @DisplayName("Depósito deve aumentar o saldo")
    void deposit() {
        service.execute(1L, Transaction.Type.DEPOSIT, new BigDecimal("50"));
        assertThat(account.getBalance()).isEqualByComparingTo(new BigDecimal("150.00"));
    }

    @Test @DisplayName("Retirada deve falhar quando o saldo for insuficiente")
    void withdraw_insufficient() {
        assertThatThrownBy(() -> service.execute(1L, Transaction.Type.WITHDRAW, new BigDecimal("200")))
                .isInstanceOf(InsufficientBalanceException.class);
    }
}