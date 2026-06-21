import 'server-only'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Stockage des fichiers sur Cloudflare R2 (API compatible S3). Variables
// d'environnement attendues — tant qu'elles ne sont pas toutes définies, le
// stockage est considéré comme non configuré (cf. isR2Configured), et l'appelant
// doit le signaler plutôt que de tenter un upload voué à échouer.
function readR2Env() {
    return {
        accountId: process.env.R2_ACCOUNT_ID,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        bucket: process.env.R2_BUCKET,
        publicUrl: process.env.R2_PUBLIC_URL,
    }
}

export function isR2Configured(): boolean {
    return Object.values(readR2Env()).every(Boolean)
}

// Téléverse un objet sur R2 et renvoie son URL publique. À n'appeler qu'après
// avoir vérifié isR2Configured() ; lève une erreur explicite sinon.
export async function uploadToR2(input: {
    key: string
    body: Buffer
    contentType: string
}): Promise<string> {
    const { accountId, accessKeyId, secretAccessKey, bucket, publicUrl } =
        readR2Env()
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
        throw new Error('Stockage R2 non configuré : credentials manquants.')
    }

    const client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
    })

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: input.key,
            Body: input.body,
            ContentType: input.contentType,
        }),
    )

    return `${publicUrl.replace(/\/$/, '')}/${input.key}`
}
