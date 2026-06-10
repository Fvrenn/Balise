import { createAuthClient } from 'better-auth/react'
import { organizationClient } from 'better-auth/client/plugins'

// baseURL omis : le client cible l'origine courante (même domaine que l'app).
// Les plugins client doivent refléter ceux du serveur (auth.ts).
export const authClient = createAuthClient({
    plugins: [organizationClient()],
})

export const { signIn, signUp, signOut, useSession } = authClient
