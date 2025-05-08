# Simple Banking Web

**Um projeto full-stack desenvolvido com Next.js (App Router), React, Java, Spring Boot e Docker, implementado como teste técnico.**

| Pessoas | Contas | Movimentações |
|---|---|---|
| ![image](https://github.com/user-attachments/assets/5907ba73-87b1-4651-8e2f-2359e5a19ff9)| ![image](https://github.com/user-attachments/assets/348b0137-5bc8-444d-99cb-edd18921478b) | ![image](https://github.com/user-attachments/assets/0a63c9d7-4986-4a7b-8e9d-64ce8949f8ec) |

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

| Arquitetura de implantação |
|---|
| ![image](https://github.com/user-attachments/assets/c36ad05d-a630-434b-865c-d69acaef54f6) |

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

- Domínio de **Java com Spring Boot**, **Next.js 13 App Router** e **React 18**
- Uso de **design system** e **acessibilidade** (Radix UI)
- Integração frontend-backend com **axios** e **paginção**
- **Testes** unitários e integração
- Implantação via **Docker**

Sinta-se à vontade para rodar, explorar o código e entrar em contato para dúvidas!

---

Por *Luisgmr* — [LinkedIn](https://linkedin.com/in/Luisgmr) | [GitHub](https://github.com/Luisgmr)

