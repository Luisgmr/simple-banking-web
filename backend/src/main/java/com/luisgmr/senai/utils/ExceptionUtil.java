package com.luisgmr.senai.utils;

import com.luisgmr.senai.exception.BusinessException;
import com.luisgmr.senai.exception.EntityNotFoundException;
import com.luisgmr.senai.exception.UniqueColumnException;

import java.util.function.Supplier;

public final class ExceptionUtil {

    private ExceptionUtil() {}

    public static Supplier<EntityNotFoundException> personNotFoundSupplier(Long id) {
        return () -> new EntityNotFoundException("Pessoa não encontrada com o ID: " + id);
    }

    public static Supplier<EntityNotFoundException> accountNotFoundSupplier(Long id) {
        return () -> new EntityNotFoundException("Conta não encontrada com o ID: " + id);
    }

    public static void cpfAlreadyExists() {
        throw new UniqueColumnException("CPF já está cadastrado");
    }

    public static void accountNumberAlreadyExists(String number) {
        throw new UniqueColumnException("O número da conta " + number + " já existe");
    }

    public static void newAccountNumberEquals() {
        throw new BusinessException("O novo número da conta deve ser diferente do número atual");
    }

    public static void accountHasTransactions() {
        throw new BusinessException("Não é possível deletar uma conta com movimentações");
    }

    public static void personHasTransactions() {
        throw new BusinessException("Não é possível deletar uma pessoa que possui contas com movimentações");
    }

    public static void invalidCpf() {
        throw new IllegalArgumentException("CPF inválido");
    }

    public static void invalidName() {
        throw new IllegalArgumentException("Nome inválido. Deve conter somente letras.");
    }

    public static void newAddressEquals() {
        throw new BusinessException("O novo endereço da pessoa deve ser diferente do endereço atual");
    }

}
