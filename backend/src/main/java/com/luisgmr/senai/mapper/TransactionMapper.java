package com.luisgmr.senai.mapper;

import com.luisgmr.senai.domain.Transaction;
import com.luisgmr.senai.dto.TransactionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(source = "account.id", target = "accountId")
    TransactionDTO toDto(Transaction transaction);
}
