# Balise

SaaS d'audit d'accessibilité RGAA 4.1.2 pour cabinets de conseil.

## Stack

| Couche | Outil |
|--------|-------|
| Framework | Next.js 15 App Router + TypeScript strict |
| UI | Tailwind CSS + shadcn/ui (Charts inclus) |
| API | tRPC v11 + TanStack Query |
| ORM | Drizzle ORM |
| Base de données | PostgreSQL 16 |
| Auth | Better Auth + plugin organizations |
| Queue | BullMQ + Redis 7 |
| Scanner | Playwright (Chromium) + axe-core |
| Fichiers | Cloudflare R2 |
| PDF | Playwright print |
| Excel | ExcelJS |
| Emails | Resend |
| Erreurs | Sentry |
| Package manager | pnpm |


## Conventions de code

Ces règles s'appliquent à tout le code du projet. Elles priment sur les habitudes par défaut.

---

### Imports

**Toujours privilégier les imports absolus** via l'alias `@/`. Les imports relatifs sont à éviter sauf pour un fichier strictement voisin dans le même dossier.

```typescript
// ✅ Bon — alias absolu
import { db } from '@/db'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

// ❌ Éviter — relatif qui remonte
import { db } from '../../../db'
import { auth } from '../../lib/auth'

// ✅ Tolérable — voisin direct dans le même dossier
import { columns } from './columns'
```

**Règle pratique** : si l'import contient `../`, il faut le remplacer par `@/`. Un seul `./` vers un fichier du même dossier est acceptable.

**Ordre des imports** dans chaque fichier :
1. Librairies externes (react, next, drizzle…)
2. Imports internes absolus (`@/…`)
3. Imports relatifs (`./…`)
4. Types (séparés si nombreux)

---

### Nommage

Le nom doit révéler l'intention. On doit comprendre ce que fait une chose sans lire son implémentation.

- **Variables et fonctions** : camelCase, descriptif. `auditComplianceRate`, pas `rate` ou `r`.
- **Composants React** : PascalCase. `AuditGrid`, `CriterionRow`.
- **Types et interfaces** : PascalCase. `AuditFinding`, `CreateAuditInput`.
- **Constantes globales** : UPPER_SNAKE_CASE. `MAX_CONCURRENT_SCANS`.
- **Fichiers de composants** : kebab-case. `criterion-row.tsx`, `audit-grid.tsx`.
- **Booléens** : préfixe `is`, `has`, `should`, `can`. `isLoading`, `hasComment`, `canEdit`.

Pas d'abréviations obscures. Pas de noms génériques comme `data`, `info`, `temp`, `handle` seuls. Un nom long et clair vaut mieux qu'un nom court et cryptique.

Éviter les suffixes de type redondants : `users` plutôt que `usersList`, `client` plutôt que `clientObject`.

---

### Fonctions

**Petites.** Une fonction fait une seule chose, à un seul niveau d'abstraction. Si une fonction dépasse ~20-25 lignes, se demander si elle ne fait pas plusieurs choses.

**Peu d'arguments.** Zéro à deux idéalement. Au-delà de trois, passer un objet nommé :

```typescript
// ❌ Trop d'arguments positionnels
function createAudit(name, url, clientId, assignedTo, status) {}

// ✅ Objet nommé
function createAudit(input: CreateAuditInput) {}
```

**Pas d'effets de bord cachés.** Le nom doit refléter tout ce que fait la fonction. Une fonction `getComplianceRate()` ne doit pas modifier la base au passage.

**Early return.** Sortir tôt plutôt que d'imbriquer les conditions :

```typescript
// ✅ Early return, plat
if (!audit) return null
if (audit.status === 'completed') return audit
// suite…

// ❌ Imbrication profonde
if (audit) {
  if (audit.status !== 'completed') {
    // suite…
  }
}
```

---

### Commentaires

Le bon code se documente lui-même. Un commentaire qui explique *ce que* fait le code est souvent le signe que le code n'est pas assez clair — renommer ou extraire plutôt que commenter.

**Commenter le *pourquoi*, jamais le *quoi*.**

```typescript
// ❌ Décrit le quoi (inutile)
// Incrémente le compteur
counter++

// ✅ Explique le pourquoi (utile)
// Le RGAA impose un échantillon minimum de 15 pages, on bloque en dessous
if (pages.length < MIN_SAMPLE_SIZE) throw new Error(...)
```

Pas de code commenté laissé dans les fichiers — Git garde l'historique. Pas de commentaires obsolètes qui contredisent le code.

---

### Structure et organisation

**Colocation.** Garder ensemble ce qui change ensemble. Les composants spécifiques à une page vivent près de cette page, pas dans un dossier global éloigné.

**Server Components par défaut.** N'ajouter `'use client'` que lorsque c'est nécessaire (état, effets, événements navigateur, hooks). Un composant qui ne fait qu'afficher des données reste serveur.

**Une responsabilité par fichier.** Un fichier qui mélange logique métier, accès base et rendu doit être découpé.

**Pas de logique métier dans les composants.** Les calculs (taux de conformité, agrégations) vivent dans des fonctions pures testables, pas dans le JSX. Le composant appelle la fonction, il ne fait pas le calcul.

---

### TypeScript

**`strict` toujours.** Pas de `any` — utiliser `unknown` et affiner si le type est incertain.

**Inférence quand c'est évident, annotation quand ça clarifie.** Ne pas sur-annoter ce que TypeScript devine déjà, mais toujours typer les signatures de fonctions exportées et les retours d'API.

**Les types métier sont définis une fois** (dans le schéma Drizzle via `$inferSelect`) et réutilisés partout. Ne pas redéclarer manuellement un type qui existe déjà.

**Préférer les types union aux énumérations de strings éparpillées :**

```typescript
type AuditStatus = 'in_progress' | 'completed'
```

---

### CSS et styles

**Tokens du design system uniquement.** Jamais de couleur hexadécimale en dur dans un composant. Utiliser les classes sémantiques.

```tsx
// ✅ Token sémantique
<div className="bg-sidebar text-sidebar-foreground">
<Button className="bg-primary">

// ❌ Valeur hardcodée
<div className="bg-[#0F1C2A]">
<div style={{ backgroundColor: '#F0A500' }}>
```

**Tailwind, pas de CSS séparé.** Sauf cas exceptionnel, tout le style passe par les classes utilitaires Tailwind. Pas de fichiers `.css` par composant.

**Composants shadcn comme base.** Ne pas réinventer un bouton, un input, une modale — étendre les composants shadcn existants.

**Classes lisibles.** Pour les longues listes de classes, utiliser `cn()` (l'utilitaire shadcn) et grouper logiquement. Extraire en variantes (`cva`) si un composant a plusieurs états visuels.

**Pas de styles inline** sauf valeur vraiment dynamique calculée au runtime (ex : une largeur de barre de progression en pourcentage).

---

### Gestion des erreurs

**Échouer explicitement.** Ne pas avaler une erreur en silence. Soit on la gère, soit on la laisse remonter.

**Pas de `try/catch` vide.** Si on attrape, on fait quelque chose de l'erreur (log, message utilisateur, fallback).

**Valider les entrées avec Zod** aux frontières de l'application (procédures tRPC, route handlers). Ne pas faire confiance aux données qui viennent du client.

**Messages d'erreur utiles.** Une erreur doit dire ce qui a échoué et idéalement comment corriger, pas juste "Error".

---

### Principe général

Le code est lu bien plus souvent qu'il n'est écrit. Optimiser pour la lecture. Si un choix rend le code plus court mais moins clair, privilégier la clarté.

Quand quelque chose est dupliqué trois fois, le factoriser. Pas avant — une abstraction prématurée coûte plus cher qu'une duplication ponctuelle.

Laisser le code dans un meilleur état qu'on l'a trouvé.
