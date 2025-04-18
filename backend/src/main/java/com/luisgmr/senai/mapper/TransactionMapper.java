package com.luisgmr.senai.mapper;

import com.luisgmr.senai.domain.Transaction;
import com.luisgmr.senai.dto.response.TransactionResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    TransactionResponseDTO toResponse(Transaction transaction);
}
