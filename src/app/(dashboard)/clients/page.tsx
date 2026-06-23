import { getServerApi } from "@/trpc/server"
import { handleServerError } from "@/lib/server-utils"

import { ClientsView, type ClientsData } from "./clients-view"

// Stats non dérivables de la liste : clients.list agrège le nombre d'audits par
// client mais pas leur répartition par statut. On fetche donc les deux.
async function fetchClientsData(): Promise<ClientsData> {
  const api = await getServerApi()
  const [clients, stats] = await Promise.all([
    api.clients.list(),
    api.clients.stats(),
  ]).catch(handleServerError)
  return { clients, stats }
}

// La page ne bloque pas : elle crée la promesse sans l'attendre et la passe à la
// vue, qui affiche immédiatement recherche/titre et streame les résultats.
export default function ClientsPage() {
  const clientsPromise = fetchClientsData()

  return (
    <div className="mx-12  px-6 py-10">
      <ClientsView clientsPromise={clientsPromise} />
    </div>
  )
}
