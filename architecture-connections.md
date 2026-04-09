# Architecture Connections & Flow

Este documento detalha **como as camadas interagem entre si**. Ele inclui um diagrama de grafos focado no fluxo de dependências (Dependency Inversion Principle do Clean Architecture) e um diagrama de sequência que exemplifica o fluxo de execução ocorrendo através de todas as camadas.

## 1. Fluxo de Dependências (Clean Architecture)
O diagrama abaixo ilustra a Inversão de Dependência (DIP). A camada de Infraestrutura *depende* das abstrações definidas na camada de Aplicação. A Aplicação não conhece o banco de dados nem o framework web.

```mermaid
flowchart TB
    subgraph Core ["1. Core Layer (Independente)"]
        Entity["Entity (Base)"]
        Either["Either (Resultados/Erros)"]
    end

    subgraph Enterprise ["2. Domain Enterprise (Regras de Negócio)"]
        Account["Account (Entity)"]
    end

    subgraph Application ["3. Domain Application (Orquestração & Portas)"]
        UseCase["RegisterAccountUseCase"]
        IRepo[["AccountsRepository (Interface/Port)"]]
        IHash[["HashGenerator (Interface/Port)"]]
    end

    subgraph Infra ["4. Infrastructure Layer (Adapters, Framework, DB)"]
        Controller["RegisterAccountController"]
        PrismaRepo["PrismaAccountsRepository (Adapter)"]
        ArgonHasher["ArgonHasher (Adapter)"]
        Prisma["Prisma ORM (Service)"]
    end

    %% Regras de dependencia de camadas (de fora para dentro)
    Enterprise -->|Extende / Usa| Core
    Application -->|Manipula| Enterprise
    Application -->|Retorna| Core
    
    %% Inversão de Dependências (Setas pontilhadas)
    PrismaRepo -.->|Implementa| IRepo
    ArgonHasher -.->|Implementa| IHash

    %% Fluxo de Controle e Chamadas de infraestrutura
    Controller ==>|Injeta & Chama| UseCase
    Infra -->|Conhece Todas| Application
    
    %% Uso de Repositório DB
    UseCase -->|Chama Métodos| IRepo
    UseCase -->|Chama Métodos| IHash
    PrismaRepo -->|Acessa BD| Prisma
    PrismaRepo -->|Mapeia para| Account
```

## 2. Fluxo de Execução (Runtime Sequence Diagram)
Para entender de forma prática como as camadas se conectam em tempo de execução, veja o fluxo de uma requisição HTTP percorrendo todas as camadas do sistema até o banco de dados e retornando uma resposta segura (Either).

```mermaid
sequenceDiagram
    participant Client
    participant Controller as RegisterAccount Controller<br/>(Infra)
    participant UseCase as RegisterAccount UseCase<br/>(Application)
    participant HashGen as HashGenerator Adapter<br/>(Infra/Argon2)
    participant Repo as PrismaAccounts Repository<br/>(Infra)
    participant DB as PrismaService<br/>(Database)
    participant Account as Account Entity<br/>(Enterprise Domain)

    Client->>Controller: POST /accounts (name, email, pass)
    
    Note over Controller: ZodValidationPipe valida o DTO
    
    Controller->>UseCase: execute({ name, email, password })
    
    Note over UseCase: Inicia a orquestração do caso de uso
    UseCase->>Repo: findByEmail(email) (Interface call)
    Repo->>DB: prisma.user.findUnique(...)
    DB-->>Repo: null (Não existe)
    Repo-->>UseCase: null

    UseCase->>HashGen: hash(password) (Interface call)
    HashGen-->>UseCase: "hashed_password"

    Note over UseCase,Account: A camada de Aplicação cria a entidade de domínio
    UseCase->>Account: Account.create({ name, email, password: "hashed_password" })
    Account-->>UseCase: Account Entity Object
    
    UseCase->>Repo: create(account) (Interface call)
    
    Note over Repo: Mapper converte Account (Domain) para Prisma (Data)
    Repo->>DB: prisma.user.create(...)
    DB-->>Repo: Registro Inserido
    Repo-->>UseCase: void
    
    Note over UseCase: Retorna o modelo Right(Either) como sucesso
    UseCase-->>Controller: Right({ account })
    
    Note over Controller: AccountPresenter mapeia Account para JSON HTTP
    Controller-->>Client: 201 Created (HTTP Response)
```