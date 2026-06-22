import {
    pgTable,
    pgEnum,
    text,
    boolean,
    timestamp,
    integer,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const auditStatus = pgEnum('audit_status', [
    'in_progress',
    'pending_review',
    'completed',
])

export const pageType = pgEnum('page_type', [
    'mandatory',   // page obligatoire RGAA (accueil, contact, mentions…)
    'template',    // page gabarit (carrousel, carte, formulaire complexe…)
    'additional',  // page ajoutée manuellement
])

export const findingStatus = pgEnum('finding_status', [
    'pending',         // non encore renseigné
    'conforme',
    'non_conforme',
    'non_applicable',
])

// ─── Better Auth — Core ───────────────────────────────────────────────────────
// Ces tables sont gérées par Better Auth.
// Le schéma doit correspondre exactement à ce qu'il attend.

export const user = pgTable('user', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull(),
    image: text('image'),
    // Statut plateforme Balise, indépendant du système organization de Better
    // Auth. true = admin Balise (hors cabinet) ; jamais positionné via l'UI,
    // uniquement en base ou par script. Voir CLAUDE.md « Modèle d'accès ».
    isAdmin: boolean('is_admin').notNull().default(false),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    activeOrganizationId: text('active_organization_id'),
})

export const account = pgTable('account', {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at'),
    updatedAt: timestamp('updated_at'),
})

// ─── Better Auth — Plugin organizations ───────────────────────────────────────
// Un cabinet = une organization.
// Les champs website et contactEmail sont des extensions Balise.

export const organization = pgTable('organization', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').unique(),
    logo: text('logo'),
    createdAt: timestamp('created_at').notNull(),
    metadata: text('metadata'),
    // Champs supplémentaires — paramètres du cabinet
    website: text('website'),
    contactEmail: text('contact_email'),
})

export const member = pgTable('member', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    role: text('role').notNull(), // 'owner' | 'auditor'
    createdAt: timestamp('created_at').notNull(),
})

export const invitation = pgTable('invitation', {
    id: text('id').primaryKey(),
    organizationId: text('organization_id')
        .notNull()
        .references(() => organization.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    role: text('role'),
    status: text('status').notNull(), // 'pending' | 'accepted' | 'rejected' | 'canceled'
    expiresAt: timestamp('expires_at').notNull(),
    // Requis par Better Auth (modèle invitation du plugin organization).
    createdAt: timestamp('created_at').notNull().defaultNow(),
    inviterId: text('inviter_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
})

// ─── Clients ──────────────────────────────────────────────────────────────────
// Fiches des entreprises auditées par le cabinet.
// Les clients n'ont pas accès à Balise.

export const clients = pgTable(
    'clients',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        organizationId: text('organization_id')
            .notNull()
            .references(() => organization.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        // Description libre du client (ex : « Groupe bancaire, plusieurs filiales »).
        // Le contact n'est plus porté ici : il dépend du site audité, donc de l'audit.
        note: text('note'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => ({
        organizationIdx: index('clients_organization_idx').on(t.organizationId),
    }),
)

// ─── Audits ───────────────────────────────────────────────────────────────────

export const audits = pgTable(
    'audits',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        organizationId: text('organization_id')
            .notNull()
            .references(() => organization.id, { onDelete: 'cascade' }),
        clientId: text('client_id')
            .notNull()
            .references(() => clients.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        siteUrl: text('site_url').notNull(),
        // Référent du site pour cet audit : un client peut suivre plusieurs sites,
        // chacun avec son propre référent, d'où un contact au niveau de l'audit.
        contactName: text('contact_name'),
        contactEmail: text('contact_email'),
        status: auditStatus('status').notNull().default('in_progress'),
        // Taux mis en cache — recalculé à chaque changement de finding
        // Formule : conforme / (106 - non_applicable) * 100
        complianceRate: integer('compliance_rate'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => ({
        organizationIdx: index('audits_organization_idx').on(t.organizationId),
        clientIdx: index('audits_client_idx').on(t.clientId),
    }),
)

// ─── Assignations d'audit ─────────────────────────────────────────────────────
// Liaison plusieurs-à-plusieurs entre un audit et les auditeurs qui le mènent.
// Un audit peut être confié à plusieurs membres du cabinet ; chacun n'y figure
// qu'une fois (index unique). `assignedAt` encode l'ordre d'assignation : le plus
// ancien est le « premier » assigné, de façon stable (cf. routeur audits).

export const auditAssignees = pgTable(
    'audit_assignees',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        auditId: text('audit_id')
            .notNull()
            .references(() => audits.id, { onDelete: 'cascade' }),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        assignedAt: timestamp('assigned_at').notNull().defaultNow(),
    },
    (t) => ({
        // Empêche d'assigner deux fois la même personne au même audit.
        auditUserUnique: uniqueIndex('audit_assignees_audit_user_uidx').on(
            t.auditId,
            t.userId,
        ),
        // « Mes audits » filtre sur le userId ; le composite ci-dessus, préfixé par
        // auditId, ne couvre pas ce filtre, d'où un index dédié.
        userIdx: index('audit_assignees_user_idx').on(t.userId),
    }),
)

// ─── Pages de l'échantillon ───────────────────────────────────────────────────
// Les pages sélectionnées pour cet audit (15 à 25 en pratique).
// Proposées automatiquement par le scan de détection, validées par l'auditrice.

export const auditPages = pgTable(
    'audit_pages',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        auditId: text('audit_id')
            .notNull()
            .references(() => audits.id, { onDelete: 'cascade' }),
        label: text('label').notNull(), // ex: "Accueil", "Gabarit — Carrousel"
        url: text('url').notNull(),
        type: pageType('type').notNull().default('additional'),
        sortOrder: integer('sort_order').notNull().default(0),
    },
    (t) => ({
        auditIdx: index('audit_pages_audit_idx').on(t.auditId),
    }),
)

// ─── Critères RGAA ────────────────────────────────────────────────────────────
// Table statique — 106 lignes, peuplée une seule fois via le seed.
// Ne jamais modifier ces données en cours d'usage.
// Voir : src/server/db/seed-rgaa.ts

export const rgaaCriteria = pgTable(
    'rgaa_criteria',
    {
        id: text('id').primaryKey(), // ex: "1.1", "3.2", "13.12"
        themeId: integer('theme_id').notNull(), // 1 à 13
        themeName: text('theme_name').notNull(), // ex: "Images", "Couleurs"
        title: text('title').notNull(),
        sortOrder: integer('sort_order').notNull(),
    },
    (t) => ({
        themeIdx: index('rgaa_theme_idx').on(t.themeId),
    }),
)

// ─── Findings ─────────────────────────────────────────────────────────────────
// Un finding = le résultat d'un critère dans un audit.
// Créés automatiquement pour les 106 critères à la création de l'audit (status: pending).
// L'auditrice les met à jour au fur et à mesure de son travail.

export const auditFindings = pgTable(
    'audit_findings',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        auditId: text('audit_id')
            .notNull()
            .references(() => audits.id, { onDelete: 'cascade' }),
        criterionId: text('criterion_id')
            .notNull()
            .references(() => rgaaCriteria.id),
        status: findingStatus('status').notNull().default('pending'),
        // Obligatoire quand status = 'non_conforme' (validé côté application, pas en DB)
        comment: text('comment'),
        // IDs des pages de l'échantillon concernées par cette non-conformité
        concernedPageIds: text('concerned_page_ids').array(),
        updatedBy: text('updated_by')
            .references(() => user.id, { onDelete: 'set null' }),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => ({
        auditIdx: index('findings_audit_idx').on(t.auditId),
        criterionIdx: index('findings_criterion_idx').on(t.criterionId),
        // Un seul finding par critère par audit
        auditCriterionUnique: uniqueIndex('findings_audit_criterion_uidx').on(
            t.auditId,
            t.criterionId,
        ),
    }),
)

// ─── Relations ────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    memberships: many(member),
    auditAssignments: many(auditAssignees),
}))

export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation),
    clients: many(clients),
    audits: many(audits),
}))

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id],
    }),
}))

export const clientsRelations = relations(clients, ({ one, many }) => ({
    organization: one(organization, {
        fields: [clients.organizationId],
        references: [organization.id],
    }),
    audits: many(audits),
}))

export const auditsRelations = relations(audits, ({ one, many }) => ({
    organization: one(organization, {
        fields: [audits.organizationId],
        references: [organization.id],
    }),
    client: one(clients, {
        fields: [audits.clientId],
        references: [clients.id],
    }),
    assignees: many(auditAssignees),
    pages: many(auditPages),
    findings: many(auditFindings),
}))

export const auditAssigneesRelations = relations(auditAssignees, ({ one }) => ({
    audit: one(audits, {
        fields: [auditAssignees.auditId],
        references: [audits.id],
    }),
    user: one(user, {
        fields: [auditAssignees.userId],
        references: [user.id],
    }),
}))

export const auditPagesRelations = relations(auditPages, ({ one }) => ({
    audit: one(audits, {
        fields: [auditPages.auditId],
        references: [audits.id],
    }),
}))

export const rgaaCriteriaRelations = relations(rgaaCriteria, ({ many }) => ({
    findings: many(auditFindings),
}))

export const auditFindingsRelations = relations(auditFindings, ({ one }) => ({
    audit: one(audits, {
        fields: [auditFindings.auditId],
        references: [audits.id],
    }),
    criterion: one(rgaaCriteria, {
        fields: [auditFindings.criterionId],
        references: [rgaaCriteria.id],
    }),
    updatedByUser: one(user, {
        fields: [auditFindings.updatedBy],
        references: [user.id],
    }),
}))

// ─── Types inférés ────────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect
export type Organization = typeof organization.$inferSelect
export type Member = typeof member.$inferSelect
export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert
export type Audit = typeof audits.$inferSelect
export type NewAudit = typeof audits.$inferInsert
export type AuditAssignee = typeof auditAssignees.$inferSelect
export type NewAuditAssignee = typeof auditAssignees.$inferInsert
export type AuditPage = typeof auditPages.$inferSelect
export type NewAuditPage = typeof auditPages.$inferInsert
export type RgaaCriterion = typeof rgaaCriteria.$inferSelect
export type AuditFinding = typeof auditFindings.$inferSelect
export type NewAuditFinding = typeof auditFindings.$inferInsert