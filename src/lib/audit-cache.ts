import "server-only"

import { cache } from "react"

import { getServerApi } from "@/trpc/server"

// Sur une page d'audit, getById est invoqué plusieurs fois pendant le même rendu
// serveur : le layout (pour le header) puis la page (pour son contenu). cache() de
// React mémoïse l'appel sur la durée de la requête — getServerApi l'est déjà mais
// pas les appels de procédure tRPC — pour que la requête ne s'exécute qu'une fois
// et que toutes les vues partagent le même résultat.
export const getAuditById = cache(async (auditId: string) => {
  const api = await getServerApi()
  return api.audits.getById({ id: auditId })
})
