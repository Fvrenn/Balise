import { z } from 'zod'

// Schémas de champs partagés du cabinet. Source unique pour les procédures qui
// créent (onboarding) ou modifient (settings) un cabinet, afin que les règles et
// les messages restent identiques des deux côtés.

export const cabinetName = z
    .string()
    .trim()
    .min(1, 'Le nom du cabinet est obligatoire.')
    .max(200)

// Champ texte optionnel : « » (vidé par l'utilisateur) est accepté et vaudra null
// en base ; toute autre valeur est normalisée (https:// ajouté si absent) puis
// validée en tant qu'URL — ce qui autorise les domaines nus (ex. « exemple.fr »).
export const optionalWebsite = z
    .string()
    .trim()
    .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
    .pipe(z.string().url('Adresse du site web invalide.').max(2000))
    .or(z.literal(''))
    .optional()

export const optionalContactEmail = z
    .string()
    .trim()
    .email('Email de contact invalide.')
    .max(200)
    .or(z.literal(''))
    .optional()
