# Architecture Diagram

This document divides the architecture into detailed, focused diagrams representing each layer of the Domain-Driven Design (DDD) implementation.

## 1. Core Layer
Contains pure, foundational abstractions and standard types shared across all domains (such as Base Entities, IDs, and Result patterns).

```mermaid
classDiagram
  class Entity {
    <<abstract>>
    #UniqueEntityID _id
    #Props props
    +equals(Entity) boolean
    +get id() UniqueEntityID
  }
  class UniqueEntityID {
    -String value
    +toString() String
    +toValue() String
  }
  class Either {
    <<abstract>>
    +isLeft() boolean
    +isRight() boolean
  }
  class UseCaseError {
    <<interface>>
    +String message
  }
  class PaginatedResult~T~ {
    +T[] items
    +number total
  }
  class PaginationParams {
    +number page
  }
  
  Entity *-- UniqueEntityID : contains
```

## 2. Domain (Enterprise) Layer
Represents the core business models, ensuring that business rules and invariants are encapsulated.

```mermaid
classDiagram
  class Account {
    <<entity>>
    +String name
    +String email
    +String password
    +UserRole role
    +get id() UniqueEntityID
  }
  class Admin {
    <<entity>>
  }
  class User {
    <<entity>>
  }
  class Lawyer {
    <<entity>>
  }
  class Lead {
    <<entity>>
  }

  %% Inheritance representing multiple user types under Account
  Account <|-- Admin
  Account <|-- User
  Account <|-- Lawyer
```

## 3. Domain (Application) Layer
Acts as the bridge between outer layers and the enterprise domain. Contains Use Cases, Port Interfaces (Repositories, Cryptography), and Application logic.

```mermaid
classDiagram
  class RegisterAccountUseCase {
    +execute(request) Either~UseCaseError, Account~
  }
  class AccountsRepository {
    <<interface>>
    +findByEmail(email: string) Promise~Account | null~
    +create(account: Account) Promise~void~
  }
  class Encrypter {
    <<interface>>
    +encrypt(payload: Record~string, unknown~) Promise~string~
  }
  class HashGenerator {
    <<interface>>
    +hash(plain: string) Promise~string~
  }
  class HashComparer {
    <<interface>>
    +compare(plain: string, hash: string) Promise~boolean~
  }
  
  %% Use Cases depend purely on interfaces (DIP)
  RegisterAccountUseCase ..> AccountsRepository : injects
  RegisterAccountUseCase ..> HashGenerator : injects
```

## 4. Infrastructure Layer
The outermost layer consisting of framework implementation (NestJS), actual database access (Prisma), HTTP routing (Controllers), and Authorization rules (CASL).

```mermaid
classDiagram
  class AppController {
    <<controller>>
  }
  class RegisterAccountController {
    <<controller>>
    +handle(body: RegisterAccountDto)
  }
  
  class PrismaService {
    <<database>>
    +onModuleInit()
  }
  class PrismaAccountsRepository {
    <<repository>>
    +findByEmail(email: string)
    +create(account: Account)
  }
  class CaslAbilityFactory {
    <<authorization>>
    +createForUser(user: Account) MongoAbility
  }
  class PoliciesGuard {
    <<guard>>
    +canActivate(context: ExecutionContext) boolean
  }
  class JwtAuthGuard {
    <<guard>>
    +canActivate(context: ExecutionContext) boolean
  }
  class ArgonHasher {
    <<cryptography>>
    +hash(plain: string) Promise~string~
    +compare(plain, hash) Promise~boolean~
  }
  class JwtEncrypter {
    <<cryptography>>
    +encrypt(payload) Promise~string~
  }

  %% Controller actions
  RegisterAccountController ..> RegisterAccountUseCase : injects
  AppController ..> PoliciesGuard : protected_by

  %% Protocol implementations (implementing App interfaces)
  PrismaAccountsRepository ..|> AccountsRepository : implements
  ArgonHasher ..|> HashGenerator : implements
  ArgonHasher ..|> HashComparer : implements
  JwtEncrypter ..|> Encrypter : implements
  
  %% DB and Auth dependencies
  PoliciesGuard ..> CaslAbilityFactory : uses
  PrismaAccountsRepository ..> PrismaService : depends_on
```
