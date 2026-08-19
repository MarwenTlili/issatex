# To Do

- Project Structure ❌

Now:

issatex/
├── pwa/
│   ├── src/
│   │   ├── components
│   │   │   ├── admin/
│   │   │   ├── articles/
│   │   │   ├── auth/
│   │   │   ├── ui/
│   │   │   ├── ...
│   │   ├── config
│   │   ├── hooks
│   │   │   ├── use-[resource-name].ts
│   │   │   ├── use-mobile.ts
│   │   │   ├── use-toast.ts
│   │   │   ├── ...
│   │   ├── lib
│   │   │   ├── api
│   │   │   |   ├── [resource-name]-api.ts
│   │   │   |   ├── exceptions.ts
│   │   │   |   ├── handle-api-error.ts
│   │   │   ├── auth/
│   │   │   |   ├── errors.ts
│   │   │   |   ├── auth-options.ts
│   │   │   |   ├── auth-service.ts
│   │   │   ├── utils/
│   │   │   ├── validation/
│   │   │   |   ├── schema.ts
│   │   │   |   ├── validation-errors.ts
│   │   │   ├── utils.ts
│   │   ├── mercure/
│   │   ├── providers/
│   │   ├── styles/
│   │   ├── types/

Objective:

pwa/
├── src/
│ ├── app/
│ ├── components/
│ ├── features/
│ │ ├── auth/
│ │ │ ├── api.ts
│ │ │ ├── hooks.ts
│ │ │ ├── schema.ts
│ │ │ └── types.ts
│ │ │
│ │ ├── users/
│ │ │ ├── api.ts
│ │ │ ├── hooks.ts
│ │ │ ├── schema.ts
│ │ │ └── types.ts
│ │ │
│ │ └── products/
│ │ ├── api.ts
│ │ ├── hooks.ts
│ │ ├── schema.ts
│ │ └── types.ts
│ │
│ ├── lib/
│ │ ├── apiClient.ts
│ │ ├── ApiError.ts
│ │ ├── fetcher.ts
│ │ └── utils.ts
│ │
│ ├── schemas/
│ │ ├── hydra.ts
│ │ ├── pagination.ts
│ │ └── apiError.ts
│ │
│ └── types/

- Use Symfony Voter to check user permissions ❌

https://symfony.com/doc/6.4/security/voters.html

https://gemini.google.com/u/2/app/78f4105f9d9b595e 

- Pages metadata ❌

## Follow Best Practices ✅

✅ SOLID
✅ Factory Pattern (création des exceptions)
✅ Strategy Pattern (présentation des erreurs : Toast, Modal, Snackbar…)
✅ Template Method (ApiService générique)
✅ Dependency Inversion (présentateur d'erreurs injecté)
✅ Single Responsibility (une responsabilité par fichier)
✅ Open/Closed (ajout d'un nouveau code HTTP sans modifier le reste)
✅ API Platform RFC7807/Hydra compatible
✅ Compatible NextAuth
✅ Compatible React Query v4
✅ Compatible React Hook Form
✅ Compatible Zod

## Architectural Layers ✅

### 1. Presentation / UI Layer

Responsible for rendering user interfaces, capturing user input, and declaring localized semantic structures. It operates on client-side frameworks and stays agnostic of how network queries are performed.

- Files / Mappings:
    - src/components/auth/login-form.tsx
    - src/app/ (Next.js App Router Pages and Layouts)

- Key Responsibilities:
    - Configures form state orchestration via react-hook-form and manages structural UI assertions (e.g., binding fields via RHFInput).  
    - Binds user actions (onSubmit) to application state controllers or authentication handlers (signIn).
    - Triggers contextual visual feedback, such as routing updates via useRouter or presenting server/validation error banners derived from lower layers.

### 2. Application / Coordination Layer

Acts as the orchestration layer between UI intents, caching logic, and remote infrastructure. It normalizes data mutations, encapsulates cross-cutting concerns like caching/session management, and enforces application states.

A. Authentication & Session Sub-layer

- Files / Mappings:
    - src/lib/auth/auth-options.ts
    - src/lib/auth/errors.ts (specifically AuthErrorFactory and getAuthErrorMessage)  

- Key Responsibilities:
    - Orchestrates authentication workflow using NextAuth providers and stateful callbacks (jwt, session).
    - Acts as a security barrier: utilizes AuthErrorFactory to capture domain exceptions (ApiException, NetworkException) and map them to generalized, URL-safe NextAuth tokens. This mitigates info disclosure and username enumeration attacks.  
    - Handles token lifecycle (decoding JWTs, state updates, silent token refresh queries via authService).

B. State & Query Sub-layer

- Files / Mappings:
    - src/hooks/use-articles.ts
- Key Responsibilities:
    - Implements declarative asynchronous hooks leveraging @tanstack/react-query (useQuery, useMutation).
    - Manages server state, automatic data synchronization, query dependency setups (e.g., tying articles to a currentClient.id), and cache invalidation policies via queryClient.invalidateQueries.

### 3. Domain Service / API Client Layer

This layer exposes high-level, strongly-typed operations reflecting your backend's API resource contracts (in this case, tailored around API Platform patterns). It isolates the direct REST endpoints from the components.

- Files / Mappings:
    - src/lib/api/articles-api.ts
    - src/lib/auth/auth-service.ts

- Key Responsibilities:
    - Implements dedicated API clients extending reusable abstractions (e.g., ArticlesApiService inheriting from ApiService).  
    - Constructs contextual query parameters and binds domain-specific interfaces (ArticlesFilters, CreateArticleData) to remote REST invocations.  

### 4. Infrastructure / Network Layer

This layer sits at the absolute bottom of your architecture. Its sole job is handling raw HTTP transportation, fetch timeouts, JSON response parsing, and standard error intercepting.

- Files:src/lib/api/base.ts (ApiService, apiRequest core client engine)
- src/lib/api/exceptions.ts (ApiErrorFactory translating raw HTTP bodies into domain exceptions)

Key Behavior: Intercepts a failing Response, determines if it aligns with RFC 7807 problem details, and wraps the network error safely.
