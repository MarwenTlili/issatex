# Note

## SOLID + Clean Architecture

fetch()
│
▼
apiRequest()
│
├── HTTP error → ApiException
├── AbortError → TimeoutException
├── fetch TypeError → NetworkException
└── other JS Error → preserve it
│
▼
React Query
│
├── ValidationException → React Hook Form
└── everything else → handleApiError()
│
▼
Sonner

## Flux de données

+-----------------------------------------------------------------------+
| Couche 1 : COMPOSANTS UI |
| (article-form.tsx, pages, formulaires...) |
+-----------------------------------------------------------------------+
│
▼
+-----------------------------------------------------------------------+
| Couche 2 : GESTION D'ÉTAT & CACHE |
| (@tanstack/react-query - useQuery / useMutation) |
+-----------------------------------------------------------------------+
│
▼
+-----------------------------------------------------------------------+
| Couche 3 : ABSTRACTION ET CRUD (SDK) |
| ([Resource]-api.ts, ApiService, auth-services.ts) |
+-----------------------------------------------------------------------+
│
▼
+-----------------------------------------------------------------------+
| Couche 4 : CLIENTS BAS NIVEAU & UTILS (base.ts) |
| (apiRequest, publicApiRequest, fetchWithTimeout, Next-Auth) |
+-----------------------------------------------------------------------+
│
▼
+-----------------------------------------------------------------------+
| Couche 5 : BACKEND API |
| (Endpoints REST / JSON-LD / Hydra) |
+-----------------------------------------------------------------------+
