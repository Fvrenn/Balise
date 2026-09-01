import type { SampleDetection } from "@/server/sample-detection"

// Lecture côté interface d'un résultat de détection : ce qui est proposable à
// l'ajout, et ce qui manque. Partagé par la création d'audit (étape 2) et la
// relance depuis l'écran d'échantillon — les deux affichent la même chose.

export interface DetectedCandidate {
  key: string
  label: string
  url: string
  type: "mandatory" | "template"
}

// Une page trouvée devient un candidat ajoutable ; une page obligatoire
// introuvable n'est qu'un avertissement, il n'y a pas d'URL à proposer.
export function toCandidates(detection: SampleDetection): DetectedCandidate[] {
  const found = (
    pages: SampleDetection["mandatory"],
    type: DetectedCandidate["type"],
  ) =>
    pages.flatMap((page) =>
      page.url === null ? [] : [{ key: page.key, label: page.label, url: page.url, type }],
    )

  return [
    ...found(detection.mandatory, "mandatory"),
    ...found(detection.templates, "template"),
  ]
}

// Pages que le RGAA attend dans l'échantillon et que la détection n'a pas
// trouvées : l'auditrice doit les saisir, ou constater qu'elles n'existent pas.
export function missingRequiredLabels(detection: SampleDetection): string[] {
  return detection.mandatory
    .filter((page) => page.isRequired && !page.isFound)
    .map((page) => page.label)
}
