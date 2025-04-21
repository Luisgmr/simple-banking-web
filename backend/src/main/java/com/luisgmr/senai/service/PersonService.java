package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.repository.*;
import com.luisgmr.senai.utils.FormatterUtil;
import com.luisgmr.senai.utils.ValidationUtil;
import com.luisgmr.senai.utils.ExceptionUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@Service
public class PersonService {
    private final PersonRepository repository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public Page<Person> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<Person> search(String term) {
        return repository.searchByNameOrCpf(term);
    }


    @Transactional
    public Person create(Person person) {
        if (!ValidationUtil.isValidCpf(person.getCpf()))
            ExceptionUtil.invalidCpf();

        if (repository.findByCpf(person.getCpf()).isPresent())
            ExceptionUtil.cpfAlreadyExists();

        if (ValidationUtil.containsNumbers(person.getName()))
            ExceptionUtil.invalidName();

        person.setName(FormatterUtil.formatName(person.getName()));

        return repository.save(person);
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

        if (Objects.equals(data.getAddress(), person.getAddress()))
            ExceptionUtil.newAddressEquals();

        person.setAddress(data.getAddress());
        return repository.save(person);
    }

    @Transactional
    public void delete(Long id) {
        Person person = find(id);
        if (transactionRepository.existsByAccount_Owner(person)) {
            ExceptionUtil.personHasTransactions();
        } else {
            accountRepository.deleteAccountsByOwner(person);
        }

        repository.delete(person);
    }

}
