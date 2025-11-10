# 🧵 Mini Project Issatex

Système de **Gestion de Production Assistée par Ordinateur (GPAO)** pour la société **ISSATEX**, spécialisée dans la confection de prêt-à-porter et linge de maison.  
Le projet permet la **gestion complète du cycle de production**, de la **prise d’ordre de fabrication (OF)** jusqu’à l’**expédition** et la **facturation**, tout en intégrant des rôles multiples (gérant, secrétaire, client, magasinier, etc.).

---

## 🚀 Stack Technique

### 🧩 Back-End

-   **Framework** : [Symfony](https://symfony.com/) avec **API Platform**
-   **Packages principaux :**
    -   `lexik/jwt-authentication-bundle` — Authentification par JWT
    -   `gesdinet/jwt-refresh-token-bundle` — Rafraîchissement de tokens
    -   `vich/uploader-bundle` — Gestion de l’upload de fichiers (document technique de l'article)
    -   `mercure-bundle` — Notifications temps réel (changement d'état des OF)
-   **Base de données** : PostgreSQL
-   **Architecture** : REST + Temps réel via Mercure

### 💻 Front-End

-   **Next.js (TypeScript)** — Front-end et interface d’administration
    -   **Admin** : [React Admin](https://marmelab.com/react-admin/) + [MUI](https://mui.com/)
    -   **Secrétaire / Client** :
        -   Gestion des formulaires : `react-hook-form`
        -   Gestion des requêtes : `react-query`
        -   Validation : `zod`
        -   UI : `tailwindcss`, `shadcn`
    -   **Notifications en temps réel** : via Mercure ou WebSocket client

---

## 🧠 Contexte du Projet

ISSATEX souhaite moderniser son système de gestion de production pour :

-   Automatiser la **gestion des ordres de fabrication (OF)**
-   Suivre la **production journalière et le rendement**
-   Gérer les **expéditions et factures**
-   Permettre aux **donneurs d’ordre** de suivre en temps réel l’état de leurs commandes

---

## ⚙️ Fonctionnalités Principales

### 🧱 Données de base

-   Gestion des **îlots** (unités autonomes de production)
-   Gestion des **machines** (type, marque, référence)
-   Gestion des **employés** (catégorie, date de recrutement, matricule)

### 🧾 Gestion des Ordres de Fabrication (OF)

-   Création, consultation, mise à jour et suppression d’OF
-   Gestion des **OF urgents**
-   Planification hebdomadaire de production par îlot

### 📊 Suivi de la Production

-   Saisie des quantités journalières (par taille et qualité)
-   Calcul automatique du **rendement** :
    Rendement (%) = Temps productif / Temps de présence
-   Statistiques par îlot : journalières, hebdomadaires, mensuelles, annuelles

### 📱 Notifications

-   Notifications push sur changement d’état d’un OF : Planifié, Annulé

---

## 🔐 Rôles Utilisateurs

| Rôle           | Permissions principales                                                 |
| -------------- | ----------------------------------------------------------------------- |
| **Gérant**     | Gestion complète (îlots, OF, employés, machines, plannings, rendements) |
| **Secrétaire** | Suivi production, saisie des présences, éditions PDF                    |
| **Client**     | Lancement & suivi de ces Ordres de Fabrication                          |

---

## 📄 Documentation & Références

-   Cahier des charges : _Mini Projet ISSATEX – Pr. Chiheb CHAIEB (ISET Sousse, 2022)_
-   Technologies :
    -   [Api-Platform](https://api-platform.com/)
    -   [Next.js](https://nextjs.org/)
    -   [React Admin](https://marmelab.com/react-admin/)
    -   [TailwindCSS](https://tailwindcss.com/)

---

## 📦 Licence

Projet académique – Usage éducatif uniquement.
