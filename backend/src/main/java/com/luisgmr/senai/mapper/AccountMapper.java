package com.luisgmr.senai.mapper;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.dto.AccountDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(source = "owner.id",   target = "ownerId")
    @Mapping(source = "owner.name", target = "ownerName")
    AccountDTO toDto(Account account);

    @Mapping(source = "ownerId", target = "owner.id")
    Account toEntity(AccountDTO dto);
}