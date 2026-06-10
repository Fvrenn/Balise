# Balise — Spécification produit

---

## 1. Présentation

**Balise** est un SaaS d'audit d'accessibilité numérique conforme au référentiel RGAA 4.1.2.
Il est destiné aux cabinets de conseil en accessibilité qui réalisent des audits pour le compte de clients externes.

**Problème résolu** : un audit RGAA complet prend une journée entière car l'auditeur doit inspecter manuellement chaque critère, page par page, dans les outils de développement du navigateur. Balise automatise la détection des pages à auditer, structure la saisie des 106 critères et génère automatiquement les livrables finaux.

**Ce que Balise n'est pas** : un outil de correction automatique. Il assiste l'auditeur humain, il ne le remplace pas. Le jugement reste humain sur tous les critères.

**Onboarding** : il n'y a pas de page d'inscription publique. Les cabinets clients sont onboardés manuellement — le cabinet est créé en base par l'administrateur Balise, puis un Owner est invité par email. Cette approche est volontaire tant que le nombre de clients reste limité (< 10 cabinets). Une page d'inscription self-service pourra être ajoutée ultérieurement si nécessaire.

---

## 2. Structure multi-tenant

```
Cabinet (Organization)
├── Owners (1 ou plusieurs)
├── Auditeurs
├── Clients (entreprises auditées)
│   └── Audits
│       ├── Échantillon de pages
│       └── Grille RGAA (106 critères)
```

**Cabinet** — l'entreprise qui utilise Balise. Une licence = un cabinet. Chaque cabinet est totalement isolé des autres.

**Owner** — gère le cabinet, invite des membres, peut tout voir et tout modifier. Plusieurs owners possibles au même niveau de droits.

**Auditeur** — réalise les audits. Voit tous les audits du cabinet. Peut travailler sur l'audit d'un collègue si nécessaire.

**Client** — l'entreprise auditée. N'a pas accès à Balise. C'est une fiche interne qui regroupe les audits réalisés pour elle.

---

## 3. Vocabulaire RGAA important

| Terme | Définition |
|-------|-----------|
| **Critère** | Une règle d'accessibilité parmi les 106 du RGAA |
| **Thématique** | Groupe de critères (13 au total : Images, Couleurs, Formulaires…) |
| **Conforme** | Le critère est respecté sur le site audité |
| **Non conforme** | Le critère n'est pas respecté — un commentaire est obligatoire |
| **Non applicable** | Le critère ne s'applique pas à ce site (ex : pas de vidéo = thématique Multimédia NA) |
| **Échantillon** | Les pages sélectionnées pour l'audit (15 à 25 pages en pratique) |
| **Pages obligatoires** | Pages systématiquement incluses dans tout audit RGAA |
| **Pages gabarit** | Pages représentant un type de composant spécifique (carrousel, carte, formulaire…) |
| **Taux de conformité** | Critères conformes / (total critères − critères non applicables) |

---

## 4. Pages de l'application

---

### 4.1 Page Login
**Route** : `/login`
**Accès** : public

**Description** : point d'entrée de l'application pour les utilisateurs existants.

**Éléments** :
- Champ email
- Champ mot de passe
- Bouton **Se connecter**
- Lien **Mot de passe oublié** → envoie un lien de réinitialisation par email

**Workflow** :
1. L'utilisateur saisit ses identifiants
2. Si valides → redirigé vers `/dashboard`
3. Si invalides → message d'erreur inline

---

### 4.2 Page Acceptation d'invitation
**Route** : `/invite/[token]`
**Accès** : public (token unique par invitation)

**Description** : page par laquelle un nouvel auditeur rejoint un cabinet existant. Le lien est envoyé par email par un Owner.

**Éléments** :
- Nom du cabinet affiché en haut (contexte)
- Champ **Prénom**
- Champ **Nom**
- Champ **Email** (pré-rempli, non modifiable)
- Champ **Mot de passe**
- Champ **Confirmation mot de passe**
- Bouton **Rejoindre le cabinet**

**Workflow** :
1. L'Owner invite via un email (cf. page Équipe)
2. L'invité clique sur le lien dans l'email
3. Il crée son compte via ce formulaire
4. Redirection vers `/dashboard`

**Règles** :
- Le token expire après 48h
- Si le token est expiré, message d'erreur avec option de demander un nouvel envoi

---

### 4.3 Dashboard global
**Route** : `/dashboard`
**Accès** : Owner + Auditeur

**Description** : première page après connexion. Vue d'ensemble du cabinet — audits en cours, récents, et accès rapide aux clients.

**Éléments**

*Bloc "Mes audits en cours"* (audits assignés à l'utilisateur connecté)
- Carte par audit : nom du client, nom de l'audit, date de dernière modification, progression (x/106 critères renseignés), statut (En cours / Terminé), avatar de l'auditeur assigné
- Bouton **Continuer l'audit** sur chaque carte

*Bloc "Tous les audits du cabinet"* (visibles par tous)
- Liste compacte : nom client, nom audit, auditeur assigné, date, statut
- Filtre par statut (En cours / Terminé)
- Filtre par auditeur (Owner uniquement)
- Bouton **Voir** sur chaque ligne

*Bouton principal* **+ Nouvel audit** — en haut à droite, visible par tous

*Accès rapide sidebar* :
- Lien vers la liste des clients
- Lien vers la gestion de l'équipe (Owner uniquement)
- Lien vers les paramètres du cabinet

**Workflow** :
- C'est la page d'atterrissage après login
- L'auditeur voit immédiatement ses audits en cours en priorité
- L'Owner voit en plus les audits de toute l'équipe

---

### 4.4 Page Clients
**Route** : `/clients`
**Accès** : Owner + Auditeur

**Description** : liste de toutes les entreprises clientes du cabinet. Chaque client regroupe ses audits.

**Éléments** :
- Barre de recherche (par nom de client)
- Liste des clients : nom, nombre d'audits réalisés, date du dernier audit, auditeur référent
- Bouton **+ Nouveau client**
- Clic sur un client → redirige vers `/clients/[clientId]`

**Bouton "Nouveau client"** → ouvre une modale avec :
- Champ **Nom de l'entreprise**
- Champ **Site web** (optionnel)
- Champ **Contact** (optionnel, pour usage interne)
- Bouton **Créer**

---

### 4.5 Page Client
**Route** : `/clients/[clientId]`
**Accès** : Owner + Auditeur

**Description** : fiche d'un client avec l'historique complet de ses audits. Permet de retrouver tout ce qui a été fait pour ce client.

**Éléments** :
- En-tête : nom du client, site web, date de création de la fiche
- Bouton **Modifier la fiche** (Owner uniquement) → modale d'édition
- Bouton **+ Nouvel audit pour ce client** → redirige vers la création d'audit pré-remplie avec ce client
- Liste de tous les audits pour ce client :
  - Nom de l'audit, date, auditeur, statut, taux de conformité final
  - Bouton **Voir** sur chaque ligne
  - Bouton **Télécharger l'export** sur les audits terminés

**Workflow** :
- Quand un stagiaire arrive, l'Owner lui donne accès et il peut consulter les audits passés comme référence
- L'historique permet de suivre la progression d'un client sur plusieurs années

---

### 4.6 Page Création d'audit
**Route** : `/audits/new`
**Accès** : Owner + Auditeur

**Description** : formulaire en plusieurs étapes pour créer un nouvel audit et constituer l'échantillon de pages.

**Étape 1 — Informations générales**
- Sélecteur **Client** (liste déroulante des clients existants + option "Nouveau client")
- Champ **Nom de l'audit** (ex : "Audit RGAA 2025 — Site institutionnel")
- Champ **URL racine du site** (ex : `https://lyon.fr`)
- Sélecteur **Assigné à** (liste des membres du cabinet) — par défaut l'utilisateur connecté
- Bouton **Suivant**

**Étape 2 — Détection de l'échantillon**
- Balise lance un scan rapide de détection (pas un audit complet)
- Pendant le scan : indicateur de progression animé "Analyse du site en cours…"
- Le scan cherche : les pages obligatoires via les liens de navigation, et les gabarits via la détection de composants (carrousel, carte, formulaire, vidéo, tableau…)

Résultat affiché en deux blocs :

*Pages obligatoires*
```
✅ Accueil               https://lyon.fr
✅ Contact               https://lyon.fr/contact
✅ Mentions légales      https://lyon.fr/mentions-legales
⚠️  Confidentialité      Non trouvée    [ Renseigner l'URL ]
⚠️  Plan du site         Non trouvé     [ Renseigner l'URL ]
```

*Pages gabarit détectées*
```
✅ Carrousel             https://lyon.fr/actualites
✅ Carte interactive     https://lyon.fr/nous-trouver
✅ Formulaire            https://lyon.fr/inscription
```

Chaque ligne a :
- Icône de statut (trouvé / non trouvé)
- Label de la page
- URL (modifiable)
- Bouton **Supprimer** (croix)

En bas du bloc :
- Bouton **+ Ajouter une page manuellement** → champ label + champ URL

- Bouton **Lancer l'audit** → crée l'audit et redirige vers le workspace

**Règles** :
- Les pages obligatoires non renseignées bloquent le lancement avec un avertissement (pas un bloquant dur — l'auditrice peut forcer si elle sait que la page n'existe pas sur ce site)
- Minimum 1 page pour pouvoir lancer

---

### 4.7 Workspace audit — Vue d'ensemble
**Route** : `/audits/[auditId]`
**Accès** : Owner + Auditeur

**Description** : page d'accueil du workspace d'un audit. Résumé de l'avancement global.

**Éléments** :
- En-tête : nom du client, nom de l'audit, date de création, auditeur assigné, statut
- Bouton **Marquer comme terminé** / **Réouvrir** (bascule le statut visuel)
- Bouton **Modifier l'assignation** (Owner uniquement) → sélecteur d'auditeur

*Bloc progression*
- Barre de progression globale : x/106 critères renseignés
- Répartition par statut : x Conformes · x Non conformes · x Non applicables · x Non renseignés
- Taux de conformité actuel (calculé en temps réel)

*Bloc par thématique*
- 13 lignes, une par thématique RGAA
- Chaque ligne : nom de la thématique, barre de mini-progression, nombre de critères restants
- Clic sur une thématique → redirige vers la grille filtrée sur cette thématique

*Bloc échantillon*
- Liste des pages de l'échantillon avec leur label
- Bouton **Gérer l'échantillon** → redirige vers `/audits/[auditId]/pages`

*Bloc livrables* (V2)
- Bouton **Exporter la grille RGAA (.xlsx)**
- Bouton **Générer le rapport PDF** (V2)
- Bouton **Générer la déclaration d'accessibilité** (V2)

---

### 4.8 Workspace audit — Échantillon de pages
**Route** : `/audits/[auditId]/pages`
**Accès** : Owner + Auditeur

**Description** : gestion de l'échantillon de pages après création de l'audit. Permet d'ajouter, modifier ou supprimer des pages.

**Éléments** :
- Liste des pages avec label, URL, type (Obligatoire / Gabarit / Complémentaire)
- Bouton **Modifier** sur chaque ligne → modale d'édition label + URL
- Bouton **Supprimer** sur chaque ligne
- Bouton **+ Ajouter une page**
- Bouton **Relancer la détection automatique** → refait tourner le scan de détection et propose les nouvelles pages trouvées sans écraser celles déjà en place

---

### 4.9 Workspace audit — Grille RGAA
**Route** : `/audits/[auditId]/criteria`
**Accès** : Owner + Auditeur

**Description** : c'est le cœur de l'application. La grille des 106 critères RGAA où l'auditrice saisit ses observations. Tout est sauvegardé automatiquement à chaque modification.

**Éléments de navigation**
- Tabs ou menu latéral secondaire listant les 13 thématiques
- Barre de progression globale en haut
- Filtre rapide : Tous / Non renseignés / Non conformes

**Pour chaque critère**

Chaque critère est une ligne ou une carte avec :

- **Numéro et intitulé** du critère (ex : "1.1 — Chaque image porteuse d'information a-t-elle une alternative textuelle ?")
- **Lien "Méthode"** → ouvre la page officielle RGAA du critère dans un nouvel onglet
- **Trois boutons de statut** :
  - `Conforme` → vert quand sélectionné
  - `Non conforme` → rouge quand sélectionné
  - `Non applicable` → gris quand sélectionné
- **Champ commentaire** : apparaît obligatoirement quand "Non conforme" est sélectionné. Optionnel pour les autres statuts. Texte libre, multiligne. L'auditrice y explique le problème constaté et la recommandation de correction.
- **Champ pages concernées** : sélecteur multi-choix parmi les pages de l'échantillon. Apparaît quand "Non conforme" est sélectionné. Permet de préciser sur quelles pages le problème a été observé.

**Comportement de sauvegarde** :
- Sauvegarde automatique à chaque changement (debounce 1s sur les champs texte)
- Indicateur discret "Sauvegardé" / "Sauvegarde en cours…" en haut de page
- Pas de bouton "Enregistrer" — tout est persistant en continu

**Comportement "Non applicable" sur une thématique entière** :
- Bouton **Marquer toute la thématique comme Non applicable** en haut de chaque section thématique
- Utile si le site n'a pas de vidéo (thématique Multimédia = NA en bloc)
- Une confirmation est demandée avant d'appliquer en masse

**Workflow type de l'auditrice** :
1. Elle ouvre la thématique Images
2. Pour chaque critère, elle a inspecté la page dans son navigateur
3. Elle clique sur le statut correspondant
4. Si non conforme, elle saisit son commentaire et sélectionne les pages concernées
5. Elle passe à la thématique suivante
6. Elle peut fermer et reprendre plus tard — tout est sauvegardé

---

### 4.10 Workspace audit — Rapports
**Route** : `/audits/[auditId]/reports`
**Accès** : Owner + Auditeur

**Description** : génération et téléchargement des livrables de l'audit.

**MVP — disponible dès la V1**

*Export grille RGAA (.xlsx)*
- Bouton **Générer l'export Excel**
- Génère la grille officielle RGAA au format du kit d'audit gouvernemental
- Colonnes : numéro critère, thématique, intitulé, statut, commentaire, pages concernées
- Téléchargement immédiat
- Le fichier est aussi stocké et accessible en re-téléchargement

**V2**

*Rapport PDF*
- Bouton **Générer le rapport PDF**
- Options : logo du cabinet (pré-rempli depuis les paramètres), nom de l'auditeur, date
- Génération asynchrone (quelques secondes) avec indicateur de progression
- Contenu : page de garde, synthèse exécutive, taux de conformité, non-conformités détaillées par thématique, recommandations
- Téléchargement du PDF + stockage pour re-téléchargement

*Déclaration d'accessibilité*
- Bouton **Générer la déclaration**
- Pré-remplit automatiquement le document légal obligatoire à partir des données de l'audit
- Sortie : HTML (à coller sur le site du client) + PDF
- L'auditrice valide et ajuste avant de télécharger

**V3**

*Présentation PowerPoint*
- Bouton **Générer la présentation**
- Sélection des non-conformités à inclure (les plus critiques pré-cochées)
- Génère un PowerPoint de synthèse avec les points clés, captures d'écran et recommandations
- Pour présentation au client non-technique

---

### 4.11 Page Équipe
**Route** : `/settings/team`
**Accès** : Owner uniquement

**Description** : gestion des membres du cabinet — invitation, modification des rôles, désactivation.

**Éléments** :
- Liste des membres : avatar, prénom nom, email, rôle (Owner / Auditeur), date d'adhésion, statut (Actif / Invité en attente)
- **Modifier le rôle** sur chaque membre : bascule Owner ↔ Auditeur
- **Désactiver** un membre : il ne peut plus se connecter mais ses audits restent accessibles
- Bouton **+ Inviter un membre** → modale avec :
  - Champ email
  - Sélecteur de rôle (Owner / Auditeur)
  - Bouton **Envoyer l'invitation**
  - L'invitation est envoyée par email avec un lien valable 48h

**Règles** :
- Un Owner ne peut pas se rétrograder lui-même si c'est le seul Owner restant
- Un Owner ne peut pas désactiver le seul Owner restant

---

### 4.12 Page Paramètres du cabinet
**Route** : `/settings/cabinet`
**Accès** : Owner uniquement

**Description** : informations et configuration du cabinet.

**Éléments** :
- Champ **Nom du cabinet**
- Upload **Logo du cabinet** (utilisé dans les rapports PDF)
- Champ **Site web du cabinet** (apparaît dans les rapports)
- Champ **Email de contact** (apparaît dans les déclarations d'accessibilité)
- Bouton **Enregistrer les modifications**

---

### 4.13 Page Profil utilisateur
**Route** : `/settings/profile`
**Accès** : Owner + Auditeur (chacun gère son propre profil)

**Éléments** :
- Champ **Prénom**
- Champ **Nom**
- Champ **Email**
- Section **Changer le mot de passe** : ancien mot de passe, nouveau, confirmation
- Bouton **Enregistrer**

---

## 5. Sidebar — Structure de navigation

La sidebar est contextuelle. Elle change selon qu'on est dans le contexte global du cabinet ou à l'intérieur d'un audit.

### Sidebar globale

```
[Logo Balise]

Dashboard

── Travail ──
Clients
Tous les audits

── Cabinet ──        (Owner uniquement)
Équipe
Paramètres

────────────────
[Avatar] Prénom NOM
Profil
Se déconnecter
```

### Sidebar projet (dans un audit)

```
← Retour au dashboard

[Nom du client]
[Nom de l'audit]
Assigné à : Prénom N.
Statut : En cours  ●

── Audit ──
Vue d'ensemble
Grille RGAA          [47/106]
Échantillon pages    [18 pages]

── Livrables ──
Rapports & exports

────────────────
Paramètres de l'audit
```

---

## 6. Découpage par version

### MVP — V1

**Objectif** : permettre à une auditrice de réaliser un audit RGAA complet de A à Z et d'en sortir l'export Excel officiel.

| Fonctionnalité | Détail |
|---------------|--------|
| Auth | Login, invitation, reset password |
| Cabinet | Paramètres de base, logo (création manuelle par l'admin) |
| Équipe | Invitation, rôles Owner/Auditeur, désactivation |
| Clients | Création de fiches clients, historique des audits |
| Création d'audit | Saisie URL, scan de détection, proposition de l'échantillon |
| Grille RGAA | 106 critères, 3 statuts, commentaires, pages concernées |
| Sauvegarde | Automatique en continu, pause et reprise |
| NA en masse | Marquer toute une thématique comme Non applicable |
| Export Excel | Grille officielle RGAA au format .xlsx |
| Dashboard | Mes audits en cours, tous les audits du cabinet |
| Assignation | Assigner un audit à un auditeur, réassigner (Owner) |

**Ce qui n'est pas dans le MVP** :
- Rapport PDF
- Déclaration d'accessibilité
- PowerPoint
- Scan des critères automatique (la grille est remplie manuellement)
- Statistiques cabinet
- Travail collaboratif simultané

---

### V2

**Objectif** : automatiser les livrables et introduire la revue semi-automatique des critères.

| Fonctionnalité | Détail |
|---------------|--------|
| Rapport PDF | Génération white-label avec logo cabinet |
| Déclaration d'accessibilité | Pré-remplissage automatique, export HTML + PDF |
| Revue semi-auto | Image + alt côte à côte, lien + contexte, label + champ |
| Progression client | Comparaison entre deux audits du même client |
| Réassignation | Transfert d'un audit entre auditeurs avec notification |

---

### V3

**Objectif** : fonctionnalités avancées et pilotage cabinet.

| Fonctionnalité | Détail |
|---------------|--------|
| PowerPoint de synthèse | Sélection des points critiques, génération automatique |
| Statistiques cabinet | Taux moyen de conformité, évolution, performance par auditeur |
| Travail collaboratif | Deux auditeurs sur le même audit simultanément |
| Relance de scan | Nouveau scan avec comparaison au précédent, détection des régressions |
| Rappels automatiques | Email d'alerte quand une déclaration d'accessibilité approche de son renouvellement annuel |

---

## 7. Règles métier importantes

**Taux de conformité**
```
Taux = Critères conformes / (106 − Critères non applicables)
```
Un critère "non renseigné" n'entre pas dans le calcul. Le taux est donc fiable dès le début et s'affine au fur et à mesure.

**Statut d'un audit**
- **En cours** : audit créé, travail en progression
- **Terminé** : marqué manuellement par l'auditrice — statut visuel uniquement, l'audit reste modifiable

**Commentaire obligatoire**
Quand un critère est marqué "Non conforme", le champ commentaire est obligatoire avant de pouvoir générer les livrables. Un avertissement s'affiche sur la page des rapports si des non-conformités n'ont pas de commentaire.

**Isolation des données**
Un cabinet ne voit jamais les données d'un autre cabinet. Toutes les requêtes sont filtrées par `organizationId`.

**Suppression d'un membre**
Quand un auditeur est désactivé, tous ses audits restent intacts et accessibles. Ses audits en cours apparaissent dans la vue "tous les audits" avec une mention "Auditeur désactivé" pour que l'Owner puisse les réassigner.
