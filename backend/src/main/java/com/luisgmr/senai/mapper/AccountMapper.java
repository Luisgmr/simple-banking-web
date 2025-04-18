package com.luisgmr.senai.mapper;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.dto.AccountDTO;
import com.luisgmr.senai.dto.response.AccountResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PersonMapper.class)
public interface AccountMapper {
    @Mapping(source = "owner.id",   target = "ownerId")
    AccountDTO toDto(Account account);

    @Mapping(source = "ownerId", target = "owner.id")
    Account toEntity(AccountDTO dto);

    AccountResponseDTO toResponseDto(Account account);
}