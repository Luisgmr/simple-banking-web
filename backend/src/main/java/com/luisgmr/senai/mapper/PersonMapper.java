package com.luisgmr.senai.mapper;

import com.luisgmr.senai.domain.Person;
import com.luisgmr.senai.dto.PersonDTO;
import com.luisgmr.senai.dto.request.PersonUpdateRequestDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    PersonDTO toDto(Person person);
    Person toEntity(PersonDTO dto);
    Person updateRequestToEntity(PersonUpdateRequestDTO dto);
}
