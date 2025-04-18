package com.luisgmr.senai.mapper;

import com.luisgmr.senai.domain.Account;
import com.luisgmr.senai.dto.response.AccountResponseDTO;
import com.luisgmr.senai.dto.response.AccountSelectResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = PersonMapper.class)
public interface AccountMapper {
    AccountResponseDTO toResponse(Account account);
    AccountSelectResponseDTO toSelectResponse(Account account);
}