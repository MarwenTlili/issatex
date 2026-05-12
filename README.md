# 🧵 Mini Project Textile

Système de **Gestion de Production Assistée par Ordinateur (GPAO)**, pour une entreprise spécialisée dans la confection de prêt-à-porter et linge de maison.  
Le projet permet la **gestion complète du cycle de production**, de la **prise d’ordre de fabrication (OF)** jusqu’à l’**expédition** et la **facturation**, tout en intégrant des rôles multiples (gérant, secrétaire, client, magasinier, etc.).

---

## 🎯 Objectifs du Projet

Développement d'une application métier full-stack pour démontrer la maîtrise de l'écosystème **Symfony / Next.js / Docker** dans un contexte industriel complexe :

⚡ **Automatisation** des processus de fabrication.

📈 **Suivi en temps réel** de la production et des performances (KPIs).

🤝 **Collaboration** fluide entre gérants, secrétaires et donneurs d'ordre (clients).

## 🧠 Contexte & Enjeux

Modernisation de la chaîne de production textile pour répondre à quatre besoins critiques :

- Automatiser la **gestion des ordres de fabrication (OF)**
- Suivre la **production journalière et le rendement**
- Permettre aux **donneurs d’ordre** de suivre en temps réel l’état de leurs commandes
- ~~Gérer les **expéditions et factures**~~

---

## ⚙️ Fonctionnalités Principales

### 🧱 Données de base

- Gestion des **îlots** (unités autonomes de production)
- Gestion des **machines** (type, marque, référence)
- Gestion des **employés** (catégorie, date de recrutement, matricule)
- Gestion des **Clients** (privilégié ou non)

### 🧾 Gestion des Ordres de Fabrication (OF)

- Création, consultation, mise à jour et suppression d’OF (non lancé)
- Gestion des **OF urgents**
- Planification hebdomadaire de production par îlot

### 📊 Suivi de la Production

- Saisie des quantités journalières (par taille et qualité)
- ~~Calcul automatique du **rendement** :  
  Rendement (%) = Temps productif / Temps de présence~~
- ~~Statistiques par îlot : journalières, hebdomadaires, mensuelles, annuelles~~

### 📱 Notifications

- Notifications sur changement d’état d’un OF : Planifié, En_cours, Annulé, ...

---

## 🔐 Rôles Utilisateurs

| Rôle           | Permissions principales                                                            |
| -------------- | ---------------------------------------------------------------------------------- |
| **Gérant**     | Gestion complète (îlots, employés, machines, OF, plannings, Présences, rendements) |
| **Secrétaire** | Suivi production, saisie des présences                                             |
| **Client**     | Lancement & suivi de ces Ordres de Fabrication, Gérer ces articles                 |

---

## 🛠️ Stack Technique

### 🧩 Back-End

- **Framework** : API-Platform (Symfony)
- **Packages principaux :**
    - `lexik/jwt-authentication-bundle` — Authentification par JWT
    - `gesdinet/jwt-refresh-token-bundle` — Rafraîchissement de tokens
    - `vich/uploader-bundle` — Gestion de l’upload de fichiers (document technique de l'article)
    - `mercure-bundle` — Notifications temps réel (changement d'état des OF)
- **Base de données relationnelle** : PostgreSQL
- **Architecture** : REST + Temps réel via Mercure

### 💻 Front-End

- **Next.js (TypeScript)** — Front-end et interface d’administration
    - **Admin** : [React Admin](https://marmelab.com/react-admin/) + [MUI](https://mui.com/)
    - **Secrétaire / Client** :
        - Gestion des formulaires : `react-hook-form`
        - Gestion des requêtes : `react-query`
        - Validation : `zod`
        - UI : `tailwindcss`
    - **Notifications en temps réel** : via pe protocole Mercure

---

## 🧭 Pour Commencer

👉 Consultez le [Guide d'installation](docs/SETUP.md) pour déployer l'environnement via Docker.

---

## 📦 Licence

Distribué sous licence MIT. Usage éducatif et démonstration technique.
