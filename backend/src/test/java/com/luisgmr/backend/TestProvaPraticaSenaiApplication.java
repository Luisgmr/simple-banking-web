package com.luisgmr.backend;

import org.springframework.boot.SpringApplication;

public class TestProvaPraticaSenaiApplication {

	public static void main(String[] args) {
		SpringApplication.from(ProvaPraticaSenaiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
