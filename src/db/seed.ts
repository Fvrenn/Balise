import { config } from 'dotenv'
config({ path: '.env.local' })

import { db } from '@/db'
import { member, organization, rgaaCriteria } from '@/db/schema'
import { auth } from '@/lib/auth'

/**
 * Seed RGAA 4.1.2 — Référentiel complet des 106 critères (13 thématiques)
 *
 * Données de référence statiques. À exécuter une seule fois.
 * Idempotent grâce à onConflictDoNothing (relançable sans créer de doublon).
 *
 * Source : docs/RGAA.md — intitulés officiels repris à l’identique.
 *
 * Thématiques :
 *    1. Images                          (1.1 → 1.9)     9 critères
 *    2. Cadres                          (2.1 → 2.2)     2
 *    3. Couleurs                        (3.1 → 3.3)     3
 *    4. Multimédia                      (4.1 → 4.13)   13
 *    5. Tableaux                        (5.1 → 5.8)     8
 *    6. Liens                           (6.1 → 6.2)     2
 *    7. Scripts                         (7.1 → 7.5)     5
 *    8. Éléments obligatoires           (8.1 → 8.10)   10
 *    9. Structuration de l’information  (9.1 → 9.4)     4
 *   10. Présentation de l’information   (10.1 → 10.14) 14
 *   11. Formulaires                     (11.1 → 11.13) 13
 *   12. Navigation                      (12.1 → 12.11) 11
 *   13. Consultation                    (13.1 → 13.12) 12
 */

export const rgaaCriteriaSeed = [
    // ─── Thématique 1 — Images ──────────────────────────────────────────────
    {
        id: '1.1',
        themeId: 1,
        themeName: 'Images',
        title:
            'Chaque image porteuse d’information a-t-elle une alternative textuelle ?',
        sortOrder: 1,
    },
    {
        id: '1.2',
        themeId: 1,
        themeName: 'Images',
        title:
            'Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?',
        sortOrder: 2,
    },
    {
        id: '1.3',
        themeId: 1,
        themeName: 'Images',
        title:
            'Pour chaque image porteuse d’information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?',
        sortOrder: 3,
    },
    {
        id: '1.4',
        themeId: 1,
        themeName: 'Images',
        title:
            'Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d’identifier la nature et la fonction de l’image ?',
        sortOrder: 4,
    },
    {
        id: '1.5',
        themeId: 1,
        themeName: 'Images',
        title:
            'Pour chaque image utilisée comme CAPTCHA, une solution d’accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?',
        sortOrder: 5,
    },
    {
        id: '1.6',
        themeId: 1,
        themeName: 'Images',
        title:
            'Chaque image porteuse d’information a-t-elle, si nécessaire, une description détaillée ?',
        sortOrder: 6,
    },
    {
        id: '1.7',
        themeId: 1,
        themeName: 'Images',
        title:
            'Pour chaque image porteuse d’information ayant une description détaillée, cette description est-elle pertinente ?',
        sortOrder: 7,
    },
    {
        id: '1.8',
        themeId: 1,
        themeName: 'Images',
        title:
            'Chaque image texte porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?',
        sortOrder: 8,
    },
    {
        id: '1.9',
        themeId: 1,
        themeName: 'Images',
        title:
            'Chaque légende d’image est-elle, si nécessaire, correctement reliée à l’image correspondante ?',
        sortOrder: 9,
    },

    // ─── Thématique 2 — Cadres ──────────────────────────────────────────────
    {
        id: '2.1',
        themeId: 2,
        themeName: 'Cadres',
        title: 'Chaque cadre a-t-il un titre de cadre ?',
        sortOrder: 10,
    },
    {
        id: '2.2',
        themeId: 2,
        themeName: 'Cadres',
        title:
            'Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?',
        sortOrder: 11,
    },

    // ─── Thématique 3 — Couleurs ────────────────────────────────────────────
    {
        id: '3.1',
        themeId: 3,
        themeName: 'Couleurs',
        title:
            'Dans chaque page web, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?',
        sortOrder: 12,
    },
    {
        id: '3.2',
        themeId: 3,
        themeName: 'Couleurs',
        title:
            'Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?',
        sortOrder: 13,
    },
    {
        id: '3.3',
        themeId: 3,
        themeName: 'Couleurs',
        title:
            'Dans chaque page web, les couleurs utilisées dans les composants d’interface ou les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées (hors cas particuliers) ?',
        sortOrder: 14,
    },

    // ─── Thématique 4 — Multimédia ──────────────────────────────────────────
    {
        id: '4.1',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription (hors cas particuliers) ?',
        sortOrder: 15,
    },
    {
        id: '4.2',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchronisée, celles-ci sont-elles pertinentes (hors cas particuliers) ?',
        sortOrder: 16,
    },
    {
        id: '4.3',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?',
        sortOrder: 17,
    },
    {
        id: '4.4',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?',
        sortOrder: 18,
    },
    {
        id: '4.5',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée (hors cas particuliers) ?',
        sortOrder: 19,
    },
    {
        id: '4.6',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?',
        sortOrder: 20,
    },
    {
        id: '4.7',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque média temporel est-il clairement identifiable (hors cas particuliers) ?',
        sortOrder: 21,
    },
    {
        id: '4.8',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque média non temporel a-t-il, si nécessaire, une alternative (hors cas particuliers) ?',
        sortOrder: 22,
    },
    {
        id: '4.9',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ?',
        sortOrder: 23,
    },
    {
        id: '4.10',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque son déclenché automatiquement est-il contrôlable par l’utilisateur ?',
        sortOrder: 24,
    },
    {
        id: '4.11',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ?',
        sortOrder: 25,
    },
    {
        id: '4.12',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ?',
        sortOrder: 26,
    },
    {
        id: '4.13',
        themeId: 4,
        themeName: 'Multimédia',
        title:
            'Chaque média temporel et non temporel est-il compatible avec les technologies d’assistance (hors cas particuliers) ?',
        sortOrder: 27,
    },

    // ─── Thématique 5 — Tableaux ────────────────────────────────────────────
    {
        id: '5.1',
        themeId: 5,
        themeName: 'Tableaux',
        title: 'Chaque tableau de données complexe a-t-il un résumé ?',
        sortOrder: 28,
    },
    {
        id: '5.2',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?',
        sortOrder: 29,
    },
    {
        id: '5.3',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?',
        sortOrder: 30,
    },
    {
        id: '5.4',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?',
        sortOrder: 31,
    },
    {
        id: '5.5',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?',
        sortOrder: 32,
    },
    {
        id: '5.6',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?',
        sortOrder: 33,
    },
    {
        id: '5.7',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Pour chaque tableau de données, la technique appropriée permettant d’associer chaque cellule avec ses en-têtes est-elle utilisée (hors cas particuliers) ?',
        sortOrder: 34,
    },
    {
        id: '5.8',
        themeId: 5,
        themeName: 'Tableaux',
        title:
            'Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données. Cette règle est-elle respectée ?',
        sortOrder: 35,
    },

    // ─── Thématique 6 — Liens ───────────────────────────────────────────────
    {
        id: '6.1',
        themeId: 6,
        themeName: 'Liens',
        title: 'Chaque lien est-il explicite (hors cas particuliers) ?',
        sortOrder: 36,
    },
    {
        id: '6.2',
        themeId: 6,
        themeName: 'Liens',
        title: 'Dans chaque page web, chaque lien a-t-il un intitulé ?',
        sortOrder: 37,
    },

    // ─── Thématique 7 — Scripts ─────────────────────────────────────────────
    {
        id: '7.1',
        themeId: 7,
        themeName: 'Scripts',
        title:
            'Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?',
        sortOrder: 38,
    },
    {
        id: '7.2',
        themeId: 7,
        themeName: 'Scripts',
        title:
            'Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?',
        sortOrder: 39,
    },
    {
        id: '7.3',
        themeId: 7,
        themeName: 'Scripts',
        title:
            'Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?',
        sortOrder: 40,
    },
    {
        id: '7.4',
        themeId: 7,
        themeName: 'Scripts',
        title:
            'Pour chaque script qui initie un changement de contexte, l’utilisateur est-il averti ou en a-t-il le contrôle ?',
        sortOrder: 41,
    },
    {
        id: '7.5',
        themeId: 7,
        themeName: 'Scripts',
        title:
            'Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d’assistance ?',
        sortOrder: 42,
    },

    // ─── Thématique 8 — Éléments obligatoires ───────────────────────────────
    {
        id: '8.1',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title: 'Chaque page web est-elle définie par un type de document ?',
        sortOrder: 43,
    },
    {
        id: '8.2',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?',
        sortOrder: 44,
    },
    {
        id: '8.3',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title: 'Dans chaque page web, la langue par défaut est-elle présente ?',
        sortOrder: 45,
    },
    {
        id: '8.4',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?',
        sortOrder: 46,
    },
    {
        id: '8.5',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title: 'Chaque page web a-t-elle un titre de page ?',
        sortOrder: 47,
    },
    {
        id: '8.6',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?',
        sortOrder: 48,
    },
    {
        id: '8.7',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?',
        sortOrder: 49,
    },
    {
        id: '8.8',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ?',
        sortOrder: 50,
    },
    {
        id: '8.9',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?',
        sortOrder: 51,
    },
    {
        id: '8.10',
        themeId: 8,
        themeName: 'Éléments obligatoires',
        title:
            'Dans chaque page web, les changements du sens de lecture sont-ils signalés ?',
        sortOrder: 52,
    },

    // ─── Thématique 9 — Structuration de l’information ──────────────────────
    {
        id: '9.1',
        themeId: 9,
        themeName: 'Structuration de l’information',
        title:
            'Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?',
        sortOrder: 53,
    },
    {
        id: '9.2',
        themeId: 9,
        themeName: 'Structuration de l’information',
        title:
            'Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?',
        sortOrder: 54,
    },
    {
        id: '9.3',
        themeId: 9,
        themeName: 'Structuration de l’information',
        title:
            'Dans chaque page web, chaque liste est-elle correctement structurée ?',
        sortOrder: 55,
    },
    {
        id: '9.4',
        themeId: 9,
        themeName: 'Structuration de l’information',
        title:
            'Dans chaque page web, chaque citation est-elle correctement indiquée ?',
        sortOrder: 56,
    },

    // ─── Thématique 10 — Présentation de l’information ──────────────────────
    {
        id: '10.1',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ?',
        sortOrder: 57,
    },
    {
        id: '10.2',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, le contenu visible porteur d’information reste-t-il présent lorsque les feuilles de styles sont désactivées ?',
        sortOrder: 58,
    },
    {
        id: '10.3',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, l’information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?',
        sortOrder: 59,
    },
    {
        id: '10.4',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200 %, au moins (hors cas particuliers) ?',
        sortOrder: 60,
    },
    {
        id: '10.5',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ?',
        sortOrder: 61,
    },
    {
        id: '10.6',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, chaque lien dont la nature n’est pas évidente est-il visible par rapport au texte environnant ?',
        sortOrder: 62,
    },
    {
        id: '10.7',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?',
        sortOrder: 63,
    },
    {
        id: '10.8',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?',
        sortOrder: 64,
    },
    {
        id: '10.9',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?',
        sortOrder: 65,
    },
    {
        id: '10.10',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, l’information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ?',
        sortOrder: 66,
    },
    {
        id: '10.11',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Pour chaque page web, les contenus peuvent-ils être présentés sans perte d’information ou de fonctionnalité et sans avoir recours soit à un défilement vertical pour une fenêtre ayant une hauteur de 256 px, soit à un défilement horizontal pour une fenêtre ayant une largeur de 320 px (hors cas particuliers) ?',
        sortOrder: 67,
    },
    {
        id: '10.12',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, les propriétés d’espacement du texte peuvent-elles être redéfinies par l’utilisateur sans perte de contenu ou de fonctionnalité (hors cas particuliers) ?',
        sortOrder: 68,
    },
    {
        id: '10.13',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d’un composant d’interface sont-ils contrôlables par l’utilisateur (hors cas particuliers) ?',
        sortOrder: 69,
    },
    {
        id: '10.14',
        themeId: 10,
        themeName: 'Présentation de l’information',
        title:
            'Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ?',
        sortOrder: 70,
    },

    // ─── Thématique 11 — Formulaires ────────────────────────────────────────
    {
        id: '11.1',
        themeId: 11,
        themeName: 'Formulaires',
        title: 'Chaque champ de formulaire a-t-il une étiquette ?',
        sortOrder: 71,
    },
    {
        id: '11.2',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?',
        sortOrder: 72,
    },
    {
        id: '11.3',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?',
        sortOrder: 73,
    },
    {
        id: '11.4',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?',
        sortOrder: 74,
    },
    {
        id: '11.5',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?',
        sortOrder: 75,
    },
    {
        id: '11.6',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?',
        sortOrder: 76,
    },
    {
        id: '11.7',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?',
        sortOrder: 77,
    },
    {
        id: '11.8',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupés de manière pertinente ?',
        sortOrder: 78,
    },
    {
        id: '11.9',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?',
        sortOrder: 79,
    },
    {
        id: '11.10',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?',
        sortOrder: 80,
    },
    {
        id: '11.11',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?',
        sortOrder: 81,
    },
    {
        id: '11.12',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?',
        sortOrder: 82,
    },
    {
        id: '11.13',
        themeId: 11,
        themeName: 'Formulaires',
        title:
            'La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?',
        sortOrder: 83,
    },

    // ─── Thématique 12 — Navigation ─────────────────────────────────────────
    {
        id: '12.1',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins (hors cas particuliers) ?',
        sortOrder: 84,
    },
    {
        id: '12.2',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place (hors cas particuliers) ?',
        sortOrder: 85,
    },
    {
        id: '12.3',
        themeId: 12,
        themeName: 'Navigation',
        title: 'La page « plan du site » est-elle pertinente ?',
        sortOrder: 86,
    },
    {
        id: '12.4',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir d’une fonctionnalité identique ?',
        sortOrder: 87,
    },
    {
        id: '12.5',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de manière identique ?',
        sortOrder: 88,
    },
    {
        id: '12.6',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ?',
        sortOrder: 89,
    },
    {
        id: '12.7',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque page web, un lien d’évitement ou d’accès rapide à la zone de contenu principal est-il présent (hors cas particuliers) ?',
        sortOrder: 90,
    },
    {
        id: '12.8',
        themeId: 12,
        themeName: 'Navigation',
        title: 'Dans chaque page web, l’ordre de tabulation est-il cohérent ?',
        sortOrder: 91,
    },
    {
        id: '12.9',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?',
        sortOrder: 92,
    },
    {
        id: '12.10',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque page web, les raccourcis clavier n’utilisant qu’une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contrôlables par l’utilisateur ?',
        sortOrder: 93,
    },
    {
        id: '12.11',
        themeId: 12,
        themeName: 'Navigation',
        title:
            'Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier ?',
        sortOrder: 94,
    },

    // ─── Thématique 13 — Consultation ───────────────────────────────────────
    {
        id: '13.1',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Pour chaque page web, l’utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu (hors cas particuliers) ?',
        sortOrder: 95,
    },
    {
        id: '13.2',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, l’ouverture d’une nouvelle fenêtre ne doit pas être déclenchée sans action de l’utilisateur. Cette règle est-elle respectée ?',
        sortOrder: 96,
    },
    {
        id: '13.3',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible (hors cas particuliers) ?',
        sortOrder: 97,
    },
    {
        id: '13.4',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?',
        sortOrder: 98,
    },
    {
        id: '13.5',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ?',
        sortOrder: 99,
    },
    {
        id: '13.6',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, pour chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ?',
        sortOrder: 100,
    },
    {
        id: '13.7',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?',
        sortOrder: 101,
    },
    {
        id: '13.8',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l’utilisateur ?',
        sortOrder: 102,
    },
    {
        id: '13.9',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) (hors cas particuliers) ?',
        sortOrder: 103,
    },
    {
        id: '13.10',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, les fonctionnalités utilisables ou disponibles au moyen d’un geste complexe peuvent-elles être également disponibles au moyen d’un geste simple (hors cas particuliers) ?',
        sortOrder: 104,
    },
    {
        id: '13.11',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran peuvent-elles faire l’objet d’une annulation (hors cas particuliers) ?',
        sortOrder: 105,
    },
    {
        id: '13.12',
        themeId: 13,
        themeName: 'Consultation',
        title:
            'Dans chaque page web, les fonctionnalités qui impliquent un mouvement de l’appareil ou vers l’appareil peuvent-elles être satisfaites de manière alternative (hors cas particuliers) ?',
        sortOrder: 106,
    },
]


async function createAdminUser() {
    const { user } = await auth.api.signUpEmail({
        body: {
            email: 'admin@balise.app',
            password: 'changeme123',
            name: 'Admin Balise',
        },
    })
    console.log('✅ Utilisateur admin créé : admin@balise.app')

    // Rattache l'admin à un cabinet. Le membership suffit à l'isolation tRPC :
    // le contexte résout l'organizationId via la première appartenance quand la
    // session n'a pas encore d'organisation active.
    const [cabinet] = await db
        .insert(organization)
        .values({
            id: crypto.randomUUID(),
            name: 'Trialog',
            slug: 'trialog',
            createdAt: new Date(),
        })
        .returning()
    if (!cabinet) {
        throw new Error('Création du cabinet Trialog échouée.')
    }

    await db.insert(member).values({
        id: crypto.randomUUID(),
        organizationId: cabinet.id,
        userId: user.id,
        role: 'owner',
        createdAt: new Date(),
    })
    console.log('✅ Cabinet Trialog créé, admin rattaché en tant qu’owner')
}

export async function seedRgaaCriteria() {
    await db
        .insert(rgaaCriteria)
        .values(rgaaCriteriaSeed)
        .onConflictDoNothing({ target: rgaaCriteria.id })

    console.log(
        `✅ Seed RGAA 4.1.2 : ${rgaaCriteriaSeed.length} critères insérés`,
    )
}

// Permet de lancer directement : pnpm tsx src/db/seed.ts
if (require.main === module) {
    seedRgaaCriteria()
        .then(() => createAdminUser())
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err)
            process.exit(1)
        })
}
