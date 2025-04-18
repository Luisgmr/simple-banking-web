package com.luisgmr.senai.repository;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.domain.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccount(Account account);
    boolean existsByAccount(Account account);

    boolean existsByAccount_Owner_Id(Long accountOwnerId);
}
