package com.luisgmr.senai.repository;

import com.luisgmr.senai.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByCpf(String cpf);

    @Query("""
      select p from Person p
       where lower(p.name) like lower(concat('%', :term, '%'))
          or p.cpf like concat('%', :term, '%')
      """)
    List<Person> searchByNameOrCpf(@Param("term") String term);

}
