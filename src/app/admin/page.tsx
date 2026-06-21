import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { getServerApi } from "@/trpc/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CreateOwnerForm } from "./create-owner-form"

// La garde isAdmin est faite par le layout admin : la page ne rend que pour un
// Admin, elle peut donc interroger admin.listCabinets sans risque de FORBIDDEN.
export default async function AdminPage() {
  const api = await getServerApi()
  const cabinets = await api.admin.listCabinets()

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-10">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Administration Balise
        </h1>
        <p className="text-sm text-muted-foreground">
          Supervision de la plateforme : cabinets et création de comptes Owner.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cabinets</CardTitle>
          <CardDescription>
            {cabinets.length === 0
              ? "Aucun cabinet sur la plateforme."
              : `${cabinets.length} cabinet${
                  cabinets.length > 1 ? "s" : ""
                } sur la plateforme.`}
          </CardDescription>
        </CardHeader>
        {cabinets.length > 0 ? (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="text-right">Membres</TableHead>
                  <TableHead className="text-right">Créé le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabinets.map((cabinet) => (
                  <TableRow key={cabinet.id}>
                    <TableCell className="font-medium text-foreground">
                      {cabinet.name}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {cabinet.memberCount}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {format(cabinet.createdAt, "d MMM yyyy", { locale: fr })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Créer un Owner</CardTitle>
          <CardDescription>
            Le compte est créé sans cabinet. À sa première connexion, l&apos;Owner
            sera invité à créer le sien.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOwnerForm />
        </CardContent>
      </Card>
    </div>
  )
}
