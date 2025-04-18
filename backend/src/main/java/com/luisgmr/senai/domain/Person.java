package com.luisgmr.senai.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "tb_person")
public class Person {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Pattern(regexp = "\\d{11}")
    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @NotBlank
    @Column(nullable = false)
    private String address;
}