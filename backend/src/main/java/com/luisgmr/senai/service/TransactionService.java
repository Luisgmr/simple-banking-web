package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Transaction;
import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.repository.AccountRepository;
import com.luisgmr.senai.repository.TransactionRepository;
import com.luisgmr.senai.exception.InsufficientBalanceException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    @Transactional
    public Transaction execute(Long accountId, Transaction.Type type, BigDecimal amount) {

        Account account = accountService.find(accountId);

        if (type == Transaction.Type.WITHDRAW && account.getBalance().compareTo(amount) < 0)
            throw new InsufficientBalanceException();

        if (type == Transaction.Type.DEPOSIT) {
            account.setBalance(account.getBalance().add(amount));
        } else {
            account.setBalance(account.getBalance().subtract(amount));
        }

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setType(type);

        transactionRepository.save(transaction);
        accountRepository.save(account);
        return transaction;
    }

    public List<Transaction> extract(Long accountId) {
        Account account = accountService.find(accountId);
        return transactionRepository.findByAccount(account);
    }
}