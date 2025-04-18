package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.repository.*;
import com.luisgmr.senai.utils.ExceptionUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class PersonService {
    private final PersonRepository repository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public List<Person> list() {
        return repository.findAll();
    }

    @Transactional
    public Person create(Person p) {
        if (repository.findByCpf(p.getCpf()).isPresent())
            ExceptionUtil.cpfAlreadyExists();

        return repository.save(p);
    }

    public Person find(Long id) {
        return repository.findById(id).orElseThrow(ExceptionUtil.personNotFoundSupplier(id));
    }

    public List<Account> findAccounts(Long id) {
        return accountRepository.findByOwner_Id(id).orElseThrow(ExceptionUtil.personNotFoundSupplier(id));
    }

    @Transactional
    public Person update(Long id, Person data) {
        Person person = find(id);
        person.setName(data.getName());
        person.setAddress(data.getAddress());
        return repository.save(person);
    }

    @Transactional
    public void delete(Long id) {

        if (transactionRepository.existsByAccount_Owner_Id(id))
            ExceptionUtil.personHasTransactions();

        repository.delete(find(id));
    }

}
