package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.exception.BusinessException;
import com.luisgmr.senai.exception.EntityNotFoundException;
import com.luisgmr.senai.exception.UniqueColumnException;
import com.luisgmr.senai.repository.AccountRepository;
import com.luisgmr.senai.repository.PersonRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final PersonRepository personRepository;

    public List<Account> list() {
        return accountRepository.findAll();
    }

    public Account find(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Conta não encontrada com o ID " + id));
    }

    @Transactional
    public Account create(Long personId, String number) {
        if (accountRepository.existsByAccountNumber(number))
            throw new UniqueColumnException("O número da conta " + number + " já existe");

        Person owner = personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException("Pessoa com o ID " + personId + " não encontrada"));

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
            throw new BusinessException("O novo número da conta deve ser diferente do número atual");

        if (accountRepository.existsByAccountNumber(newNumber))
            throw new UniqueColumnException("O número da conta " + newNumber + " já existe");

        account.setAccountNumber(newNumber);
        return accountRepository.save(account);
    }

    @Transactional
    public void delete(Long id) {
        accountRepository.delete(find(id));
    }
}