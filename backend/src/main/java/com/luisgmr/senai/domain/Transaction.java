package com.luisgmr.senai.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity @Table(name = "tb_transaction")
public class Transaction {

    public enum Type { DEPOSIT, WITHDRAW }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @DecimalMin(value = "0.01")
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    @ManyToOne(optional = false)
    private Account account;
}