// Sous-tests RGAA 4.1.2 par critère — données de référence extraites du
// référentiel officiel (docs/RGAA.md), intitulés repris à l'identique.
// Alimente le panneau de détail d'un critère dans la grille d'audit.

export interface RgaaSubTest {
  id: string // ex: "1.1.1"
  title: string
}

export interface RgaaCriterionDetail {
  id: string // ex: "1.1"
  title: string
  subTests: RgaaSubTest[]
}

export const RGAA_CRITERIA_DETAILS: Record<string, RgaaCriterionDetail> = {
  "1.1": {
    id: "1.1",
    title: "Chaque image porteuse d’information a-t-elle une alternative textuelle ?",
    subTests: [
      { id: "1.1.1", title: "Chaque image (balise <img> ou balise possédant l’attribut WAI-ARIA role=\"img\") porteuse d’information a-t-elle une alternative textuelle ?" },
      { id: "1.1.2", title: "Chaque zone d’une image réactive (balise <area>) porteuse d’information a-t-elle une alternative textuelle ?" },
      { id: "1.1.3", title: "Chaque bouton de type image (balise <input> avec l’attribut type=\"image\") a-t-il une alternative textuelle ?" },
      { id: "1.1.4", title: "Chaque zone cliquable d’une image réactive côté serveur est-elle doublée d’un mécanisme utilisable quel que soit le dispositif de pointage utilisé et permettant d’accéder à la même destination ?" },
      { id: "1.1.5", title: "Chaque image vectorielle (balise <svg>) porteuse d’information, vérifie-t-elle ces conditions ?" },
      { id: "1.1.6", title: "Chaque image objet (balise <object> avec l’attribut type=\"image/…\") porteuse d’information, vérifie-t-elle une de ces conditions ?" },
      { id: "1.1.7", title: "Chaque image embarquée (balise <embed> avec l’attribut type=\"image/…\") porteuse d’information, vérifie-t-elle une de ces conditions ?" },
      { id: "1.1.8", title: "Chaque image bitmap (balise <canvas>) porteuse d’information, vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "1.2": {
    id: "1.2",
    title: "Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?",
    subTests: [
      { id: "1.2.1", title: "Chaque image (balise <img>) de décoration, sans légende, vérifie-t-elle une de ces conditions ?" },
      { id: "1.2.2", title: "Chaque zone non cliquable (balise <area> sans attribut href) de décoration, vérifie-t-elle une de ces conditions ?" },
      { id: "1.2.3", title: "Chaque image objet (balise <object> avec l’attribut type=\"image/…\") de décoration, sans légende, vérifie-t-elle ces conditions ?" },
      { id: "1.2.4", title: "Chaque image vectorielle (balise <svg>) de décoration, sans légende, vérifie-t-elle ces conditions ?" },
      { id: "1.2.5", title: "Chaque image bitmap (balise <canvas>) de décoration, sans légende, vérifie-t-elle ces conditions ?" },
      { id: "1.2.6", title: "Chaque image embarquée (balise <embed> avec l’attribut type=\"image/…\") de décoration, sans légende, vérifie-t-elle ces conditions ?" },
    ],
  },
  "1.3": {
    id: "1.3",
    title: "Pour chaque image porteuse d’information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?",
    subTests: [
      { id: "1.3.1", title: "Chaque image (balise <img> ou balise possédant l’attribut WAI-ARIA role=\"img\") porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.2", title: "Pour chaque zone (balise <area>) d’une image réactive porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.3", title: "Pour chaque bouton de type image (balise <input> avec l’attribut type=\"image\"), ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.4", title: "Pour chaque image objet (balise <object> avec l’attribut type=\"image/…\") porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.5", title: "Pour chaque image embarquée (balise <embed> avec l’attribut type=\"image/…\") porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.6", title: "Pour chaque image vectorielle (balise <svg>) porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.7", title: "Pour chaque image bitmap (balise <canvas>) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?" },
      { id: "1.3.8", title: "Pour chaque image bitmap (balise <canvas>) porteuse d’information et ayant un contenu alternatif entre <canvas> et </canvas>, ce contenu alternatif est-il correctement restitué par les technologies d’assistance ?" },
      { id: "1.3.9", title: "Pour chaque image porteuse d’information et ayant une alternative textuelle, l’alternative textuelle est-elle courte et concise (hors cas particuliers) ?" },
    ],
  },
  "1.4": {
    id: "1.4",
    title: "Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d’identifier la nature et la fonction de l’image ?",
    subTests: [
      { id: "1.4.1", title: "Pour chaque image (balise <img>) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?" },
      { id: "1.4.2", title: "Pour chaque zone (balise <area>) d’une image réactive utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?" },
      { id: "1.4.3", title: "Pour chaque bouton de type image (balise <input> avec l’attribut type=\"image\") utilisé comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?" },
      { id: "1.4.4", title: "Pour chaque image objet (balise <object> avec l’attribut type=\"image/…\") utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?" },
      { id: "1.4.5", title: "Pour chaque image embarquée (balise <embed> avec l’attribut type=\"image/…\") utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?" },
      { id: "1.4.6", title: "Pour chaque image vectorielle (balise <svg>) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?" },
      { id: "1.4.7", title: "Pour chaque image bitmap (balise <canvas>) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?" },
    ],
  },
  "1.5": {
    id: "1.5",
    title: "Pour chaque image utilisée comme CAPTCHA, une solution d’accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?",
    subTests: [
      { id: "1.5.1", title: "Chaque image (balises <img>, <area>, <object>, <embed>, <svg>, <canvas> ou possédant un attribut WAI-ARIA role=\"img\") utilisée comme CAPTCHA vérifie-t-elle une de ces conditions ?" },
      { id: "1.5.2", title: "Chaque bouton associé à une image (balise input avec l’attribut type=\"image\") utilisée comme CAPTCHA vérifie-t-il une de ces conditions ?" },
    ],
  },
  "1.6": {
    id: "1.6",
    title: "Chaque image porteuse d’information a-t-elle, si nécessaire, une description détaillée ?",
    subTests: [
      { id: "1.6.1", title: "Chaque image (balise <img>) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?" },
      { id: "1.6.2", title: "Chaque image objet (balise <object> avec l’attribut type=\"image/…\") porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?" },
      { id: "1.6.3", title: "Chaque image embarquée (balise <embed>) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?" },
      { id: "1.6.4", title: "Chaque bouton de type image (balise <input> avec l’attribut type=\"image\") porteur d’information, qui nécessite une description détaillée, vérifie-t-il une de ces conditions ?" },
      { id: "1.6.5", title: "Chaque image vectorielle (balise <svg>) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?" },
      { id: "1.6.6", title: "Pour chaque image vectorielle (balise <svg>) porteuse d’information, ayant une description détaillée, la référence éventuelle à la description détaillée dans l’attribut WAI-ARIA aria-label et la description détaillée associée par l’attribut WAI-ARIA aria-labelledby ou aria-describedby sont-elles correctement restituées par les technologies d’assistance ?" },
      { id: "1.6.7", title: "Chaque image bitmap (balise <canvas>), porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?" },
      { id: "1.6.8", title: "Pour chaque image bitmap (balise <canvas>) porteuse d’information, qui implémente une référence à une description détaillée adjacente, cette référence est-elle correctement restituée par les technologies d’assistance ?" },
      { id: "1.6.9", title: "Pour chaque image (balise <img>, <input> avec l’attribut type=\"image\", <area>, <object>, <embed>, <svg>, <canvas>, ou possédant un attribut WAI-ARIA role=\"img\") porteuse d’information, qui est accompagnée d’une description détaillée et qui utilise un attribut WAI-ARIA aria-describedby, l’attribut WAI-ARIA aria-describedby associe-t-il la description détaillée ?" },
      { id: "1.6.10", title: "Chaque balise possédant un attribut WAI-ARIA role=\"img\" porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "1.7": {
    id: "1.7",
    title: "Pour chaque image porteuse d’information ayant une description détaillée, cette description est-elle pertinente ?",
    subTests: [
      { id: "1.7.1", title: "Chaque image (balise <img>) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?" },
      { id: "1.7.2", title: "Chaque bouton de type image (balise <input> avec l’attribut type=\"image\") porteur d’information, ayant une description détaillée, vérifie-t-il ces conditions ?" },
      { id: "1.7.3", title: "Chaque image objet (balise <object> avec l’attribut type=\"image/…\") porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?" },
      { id: "1.7.4", title: "Chaque image embarquée (balise <embed> avec l’attribut type=\"image/…\") porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?" },
      { id: "1.7.5", title: "Chaque image vectorielle (balise <svg>) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?" },
      { id: "1.7.6", title: "Chaque image bitmap (balise <canvas>) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?" },
    ],
  },
  "1.8": {
    id: "1.8",
    title: "Chaque image texte porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?",
    subTests: [
      { id: "1.8.1", title: "Chaque image texte (balise <img> ou possédant un attribut WAI-ARIA role=\"img\") porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?" },
      { id: "1.8.2", title: "Chaque bouton « image texte » (balise <input> avec l’attribut type=\"image\") porteur d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacé par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?" },
      { id: "1.8.3", title: "Chaque image texte objet (balise <object> avec l’attribut type=\"image/…\") porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?" },
      { id: "1.8.4", title: "Chaque image texte embarquée (balise <embed> avec l’attribut type=\"image/…\") porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?" },
      { id: "1.8.5", title: "Chaque image texte bitmap (balise <canvas>) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?" },
      { id: "1.8.6", title: "Chaque image texte SVG (balise <svg>) porteuse d’information et dont le texte n’est pas complètement structuré au moyen d’éléments <text>, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?" },
    ],
  },
  "1.9": {
    id: "1.9",
    title: "Chaque légende d’image est-elle, si nécessaire, correctement reliée à l’image correspondante ?",
    subTests: [
      { id: "1.9.1", title: "Chaque image pourvue d’une légende (balise <img>, <input> avec l’attribut type=\"image\" ou possédant un attribut WAI-ARIA role=\"img\" associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?" },
      { id: "1.9.2", title: "Chaque image objet pourvue d’une légende (balise <object> avec l’attribut type=\"image/…\" associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?" },
      { id: "1.9.3", title: "Chaque image embarquée pourvue d’une légende (balise <embed> associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?" },
      { id: "1.9.4", title: "Chaque image vectorielle pourvue d’une légende (balise <svg> associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?" },
      { id: "1.9.5", title: "Chaque image bitmap pourvue d’une légende (balise <canvas> associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?" },
    ],
  },
  "2.1": {
    id: "2.1",
    title: "Chaque cadre a-t-il un titre de cadre ?",
    subTests: [
      { id: "2.1.1", title: "Chaque cadre (balise <iframe> ou <frame>) a-t-il un attribut title ?" },
    ],
  },
  "2.2": {
    id: "2.2",
    title: "Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?",
    subTests: [
      { id: "2.2.1", title: "Pour chaque cadre (balise <iframe> ou <frame>) ayant un attribut title, le contenu de cet attribut est-il pertinent ?" },
    ],
  },
  "3.1": {
    id: "3.1",
    title: "Dans chaque page web, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?",
    subTests: [
      { id: "3.1.1", title: "Pour chaque mot ou ensemble de mots dont la mise en couleur est porteuse d’information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
      { id: "3.1.2", title: "Pour chaque indication de couleur donnée par un texte, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
      { id: "3.1.3", title: "Pour chaque image véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
      { id: "3.1.4", title: "Pour chaque propriété CSS déterminant une couleur et véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
      { id: "3.1.5", title: "Pour chaque média temporel véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
      { id: "3.1.6", title: "Pour chaque média non temporel véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?" },
    ],
  },
  "3.2": {
    id: "3.2",
    title: "Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?",
    subTests: [
      { id: "3.2.1", title: "Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions (hors cas particuliers) ?" },
      { id: "3.2.2", title: "Dans chaque page web, le texte et le texte en image en gras d’une taille restituée inférieure à 18,5px vérifient-ils une de ces conditions (hors cas particuliers) ?" },
      { id: "3.2.3", title: "Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée supérieure ou égale à 24px vérifient-ils une de ces conditions (hors cas particuliers) ?" },
      { id: "3.2.4", title: "Dans chaque page web, le texte et le texte en image en gras d’une taille restituée supérieure ou égale à 18,5px vérifient-ils une de ces conditions (hors cas particuliers) ?" },
      { id: "3.2.5", title: "Dans le mécanisme qui permet d’afficher un rapport de contraste conforme, le rapport de contraste entre le texte et la couleur d’arrière-plan est-il suffisamment élevé ?" },
    ],
  },
  "3.3": {
    id: "3.3",
    title: "Dans chaque page web, les couleurs utilisées dans les composants d’interface ou les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées (hors cas particuliers) ?",
    subTests: [
      { id: "3.3.1", title: "Dans chaque page web, le rapport de contraste entre les couleurs d’un composant d’interface dans ses différents états et la couleur d’arrière-plan contiguë vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "3.3.2", title: "Dans chaque page web, le rapport de contraste des différentes couleurs composant un élément graphique, lorsqu’elles sont nécessaires à sa compréhension, et la couleur d’arrière-plan contiguë, vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "3.3.3", title: "Dans chaque page web, le rapport de contraste des différentes couleurs contiguës entre elles d’un élément graphique, lorsqu’elles sont nécessaires à sa compréhension, vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "3.3.4", title: "Dans le mécanisme qui permet d’afficher un rapport de contraste conforme, les couleurs du composant ou des éléments graphiques porteurs d’informations qui le composent, sont-elles suffisamment contrastées ?" },
    ],
  },
  "4.1": {
    id: "4.1",
    title: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription (hors cas particuliers) ?",
    subTests: [
      { id: "4.1.1", title: "Chaque média temporel pré-enregistré seulement audio, vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?" },
      { id: "4.1.2", title: "Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?" },
      { id: "4.1.3", title: "Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "4.2": {
    id: "4.2",
    title: "Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchronisée, celles-ci sont-elles pertinentes (hors cas particuliers) ?",
    subTests: [
      { id: "4.2.1", title: "Pour chaque média temporel pré-enregistré seulement audio, ayant une transcription textuelle, celle-ci est-elle pertinente (hors cas particuliers) ?" },
      { id: "4.2.2", title: "Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "4.2.3", title: "Chaque média temporel synchronisé pré-enregistré vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "4.3": {
    id: "4.3",
    title: "Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?",
    subTests: [
      { id: "4.3.1", title: "Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?" },
      { id: "4.3.2", title: "Pour chaque média temporel synchronisé pré-enregistré possédant des sous-titres synchronisés diffusés via une balise <track>, la balise <track> possède-t-elle un attribut kind=\"captions\" ?" },
    ],
  },
  "4.4": {
    id: "4.4",
    title: "Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?",
    subTests: [
      { id: "4.4.1", title: "Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?" },
    ],
  },
  "4.5": {
    id: "4.5",
    title: "Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée (hors cas particuliers) ?",
    subTests: [
      { id: "4.5.1", title: "Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?" },
      { id: "4.5.2", title: "Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "4.6": {
    id: "4.6",
    title: "Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?",
    subTests: [
      { id: "4.6.1", title: "Pour chaque média temporel pré-enregistré seulement vidéo ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?" },
      { id: "4.6.2", title: "Pour chaque média temporel synchronisé ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?" },
    ],
  },
  "4.7": {
    id: "4.7",
    title: "Chaque média temporel est-il clairement identifiable (hors cas particuliers) ?",
    subTests: [
      { id: "4.7.1", title: "Pour chaque média temporel seulement son, seulement vidéo ou synchronisé, le contenu textuel adjacent permet-il d’identifier clairement le média temporel (hors cas particuliers) ?" },
    ],
  },
  "4.8": {
    id: "4.8",
    title: "Chaque média non temporel a-t-il, si nécessaire, une alternative (hors cas particuliers) ?",
    subTests: [
      { id: "4.8.1", title: "Chaque média non temporel vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?" },
      { id: "4.8.2", title: "Chaque média non temporel associé à une alternative vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "4.9": {
    id: "4.9",
    title: "Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ?",
    subTests: [
      { id: "4.9.1", title: "Pour chaque média non temporel ayant une alternative, cette alternative permet-elle d’accéder au même contenu et à des fonctionnalités similaires ?" },
    ],
  },
  "4.10": {
    id: "4.10",
    title: "Chaque son déclenché automatiquement est-il contrôlable par l’utilisateur ?",
    subTests: [
      { id: "4.10.1", title: "Chaque séquence sonore déclenchée automatiquement via une balise <object>, <video>, <audio>, <embed>, <bgsound> ou un code JavaScript vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "4.11": {
    id: "4.11",
    title: "La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ?",
    subTests: [
      { id: "4.11.1", title: "Chaque média temporel a-t-il, si nécessaire, les fonctionnalités de contrôle de sa consultation ?" },
      { id: "4.11.2", title: "Pour chaque média temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?" },
      { id: "4.11.3", title: "Pour chaque média temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "4.12": {
    id: "4.12",
    title: "La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ?",
    subTests: [
      { id: "4.12.1", title: "Pour chaque média non temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?" },
      { id: "4.12.2", title: "Pour chaque média non temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "4.13": {
    id: "4.13",
    title: "Chaque média temporel et non temporel est-il compatible avec les technologies d’assistance (hors cas particuliers) ?",
    subTests: [
      { id: "4.13.1", title: "Chaque média temporel et non temporel vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "4.13.2", title: "Chaque média temporel et non temporel qui possède une alternative compatible avec les technologies d’assistance, vérifie-t-il une de ces conditions ?" },
    ],
  },
  "5.1": {
    id: "5.1",
    title: "Chaque tableau de données complexe a-t-il un résumé ?",
    subTests: [
      { id: "5.1.1", title: "Pour chaque tableau de données complexe, un résumé est-il disponible ?" },
    ],
  },
  "5.2": {
    id: "5.2",
    title: "Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?",
    subTests: [
      { id: "5.2.1", title: "Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?" },
    ],
  },
  "5.3": {
    id: "5.3",
    title: "Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?",
    subTests: [
      { id: "5.3.1", title: "Chaque tableau de mise en forme vérifie-t-il ces conditions ?" },
    ],
  },
  "5.4": {
    id: "5.4",
    title: "Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?",
    subTests: [
      { id: "5.4.1", title: "Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?" },
    ],
  },
  "5.5": {
    id: "5.5",
    title: "Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?",
    subTests: [
      { id: "5.5.1", title: "Pour chaque tableau de données ayant un titre, ce titre permet-il d’identifier le contenu du tableau de données de manière claire et concise ?" },
    ],
  },
  "5.6": {
    id: "5.6",
    title: "Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?",
    subTests: [
      { id: "5.6.1", title: "Pour chaque tableau de données, chaque en-tête de colonne s’appliquant à la totalité de la colonne vérifie-t-il une de ces conditions ?" },
      { id: "5.6.2", title: "Pour chaque tableau de données, chaque en-tête de ligne s’appliquant à la totalité de la ligne vérifie-t-il une de ces conditions ?" },
      { id: "5.6.3", title: "Pour chaque tableau de données, chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne est-il structuré au moyen d’une balise <th> ?" },
      { id: "5.6.4", title: "Pour chaque tableau de données, chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise <td> ou <th> ?" },
    ],
  },
  "5.7": {
    id: "5.7",
    title: "Pour chaque tableau de données, la technique appropriée permettant d’associer chaque cellule avec ses en-têtes est-elle utilisée (hors cas particuliers) ?",
    subTests: [
      { id: "5.7.1", title: "Pour chaque contenu de balise <th> s’appliquant à la totalité de la ligne ou de la colonne, la balise <th> respecte-t-elle une de ces conditions (hors cas particuliers) ?" },
      { id: "5.7.2", title: "Pour chaque contenu de balise <th> s’appliquant à la totalité de la ligne ou de la colonne et possédant un attribut scope, la balise <th> vérifie-t-elle une de ces conditions ?" },
      { id: "5.7.3", title: "Pour chaque contenu de balise <th> ne s’appliquant pas à la totalité de la ligne ou de la colonne, la balise <th> vérifie-t-elle ces conditions ?" },
      { id: "5.7.4", title: "Pour chaque contenu de balise <td> ou <th> associée à un ou plusieurs en-têtes possédant un attribut id, la balise vérifie-t-elle ces conditions ?" },
      { id: "5.7.5", title: "Pour chaque balise pourvue d’un attribut WAI-ARIA role=\"rowheader\" ou role=\"columnheader\" dont le contenu s’applique à la totalité de la ligne ou de la colonne, la balise vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "5.8": {
    id: "5.8",
    title: "Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données. Cette règle est-elle respectée ?",
    subTests: [
      { id: "5.8.1", title: "Chaque tableau de mise en forme (balise <table>) vérifie-t-il ces conditions ?" },
    ],
  },
  "6.1": {
    id: "6.1",
    title: "Chaque lien est-il explicite (hors cas particuliers) ?",
    subTests: [
      { id: "6.1.1", title: "Chaque lien texte vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "6.1.2", title: "Chaque lien image vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "6.1.3", title: "Chaque lien composite vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "6.1.4", title: "Chaque lien SVG vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "6.1.5", title: "Pour chaque lien ayant un intitulé visible, le nom accessible du lien contient-il au moins l’intitulé visible (hors cas particuliers) ?" },
    ],
  },
  "6.2": {
    id: "6.2",
    title: "Dans chaque page web, chaque lien a-t-il un intitulé ?",
    subTests: [
      { id: "6.2.1", title: "Dans chaque page web, chaque lien a-t-il un intitulé entre <a> et </a> ?" },
    ],
  },
  "7.1": {
    id: "7.1",
    title: "Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?",
    subTests: [
      { id: "7.1.1", title: "Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il, si nécessaire, une de ces conditions ?" },
      { id: "7.1.2", title: "Chaque script qui génère ou contrôle un composant d’interface respecte-t-il une de ces conditions ?" },
      { id: "7.1.3", title: "Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il ces conditions (hors cas particuliers) ?" },
    ],
  },
  "7.2": {
    id: "7.2",
    title: "Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?",
    subTests: [
      { id: "7.2.1", title: "Chaque script débutant par la balise <script> et ayant une alternative vérifie-t-il une de ces conditions ?" },
      { id: "7.2.2", title: "Chaque élément non textuel mis à jour par un script (dans la page, ou dans un cadre) et ayant une alternative vérifie-t-il ces conditions ?" },
    ],
  },
  "7.3": {
    id: "7.3",
    title: "Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?",
    subTests: [
      { id: "7.3.1", title: "Chaque élément possédant un gestionnaire d’événement contrôlé par un script vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "7.3.2", title: "Un script ne doit pas supprimer le focus d’un élément qui le reçoit. Cette règle est-elle respectée (hors cas particuliers) ?" },
    ],
  },
  "7.4": {
    id: "7.4",
    title: "Pour chaque script qui initie un changement de contexte, l’utilisateur est-il averti ou en a-t-il le contrôle ?",
    subTests: [
      { id: "7.4.1", title: "Chaque script qui initie un changement de contexte vérifie-t-il une de ces conditions ?" },
    ],
  },
  "7.5": {
    id: "7.5",
    title: "Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d’assistance ?",
    subTests: [
      { id: "7.5.1", title: "Chaque message de statut qui informe de la réussite, du résultat d’une action ou bien de l’état d’une application utilise-t-il l’attribut WAI-ARIA role=\"status\" ?" },
      { id: "7.5.2", title: "Chaque message de statut qui présente une suggestion, ou avertit de l’existence d’une erreur utilise-t-il l’attribut WAI-ARIA role=\"alert\" ?" },
      { id: "7.5.3", title: "Chaque message de statut qui indique la progression d’un processus utilise-t-il l’un des attributs WAI-ARIA role=\"log\", role=\"progressbar\" ou role=\"status\" ?" },
    ],
  },
  "8.1": {
    id: "8.1",
    title: "Chaque page web est-elle définie par un type de document ?",
    subTests: [
      { id: "8.1.1", title: "Pour chaque page web, le type de document (balise doctype) est-il présent ?" },
      { id: "8.1.2", title: "Pour chaque page web, le type de document (balise doctype) est-il valide ?" },
      { id: "8.1.3", title: "Pour chaque page web possédant une déclaration de type de document, celle-ci est-elle située avant la balise <html> dans le code source ?" },
    ],
  },
  "8.2": {
    id: "8.2",
    title: "Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?",
    subTests: [
      { id: "8.2.1", title: "Pour chaque déclaration de type de document, le code source généré de la page vérifie-t-il ces conditions ?" },
    ],
  },
  "8.3": {
    id: "8.3",
    title: "Dans chaque page web, la langue par défaut est-elle présente ?",
    subTests: [
      { id: "8.3.1", title: "Pour chaque page web, l’indication de langue par défaut vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "8.4": {
    id: "8.4",
    title: "Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?",
    subTests: [
      { id: "8.4.1", title: "Pour chaque page web ayant une langue par défaut, le code de langue vérifie-t-il ces conditions ?" },
    ],
  },
  "8.5": {
    id: "8.5",
    title: "Chaque page web a-t-elle un titre de page ?",
    subTests: [
      { id: "8.5.1", title: "Chaque page web a-t-elle un titre de page (balise <title>) ?" },
    ],
  },
  "8.6": {
    id: "8.6",
    title: "Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?",
    subTests: [
      { id: "8.6.1", title: "Pour chaque page web ayant un titre de page (balise <title>), le contenu de cette balise est-il pertinent ?" },
    ],
  },
  "8.7": {
    id: "8.7",
    title: "Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?",
    subTests: [
      { id: "8.7.1", title: "Dans chaque page web, chaque texte écrit dans une langue différente de la langue par défaut vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "8.8": {
    id: "8.8",
    title: "Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ?",
    subTests: [
      { id: "8.8.1", title: "Pour chaque page web, le code de langue de chaque changement de langue vérifie-t-il ces conditions ?" },
    ],
  },
  "8.9": {
    id: "8.9",
    title: "Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?",
    subTests: [
      { id: "8.9.1", title: "Dans chaque page web les balises (à l’exception de <div>, <span> et <table>) ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?" },
    ],
  },
  "8.10": {
    id: "8.10",
    title: "Dans chaque page web, les changements du sens de lecture sont-ils signalés ?",
    subTests: [
      { id: "8.10.1", title: "Dans chaque page web, chaque texte dont le sens de lecture est différent du sens de lecture par défaut est contenu dans une balise possédant un attribut dir ?" },
      { id: "8.10.2", title: "Dans chaque page web, chaque changement du sens de lecture (attribut dir) vérifie-t-il ces conditions ?" },
    ],
  },
  "9.1": {
    id: "9.1",
    title: "Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?",
    subTests: [
      { id: "9.1.1", title: "Dans chaque page web, la hiérarchie entre les titres (balise <hx> ou balise possédant un attribut WAI-ARIA role=\"heading\" associé à un attribut WAI-ARIA aria-level) est-elle pertinente ?" },
      { id: "9.1.2", title: "Dans chaque page web, le contenu de chaque titre (balise <hx> ou balise possédant un attribut WAI-ARIA role=\"heading\" associé à un attribut WAI-ARIA aria-level) est-il pertinent ?" },
      { id: "9.1.3", title: "Dans chaque page web, chaque passage de texte constituant un titre est-il structuré à l’aide d’une balise <hx> ou d’une balise possédant un attribut WAI-ARIA role=\"heading\" associé à un attribut WAI-ARIA aria-level ?" },
    ],
  },
  "9.2": {
    id: "9.2",
    title: "Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?",
    subTests: [
      { id: "9.2.1", title: "Dans chaque page web, la structure du document vérifie-t-elle ces conditions (hors cas particuliers) ?" },
    ],
  },
  "9.3": {
    id: "9.3",
    title: "Dans chaque page web, chaque liste est-elle correctement structurée ?",
    subTests: [
      { id: "9.3.1", title: "Dans chaque page web, les informations regroupées visuellement sous forme de liste non ordonnée vérifient-elles une de ces conditions ?" },
      { id: "9.3.2", title: "Dans chaque page web, les informations regroupées visuellement sous forme de liste ordonnée vérifient-elles une de ces conditions ?" },
      { id: "9.3.3", title: "Dans chaque page web, les informations regroupées sous forme de liste de description utilisent-elles les balises <dl> et <dt>/<dd> ?" },
    ],
  },
  "9.4": {
    id: "9.4",
    title: "Dans chaque page web, chaque citation est-elle correctement indiquée ?",
    subTests: [
      { id: "9.4.1", title: "Dans chaque page web, chaque citation courte utilise-t-elle une balise <q> ?" },
      { id: "9.4.2", title: "Dans chaque page web, chaque bloc de citation utilise-t-il une balise <blockquote> ?" },
    ],
  },
  "10.1": {
    id: "10.1",
    title: "Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ?",
    subTests: [
      { id: "10.1.1", title: "Dans chaque page web, les balises servant à la présentation de l’information ne doivent pas être présentes dans le code source généré des pages. Cette règle est-elle respectée ?" },
      { id: "10.1.2", title: "Dans chaque page web, les attributs servant à la présentation de l’information ne doivent pas être présents dans le code source généré des pages. Cette règle est-elle respectée ?" },
      { id: "10.1.3", title: "Dans chaque page web, l’utilisation des espaces vérifie-t-elle ces conditions ?" },
    ],
  },
  "10.2": {
    id: "10.2",
    title: "Dans chaque page web, le contenu visible porteur d’information reste-t-il présent lorsque les feuilles de styles sont désactivées ?",
    subTests: [
      { id: "10.2.1", title: "Dans chaque page web, l’information reste-t-elle présente lorsque les feuilles de styles sont désactivées ?" },
    ],
  },
  "10.3": {
    id: "10.3",
    title: "Dans chaque page web, l’information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?",
    subTests: [
      { id: "10.3.1", title: "Dans chaque page web, l’information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?" },
    ],
  },
  "10.4": {
    id: "10.4",
    title: "Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200 %, au moins (hors cas particuliers) ?",
    subTests: [
      { id: "10.4.1", title: "Dans chaque page web, l’augmentation de la taille des caractères jusqu’à 200 %, au moins, ne doit pas provoquer de perte d’information. Cette règle est-elle respectée selon une de ces conditions (hors cas particuliers) ?" },
      { id: "10.4.2", title: "Dans chaque page web, l’augmentation de la taille des caractères jusqu’à 200 %, au moins, doit être possible pour l’ensemble du texte dans la page. Cette règle est-elle respectée selon une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "10.5": {
    id: "10.5",
    title: "Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ?",
    subTests: [
      { id: "10.5.1", title: "Dans chaque page web, chaque déclaration CSS de couleurs de police (color), d’un élément susceptible de contenir du texte, est-elle accompagnée d’une déclaration de couleur de fond (background, background-color), au moins, héritée d’un parent ?" },
      { id: "10.5.2", title: "Dans chaque page web, chaque déclaration de couleur de fond (background, background-color), d’un élément susceptible de contenir du texte, est-elle accompagnée d’une déclaration de couleur de police (color) au moins, héritée d’un parent ?" },
      { id: "10.5.3", title: "Dans chaque page web, chaque utilisation d’une image pour créer une couleur de fond d’un élément susceptible de contenir du texte, via CSS (background, background-image), est-elle accompagnée d’une déclaration de couleur de fond (background, background-color), au moins, héritée d’un parent ?" },
    ],
  },
  "10.6": {
    id: "10.6",
    title: "Dans chaque page web, chaque lien dont la nature n’est pas évidente est-il visible par rapport au texte environnant ?",
    subTests: [
      { id: "10.6.1", title: "Dans chaque page web, chaque lien texte signalé uniquement par la couleur, et dont la nature n’est pas évidente, vérifie-t-il ces conditions ?" },
    ],
  },
  "10.7": {
    id: "10.7",
    title: "Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?",
    subTests: [
      { id: "10.7.1", title: "Pour chaque élément recevant le focus, la prise de focus vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "10.8": {
    id: "10.8",
    title: "Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?",
    subTests: [
      { id: "10.8.1", title: "Dans chaque page web, chaque contenu caché vérifie-t-il une de ces conditions ?" },
    ],
  },
  "10.9": {
    id: "10.9",
    title: "Dans chaque page web, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?",
    subTests: [
      { id: "10.9.1", title: "Dans chaque page web, pour chaque texte ou ensemble de textes, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?" },
      { id: "10.9.2", title: "Dans chaque page web, pour chaque image ou ensemble d’images, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?" },
      { id: "10.9.3", title: "Dans chaque page web, pour chaque média temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?" },
      { id: "10.9.4", title: "Dans chaque page web, pour chaque média non temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?" },
    ],
  },
  "10.10": {
    id: "10.10",
    title: "Dans chaque page web, l’information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ?",
    subTests: [
      { id: "10.10.1", title: "Dans chaque page web, pour chaque texte ou ensemble de textes, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?" },
      { id: "10.10.2", title: "Dans chaque page web, pour chaque image ou ensemble d’images, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?" },
      { id: "10.10.3", title: "Dans chaque page web, pour chaque média temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?" },
      { id: "10.10.4", title: "Dans chaque page web, pour chaque média non temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?" },
    ],
  },
  "10.11": {
    id: "10.11",
    title: "Pour chaque page web, les contenus peuvent-ils être présentés sans perte d’information ou de fonctionnalité et sans avoir recours soit à un défilement vertical pour une fenêtre ayant une hauteur de 256 px, soit à un défilement horizontal pour une fenêtre ayant une largeur de 320 px (hors cas particuliers) ?",
    subTests: [
      { id: "10.11.1", title: "Pour chaque page web, lorsque le contenu dont le sens de lecture est horizontal est affiché dans une fenêtre réduite à une largeur de 320 px, l’ensemble des informations et des fonctionnalités sont-elles disponibles sans aucun défilement horizontal (hors cas particuliers) ?" },
      { id: "10.11.2", title: "Pour chaque page web, lorsque le contenu dont le sens de lecture est vertical est affiché dans une fenêtre réduite à une hauteur de 256 px, l’ensemble des informations et des fonctionnalités sont-elles disponibles sans aucun défilement vertical (hors cas particuliers) ?" },
    ],
  },
  "10.12": {
    id: "10.12",
    title: "Dans chaque page web, les propriétés d’espacement du texte peuvent-elles être redéfinies par l’utilisateur sans perte de contenu ou de fonctionnalité (hors cas particuliers) ?",
    subTests: [
      { id: "10.12.1", title: "Dans chaque page web, le texte reste-t-il lisible lorsque l’affichage est modifié selon ces conditions (hors cas particuliers) ?" },
    ],
  },
  "10.13": {
    id: "10.13",
    title: "Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d’un composant d’interface sont-ils contrôlables par l’utilisateur (hors cas particuliers) ?",
    subTests: [
      { id: "10.13.1", title: "Chaque contenu additionnel devenant visible à la prise de focus ou au survol d’un composant d’interface peut-il être masqué par une action de l’utilisateur sans déplacer le focus ou le pointeur de la souris (hors cas particuliers) ?" },
      { id: "10.13.2", title: "Chaque contenu additionnel qui apparait au survol d’un composant d’interface peut-il être survolé par le pointeur de la souris sans disparaître (hors cas particuliers) ?" },
      { id: "10.13.3", title: "Chaque contenu additionnel qui apparaît à la prise de focus ou au survol d’un composant d’interface vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "10.14": {
    id: "10.14",
    title: "Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ?",
    subTests: [
      { id: "10.14.1", title: "Dans chaque page web, les contenus additionnels apparaissant au survol d’un composant d’interface via les styles CSS respectent-ils si nécessaire une de ces conditions ?" },
      { id: "10.14.2", title: "Dans chaque page web, les contenus additionnels apparaissant au focus d’un composant d’interface via les styles CSS respectent-ils si nécessaire une de ces conditions ?" },
    ],
  },
  "11.1": {
    id: "11.1",
    title: "Chaque champ de formulaire a-t-il une étiquette ?",
    subTests: [
      { id: "11.1.1", title: "Chaque champ de formulaire vérifie-t-il une de ces conditions ?" },
      { id: "11.1.2", title: "Chaque champ de formulaire associé à une balise <label> ayant un attribut for, vérifie-t-il ces conditions ?" },
      { id: "11.1.3", title: "Chaque champ de formulaire ayant une étiquette dont le contenu n’est pas visible ou à proximité (masqué, aria-label) ou qui n’est pas accolé au champ (aria-labelledby), vérifie-t-il une de ses conditions ?" },
    ],
  },
  "11.2": {
    id: "11.2",
    title: "Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?",
    subTests: [
      { id: "11.2.1", title: "Chaque balise <label> permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?" },
      { id: "11.2.2", title: "Chaque attribut title permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?" },
      { id: "11.2.3", title: "Chaque étiquette implémentée via l’attribut WAI-ARIA aria-label permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?" },
      { id: "11.2.4", title: "Chaque passage de texte associé via l’attribut WAI-ARIA aria-labelledby permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?" },
      { id: "11.2.5", title: "Chaque champ de formulaire ayant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?" },
      { id: "11.2.6", title: "Chaque bouton adjacent au champ de formulaire qui fournit une étiquette visible permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?" },
    ],
  },
  "11.3": {
    id: "11.3",
    title: "Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?",
    subTests: [
      { id: "11.3.1", title: "Chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page est-elle cohérente ?" },
      { id: "11.3.2", title: "Chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée dans un ensemble de pages est-elle cohérente ?" },
    ],
  },
  "11.4": {
    id: "11.4",
    title: "Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?",
    subTests: [
      { id: "11.4.1", title: "Chaque étiquette de champ et son champ associé sont-ils accolés ?" },
      { id: "11.4.2", title: "Chaque étiquette accolée à un champ (à l’exception des cases à cocher, bouton radio ou balises ayant un attribut WAI-ARIA role=\"checkbox\", role=\"radio\" ou role=\"switch\"), vérifie-t-elle ces conditions (hors cas particuliers) ?" },
      { id: "11.4.3", title: "Chaque étiquette accolée à un champ de type checkbox ou radio ou à une balise ayant un attribut WAI-ARIA role=\"checkbox\", role=\"radio\" ou role=\"switch\", vérifie-t-elle ces conditions (hors cas particuliers) ?" },
    ],
  },
  "11.5": {
    id: "11.5",
    title: "Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?",
    subTests: [
      { id: "11.5.1", title: "Les champs de même nature vérifient-ils l’une de ces conditions, si nécessaire ?" },
    ],
  },
  "11.6": {
    id: "11.6",
    title: "Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?",
    subTests: [
      { id: "11.6.1", title: "Chaque regroupement de champs de même nature possède-t-il une légende ?" },
    ],
  },
  "11.7": {
    id: "11.7",
    title: "Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?",
    subTests: [
      { id: "11.7.1", title: "Chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?" },
    ],
  },
  "11.8": {
    id: "11.8",
    title: "Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupés de manière pertinente ?",
    subTests: [
      { id: "11.8.1", title: "Pour chaque balise <select>, les items de même nature d’une liste de choix sont-ils regroupés avec une balise <optgroup>, si nécessaire ?" },
      { id: "11.8.2", title: "Dans chaque balise <select>, chaque balise <optgroup> possède-t-elle un attribut label ?" },
      { id: "11.8.3", title: "Pour chaque balise <optgroup> ayant un attribut label, le contenu de l’attribut label est-il pertinent ?" },
    ],
  },
  "11.9": {
    id: "11.9",
    title: "Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?",
    subTests: [
      { id: "11.9.1", title: "L’intitulé de chaque bouton vérifie-t-il ces conditions (hors cas particuliers) ?" },
      { id: "11.9.2", title: "Chaque bouton affichant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?" },
    ],
  },
  "11.10": {
    id: "11.10",
    title: "Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?",
    subTests: [
      { id: "11.10.1", title: "Les indications du caractère obligatoire de la saisie des champs vérifient-elles une de ces conditions (hors cas particuliers) ?" },
      { id: "11.10.2", title: "Les champs obligatoires ayant l’attribut aria-required=\"true\" ou required vérifient-ils une de ces conditions ?" },
      { id: "11.10.3", title: "Les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire vérifient-ils une de ces conditions ?" },
      { id: "11.10.4", title: "Les champs obligatoires ayant l’attribut aria-invalid=\"true\" vérifient-ils une de ces conditions ?" },
      { id: "11.10.5", title: "Les instructions et indications du type de données et/ou de format obligatoires vérifient-elles une de ces conditions ?" },
      { id: "11.10.6", title: "Les messages d’erreurs fournissant une instruction ou une indication du type de données et/ou de format obligatoire des champs vérifient-ils une de ces conditions ?" },
      { id: "11.10.7", title: "Les champs ayant l’attribut aria-invalid=\"true\" dont la saisie requiert un type de données et/ou de format obligatoires vérifient-ils une de ces conditions ?" },
    ],
  },
  "11.11": {
    id: "11.11",
    title: "Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?",
    subTests: [
      { id: "11.11.1", title: "Pour chaque erreur de saisie, les types et les formats de données sont-ils suggérés, si nécessaire ?" },
      { id: "11.11.2", title: "Pour chaque erreur de saisie, des exemples de valeurs attendues sont-ils suggérés, si nécessaire ?" },
    ],
  },
  "11.12": {
    id: "11.12",
    title: "Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?",
    subTests: [
      { id: "11.12.1", title: "Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques, la saisie des données vérifie-t-elle une de ces conditions ?" },
      { id: "11.12.2", title: "Chaque formulaire dont la validation modifie ou supprime des données à caractère financier, juridique ou personnel vérifie-t-il une de ces conditions ?" },
    ],
  },
  "11.13": {
    id: "11.13",
    title: "La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?",
    subTests: [
      { id: "11.13.1", title: "Chaque champ de formulaire dont l’objet se rapporte à une information concernant l’utilisateur vérifie-t-il ces conditions ?" },
    ],
  },
  "12.1": {
    id: "12.1",
    title: "Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins (hors cas particuliers) ?",
    subTests: [
      { id: "12.1.1", title: "Chaque ensemble de pages vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "12.2": {
    id: "12.2",
    title: "Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place (hors cas particuliers) ?",
    subTests: [
      { id: "12.2.1", title: "Dans chaque ensemble de pages, chaque page disposant d’un menu et les barres de navigation vérifie-t-elle ces conditions (hors cas particuliers) ?" },
    ],
  },
  "12.3": {
    id: "12.3",
    title: "La page « plan du site » est-elle pertinente ?",
    subTests: [
      { id: "12.3.1", title: "La page « plan du site » est-elle représentative de l’architecture générale du site ?" },
      { id: "12.3.2", title: "Les liens du plan du site sont-ils fonctionnels ?" },
      { id: "12.3.3", title: "Les liens du plan du site renvoient-ils bien vers les pages indiquées par l’intitulé ?" },
    ],
  },
  "12.4": {
    id: "12.4",
    title: "Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir d’une fonctionnalité identique ?",
    subTests: [
      { id: "12.4.1", title: "Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir d’une fonctionnalité identique ?" },
      { id: "12.4.2", title: "Dans chaque ensemble de pages, la fonctionnalité vers la page « plan du site » est-elle située à la même place dans la présentation ?" },
      { id: "12.4.3", title: "Dans chaque ensemble de pages, la fonctionnalité vers la page « plan du site » se présente-t-elle toujours dans le même ordre relatif dans le code source ?" },
    ],
  },
  "12.5": {
    id: "12.5",
    title: "Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de manière identique ?",
    subTests: [
      { id: "12.5.1", title: "Dans chaque ensemble de pages, le moteur de recherche est-il accessible à partir d’une fonctionnalité identique ?" },
      { id: "12.5.2", title: "Dans chaque ensemble de pages, la fonctionnalité vers le moteur de recherche est-elle située à la même place dans la présentation ?" },
      { id: "12.5.3", title: "Dans chaque ensemble de pages, la fonctionnalité vers le moteur de recherche se présente-t-elle toujours dans le même ordre relatif dans le code source ?" },
    ],
  },
  "12.6": {
    id: "12.6",
    title: "Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ?",
    subTests: [
      { id: "12.6.1", title: "Dans chaque page web où elles sont présentes, la zone d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche respectent-elles au moins une de ces conditions ?" },
    ],
  },
  "12.7": {
    id: "12.7",
    title: "Dans chaque page web, un lien d’évitement ou d’accès rapide à la zone de contenu principal est-il présent (hors cas particuliers) ?",
    subTests: [
      { id: "12.7.1", title: "Dans chaque page web, un lien permet-il d’éviter la zone de contenu principal ou d’y accéder (hors cas particuliers) ?" },
      { id: "12.7.2", title: "Dans chaque ensemble de pages, le lien d’évitement ou d’accès rapide à la zone de contenu principal vérifie-t-il ces conditions (hors cas particuliers) ?" },
    ],
  },
  "12.8": {
    id: "12.8",
    title: "Dans chaque page web, l’ordre de tabulation est-il cohérent ?",
    subTests: [
      { id: "12.8.1", title: "Dans chaque page web, l’ordre de tabulation dans le contenu est-il cohérent ?" },
      { id: "12.8.2", title: "Pour chaque script qui met à jour ou insère un contenu, l’ordre de tabulation reste-t-il cohérent ?" },
    ],
  },
  "12.9": {
    id: "12.9",
    title: "Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?",
    subTests: [
      { id: "12.9.1", title: "Dans chaque page web, chaque élément recevant le focus vérifie-t-il une de ces conditions ?" },
    ],
  },
  "12.10": {
    id: "12.10",
    title: "Dans chaque page web, les raccourcis clavier n’utilisant qu’une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contrôlables par l’utilisateur ?",
    subTests: [
      { id: "12.10.1", title: "Dans chaque page web, chaque raccourci clavier n’utilisant qu’une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) vérifie-t-il l’une de ces conditions ?" },
    ],
  },
  "12.11": {
    id: "12.11",
    title: "Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier ?",
    subTests: [
      { id: "12.11.1", title: "Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier ?" },
    ],
  },
  "13.1": {
    id: "13.1",
    title: "Pour chaque page web, l’utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu (hors cas particuliers) ?",
    subTests: [
      { id: "13.1.1", title: "Pour chaque page web, chaque procédé de rafraîchissement (balise <object>, balise <embed>, balise <svg>, balise <canvas>, balise <meta>) vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "13.1.2", title: "Pour chaque page web, chaque procédé de redirection effectué via une balise <meta> est-il immédiat (hors cas particuliers) ?" },
      { id: "13.1.3", title: "Pour chaque page web, chaque procédé de redirection effectué via un script vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
      { id: "13.1.4", title: "Pour chaque page web, chaque procédé limitant le temps d’une session vérifie-t-il une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "13.2": {
    id: "13.2",
    title: "Dans chaque page web, l’ouverture d’une nouvelle fenêtre ne doit pas être déclenchée sans action de l’utilisateur. Cette règle est-elle respectée ?",
    subTests: [
      { id: "13.2.1", title: "Dans chaque page web, l’ouverture d’une nouvelle fenêtre ne doit pas être déclenchée sans action de l’utilisateur. Cette règle est-elle respectée ?" },
    ],
  },
  "13.3": {
    id: "13.3",
    title: "Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible (hors cas particuliers) ?",
    subTests: [
      { id: "13.3.1", title: "Dans chaque page web, chaque fonctionnalité de téléchargement d’un document bureautique vérifie-t-elle une de ces conditions ?" },
    ],
  },
  "13.4": {
    id: "13.4",
    title: "Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?",
    subTests: [
      { id: "13.4.1", title: "Chaque document bureautique ayant une version accessible vérifie-t-il une de ces conditions ?" },
    ],
  },
  "13.5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ?",
    subTests: [
      { id: "13.5.1", title: "Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) vérifie-t-il une de ces conditions ?" },
    ],
  },
  "13.6": {
    id: "13.6",
    title: "Dans chaque page web, pour chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ?",
    subTests: [
      { id: "13.6.1", title: "Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) vérifie-t-il une de ces conditions ?" },
    ],
  },
  "13.7": {
    id: "13.7",
    title: "Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?",
    subTests: [
      { id: "13.7.1", title: "Dans chaque page web, chaque image ou élément multimédia (balise <video>, balise <img>, balise <svg>, balise <canvas>, balise <embed> ou balise <object>) qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?" },
      { id: "13.7.2", title: "Dans chaque page web, chaque script qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?" },
      { id: "13.7.3", title: "Dans chaque page web, chaque mise en forme CSS qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?" },
    ],
  },
  "13.8": {
    id: "13.8",
    title: "Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l’utilisateur ?",
    subTests: [
      { id: "13.8.1", title: "Dans chaque page web, chaque contenu en mouvement déclenché automatiquement, vérifie-t-il une de ces conditions ?" },
      { id: "13.8.2", title: "Dans chaque page web, chaque contenu clignotant déclenché automatiquement, vérifie-t-il une de ces conditions ?" },
    ],
  },
  "13.9": {
    id: "13.9",
    title: "Dans chaque page web, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) (hors cas particuliers) ?",
    subTests: [
      { id: "13.9.1", title: "Dans chaque page web, chaque contenu vérifie-t-il ces conditions (hors cas particuliers) ?" },
    ],
  },
  "13.10": {
    id: "13.10",
    title: "Dans chaque page web, les fonctionnalités utilisables ou disponibles au moyen d’un geste complexe peuvent-elles être également disponibles au moyen d’un geste simple (hors cas particuliers) ?",
    subTests: [
      { id: "13.10.1", title: "Dans chaque page web, chaque fonctionnalité utilisable ou disponible suite à un contact multipoint est-elle également utilisable ou disponible suite à un contact en un point unique de l’écran (hors cas particuliers)." },
      { id: "13.10.2", title: "Dans chaque page web, chaque fonctionnalité utilisable ou disponible suite à un geste basé sur le suivi d’une trajectoire sur l’écran est-elle également utilisable ou disponible suite à un contact en un point unique de l’écran (hors cas particuliers)." },
    ],
  },
  "13.11": {
    id: "13.11",
    title: "Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran peuvent-elles faire l’objet d’une annulation (hors cas particuliers) ?",
    subTests: [
      { id: "13.11.1", title: "Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran vérifient-elles l’une de ces conditions (hors cas particuliers) ?" },
    ],
  },
  "13.12": {
    id: "13.12",
    title: "Dans chaque page web, les fonctionnalités qui impliquent un mouvement de l’appareil ou vers l’appareil peuvent-elles être satisfaites de manière alternative (hors cas particuliers) ?",
    subTests: [
      { id: "13.12.1", title: "Dans chaque page web, les fonctionnalités disponibles en bougeant l’appareil peuvent-elles être accomplies avec des composants d’interface utilisateur (hors cas particuliers) ?" },
      { id: "13.12.2", title: "Dans chaque page web, les fonctionnalités disponibles en faisant un geste en direction de l’appareil peuvent-elles être accomplies avec des composants d’interface utilisateur (hors cas particuliers) ?" },
      { id: "13.12.3", title: "L’utilisateur a-t-il la possibilité de désactiver la détection du mouvement pour éviter un déclenchement accidentel de la fonctionnalité (hors cas particuliers) ?" },
    ],
  },
}
