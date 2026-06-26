/**
 * Ajoute automatiquement « https:// » si l'utilisateur a tapé un domaine nu
 * (ex. « exemple.fr » → « https://exemple.fr »). Retourne une chaîne vide
 * inchangée et respecte les protocoles http:// et https:// déjà présents.
 */
export function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}
