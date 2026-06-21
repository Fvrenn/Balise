// Lit un fichier et renvoie sa charge utile base64 (sans le préfixe data:).
// Côté client uniquement (s'appuie sur FileReader). Partagé par les champs qui
// téléversent une image (logo du cabinet en settings comme en onboarding).
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            if (typeof reader.result !== 'string') {
                reject(new Error('Lecture du fichier impossible.'))
                return
            }
            resolve(reader.result.split(',')[1] ?? '')
        }
        reader.onerror = () =>
            reject(reader.error ?? new Error('Lecture du fichier impossible.'))
        reader.readAsDataURL(file)
    })
}
