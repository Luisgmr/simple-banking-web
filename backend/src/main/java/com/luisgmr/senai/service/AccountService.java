package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.repository.*;
import com.luisgmr.senai.utils.ExceptionUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final PersonRepository personRepository;
    private final TransactionRepository transactionRepository;


    public Page<Account> list(Pageable pageable) {
        return accountRepository.findAll(pageable);
    }

    public Account find(Long id) {
        return accountRepository.findById(id).orElseThrow(ExceptionUtil.accountNotFoundSupplier(id));
    }

    @Transactional
    public Account create(Long personId, String number) {
        if (accountRepository.existsByAccountNumber(number))
            ExceptionUtil.accountNumberAlreadyExists(number);

        Person owner = personRepository.findById(personId).orElseThrow(ExceptionUtil.personNotFoundSupplier(personId));

        Account acc = new Account();
        acc.setAccountNumber(number);
        acc.setOwner(owner);
        acc.setBalance(java.math.BigDecimal.ZERO);
        return accountRepository.save(acc);
    }

    @Transactional
    public Account update(Long id, String newNumber) {
        Account account = find(id);

        if (account.getAccountNumber().equals(newNumber))
            ExceptionUtil.newAccountNumberEquals();

        if (accountRepository.existsByAccountNumber(newNumber))
            ExceptionUtil.accountNumberAlreadyExists(newNumber);

        account.setAccountNumber(newNumber);
        return accountRepository.save(account);
    }

    @Transactional
    public void delete(Long id) {
        Account account = find(id);

        if (transactionRepository.existsByAccount(account))
            ExceptionUtil.accountHasTransactions();

        accountRepository.delete(account);
    }


}