package com.luisgmr.senai.service;

import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.exception.EntityNotFoundException;
import com.luisgmr.senai.exception.UniqueColumnException;
import com.luisgmr.senai.repository.PersonRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonService {
    private final PersonRepository repo;
    public PersonService(PersonRepository repo) { this.repo = repo; }

    public List<Person> list() { return repo.findAll(); }

    @Transactional
    public Person create(Person p) {
        if (repo.findByCpf(p.getCpf()).isPresent())
            throw new UniqueColumnException("CPF já está cadastrado");
        return repo.save(p);
    }

    public Person find(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pessoa não encontrada"));
    }

    @Transactional
    public Person update(Long id, Person data) {
        Person person = find(id);
        person.setName(data.getName());
        person.setAddress(data.getAddress());
        return repo.save(person);
    }

    @Transactional
    public void delete(Long id) { repo.delete(find(id)); }
}
