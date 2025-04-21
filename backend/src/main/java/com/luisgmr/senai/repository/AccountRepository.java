package com.luisgmr.senai.repository;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    boolean existsByAccountNumber(String accountNumber);

    Optional<List<Account>> findByOwner_Id(Long ownerId);

    void deleteAccountsByOwner(Person owner);
}
