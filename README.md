# Prova Full-Stack - Júnior - Java

__Bem-vindo à prova prática para a vaga de Desenvolvedor Full-Stack Java no SENAI Soluções Digitais!__

Ficamos felizes no seu interesse pela vaga, e desejamos uma ótima prova.
Leia com atenção toda a documentação e tente desenvolver o máximo que puder, mesmo que tenha que pular alguma etapa, desde que com qualidade e seguindo as regras de negócio.

## Resumo

__O candidato pode escolher entre duas abordagens para a implementação:__
- __Aplicação Java EE:__ Desenvolver uma aplicação web utilizando __Java EE__ com __JSF__ e __PrimeFaces__, preferencialmente utilizando o servidor __Wildfly__.
- __Aplicação Frontend e Backend Separados:__ Desenvolver uma aplicação com frontend na tecnologia de sua preferência (como React, Vue.js, Angular, etc.) e backend em Java, utilizando frameworks como Spring Boot ou Quarkus.

A prova consiste em desenvolver as telas modeladas que serão enviadas, respeitando as regras definidas nas imagens.

A definição do layout final e da estrutura do banco de dados fica a critério do candidato, desde que atenda às regras de negócio estabelecidas.


# Banking

**Um projeto full-stack desenvolvido com Next.js (App Router), React, Spring Boot e Docker, implementado como teste técnico para candidatura a vaga de desenvolvedor.**

---

## 📋 Sumário

1. [Sobre](#sobre)
2. [Principais Funcionalidades](#principais-funcionalidades)
3. [Arquitetura e Padrões](#arquitetura-e-padrões)
4. [Tech Stack](#tech-stack)
5. [Setup Local / Docker](#setup-local--docker)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Executando a Aplicação](#executando-a-aplicação)
8. [Testes](#testes)
9. [Componentes Reutilizáveis](#componentes-reutilizáveis)
10. [Validações e Mascara de Inputs](#validações-e-mascara-de-inputs)
11. [Animações e Feedback](#animações-e-feedback)
12. [Considerações Finais](#considerações-finais)

---

## 🧐 Sobre

Esta aplicação simula um sistema bancário básico com cadastro de **Pessoas**, **Contas** e sistema de **Movimentação** (Depósito/Retirada). Foi construída para demonstrar:

- **Frontend**: Formulários de CRUD com validações, tabelas paginadas, selects pesquisáveis com debounce, máscaras de CPF e valor.
- **Backend**: API REST em Spring Boot com JPA, repositórios, serviços, tratamento de erros e paginação. Arquitetura MVC.
- **DevOps**: Docker e Docker Compose para orquestração de frontend, backend e banco de dados e proxy nginx.
- **Qualidade de Software**: Testes unitários e de integração em serviços e controllers.

---

## 🚀 Principais Funcionalidades

- **CRUD de Pessoas** (nome, CPF, endereço) com:
  - Validação de CPF válido
  - Máscara live de CPF
  - Auto‐format de nome (título)
- **CRUD de Contas** atreladas a Pessoa, exibindo saldo
- **Movimentações**:
  - Depósito e retirada com controle de saldo insuficiente
  - Máscara de valor no estilo bancário (R\$ 0,00)
  - Exibição de extrato paginado (frontend e backend)
- **Seleção pesquisável** de pessoas no formulário de contas e movimentações, com debounce e chamada a endpoint dedicado `/persons/search?q=`.
- **Feedback visual**:
  - Toasts customizados (react-hot-toast)
  - Animações em botões e transições (framer-motion)
  - Diálogos de confirmação (Shadcn UI Dialog)

---

## 🏛️ Arquitetura e Padrões
- **Spring MVC**
- **Spring Boot + Spring Data JPA** no backend
- **Next.js (App Router)** para SSR/SSG e rotas client
- **React Hook Form + Zod** para validação de formulários
- **Shadcn UI + Radix** como design system
- **DTOs e PageResponse** para paginação de recursos
- **Clean Code**: composição de hooks, utilitários (`utils.ts`), organização por domínio, controle de exceptions

---

## 🛠️ Tech Stack

| Camada         | Tecnologia                 |
| -------------- | -------------------------- |
| Frontend       | Next.js, React, TypeScript |
| UI Library     | Shadcn UI, Radix UI        |
| Form & Val.    | React Hook Form, Zod       |
| HTTP Client    | Axios                      |
| Animações      | Framer Motion              |
| Feedback       | React Hot Toast            |
| Backend        | Spring Boot, Java, Maven   |
| ORM            | Spring Data JPA, Hibernate |
| Banco de dados | MySQL (via Docker)    |
| Contêiner      | Docker, Docker Compose     |
| Testes         | JUnit, Mockito, Testcontainer  |

---

## ⚙️ Setup Local / Docker

1. Clone este repositório e entre na pasta raiz:


2. Suba containers com Docker Compose:

   ```bash
   docker-compose up --build
   ```

   - Acessar: `http://localhost`

---

## 🔑 Variáveis de Ambiente

- **NEXT\_PUBLIC\_API\_BASE\_URL**: URL base da API (somente local, .env.development.local já está no projeto)

---

## ▶️ Executando a Aplicação

- **Docker**
  ```bash
  docker compose up --build
  ```
  ou Rodar pelo IntelliJ

- **Local (sem Docker)**
  ```bash
  Rodar apenas o container do mysql
  cd backend && mvn spring-boot:run
  cd frontend && npm install && npm run dev
  ```
  ou Rodar pelo IntelliJ

---

## 🧪 Testes

- **Backend**:

  - **Unitários** de serviço e validações (Mockito + JUnit)
  - **Integração** de controllers (Testcontainers / MockMvc)

Executar todos:

```bash
# Backend
cd backend && ./mvnw clean test

```

---

## 🧩 Componentes Reutilizáveis

- **`<SearchableSelect>`**: Select com campo de busca, debounce e integração API
- **`<PaginatedTable>`**: Tabela genérica com paginação e elipses
- **Utilitários (****`/lib/utils.ts`****)**:
  - `formatCurrency`
  - `formatCpf` / `unformatCpf` / `isValidCpf`
  - `toTitleCase`
  - `useDebounce`
  - Funções de Toast (error, success, warn)

---

## 📑 Validações e Máscaras

| Campo       | Biblioteca            | Comportamento                             |
| ----------- | --------------------- | ----------------------------------------- |
| CPF         | Custom (`utils`)      | Máscara ao digitar, só números no backend |
| Valor       | Custom `<MoneyInput>` | Digita centavos primeiro (formato nubank), formata reais   |
| Formulários | React Hook Form + Zod | Mensagens customizadas, required_error, etc   |

---

## ✨ Animações e Feedback

- **Framer Motion** para transições suaves
- **React Hot Toast** com temas customizados
- **Shadcn Dialog** para confirmações

---

## 📝 Considerações Finais

Este projeto demonstra:

- Domínio de **Next.js 13 App Router** e **React 18**
- Uso de **design system** e **acessibilidade** (Radix UI)
- Integração frontend-backend com **axios** e **paginção**
- **Testes** unitários e integração
- Implantação via **Docker**

Sinta-se à vontade para rodar, explorar o código e entrar em contato para dúvidas!

---

Por *Luisgmr* — [LinkedIn](https://linkedin.com/in/Luisgmr) | [GitHub](https://github.com/Luisgmr)

