# 1. Images

## 1.1 Chaque image porteuse d’information a-t-elle une alternative textuelle ?

### 1.1.1 Chaque image (balise `<img>` ou balise possédant l’attribut WAI-ARIA `role="img"`) porteuse d’information a-t-elle une alternative textuelle ?

#### Méthodologie

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` ou d’un élément possédant l’attribut WAI-ARIA `role="img"` ;
2. Pour chaque image, déterminer si l’image est porteuse d’information ;
3. Dans le cas où il s’agit d’un élément `<img>`, vérifier que l’image est pourvue au moins d’une alternative textuelle parmi les suivantes :
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label` ;
   * Contenu de l’attribut `alt` ;
   * Contenu de l’attribut `title`.
4. Dans le cas où il s’agit d’un élément possédant l’attribut WAI-ARIA `role="img"`, vérifier que l’image est pourvue au moins d’une alternative textuelle parmi les suivantes :
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label`.
5. Si au moins une alternative textuelle est trouvée, le test est validé.

### 1.1.2 Chaque zone d’une image réactive (balise `<area>`) porteuse d’information a-t-elle une alternative textuelle ?

#### Méthodologie

1. Retrouver dans le document les éléments `<area>` ;
2. Pour chaque élément `<area>`, déterminer si la zone réactive est porteuse d’information ;
3. Vérifier que la zone réactive est pourvue au moins d’une alternative textuelle parmi les suivantes :
   * Contenu de l’attribut WAI-ARIA `aria-label` ;
   * Contenu de l’attribut `alt` ;
4. Si au moins une alternative textuelle est trouvée, le test est validé.

### 1.1.3 Chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) a-t-il une alternative textuelle ?

#### Méthodologie

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, déterminer si l’image utilisée est porteuse d’information ;
3. Vérifier que l’élément `<input>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label` ;
   * Contenu de l’attribut `alt` ;
   * Contenu de l’attribut `title`.
4. Si au moins une alternative textuelle est trouvée, le test est validé.

### 1.1.4 Chaque zone cliquable d’une image réactive côté serveur est-elle doublée d’un mécanisme utilisable quel que soit le dispositif de pointage utilisé et permettant d’accéder à la même destination ?

#### Méthodologie

1. Retrouver dans le document les éléments `<img>` pourvus de l’attribut `ismap` ;
2. Pour chaque élément `<img>` pourvu de l’attribut `ismap`, vérifier la présence d’un lien ou d’un ensemble de liens (ou bien d’un autre type de composant d’interface qui jouerait un rôle similaire comme une liste de sélection, par exemple) permettant d’accéder aux mêmes ressources que lorsque l’image fait l’objet d’un clic.
3. Si c’est le cas, le test est validé.

### 1.1.5 Chaque image vectorielle (balise `<svg>`) porteuse d’information, vérifie-t-elle ces conditions ?

* La balise `<svg>` possède un attribut WAI-ARIA `role="img"` ;
* La balise `<svg>` a une alternative textuelle.

#### Méthodologie

1. Retrouver dans le document les éléments `<svg>` ;
2. Pour chaque élément `<svg>`, déterminer si l’image est porteuse d’information ;
3. S’assurer que l’élément `<svg>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
4. Si ce n’est pas le cas, le test est invalidé.
5. Le cas échéant, vérifier que l’élément `<svg>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
   * Contenu de l’élément `<title>` ;
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label` ;
6. Si au moins une alternative textuelle est trouvée, le test est validé.

### 1.1.6 Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, vérifie-t-elle une de ces conditions ?

* La balise `<object>` possède une alternative textuelle et un attribut `role="img"` ;
* L’élément `<object>` est immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
* Un mécanisme permet à l’utilisateur de remplacer l’élément `<object>` par un contenu alternatif.

#### Méthodologie

1. Retrouver dans le document les balises ouvrantes `<object>` pourvues de l’attribut `type="image/…"` ;
2. Pour chaque balise ouvrante `<object>` pourvue de l’attribut `type="image/…"`, déterminer si l’image utilisée est porteuse d’information ;
3. Vérifier que l’élément `<object>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
4. Vérifier que l’élément `<object>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label` ;
   * Contenu de l’attribut `title`.
5. Si au moins une alternative textuelle est trouvée, le test est validé ;
6. Sinon, vérifier que l’élément `<object>` est :
   * Soit immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
   * Soit un mécanisme permet à l’utilisateur de remplacer l’élément `<object>` par un contenu alternatif.
7. Si c’est le cas, le test est validé.

### 1.1.7 Chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, vérifie-t-elle une de ces conditions ?

* La balise `<embed>` possède une alternative textuelle et un attribut `role="img"` ;
* L’élément `<embed>` est immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
* Un mécanisme permet à l’utilisateur de remplacer l’élément `<embed>` par un contenu alternatif.

#### Méthodologie

1. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, déterminer si l’image utilisée est porteuse d’information ;
2. Vérifier que l’élément `<embed>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
3. Vérifier que l’élément `<embed>` est pourvu au moins d’une alternative textuelle parmi les suivantes :
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label` ;
   * Contenu de l’attribut `title`.
4. Si au moins une alternative textuelle est trouvée, le test est validé ;
5. Sinon, vérifier que l’élément `<embed>` est :
   * Soit immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
   * Soit un mécanisme permet à l’utilisateur de remplacer l’élément `<embed>` par un contenu alternatif.
6. Si c’est le cas, le test est validé.

### 1.1.8 Chaque image bitmap (balise `<canvas>`) porteuse d’information, vérifie-t-elle une de ces conditions ?

* La balise `<canvas>` possède une alternative textuelle et un attribut `role="img"` ;
* Un contenu alternatif est présent entre les balises `<canvas>` et `</canvas>` ;
* L’élément `<canvas>` est immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
* Un mécanisme permet à l’utilisateur de remplacer l’élément `<canvas>` par un contenu alternatif.

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` ;
2. Pour chaque élément `<canvas>`, déterminer si l’image utilisée est porteuse d’information ;
3. Vérifier que l’élément `<canvas>` est pourvu d’un attribut WAI-ARIA `role="img"` ;
4. Vérifier que la balise ouvrante `<canvas>` est pourvue au moins d’une alternative textuelle parmi les suivantes :
   * Passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` ;
   * Contenu de l’attribut WAI-ARIA `aria-label`.
5. Si au moins une alternative textuelle est trouvée, le test est validé.
6. Si les étapes 3 et 4 ne sont pas satisfaites, vérifier que l’élément `<canvas>` est :
   * Soit pourvu d’un contenu alternatif présent entre les balises `<canvas>` et `</canvas>` ;
   * Soit immédiatement suivi d’un lien ou bouton adjacent permettant d’accéder à un contenu alternatif ;
   * Soit un mécanisme permet à l’utilisateur de remplacer l’élément `<canvas>` par un contenu alternatif.
7. Si c’est le cas, le test est validé.

*Note : si l’élément `<canvas>` dispose d’un rôle img, son alternative ne peut être fournie que par les techniques listées à l’étape 4.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H36 H37 H53 F65 H24

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 1.2 Chaque image de décoration est-elle correctement ignorée par les technologies d’assistance ?

### 1.2.1 Chaque image (balise `<img>`) de décoration, sans légende, vérifie-t-elle une de ces conditions ?

* La balise `<img>` possède un attribut `alt` vide (`alt=""`) et est dépourvue de tout autre attribut permettant de fournir une alternative textuelle ;
* La balise `<img>` possède un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.

#### Méthodologie

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<img>` ;
2. Pour chaque image, vérifier que l’image ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’elle possède :
   * Soit un attribut `alt` vide (`alt=""`) ;
   * Soit un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.2.2 Chaque zone non cliquable (balise `<area>` sans attribut `href`) de décoration, vérifie-t-elle une de ces conditions ?

* La balise `<area>` possède un attribut `alt` vide (`alt=""`) et est dépourvue de tout autre attribut permettant de fournir une alternative textuelle ;
* La balise `<area>` possède un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.

#### Méthodologie

1. Retrouver dans le document les images décoratives structurées au moyen d’un élément `<area>` (sans attribut `href`) ;
2. Pour chaque image, vérifier que l’élément `<area>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’il possède :
   * Soit un attribut `alt` vide (`alt=""`) ;
   * Soit un attribut WAI-ARIA `aria-hidden="true"` ou `role="presentation"`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.2.3 Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) de décoration, sans légende, vérifie-t-elle ces conditions ?

* La balise `<object>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
* La balise `<object>` est dépourvue d’alternative textuelle ;
* Il n’y a aucun texte faisant office d’alternative textuelle entre `<object>` et `</object>`.

#### Méthodologie

1. Retrouver dans le document les images décoratives structurées dépourvues de légende au moyen d’un élément `<object>` (avec un attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que la balise ouvrante `<object>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’elle :
   * Possède un attribut WAI-ARIA `aria-hidden="true"` ;
   * Et est dépourvue d’alternative textuelle ;
   * Et est dépourvue d’un contenu alternatif présent entre les balises `<object>` et `</object>`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.2.4 Chaque image vectorielle (balise `<svg>`) de décoration, sans légende, vérifie-t-elle ces conditions ?

* La balise `<svg>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
* La balise `<svg>` et ses enfants sont dépourvus d’alternative textuelle ;
* Les balises `<title>` et `<desc>` sont absentes ou vides ;
* La balise `<svg>` et ses enfants sont dépourvus d’attribut `title`.

#### Méthodologie

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<svg>` ;
2. Pour chaque image, vérifier que l’élément `<svg>` ne possède pas d’attributs `aria-labelledby` ou `aria-label` et qu’il :
   * Possède un attribut WAI-ARIA `aria-hidden="true"` ;
   * Et est dépourvu d’alternative textuelle (ainsi que ses éléments enfants) ;
   * Et ne contient pas d’éléments `<title>` et `<desc>` à moins que vides de contenu ;
   * Et est dépourvu d’attribut `title` (ainsi que ses éléments enfants).
3. Si c’est le cas pour chaque image, le test est validé.

### 1.2.5 Chaque image bitmap (balise `<canvas>`) de décoration, sans légende, vérifie-t-elle ces conditions ?

* La balise `<canvas>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
* La balise `<canvas>` et ses enfants sont dépourvus d’alternative textuelle ;
* Il n’y a aucun texte faisant office d’alternative textuelle entre `<canvas>` et `</canvas>`.

#### Méthodologie

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<canvas>` ;
2. Pour chaque image, vérifier que l’élément `<canvas>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’il :
   * Possède un attribut WAI-ARIA `aria-hidden="true"` ;
   * Et est dépourvu d’alternative textuelle ;
   * Et est dépourvu d’un contenu alternatif présent entre les balises `<canvas>` et `</canvas>`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.2.6 Chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) de décoration, sans légende, vérifie-t-elle ces conditions ?

* La balise `<embed>` possède un attribut WAI-ARIA `aria-hidden="true"` ;
* La balise `<embed>` et ses enfants sont dépourvus d’alternative textuelle.

#### Méthodologie

1. Retrouver dans le document les images décoratives dépourvues de légende structurées au moyen d’un élément `<embed>` (avec un attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que l’élément `<embed>` ne possède pas d’attributs `aria-labelledby`, `aria-label` ou `title` et qu’il :
   * Possède un attribut WAI-ARIA `aria-hidden="true"` ;
   * Et est dépourvu d’alternative textuelle ;
3. Si c’est le cas pour chaque image, le test est validé.

#### Note technique

Lorsqu'une image est associée à une légende, la note technique WCAG recommande de prévoir systématiquement une alternative textuelle (cf. critère 1.9). Dans ce cas le critère 1.2 est non applicable.

Dans le cas d'une image vectorielle (balise `<svg>`) de décoration qui serait affichée au travers d'un élément `<use href="…">` enfant de l'élément `<svg>`, le test 1.2.4 s'appliquera également à l'élément `<svg>` associée par le biais de l'élément `<use>`.

Un attribut WAI-ARIA `role="presentation"` peut être utilisé sur les images de décoration et les zones non cliquables de décoration. Le rôle "none" introduit en ARIA 1.1 et synonyme du rôle "presentation" peut être aussi utilisé. Il reste préférable cependant d'utiliser le rôle "presentation" en attendant un support satisfaisant du rôle "none".

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H67 G196 C9 F39 F38 ARIA4 ARIA10

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.4.1.2 Name, Role, Value (A)

## 1.3 Pour chaque image porteuse d’information ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

### 1.3.1 Chaque image (balise `<img>` ou balise possédant l’attribut WAI-ARIA `role="img"`) porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` (ou d’un élément possédant l’attribut WAI-ARIA `role="img"`) pourvues d’une alternative textuelle ;
2. Pour chaque image, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.2 Pour chaque zone (balise `<area>`) d’une image réactive porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<area>` pourvus d’une alternative textuelle ;
2. Pour chaque élément `<area>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.3 Pour chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`), ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` et d’une alternative textuelle ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.4 Pour chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent le contenu alternatif est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.5 Pour chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent le contenu alternatif est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.6 Pour chaque image vectorielle (balise `<svg>`) porteuse d’information, ayant une alternative textuelle, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’élément `<title>` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<svg>` pourvus d’une alternative textuelle ;
2. Pour chaque élément `<svg>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.7 Pour chaque image bitmap (balise `<canvas>`) porteuse d’information, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent le contenu alternatif est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` pourvus d’une alternative textuelle ;
2. Pour chaque élément `<canvas>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.8 Pour chaque image bitmap (balise `<canvas>`) porteuse d’information et ayant un contenu alternatif entre `<canvas>` et `</canvas>`, ce contenu alternatif est-il correctement restitué par les technologies d’assistance ?

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` pourvus d’un contenu alternatif entre les balises `<canvas>` et `</canvas>` ;
2. Pour chaque élément `<canvas>`, vérifier que le contenu alternatif est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.3.9 Pour chaque image porteuse d’information et ayant une alternative textuelle, l’alternative textuelle est-elle courte et concise (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les images pourvues d’une alternative textuelle ;
2. Pour chaque image, vérifier l’alternative textuelle est courte et concise ;
3. Si c’est le cas pour chaque image, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particuliers lorsque l’image est utilisée comme CAPTCHA ou comme image-test. Dans cette situation, où il n’est pas possible de donner une alternative pertinente sans détruire l’objet du CAPTCHA ou du test, le critère est non applicable.

*Note : le cas des CAPTCHA et des images-test est traité de manière spécifique par le critère 1.4.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G94 G95 F30 F71 G196 ARIA6 ARIA9 ARIA10

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.4.1.2 Name, Role, Value (A)

## 1.4 Pour chaque image utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative permet-elle d’identifier la nature et la fonction de l’image ?

### 1.4.1 Pour chaque image (balise `<img>`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` pourvues d’une alternative textuelle et utilisées comme CAPTCHA ou comme image-test ;
2. Pour chaque image, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.4.2 Pour chaque zone (balise `<area>`) d’une image réactive utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<area>` pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<area>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.4.3 Pour chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) utilisé comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` et d’une alternative textuelle, et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.4.4 Pour chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent le contenu alternatif est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle, et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.4.5 Pour chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent le contenu alternatif est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"` et d’une alternative textuelle, et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.4.6 Pour chaque image vectorielle (balise `<svg>`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<svg>` pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<svg>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.4.7 Pour chaque image bitmap (balise `<canvas>`) utilisée comme CAPTCHA ou comme image-test, ayant une alternative textuelle ou un contenu alternatif, cette alternative est-elle pertinente ?

* S’il est présent, le contenu de l’attribut `alt` est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent ;
* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent le contenu alternatif est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` pourvus d’une alternative textuelle et utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque élément `<canvas>`, vérifier que l’alternative textuelle est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G100 G143

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 1.5 Pour chaque image utilisée comme CAPTCHA, une solution d’accès alternatif au contenu ou à la fonction du CAPTCHA est-elle présente ?

### 1.5.1 Chaque image (balises `<img>`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou possédant un attribut WAI-ARIA `role="img"`) utilisée comme CAPTCHA vérifie-t-elle une de ces conditions ?

* Il existe une autre forme de CAPTCHA non graphique, au moins ;
* Il existe une autre solution d’accès à la fonctionnalité qui est sécurisée par le CAPTCHA.

#### Méthodologie

1. Retrouver dans le document les images (éléments `<img>`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou possédant un attribut WAI-ARIA `role="img"`) utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque image, vérifier qu’il existe :
   * Soit une autre forme de CAPTCHA non graphique, au moins ;
   * Soit une autre solution d’accès à la fonctionnalité qui est sécurisée par le CAPTCHA.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.5.2 Chaque bouton associé à une image (balise input avec l’attribut `type="image"`) utilisée comme CAPTCHA vérifie-t-il une de ces conditions ?

* Il existe une autre forme de CAPTCHA non graphique, au moins ;
* Il existe une autre solution d’accès à la fonctionnalité sécurisée par le CAPTCHA.

#### Méthodologie

1. Retrouver dans le document les boutons associés à une image (éléments `<input>` avec l’attribut `type="image"`) utilisés comme CAPTCHA ou comme image-test ;
2. Pour chaque bouton associé à une image, vérifier qu’il existe :
   * Soit une autre forme de CAPTCHA non graphique, au moins ;
   * Soit une autre solution d’accès à la fonctionnalité qui est sécurisée par le CAPTCHA.
3. Si c’est le cas pour chaque image, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G144

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 1.6 Chaque image porteuse d’information a-t-elle, si nécessaire, une description détaillée ?

### 1.6.1 Chaque image (balise `<img>`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

* Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
* Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
* Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` (ou d’un élément possédant l’attribut WAI-ARIA `role="img"`) porteuses d’information qui nécessitent une description détaillée ;
2. Pour chaque image, vérifier qu’il existe :
   * Soit un attribut `longdesc` qui donne l’adresse (url) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
   * Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.6.2 Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

* Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
* Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
* Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"`, porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier qu’il existe :
   * Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, le test est validé.

### 1.6.3 Chaque image embarquée (balise `<embed>`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

* Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
* Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
* Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"`, porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier qu’il existe :
   * Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, le test est validé.

### 1.6.4 Chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) porteur d’information, qui nécessite une description détaillée, vérifie-t-il une de ces conditions ?

* Il existe un attribut `longdesc` qui donne l’adresse (URL) d’une page ou d’un emplacement dans la page contenant la description détaillée ;
* Il existe une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
* Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"`, porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier qu’il existe :
   * Soit une alternative textuelle contenant la référence à une description détaillée adjacente à l’image ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée ;
   * Soit un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée.
3. Si c’est le cas pour chaque élément `<input>` pourvu de l’attribut `type="image"`, le test est validé.

### 1.6.5 Chaque image vectorielle (balise `<svg>`) porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

* Il existe un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
* Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
* Il existe un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
* Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les éléments `<svg>` porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<svg>`, vérifier qu’il existe :
   * Soit un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
   * Soit un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
   * Soit un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<svg>`, le test est validé.

### 1.6.6 Pour chaque image vectorielle (balise `<svg>`) porteuse d’information, ayant une description détaillée, la référence éventuelle à la description détaillée dans l’attribut WAI-ARIA `aria-label` et la description détaillée associée par l’attribut WAI-ARIA `aria-labelledby` ou `aria-describedby` sont-elles correctement restituées par les technologies d’assistance ?

#### Méthodologie

1. Retrouver dans le document les éléments `<svg>` porteurs d’information dont la description détaillée est fournie au moyen d’un attribut `aria-label`, `aria-labelledby` ou `aria-describedby` ;
2. Pour chaque élément `<svg>`, vérifier que le contenu de la description détaillée est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque élément `<svg>`, le test est validé.

### 1.6.7 Chaque image bitmap (balise `<canvas>`), porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

* Il existe un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
* Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
* Il existe un contenu textuel entre `<canvas>` et `</canvas>` faisant référence à une description détaillée adjacente à l’image bitmap ;
* Il existe un contenu textuel entre `<canvas>` et `</canvas>` faisant office de description détaillée ;
* Il existe un lien ou bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `<canvas>`, vérifier qu’il existe :
   * Soit un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
   * Soit un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
   * Soit un contenu textuel entre `<canvas>` et `</canvas>` faisant référence à une description détaillée adjacente à l’image bitmap ;
   * Soit un contenu textuel entre `<canvas>` et `</canvas>` faisant office de description détaillée ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `<canvas>`, le test est validé.

### 1.6.8 Pour chaque image bitmap (balise `<canvas>`) porteuse d’information, qui implémente une référence à une description détaillée adjacente, cette référence est-elle correctement restituée par les technologies d’assistance ?

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` porteurs d’information dont la description détaillée est fournie au moyen d’un attribut `aria-label`, `aria-labelledby` ou `aria-describedby` ;
2. Pour chaque élément `<canvas>`, vérifier que le contenu de la description détaillée est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque élément `<canvas>`, le test est validé.

### 1.6.9 Pour chaque image (balise `<img>`, `<input>` avec l’attribut `type="image"`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>`, ou possédant un attribut WAI-ARIA `role="img"`) porteuse d’information, qui est accompagnée d’une description détaillée et qui utilise un attribut WAI-ARIA `aria-describedby`, l’attribut WAI-ARIA `aria-describedby` associe-t-il la description détaillée ?

#### Méthodologie

1. Retrouver dans le document les images (éléments `<img>`, `<input>` avec l’attribut `type="image"`, `<area>`, `<object>`, `<embed>`, `<svg>`, `<canvas>` ou possédant un attribut WAI-ARIA `role="img"`) porteuses d’information dont la description détaillée utilise un attribut WAI-ARIA `aria-describedby` ;
2. Pour chaque image, vérifier que le contenu de la description détaillée est correctement restitué par les technologies d’assistance ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.6.10 Chaque balise possédant un attribut WAI-ARIA `role="img"` porteuse d’information, qui nécessite une description détaillée, vérifie-t-elle une de ces conditions ?

* Il existe un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
* Il existe un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
* Il existe un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
* Il existe un lien ou un bouton adjacent permettant d’accéder à la description détaillée.

#### Méthodologie

1. Retrouver dans le document les éléments pourvus d’un attribut WAI-ARIA `role="img"` porteurs d’information qui nécessitent une description détaillée ;
2. Pour chaque élément `role="img"`, vérifier qu’il existe :
   * Soit un attribut WAI-ARIA `aria-label` contenant l’alternative textuelle et une référence à une description détaillée adjacente ;
   * Soit un attribut WAI-ARIA `aria-labelledby` associant un passage de texte faisant office d’alternative textuelle et un autre faisant office de description détaillée ;
   * Soit un attribut WAI-ARIA `aria-describedby` associant un passage de texte faisant office de description détaillée ;
   * Soit un lien ou un bouton adjacent permettant d’accéder à la description détaillée.
3. Si c’est le cas pour chaque élément `role="img"`, le test est validé.

#### Notes techniques

Dans le cas du SVG, le manque de support de l’élément `<title>` et `<desc>` par les technologies d’assistance crée une difficulté dans le cas de l’implémentation de l’alternative textuelle de l’image et de sa description détaillée. Dans ce cas, il est recommandé d’utiliser l’attribut WAI-ARIA `aria-label` pour implémenter à la fois l’alternative textuelle courte et la référence à la description détaillée adjacente ou l’attribut WAI-ARIA `aria-labelledby` pour associer les passages de texte faisant office d’alternative courte et de description détaillée.

L’utilisation de l’attribut WAI-ARIA `aria-describedby` n’est pas recommandée pour lier une image (`<img>`, `<object>`, `<embed>`, `<canvas>`) à sa description détaillée, par manque de support des technologies d’assistance. Néanmoins, lorsqu’il est utilisé, l’attribut devra nécessairement faire référence à l’id de la zone contenant la description détaillée.

La description détaillée adjacente peut être implémentée via une balise `<figcaption>`, dans ce cas le critère 1.9 doit être vérifié (utilisation de `<figure>` et des attributs WAI-ARIA `role="figure"` et `aria-label`, notamment).

L'attribut `longdesc` qui constitue une des conditions du test 1.6.1 (et dont la pertinence est vérifiée avec le test 1.7.1) est désormais considéré comme obsolète par la spécification HTML en cours. La vérification de cet attribut ne sera donc requise que pour les versions de la spécification HTML antérieure à HTML 5.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G92 G74 G73 H45 ARIA6

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 1.7 Pour chaque image porteuse d’information ayant une description détaillée, cette description est-elle pertinente ?

### 1.7.1 Chaque image (balise `<img>`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

* La description détaillée via l’adresse référencée dans l’attribut `longdesc` est pertinente ;
* La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
* La description détaillée via un lien ou un bouton adjacent est pertinente ;
* Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les images structurées au moyen d’un élément `<img>` qui possèdent une description détaillée ;
2. Pour chaque image, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.7.2 Chaque bouton de type image (balise `<input>` avec l’attribut `type="image"`) porteur d’information, ayant une description détaillée, vérifie-t-il ces conditions ?

* La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
* La description détaillée via un lien ou un bouton adjacent est pertinente ;
* Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<input>` pourvus de l’attribut `type="image"` qui possèdent une description détaillée ;
2. Pour chaque élément `<input>` pourvu de l’attribut `type="image"`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.7.3 Chaque image objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

* La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
* La description détaillée adjacente à l’image objet est pertinente ;
* La description détaillée via un lien ou un bouton adjacent est pertinente ;
* Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<object>` pourvus de l’attribut `type="image/…"` qui possèdent une description détaillée ;
2. Pour chaque élément `<object>` pourvu de l’attribut `type="image/…"`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.7.4 Chaque image embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

* La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
* La description détaillée adjacente à l’image embarquée est pertinente ;
* La description détaillée via un lien ou un bouton adjacent est pertinente ;
* Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<embed>` pourvus de l’attribut `type="image/…"` qui possèdent une description détaillée ;
2. Pour chaque élément `<embed>` pourvu de l’attribut `type="image/…"`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.7.5 Chaque image vectorielle (balise `<svg>`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

* La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
* La description détaillée dans la page et signalée par le texte contenu dans la balise `<desc>` ou `<title>` est pertinente ;
* La description détaillée adjacente contenue dans la balise `<desc>` est pertinente ;
* La description détaillée via un lien ou un bouton adjacent est pertinente ;
* Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<svg>` qui possèdent une description détaillée ;
2. Pour chaque élément `<svg>`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### 1.7.6 Chaque image bitmap (balise `<canvas>`) porteuse d’information, ayant une description détaillée, vérifie-t-elle ces conditions ?

* La description détaillée dans la page et signalée par l’alternative textuelle est pertinente ;
* La description détaillée dans la page et signalée par le texte contenu entre `<canvas>` et `</canvas>` est pertinente ;
* La description détaillée contenue entre `<canvas>` et `</canvas>` est pertinente ;
* La description détaillée adjacente à l’image bitmap est pertinente ;
* La description détaillée via un lien ou un bouton adjacent est pertinente ;
* Le passage de texte associé via l’attribut WAI-ARIA `aria-describedby` est pertinent.

#### Méthodologie

1. Retrouver dans le document les éléments `<canvas>` qui possèdent une description détaillée ;
2. Pour chaque élément `<canvas>`, vérifier que la description détaillée est pertinente ;
3. Si c’est le cas pour chaque image, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G92 F67

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 1.8 Chaque image texte porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

### 1.8.1 Chaque image texte (balise `<img>` ou possédant un attribut WAI-ARIA `role="img"`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les images texte structurées au moyen d’un élément `<img>` (ou d’un élément possédant l’attribut WAI-ARIA `role="img"`) ;
2. Pour chaque image, vérifier que :
   * Soit il existe un mécanisme de remplacement ;
   * Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.8.2 Chaque bouton « image texte » (balise `<input>` avec l’attribut `type="image"`) porteur d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacé par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les boutons “images texte” (élément `<input>` avec l’attribut `type="image"`) ;
2. Pour chaque image, vérifier que :
   * Soit il existe un mécanisme de remplacement ;
   * Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.8.3 Chaque image texte objet (balise `<object>` avec l’attribut `type="image/…"`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les images texte objet (élément `<object>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
   * Soit il existe un mécanisme de remplacement ;
   * Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.8.4 Chaque image texte embarquée (balise `<embed>` avec l’attribut `type="image/…"`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les images texte embarquées (élément `<embed>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
   * Soit il existe un mécanisme de remplacement ;
   * Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.8.5 Chaque image texte bitmap (balise `<canvas>`) porteuse d’information, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les images texte bitmap (élément `<canvas>`) ;
2. Pour chaque image, vérifier que :
   * Soit il existe un mécanisme de remplacement ;
   * Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.8.6 Chaque image texte SVG (balise `<svg>`) porteuse d’information et dont le texte n’est pas complètement structuré au moyen d’éléments `<text>`, en l’absence d’un mécanisme de remplacement, doit si possible être remplacée par du texte stylé. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les images texte vectorielle (élément `<svg>`) porteuse d’information et dont le texte n’est pas complètement structuré au moyen d’éléments `<text>` ;
2. Pour chaque image, vérifier que :
   * Soit il existe un mécanisme de remplacement ;
   * Soit l’image contient un texte qui fait appel à un effet graphique qui ne peut pas être reproduit en CSS.
3. Si c’est le cas pour chaque image, le test est validé.

#### Cas particuliers

Pour ce critère, il existe une gestion de cas particulier lorsque le texte fait partie du logo, d’une dénomination commerciale, d’un CAPTCHA, d’une image-test ou d’une image dont l’exactitude graphique serait considérée comme essentielle à la bonne transmission de l’information véhiculée par l’image. Dans ces situations, le critère est non applicable pour ces éléments.

#### Notes techniques

Le texte dans les images vectorielles étant du texte réel, il n’est pas concerné par ce critère.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.5 Texte sous forme d’image (Niveau AA)** :
  Si les technologies utilisées peuvent réaliser la présentation visuelle, du texte est utilisé pour véhiculer l’information plutôt que du texte sous forme d’image sauf dans les cas suivants :

  * **Personnalisable** : le texte sous forme d’image peut être personnalisé visuellement selon les exigences de l’utilisateur ;

  * **Essentielle** : une présentation spécifique du texte est essentielle à l’information véhiculée.

  * **Note** : Les logotypes sont considérés comme essentiels (le texte qui fait partie d’un logo ou d’un nom de marque).

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G136 G140 C22 C30

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.5 Images of Text (AA)

## 1.9 Chaque légende d’image est-elle, si nécessaire, correctement reliée à l’image correspondante ?

### 1.9.1 Chaque image pourvue d’une légende (balise `<img>`, `<input>` avec l’attribut `type="image"` ou possédant un attribut WAI-ARIA `role="img"` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

* L’image (balise `<img>`, `<input>` avec l’attribut `type="image"` ou possédant un attribut WAI-ARIA `role="img"`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
* La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
* La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
* La légende est contenue dans une balise `<figcaption>`.

#### Méthodologie

1. Retrouver dans le document les images pourvues d’une légende structurées au moyen d’élément `<img>`, d’un élément `<input>` avec l’attribut `type="image"` ou d’un élément possédant l’attribut WAI-ARIA `role="img"` ;
2. Pour chaque image, vérifier que :
   * L’image et sa légende sont contenues dans une balise `<figure>` ;
   * La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
   * La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
   * La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.9.2 Chaque image objet pourvue d’une légende (balise `<object>` avec l’attribut `type="image/…"` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

* L’image objet et sa légende adjacente sont contenues dans une balise `<figure>` ;
* La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
* La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
* La légende est contenue dans une balise `<figcaption>`.

#### Méthodologie

1. Retrouver dans le document les images objet pourvues d’une légende (élément `<object>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
   * L’image et sa légende sont contenues dans une balise `<figure>` ;
   * La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
   * La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
   * La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.9.3 Chaque image embarquée pourvue d’une légende (balise `<embed>` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

* L’image embarquée (balise `<embed>`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
* La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
* La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
* La légende est contenue dans une balise `<figcaption>`.

#### Méthodologie

1. Retrouver dans le document les images embarquées pourvues d’une légende (élément `<embed>` avec l’attribut `type="image/…"`) ;
2. Pour chaque image, vérifier que :
   * L’image et sa légende sont contenues dans une balise `<figure>` ;
   * La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
   * La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
   * La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.9.4 Chaque image vectorielle pourvue d’une légende (balise `<svg>` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

* L’image vectorielle (balise `<svg>`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
* La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
* La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
* La légende est contenue dans une balise `<figcaption>`.

#### Méthodologie

1. Retrouver dans le document les images vectorielles pourvues d’une légende (élément `<svg>`) ;
2. Pour chaque image, vérifier que :
   * L’image et sa légende sont contenues dans une balise `<figure>` ;
   * La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
   * La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
   * La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, le test est validé.

### 1.9.5 Chaque image bitmap pourvue d’une légende (balise `<canvas>` associée à une légende adjacente), vérifie-t-elle, si nécessaire, ces conditions ?

* L’image bitmap (balise `<canvas>`) et sa légende adjacente sont contenues dans une balise `<figure>` ;
* La balise `<figure>` possède un attribut WAI-ARIA `role="figure"` ou `role="group"` ;
* La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
* La légende est contenue dans une balise `<figcaption>`.

#### Méthodologie

1. Retrouver dans le document les images bitmap (élément `<canvas>`) ;
2. Pour chaque image, vérifier que :
   * L’image et sa légende sont contenues dans une balise `<figure>` ;
   * La balise `<figure>` possède une propriété WAI-ARIA `role="figure"` ou `role="group"` ;
   * La balise `<figure>` possède un attribut WAI-ARIA `aria-label` dont le contenu est identique au contenu de la légende ;
   * La légende est contenue dans une balise `<figcaption>`.
3. Si c’est le cas pour chaque image, le test est validé.

#### Note technique

L’implémentation d’un attribut WAI-ARIA `role="group"` ou `role="figure"` sur l’élément parent `<figure>` est destiné à pallier le manque de support actuel des éléments `<figure>` par les technologies d’assistance. L’utilisation d’un élément `<figcaption>` pour associer une légende à une image impose au minimum l’utilisation d’un attribut WAI-ARIA `aria-label` sur l’élément parent `<figure>` dont le contenu sera identique au contenu de l’élément `<figcaption>`. Pour s’assurer d’un support optimal, il peut également être fait une association explicite entre le contenu de l’alternative textuelle de l’image et le contenu de l’élément `<figcaption>`, par exemple :

`<img src="image.png" alt="Photo : soleil couchant" /><figcaption>Photo : crédit xxx</figcaption>`

Les attributs WAI-ARIA `aria-labelledby` et `aria-describedby` ne peuvent pas être utilisés actuellement par manque de support par les technologies d’assistance.

*Note : les images légendées doivent par ailleurs respecter le critère 1.1 et le critère 1.3 relatifs aux images porteuses d’information.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G140 ARIA4 ARIA6

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.4.1.2 Name, Role, Value (A)


# 2. Cadres

## 2.1 Chaque cadre a-t-il un titre de cadre ?

### 2.1.1 Chaque cadre (balise `<iframe>` ou `<frame>`) a-t-il un attribut `title` ?

#### Méthodologie

1. Retrouver dans le document les cadres (élément `<iframe>` ou `<frame>`) ;
2. Pour chaque cadre, vérifier qu’il possède un attribut `title` ;
3. Si c’est le cas pour chaque cadre, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H64

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.4.1.2 Name, Role, Value (A)

## 2.2 Pour chaque cadre ayant un titre de cadre, ce titre de cadre est-il pertinent ?

### 2.2.1 Pour chaque cadre (balise `<iframe>` ou `<frame>`) ayant un attribut `title`, le contenu de cet attribut est-il pertinent ?

#### Méthodologie

1. Retrouver dans le document les cadres (élément `<iframe>` ou `<frame>`) ;
2. Pour chaque cadre pourvu d’un attribut `title`, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque cadre, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H64

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.4.1.2 Name, Role, Value (A)


# 3. Couleurs

## 3.1 Dans chaque page web, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

### 3.1.1 Pour chaque mot ou ensemble de mots dont la mise en couleur est porteuse d’information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations données par la couleur dans un mot ou un ensemble de mots ;
2. Pour chacune de ces informations, vérifier qu’il existe un autre moyen de récupérer cette information (présence d’un attribut `title`, d’une icône ou d’un effet graphique de forme ou de position, un effet typographique…) ;
3. Si c’est le cas pour chaque information, le test est validé.

### 3.1.2 Pour chaque indication de couleur donnée par un texte, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations données par la couleur dans un texte ;
2. Pour chacune de ces informations, vérifier qu’il existe un autre moyen de récupérer cette information (présence d’un attribut `title`, d’une icône ou d’un effet graphique de forme ou de position, un effet typographique…) ;
3. Si c’est le cas pour chaque information, le test est validé.

### 3.1.3 Pour chaque image véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations données par la couleur dans une image ;
2. Pour chacune de ces informations, vérifier qu’il existe un autre moyen de récupérer cette information (présence d’un attribut `title`, d’une icône ou d’un effet graphique de forme ou de position, un effet typographique…) ;
3. Si c’est le cas pour chaque information, le test est validé.

### 3.1.4 Pour chaque propriété CSS déterminant une couleur et véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations données par la couleur dans une propriété CSS ;
2. Pour chacune de ces informations, vérifier qu’il existe un autre moyen de récupérer cette information (présence d’un attribut `title`, d’une icône ou d’un effet graphique de forme ou de position, un effet typographique…) ;
3. Si c’est le cas pour chaque information, le test est validé.

### 3.1.5 Pour chaque média temporel véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations données par la couleur dans un média temporel ;
2. Pour chacune de ces informations, vérifier qu’il existe un autre moyen de récupérer cette information (présence d’un attribut `title`, d’une icône ou d’un effet graphique de forme ou de position, un effet typographique…) ;
3. Si c’est le cas pour chaque information, le test est validé.

### 3.1.6 Pour chaque média non temporel véhiculant une information, l’information ne doit pas être donnée uniquement par la couleur. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations données par la couleur dans un média non temporel ;
2. Pour chacune de ces informations, vérifier qu’il existe un autre moyen de récupérer cette information (présence d’un attribut `title`, d’une icône ou d’un effet graphique de forme ou de position, un effet typographique…) ;
3. Si c’est le cas pour chaque information, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **1.4.1 Utilisation de la couleur (Niveau A)** :
  La couleur n’est pas utilisée comme la seule façon de véhiculer de l’information, d’indiquer une action, de solliciter une réponse ou de distinguer un élément visuel.

  * **Note** : Ce critère de succès traite spécifiquement de la perception des couleurs. Les autres formes de perception sont traitées à la règle 1.3 comme l’accès à la couleur par programme informatique et les autres formes de codage de la présentation visuelle.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G14 G182 G111 G117 G138 G205

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.1.4.1 Use of color (A)

## 3.2 Dans chaque page web, le contraste entre la couleur du texte et la couleur de son arrière-plan est-il suffisamment élevé (hors cas particuliers) ?

### 3.2.1 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée inférieure à 24px vérifient-ils une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins ;
* Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.

#### Méthodologie

1. Retrouver dans le document les textes et les textes en image sans effet de graisse d’une taille restituée inférieure à 24px qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces textes, vérifier que :
   * Soit le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.
3. Si c’est le cas pour chaque texte, le test est validé.

### 3.2.2 Dans chaque page web, le texte et le texte en image en gras d’une taille restituée inférieure à 18,5px vérifient-ils une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins ;
* Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.

#### Méthodologie

1. Retrouver dans le document les textes et les textes en image en gras d’une taille restituée inférieure à 18,5px qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces textes, vérifier que :
   * Soit le rapport de contraste entre le texte et son arrière-plan est de 4.5:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 4.5:1, au moins.
3. Si c’est le cas pour chaque texte, le test est validé.

### 3.2.3 Dans chaque page web, le texte et le texte en image sans effet de graisse d’une taille restituée supérieure ou égale à 24px vérifient-ils une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ;
* Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins.

#### Méthodologie

1. Retrouver dans le document les textes et les textes en image sans effet de graisse d’une taille restituée supérieure ou égale à 24px qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces textes, vérifier que :
   * Soit le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque texte, le test est validé.

### 3.2.4 Dans chaque page web, le texte et le texte en image en gras d’une taille restituée supérieure ou égale à 18,5px vérifient-ils une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ;
* Un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins.

#### Méthodologie

1. Retrouver dans le document les textes et les textes en image en gras d’une taille restituée supérieure ou égale à 18,5px qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces textes, vérifier que :
   * Soit le rapport de contraste entre le texte et son arrière-plan est de 3:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher le texte avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque texte, le test est validé.

### 3.2.5 Dans le mécanisme qui permet d’afficher un rapport de contraste conforme, le rapport de contraste entre le texte et la couleur d’arrière-plan est-il suffisamment élevé ?

#### Méthodologie

1. Retrouver dans le document les mécanismes qui permettent d’afficher un rapport de contraste conforme ;
2. Pour chacun de ces mécanismes, vérifier que le rapport de contraste entre le texte et la couleur d’arrière-plan est suffisamment élevé ;
3. Si c’est le cas pour chaque mécanisme, le test est validé.

#### Cas particuliers

Dans ces situations, les critères sont non applicables pour ces éléments :

Le texte fait partie d’un logo ou d’un nom de marque d’un organisme ou d’une société ;

Le texte ou l’image de texte est purement décoratif ;

Le texte fait partie d’une image véhiculant une information mais le texte lui-même n’apporte aucune information essentielle ;

Le texte ou l’image de texte fait partie d’un élément d’interface sur lequel aucune action n’est possible (par exemple un bouton avec l’attribut `disabled`).

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.3 Contraste (minimum) (Niveau AA)** :
  La présentation visuelle du texte et du texte sous forme d’image a un rapport de contraste d’au moins 4,5:1, sauf dans les cas suivants :

  * **Texte agrandi** : le texte agrandi et le texte agrandi sous forme d’image ont un rapport de contraste d’au moins 3:1.

  * **Texte décoratif** : aucune exigence de contraste pour le texte ou le texte sous forme d’image qui fait partie d’un composant d’interface utilisateur inactif, qui est purement décoratif, qui est invisible pour tous ou qui est une partie d’une image contenant un autre contenu significatif.

  * **Logotypes** : aucune exigence de contraste pour le texte faisant partie d’un logo ou d’un nom de marque.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G18 G136 G148 G174 G145 C29

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.3 Contrast (Minimum) (AA)

## 3.3 Dans chaque page web, les couleurs utilisées dans les composants d’interface ou les éléments graphiques porteurs d’informations sont-elles suffisamment contrastées (hors cas particuliers) ?

### 3.3.1 Dans chaque page web, le rapport de contraste entre les couleurs d’un composant d’interface dans ses différents états et la couleur d’arrière-plan contiguë vérifie-t-il une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste est de 3:1, au moins ;
* Un mécanisme permet un rapport de contraste de 3:1, au moins.

#### Méthodologie

1. Retrouver dans le document les composants d’interface qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces composants, vérifier que :
   * Soit le rapport de contraste entre les couleurs du composant dans ses différents états et la couleur d’arrière-plan contiguë est de 3:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher le composant avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque composant, le test est validé.

### 3.3.2 Dans chaque page web, le rapport de contraste des différentes couleurs composant un élément graphique, lorsqu’elles sont nécessaires à sa compréhension, et la couleur d’arrière-plan contiguë, vérifie-t-il une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste est de 3:1, au moins ;
* Un mécanisme permet un rapport de contraste de 3:1, au moins.

#### Méthodologie

1. Retrouver dans le document les éléments graphiques qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces éléments, vérifier que :
   * Soit le rapport de contraste entre les couleurs de l’élément graphique nécessaires à sa compréhension et la couleur d’arrière-plan contiguë est de 3:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher l’élément graphique avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque composant, le test est validé.

### 3.3.3 Dans chaque page web, le rapport de contraste des différentes couleurs contiguës entre elles d’un élément graphique, lorsqu’elles sont nécessaires à sa compréhension, vérifie-t-il une de ces conditions (hors cas particuliers) ?

* Le rapport de contraste est de 3:1, au moins ;
* Un mécanisme permet un rapport de contraste de 3:1, au moins.

#### Méthodologie

1. Retrouver dans le document les éléments graphiques qui pourraient poser des problèmes de contraste ;
2. Pour chacun de ces éléments, vérifier que :
   * Soit le rapport de contraste des différentes couleurs contiguës de l’élément graphique entre elles, lorsqu’elles sont nécessaires à sa compréhension, est de 3:1, au moins ;
   * Soit un mécanisme permet à l’utilisateur d’afficher l’élément graphique avec un rapport de contraste de 3:1, au moins.
3. Si c’est le cas pour chaque élément graphique, le test est validé.

### 3.3.4 Dans le mécanisme qui permet d’afficher un rapport de contraste conforme, les couleurs du composant ou des éléments graphiques porteurs d’informations qui le composent, sont-elles suffisamment contrastées ?

#### Méthodologie

1. Retrouver dans le document les mécanismes qui permettent d’afficher un rapport de contraste conforme ;
2. Pour chacun de ces mécanismes, vérifier que le rapport de contraste entre les couleurs du composant ou des éléments graphiques porteurs d’informations qui le composent est suffisamment élevé ;
3. Si c’est le cas pour chaque mécanisme, le test est validé.

*Note : le critère est non applicable dans ces situations :*

Composant d’interface inactif (par exemple, un bouton avec un attribut `disabled`) sur lequel aucune action n’est possible ;

Composant d’interface pour lequel l’apparence est gérée par les styles natifs du navigateur sans aucune modification par l’auteur (par exemple, le `style` au focus natif dans Chrome ou Firefox) ;

Composant d’interface pour lequel la couleur n’est pas nécessaire pour identifier le composant ou son état (par exemple, un groupe de liens faisant office de navigation dont la position dans la page, la taille et la couleur du texte permettent de comprendre qu’il s’agit de liens même si la couleur du soulignement des liens avec le fond blanc n’a pas un ratio de 3:1 et que le texte lui a un ratio de 4.5:1) ;

Élément graphique ou parties d’élément graphique non porteur d’information ou ayant une alternative (description longue, informations identiques visibles dans la page) ;

Élément graphique ou parties d’élément graphique faisant partie d’un logo ou du nom de marque d’un organisme ou d’une société ;

Élément graphique ou parties d’élément graphique dont la présentation est essentielle à l’information véhiculée (exemple drapeaux, logotypes, photos de personnes ou de scènes, captures d’écran, diagrammes médicaux, carte de chaleurs) ;

Élément graphique ou parties d’élément graphique dynamiques dont le contraste au survol / focus est suffisant.

#### Cas particuliers

Les cas suivants sont non applicables pour ce critère :

Composant d’interface inactif (par exemple, un bouton avec un attribut `disabled`) sur lequel aucune action n’est possible ;

Composant d’interface pour lequel l’apparence est gérée par les styles natifs du navigateur sans aucune modification par l’auteur (par exemple, le `style` au focus natif dans Chrome ou Firefox) ;

Composant d’interface pour lequel la couleur n’est pas nécessaire pour identifier le composant ou son état (par exemple, un groupe de liens faisant office de navigation dont la position dans la page, la taille et la couleur du texte permettent de comprendre qu’il s’agit de liens même si la couleur du soulignement des liens avec le fond blanc n’a pas un ratio de 3:1 et que le texte lui a un ratio de 4.5:1) ;

Élément graphique ou parties d’élément graphique non porteur d’information ou ayant une alternative (description longue, informations identiques visibles dans la page) ;

Élément graphique ou parties d’élément graphique faisant partie d’un logo ou du nom de marque d’un organisme ou d’une société ;

Élément graphique ou parties d’élément graphique dont la présentation est essentielle à l’information véhiculée (par exemple, drapeaux, logotypes, photos de personnes ou de scènes, captures d’écran, diagrammes médicaux, carte de chaleurs) ;

Élément graphique ou parties d’élément graphique dynamiques dont le contraste au survol / focus est suffisant.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.11 Contraste du contenu non textuel (Niveau AA)** :
  La présentation visuelle des éléments suivants a un rapport de contraste d’au moins 3:1 avec la ou les couleurs adjacentes :

  * **Composants d’interface utilisateur** : informations visuelles nécessaires à l’identification des composants et des états de l’interface utilisateur, à l’exception des composants inactifs ou lorsque l’apparence du composant est déterminée par l’agent utilisateur et non modifiée par l’auteur ;

  * **Objets graphiques** : parties d’éléments graphiques nécessaires à la compréhension du contenu, sauf si une présentation spécifique de ces éléments est essentielle à l’information transmise.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G18 G195 G207 G174 G145 G183 F78

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.11 Non-text Contrast (AA)


# 4. Multimédia

## 4.1 Chaque média temporel pré-enregistré a-t-il, si nécessaire, une transcription textuelle ou une audiodescription (hors cas particuliers) ?

### 4.1.1 Chaque média temporel pré-enregistré seulement audio, vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?

* Il existe une transcription textuelle accessible via un lien ou bouton adjacent ;
* Il existe une transcription textuelle adjacente clairement identifiable.

#### Méthodologie

1. Retrouver dans le document les médias temporels (éléments `<audio>`, `<video>` ou `<object>`) seulement audio qui nécessitent une transcription textuelle ;
2. Pour chaque média temporel seulement audio, vérifier la présence d’une transcription textuelle :
   * Soit accessible au moyen d’un bouton ou d’un lien adjacent (une URL ou une ancre) ;
   * Soit adjacente clairement identifiable.
3. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.1.2 Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?

* Il existe une version alternative « audio seulement » accessible via un lien ou bouton adjacent ;
* Il existe une version alternative « audio seulement » adjacente clairement identifiable ;
* Il existe une transcription textuelle accessible via un lien ou bouton adjacent ;
* Il existe une transcription textuelle adjacente clairement identifiable ;
* Il existe une audiodescription synchronisée ;
* Il existe une version alternative avec une audiodescription synchronisée accessible via un lien ou bouton adjacent.

#### Méthodologie

1. Retrouver dans le document les médias temporels (éléments `<video>` ou `<object>`) seulement vidéo qui nécessitent une transcription textuelle ;
2. Pour chaque média temporel seulement vidéo, vérifier la présence :
   * Soit d’une version alternative audio seulement accessible au moyen d’un lien ou bouton adjacent (une URL ou une ancre) ;
   * Soit d’une version alternative audio seulement adjacente ;
   * Soit d’une transcription textuelle accessible au moyen d’un bouton ou d’un lien adjacent (une URL ou une ancre) ;
   * Soit d’une transcription textuelle adjacente clairement identifiable ;
   * Soit d’une audiodescription synchronisée ;
   * Soit d’une version alternative avec une audiodescription synchronisée accessible au moyen d’un bouton ou d’un lien adjacent (une URL ou une ancre).
3. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.1.3 Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?

* Il existe une transcription textuelle accessible via un lien ou bouton adjacent ;
* Il existe une transcription textuelle adjacente clairement identifiable ;
* Il existe une audiodescription synchronisée ;
* Il existe une version alternative avec une audiodescription synchronisée accessible via un lien ou bouton adjacent.

#### Méthodologie

1. Retrouver dans le document les médias temporels (éléments `<video>` ou `<object>`) synchronisés qui nécessitent une transcription textuelle ;
2. Pour chaque média temporel synchronisé, vérifier la présence :
   * Soit d’une transcription textuelle accessible au moyen d’un lien ou bouton adjacent (une URL ou une ancre) ;
   * Soit d’une transcription textuelle adjacente clairement identifiable ;
   * Soit d’une audiodescription synchronisée ;
   * Soit d’une version alternative avec une audiodescription synchronisée accessible au moyen d’un bouton ou d’un lien adjacent (une URL ou une ancre).
3. Si c’est le cas pour chaque média temporel, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque :

Le média temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information) ;

Le média temporel est lui-même une alternative à un contenu de la page (une vidéo en langue des signes ou la vocalisation d’un texte, par exemple) ;

Le média temporel est utilisé pour accéder à une version agrandie ;

Le média temporel est utilisé comme un CAPTCHA ;

Le média temporel fait partie d’un test qui deviendrait inutile si la transcription textuelle, les sous-titres synchronisés ou l’audiodescription étaient communiqués ;

Pour les services de l’État, les collectivités territoriales et leurs établissements : si le média temporel a été publié entre le 23 septembre 2019 et le 23 septembre 2020 sur un site internet, intranet ou extranet créé depuis le 23 septembre 2018, il est exempté de l’obligation d’accessibilité ;

Pour les personnes de droit privé mentionnées aux 2° à 4° du I de l’article 47 de la loi du 11 février 2005 : si le média temporel a été publié avant le 23 septembre 2020, il est exempté de l’obligation d’accessibilité.

Dans ces situations, le critère est non applicable.

Ce cas particulier s’applique également aux critères 4.2, 4.3, 4.5.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.2.1 Contenus seulement audio et seulement vidéo (pré-enregistrés) (Niveau A)** :
  Pour des médias pré-enregistrés seulement audio et pré-enregistrés seulement vidéo, sauf si l’audio ou la vidéo sont un média de remplacement pour un texte et qu’ils sont clairement identifiés comme tels, les points suivants sont vrais :

  * **Contenu pré-enregistré seulement audio** : fournir une version de remplacement pour un média temporel, présentant une information équivalente au contenu seulement audio.

  * **Contenu pré-enregistré seulement vidéo** : fournir, soit une version de remplacement pour un média temporel, soit une piste audio (présentant une information équivalente) pour un contenu pré-enregistré seulement vidéo.
* **1.2.3 Audio-description ou version de remplacement pour un média temporel (pré-enregistré) (Niveau A)** :
  Fournir une version de remplacement pour un média temporel ou une audio-description du contenu vidéo pré-enregistré pour un média synchronisé, excepté quand le média est un média de remplacement pour un texte et qu’il est clairement identifié comme tel.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G58 G69 G78 G158 G159 G173 G8 G166 H96 SM6 SM7

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.2.1 Audio-only and Video-only (Prerecorded) (A)
  * 9.1.2.3 Audio Description or Media Alternative (Prerecorded) (A)

## 4.2 Pour chaque média temporel pré-enregistré ayant une transcription textuelle ou une audiodescription synchronisée, celles-ci sont-elles pertinentes (hors cas particuliers) ?

### 4.2.1 Pour chaque média temporel pré-enregistré seulement audio, ayant une transcription textuelle, celle-ci est-elle pertinente (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés seulement audio qui possèdent une transcription textuelle ;
2. Pour chaque média temporel seulement audio, vérifier que transcription textuelle est pertinente ;
3. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.2.2 Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il une de ces conditions (hors cas particuliers) ?

* La transcription textuelle est pertinente ;
* L’audiodescription synchronisée est pertinente ;
* L’audiodescription synchronisée de la version alternative est pertinente ;
* La version alternative audio seulement est pertinente.

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés seulement vidéo qui possèdent une transcription textuelle ;
2. Pour chaque média temporel seulement vidéo, vérifier la pertinence :
   * Soit de la transcription textuelle ;
   * Soit de l’audiodescription synchronisée ;
   * Soit de l’audiodescription synchronisée de la version alternative ;
   * Soit de la version alternative audio seulement.
3. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.2.3 Chaque média temporel synchronisé pré-enregistré vérifie-t-il une de ces conditions (hors cas particuliers) ?

* La transcription textuelle est pertinente ;
* L’audiodescription synchronisée est pertinente ;
* L’audiodescription synchronisée de la version alternative est pertinente.

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés synchronisés ;
2. Pour chaque média temporel synchronisé, vérifier la pertinence :
   * Soit de la transcription textuelle ;
   * Soit de l’audiodescription synchronisée ;
   * Soit de l’audiodescription synchronisée de la version alternative.
3. Si c’est le cas pour chaque média temporel, le test est validé.

#### Cas particuliers

Voir cas particuliers critère 4.1.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.2.1 Contenus seulement audio et seulement vidéo (pré-enregistrés) (Niveau A)** :
  Pour des médias pré-enregistrés seulement audio et pré-enregistrés seulement vidéo, sauf si l’audio ou la vidéo sont un média de remplacement pour un texte et qu’ils sont clairement identifiés comme tels, les points suivants sont vrais :

  * **Contenu pré-enregistré seulement audio** : fournir une version de remplacement pour un média temporel, présentant une information équivalente au contenu seulement audio.

  * **Contenu pré-enregistré seulement vidéo** : fournir, soit une version de remplacement pour un média temporel, soit une piste audio (présentant une information équivalente) pour un contenu pré-enregistré seulement vidéo.
* **1.2.3 Audio-description ou version de remplacement pour un média temporel (pré-enregistré) (Niveau A)** :
  Fournir une version de remplacement pour un média temporel ou une audio-description du contenu vidéo pré-enregistré pour un média synchronisé, excepté quand le média est un média de remplacement pour un texte et qu’il est clairement identifié comme tel.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F30 F67 SM6 SM7

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.2.1 Audio-only and Video-only (Prerecorded) (A)
  * 9.1.2.3 Audio Description or Media Alternative (Prerecorded) (A)

## 4.3 Chaque média temporel synchronisé pré-enregistré a-t-il, si nécessaire, des sous-titres synchronisés (hors cas particuliers) ?

### 4.3.1 Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, l’une de ces conditions (hors cas particuliers) ?

* Le média temporel synchronisé possède des sous-titres synchronisés ;
* Il existe une version alternative possédant des sous-titres synchronisés accessible via un lien ou bouton adjacent.

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés synchronisés ;
2. Pour chaque média temporel synchronisé, vérifier la présence :
   * Soit de sous-titres synchronisés ;
   * Soit d’une version alternative possédant des sous-titres synchronisés accessible au moyen d’un lien ou d’un bouton adjacent.
3. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.3.2 Pour chaque média temporel synchronisé pré-enregistré possédant des sous-titres synchronisés diffusés via une balise `<track>`, la balise `<track>` possède-t-elle un attribut `kind`="captions" ?

#### Méthodologie

1. Retrouver dans le document les médias temporels synchronisés possédant des sous-titres synchronisés au moyen d’un élément `<track>` ;
2. Pour chaque média temporel synchronisé, vérifier que la balise `<track>` possède un attribut `kind`="caption" ;
3. Si c’est le cas pour chaque média temporel synchronisé, le test est validé.

#### Cas particuliers

Voir cas particuliers critère 4.1.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.2.2 Sous-titres (pré-enregistrés) (Niveau A)** :
  Fournir des sous-titres pour tout contenu audio pré-enregistré dans un média synchronisé, excepté lorsque le média est un média de remplacement pour un texte et qu’il est clairement identifié comme tel.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G58 G93 G87 H95 SM11 SM12 F74 F75

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.2.2 Captions (Prerecorded) (A)

## 4.4 Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?

### 4.4.1 Pour chaque média temporel synchronisé pré-enregistré ayant des sous-titres synchronisés, ces sous-titres sont-ils pertinents ?

#### Méthodologie

1. Retrouver dans le document les médias temporels synchronisés possédant des sous-titres synchronisés ;
2. Pour chaque média temporel synchronisé, vérifier que les sous-titres sont :
   * Pertinents (toutes les informations sonores importantes sont présentes, les dialogues notamment) ;
   * Et correctement synchronisés.
3. Si c’est le cas pour chaque média temporel synchronisé, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.2.2 Sous-titres (pré-enregistrés) (Niveau A)** :
  Fournir des sous-titres pour tout contenu audio pré-enregistré dans un média synchronisé, excepté lorsque le média est un média de remplacement pour un texte et qu’il est clairement identifié comme tel.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G93 G87 SM11 SM12 F8 F74 F75

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.2.2 Captions (Prerecorded) (A)

## 4.5 Chaque média temporel pré-enregistré a-t-il, si nécessaire, une audiodescription synchronisée (hors cas particuliers) ?

### 4.5.1 Chaque média temporel pré-enregistré seulement vidéo vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?

* Il existe une audiodescription synchronisée ;
* Il existe une version alternative avec une audiodescription synchronisée.

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés seulement vidéo qui nécessitent une audiodescription ;
2. Pour chaque média temporel seulement vidéo, vérifier la présence :
   * Soit d’une audiodescription synchronisée ;
   * Soit d’une version alternative avec une audiodescription synchronisée accessible au moyen d’un bouton ou d’un lien adjacent (une URL ou une ancre).
3. Si c’est le cas pour chaque média temporel seulement vidéo, le test est validé.

### 4.5.2 Chaque média temporel synchronisé pré-enregistré vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?

* Il existe une audiodescription synchronisée ;
* Il existe une version alternative avec une audiodescription synchronisée.

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés synchronisés qui nécessitent une audiodescription ;
2. Pour chaque média temporel synchronisé, vérifier la présence :
   * Soit d’une audiodescription synchronisée ;
   * Soit d’une version alternative avec une audiodescription synchronisée accessible au moyen d’un bouton ou d’un lien adjacent (une URL ou une ancre).
3. Si c’est le cas pour chaque média temporel synchronisé, le test est validé.

#### Cas particuliers

Voir cas particuliers critère 4.1.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.2.5 Audio-description (pré-enregistrée) (Niveau AA)** :
  Fournir une audio-description pour tout contenu vidéo pré-enregistré, sous forme de média synchronisé.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G8 G58 G78 G173 H96 SM1 SM2 SM6 SM7

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.2.5 Audio Description (Prerecorded) (AA)

## 4.6 Pour chaque média temporel pré-enregistré ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?

### 4.6.1 Pour chaque média temporel pré-enregistré seulement vidéo ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?

#### Méthodologie

1. Retrouver dans le document les médias temporels seulement vidéo qui possèdent une audiodescription ;
2. Pour chaque média temporel, vérifier que l’audiodescription synchronisée est pertinente (toutes les informations visuelles qu’il est possible de vocaliser dans les blancs de la bande son principale sont présentes, les textes incrustés notamment) ;
3. Si c’est le cas pour chaque média temporel seulement vidéo, le test est validé.

### 4.6.2 Pour chaque média temporel synchronisé ayant une audiodescription synchronisée, celle-ci est-elle pertinente ?

#### Méthodologie

1. Retrouver dans le document les médias temporels synchronisés qui possèdent une audiodescription ;
2. Pour chaque média temporel, vérifier que l’audiodescription synchronisée est pertinente (toutes les informations visuelles qu’il est possible de vocaliser dans les blancs de la bande son principale sont présentes, les textes incrustés notamment) ;
3. Si c’est le cas pour chaque média temporel synchronisé, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.2.5 Audio-description (pré-enregistrée) (Niveau AA)** :
  Fournir une audio-description pour tout contenu vidéo pré-enregistré, sous forme de média synchronisé.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** SM1 SM2 SM6 SM7

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.2.5 Audio Description (Prerecorded) (AA)

## 4.7 Chaque média temporel est-il clairement identifiable (hors cas particuliers) ?

### 4.7.1 Pour chaque média temporel seulement son, seulement vidéo ou synchronisé, le contenu textuel adjacent permet-il d’identifier clairement le média temporel (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les médias temporels pré-enregistrés seulement vidéo, audio ou synchronisés ;
2. Pour chaque média temporel, vérifier que :
   * Un passage de texte (un titre ou un paragraphe, par exemple) qui précède ou suit immédiatement le média temporel, permet de l’identifier ;
   * Et le passage de texte est situé à l’extérieur du lecteur de contenu multimédia si ce dernier fait appel à la technologie Flash.
3. Si c’est le cas pour chaque média temporel, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque le média temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information). Dans cette situation, le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G68 G100

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 4.8 Chaque média non temporel a-t-il, si nécessaire, une alternative (hors cas particuliers) ?

### 4.8.1 Chaque média non temporel vérifie-t-il, si nécessaire, une de ces conditions (hors cas particuliers) ?

* Un lien ou un bouton adjacent, clairement identifiable, permet d’accéder à une page contenant une alternative ;
* Un lien ou un bouton adjacent, clairement identifiable, permet d’accéder à une alternative dans la page.

#### Méthodologie

1. Retrouver dans le document les médias non temporels ;
2. Pour chaque média non temporel, vérifier qu’un lien ou un bouton adjacent, clairement identifiable :
   * Soit contient l’adresse (url) d’une page contenant une alternative ;
   * Soit permet d’accéder à une alternative dans la page.
3. Si c’est le cas pour chaque média non temporel, le test est validé.

### 4.8.2 Chaque média non temporel associé à une alternative vérifie-t-il une de ces conditions (hors cas particuliers) ?

* La page référencée par le lien ou bouton adjacent est accessible ;
* L’alternative dans la page, référencée par le lien ou bouton adjacent, est accessible.

#### Méthodologie

1. Retrouver dans le document les médias non temporels associés à une alternative ;
2. Pour chaque média non temporel, vérifier que :
   * La page référencée par le lien ou le bouton adjacent est accessible ;
   * L’alternative dans la page, référencée par le lien ou le bouton adjacent, est accessible.
3. Si c’est le cas pour chaque média non temporel, le test est validé.

*Note : le critère est non applicable dans les situations où :*

Le média non temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information) ;

Le média non temporel est diffusé dans un environnement maîtrisé ;

Le média non temporel est inséré via JavaScript en vérifiant la présence et la version du plug-in, en remplacement d’un contenu alternatif déjà présent.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque :

Le média non temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information) ;

Le média non temporel est diffusé dans un environnement maîtrisé ;

Le média non temporel est inséré via JavaScript en vérifiant la présence et la version du plug-in, en remplacement d’un contenu alternatif déjà présent.

Dans ces situations, le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H35 H46

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 4.9 Pour chaque média non temporel ayant une alternative, cette alternative est-elle pertinente ?

### 4.9.1 Pour chaque média non temporel ayant une alternative, cette alternative permet-elle d’accéder au même contenu et à des fonctionnalités similaires ?

#### Méthodologie

1. Retrouver dans le document les médias non temporels associés à une alternative ;
2. Pour chaque média non temporel, vérifier que l’alternative est pertinente (elle permet d’accéder au même contenu et à des fonctionnalités similaires) ;
3. Si c’est le cas pour chaque média non temporel, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H46 F30

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 4.10 Chaque son déclenché automatiquement est-il contrôlable par l’utilisateur ?

### 4.10.1 Chaque séquence sonore déclenchée automatiquement via une balise `<object>`, `<video>`, `<audio>`, `<embed>`, `<bgsound>` ou un code JavaScript vérifie-t-elle une de ces conditions ?

* La séquence sonore a une durée inférieure ou égale à 3 secondes ;
* La séquence sonore peut être stoppée sur action de l’utilisateur ;
* Le volume de la séquence sonore peut être contrôlé par l’utilisateur indépendamment du contrôle de volume du système.

#### Méthodologie

1. Au chargement du document, si un son se déclenche automatiquement, vérifier que :
   * Soit la séquence sonore a une durée inférieure ou égale à 3 secondes ;
   * Soit un dispositif (un bouton par exemple), sur l’élément ayant déclenché le son (voir note), ou dans la page, permet de le stopper ;
   * Soit le volume de la séquence peut être contrôlé par l’utilisateur, indépendamment du contrôle de volume du système.
2. Si c’est le cas, le test est validé.

*Note : les éléments suivants sont susceptibles de déclencher des sons au chargement de la page : éléments `<audio>`, `<video>`, `<object>`, `<embed>`, `<bgsound>` ou un code JavaScript (utilisation de la Web Audio API, par exemple).*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.2 Contrôle du son (Niveau A)** :
  Si du son sur une page Web est audible automatiquement pendant plus de 3 secondes, un mécanisme est disponible pour le mettre en pause, l’arrêter ou pour en contrôler le volume de façon indépendante du niveau de volume du système général.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Voir l’exigence de conformité 5 : Non-interférence.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G60 G170 G171 F23 F93

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.2 Audio Control (A)

## 4.11 La consultation de chaque média temporel est-elle, si nécessaire, contrôlable par le clavier et tout dispositif de pointage ?

### 4.11.1 Chaque média temporel a-t-il, si nécessaire, les fonctionnalités de contrôle de sa consultation ?

#### Méthodologie

1. Retrouver dans le document les médias temporels ;
2. Pour chaque média temporel, vérifier la présence des fonctionnalités obligatoires de contrôle de la consultation :
   * Au minimum : lecture, pause ou stop ;
3. Si le média a du son, il doit avoir une fonctionnalité d’activation / désactivation du son ;
4. Si le média a des sous-titres, il doit avoir une fonctionnalité de contrôle de l’apparition/disparition des sous-titres ;
5. Si le média a une audiodescription, il doit avoir une fonctionnalité de contrôle de l’apparition/disparition de l’audiodescription.
6. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.11.2 Pour chaque média temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?

* La fonctionnalité est accessible par le clavier et tout dispositif de pointage ;
* Une fonctionnalité accessible par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.

#### Méthodologie

1. Retrouver dans le document les médias temporels pourvus de fonctionnalités de contrôle ;
2. Pour chaque média temporel, vérifier que :
   * Soit la fonctionnalité est accessible par le clavier et tout dispositif de pointage ;
   * Soit une fonctionnalité accessible par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.
3. Si c’est le cas pour chaque média temporel, le test est validé.

### 4.11.3 Pour chaque média temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?

* La fonctionnalité est activable par le clavier et tout dispositif de pointage ;
* Une fonctionnalité activable par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.

#### Méthodologie

1. Retrouver dans le document les médias temporels pourvus de fonctionnalités de contrôle ;
2. Pour chaque média temporel, vérifier que :
   * Soit la fonctionnalité est activable par le clavier et tout dispositif de pointage ;
   * Soit une fonctionnalité activable par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.
3. Si c’est le cas pour chaque média temporel, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.1.1 Clavier (Niveau A)** :
  Toutes les fonctionnalités du contenu sont utilisables à l’aide d’une interface clavier sans exiger un rythme de frappe propre à l’utilisateur, sauf lorsque la fonction sous-jacente nécessite une saisie qui dépend du tracé du mouvement effectué par l’utilisateur et pas seulement des points de départ et d’arrivée de ce tracé.

  * **Note** : Cette exception ne concerne que la fonction sous-jacente et non la technique de saisie. Par exemple, lorsqu’on utilise l’écriture manuscrite pour saisir du texte, la technique de saisie (l’écriture manuscrite) nécessite une saisie qui dépend d’un tracé, mais la fonction sous-jacente (la saisie de texte) ne le requiert pas.

  * **Note** : Cela n’interdit pas et ne devrait pas décourager l’utilisation de la souris ou de toute autre méthode de saisie en plus de l’utilisation du clavier.
* **2.1.2 Pas de piège au clavier (Niveau A)** :
  Si le focus du clavier peut être positionné sur un élément de la page à l’aide d’une interface clavier, réciproquement, il peut être déplacé hors de ce même composant simplement à l’aide d’une interface clavier et, si ce déplacement exige plus que l’utilisation d’une simple touche flèche ou tabulation ou toute autre méthode standard de sortie, l’utilisateur est informé de la méthode permettant de déplacer le focus hors de ce composant.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Voir l’exigence de conformité 5 : Non-interférence.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G4 G90 G202

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.1.1 Keyboard (A)
  * 9.2.1.2 No Keyboard Trap (A)

## 4.12 La consultation de chaque média non temporel est-elle contrôlable par le clavier et tout dispositif de pointage ?

### 4.12.1 Pour chaque média non temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?

* La fonctionnalité est accessible par le clavier et tout dispositif de pointage ;
* Une fonctionnalité accessible par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.

#### Méthodologie

1. Retrouver dans le document les médias non temporels pourvus de fonctionnalités de contrôle ;
2. Pour chaque média non temporel, vérifier que :
   * Soit la fonctionnalité est accessible par le clavier et tout dispositif de pointage ;
   * Soit une fonctionnalité accessible par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.
3. Si c’est le cas pour chaque média non temporel, le test est validé.

### 4.12.2 Pour chaque média non temporel, chaque fonctionnalité vérifie-t-elle une de ces conditions ?

* La fonctionnalité est activable par le clavier et tout dispositif de pointage ;
* Une fonctionnalité activable par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.

#### Méthodologie

1. Retrouver dans le document les médias non temporels pourvus de fonctionnalités de contrôle ;
2. Pour chaque média non temporel, vérifier que :
   * Soit la fonctionnalité est activable par le clavier et tout dispositif de pointage ;
   * Soit une fonctionnalité activable par le clavier et tout dispositif de pointage permettant de réaliser la même action est présente dans la page.
3. Si c’est le cas pour chaque média non temporel, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.1.1 Clavier (Niveau A)** :
  Toutes les fonctionnalités du contenu sont utilisables à l’aide d’une interface clavier sans exiger un rythme de frappe propre à l’utilisateur, sauf lorsque la fonction sous-jacente nécessite une saisie qui dépend du tracé du mouvement effectué par l’utilisateur et pas seulement des points de départ et d’arrivée de ce tracé.

  * **Note** : Cette exception ne concerne que la fonction sous-jacente et non la technique de saisie. Par exemple, lorsqu’on utilise l’écriture manuscrite pour saisir du texte, la technique de saisie (l’écriture manuscrite) nécessite une saisie qui dépend d’un tracé, mais la fonction sous-jacente (la saisie de texte) ne le requiert pas.

  * **Note** : Cela n’interdit pas et ne devrait pas décourager l’utilisation de la souris ou de toute autre méthode de saisie en plus de l’utilisation du clavier.
* **2.1.2 Pas de piège au clavier (Niveau A)** :
  Si le focus du clavier peut être positionné sur un élément de la page à l’aide d’une interface clavier, réciproquement, il peut être déplacé hors de ce même composant simplement à l’aide d’une interface clavier et, si ce déplacement exige plus que l’utilisation d’une simple touche flèche ou tabulation ou toute autre méthode standard de sortie, l’utilisateur est informé de la méthode permettant de déplacer le focus hors de ce composant.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Voir l’exigence de conformité 5 : Non-interférence.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G4 G90

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.1.1 Keyboard (A)
  * 9.2.1.2 No Keyboard Trap (A)

## 4.13 Chaque média temporel et non temporel est-il compatible avec les technologies d’assistance (hors cas particuliers) ?

### 4.13.1 Chaque média temporel et non temporel vérifie-t-il une de ces conditions (hors cas particuliers) ?

* Le nom, le rôle, la valeur, le paramétrage et les changements d’états des composants d’interfaces sont accessibles aux technologies d’assistance via une API d’accessibilité ;
* Une alternative compatible avec une API d’accessibilité permet d’accéder aux mêmes fonctionnalités.

#### Méthodologie

1. Retrouver dans le document les médias temporels et non temporels ;
2. Pour chaque média, vérifier que :
   * Soit le nom, le rôle, la valeur, le paramétrage et les changements d’états des composants d’interfaces sont accessibles aux technologies d’assistance via une API d’accessibilité (par exemple, les zones mises à jour dynamiquement dans un lecteur vidéo sont correctement restituées) ;
   * Soit une alternative compatible avec une API d’accessibilité permet d’accéder aux mêmes fonctionnalités.
3. Si c’est le cas pour chaque média temporel ou non temporel, le test est validé.

### 4.13.2 Chaque média temporel et non temporel qui possède une alternative compatible avec les technologies d’assistance, vérifie-t-il une de ces conditions ?

* L’alternative est adjacente au média temporel ou non temporel ;
* L’alternative est accessible via un lien ou bouton adjacent ;
* Un mécanisme permet de remplacer le média temporel ou non temporel par son alternative.

#### Méthodologie

1. Retrouver dans le document les médias temporels et non temporels qui possèdent une alternative compatible avec les technologies d’assistance ;
2. Pour chaque média, vérifier que :
   * Soit l’alternative est adjacente au média temporel ou non temporel ;
   * Soit l’alternative est accessible au moyen d’un lien ou d’un bouton adjacent ;
   * Soit un mécanisme permet de remplacer le média temporel ou non temporel par son alternative.
3. Si c’est le cas pour chaque média temporel ou non temporel, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque le média temporel ou non temporel est utilisé à des fins décoratives (c’est-à-dire qu’il n’apporte aucune information).

Dans ces situations, le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G10 G135 F15 F54

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.4.1.2 Name, role, Value (A)


# 5. Tableaux

## 5.1 Chaque tableau de données complexe a-t-il un résumé ?

### 5.1.1 Pour chaque tableau de données complexe, un résumé est-il disponible ?

#### Méthodologie

1. Retrouver dans le document les tableaux de données complexes (tableau de données - élément `<table>` ou élément pourvu d’un attribut WAI-ARIA `role`="table" - contenant des en-têtes qui ne sont pas répartis uniquement sur la première ligne et/ou la première colonne de la grille ou dont la portée n’est pas valable pour l’ensemble de la colonne ou de la ligne) ;
2. Pour chaque tableau de données complexe, vérifier qu’un passage de texte permettant de comprendre la nature et la structure du tableau, est présent :
   * Soit dans l’élément `<caption>` ;
   * Soit dans l’attribut `summary` de l’élément `<table>` (dans les versions de HTML et de XHTML antérieures à HTML 5) ;
   * Soit dans un passage de texte lié au tableau avec l’attribut `aria-describedby`.
3. Si c’est le cas pour chaque tableau de données complexe, le test est validé.

#### Notes techniques

La spécification HTML propose plusieurs méthodes pour lier un résumé à un tableau (tableau lié à un passage de texte avec l’attribut `aria-describedby`, tableau groupé dans un élément figure avec un résumé présent dans un élément figcaption ou un élément p, résumé présent dans un élément details contenu dans l’élément caption). Ces méthodes n’ont pas un support suffisant pour être utilisées actuellement.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H73

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 5.2 Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?

### 5.2.1 Pour chaque tableau de données complexe ayant un résumé, celui-ci est-il pertinent ?

#### Méthodologie

1. Retrouver dans le document les résumés de tableaux de données complexes (tels que déterminés par le test 5.1.1) ;
2. Pour chaque résumé, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque résumé de tableaux de données complexes, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H73

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 5.3 Pour chaque tableau de mise en forme, le contenu linéarisé reste-t-il compréhensible ?

### 5.3.1 Chaque tableau de mise en forme vérifie-t-il ces conditions ?

* Le contenu linéarisé reste compréhensible ;
* La balise `<table>` possède un attribut `role`="`presentation`".

#### Méthodologie

1. Retrouver dans le document les tableaux de mise en forme ;
2. Pour chaque tableau de mise en forme, vérifier que :
   * L’ordre d’accès aux cellules est cohérent avec le contenu ;
   * L’élément `<table>` est pourvu d’un attribut WAI-ARIA `role`="`presentation`".
3. Si c’est le cas pour chaque tableau de mise en forme, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F49 ARIA4

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.2 Meaningful Sequence (A)
  * 9.4.1.2 Name, Role, Value (A)

## 5.4 Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?

### 5.4.1 Pour chaque tableau de données ayant un titre, le titre est-il correctement associé au tableau de données ?

#### Méthodologie

1. Retrouver dans le document les tableaux de données pourvus d’un titre ;
2. Pour chaque titre, vérifier qu’il est fourni au moyen :
   * Soit d’un élément `<caption>` ;
   * Soit d’un attribut `title` ;
   * Soit d’un attribut WAI-ARIA `aria-label` ;
   * Soit d’un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte.
3. Si c’est le cas pour chaque titre de tableau de données, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H39

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 5.5 Pour chaque tableau de données ayant un titre, celui-ci est-il pertinent ?

### 5.5.1 Pour chaque tableau de données ayant un titre, ce titre permet-il d’identifier le contenu du tableau de données de manière claire et concise ?

#### Méthodologie

1. Retrouver dans le document les tableaux de données pourvus d’un titre ;
2. Pour chaque titre, vérifier qu’il est pertinent ;
3. Si c’est le cas pour chaque titre de tableau de données, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H39

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 5.6 Pour chaque tableau de données, chaque en-tête de colonne et chaque en-tête de ligne sont-ils correctement déclarés ?

### 5.6.1 Pour chaque tableau de données, chaque en-tête de colonne s’appliquant à la totalité de la colonne vérifie-t-il une de ces conditions ?

* L’en-tête de colonnes est structuré au moyen d’une balise `<th>` ;
* L’en-tête de colonnes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA `role`="`columnheader`".

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête de colonnes s’appliquant à la totalité de la colonne, vérifier que l’en-tête de colonne est structuré au moyen :
   * Soit d’un élément `<th>` ;
   * Soit d’un élément pourvu d’un attribut WAI-ARIA `role`="`columnheader`".
3. Si c’est le cas pour chaque en-tête de colonne s’appliquant à la totalité de la colonne, le test est validé.

### 5.6.2 Pour chaque tableau de données, chaque en-tête de ligne s’appliquant à la totalité de la ligne vérifie-t-il une de ces conditions ?

* L’en-tête de lignes est structuré au moyen d’une balise `<th>` ;
* L’en-tête de lignes est structuré au moyen d’une balise pourvue d’un attribut WAI-ARIA `role`="`rowheader`".

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête de ligne s’appliquant à la totalité de la ligne, vérifier que l’en-tête de ligne est structuré au moyen :
   * Soit d’un élément `<th>` ;
   * Soit d’un élément pourvu d’un attribut WAI-ARIA `role`="`rowheader`".
3. Si c’est le cas pour chaque en-tête de ligne s’appliquant à la totalité de la ligne, le test est validé.

### 5.6.3 Pour chaque tableau de données, chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne est-il structuré au moyen d’une balise `<th>` ?

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, vérifier que l’en-tête de ligne est structuré au moyen d’un élément `<th>` ;
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, le test est validé.

### 5.6.4 Pour chaque tableau de données, chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise `<td>` ou `<th>` ?

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque cellule associée à plusieurs en-têtes est-elle structurée au moyen d’une balise `<th>` ou `<td>` ;
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H51 F91

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 5.7 Pour chaque tableau de données, la technique appropriée permettant d’associer chaque cellule avec ses en-têtes est-elle utilisée (hors cas particuliers) ?

### 5.7.1 Pour chaque contenu de balise `<th>` s’appliquant à la totalité de la ligne ou de la colonne, la balise `<th>` respecte-t-elle une de ces conditions (hors cas particuliers) ?

* La balise `<th>` possède un attribut `id` unique ;
* La balise `<th>` possède un attribut `scope` ;
* La balise `<th>` possède un attribut WAI-ARIA `role`="`rowheader`" ou `role`="`columnheader`".

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) s’appliquant à la totalité de la ligne ou de la colonne, vérifier que l’élément `<th>` possède :
   * Soit un attribut `id` unique ;
   * Soit un attribut `scope` ;
   * Soit un attribut WAI-ARIA `role`="`rowheader`" ou "`columnheader`".
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne, le test est validé.

### 5.7.2 Pour chaque contenu de balise `<th>` s’appliquant à la totalité de la ligne ou de la colonne et possédant un attribut `scope`, la balise `<th>` vérifie-t-elle une de ces conditions ?

* La balise `<th>` possède un attribut `scope` avec la valeur "row" pour les en-têtes de ligne ;
* La balise `<th>` possède un attribut `scope` avec la valeur "col" pour les en-têtes de colonne.

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut `scope`, vérifier que l’attribut `scope` possède :
   * Soit une valeur "row" pour les en-têtes de ligne ;
   * Soit une valeur "col" pour les en-têtes de colonne.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut `scope`, le test est validé.

### 5.7.3 Pour chaque contenu de balise `<th>` ne s’appliquant pas à la totalité de la ligne ou de la colonne, la balise `<th>` vérifie-t-elle ces conditions ?

* La balise `<th>` ne possède pas d’attribut `scope` ;
* La balise `<th>` ne possède pas d’attribut WAI-ARIA `role`="`rowheader`" ou `role`="`columnheader`" ;
* La balise `<th>` possède un attribut `id` unique.

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête (élément `<th>`) ne s’appliquant pas à la totalité de la ligne ou de la colonne, vérifier que l’élément `<th>` :
   * Possède un attribut `id` unique ;
   * Et ne possède pas d’attribut `scope` ;
   * Et ne possède pas d’attribut WAI-ARIA `role`="`rowheader`" ou "`columnheader`".
3. Si c’est le cas pour chaque en-tête ne s’appliquant pas à la totalité de la ligne ou de la colonne, le test est validé.

### 5.7.4 Pour chaque contenu de balise `<td>` ou `<th>` associée à un ou plusieurs en-têtes possédant un attribut `id`, la balise vérifie-t-elle ces conditions ?

* La balise possède un attribut `headers` ;
* L’attribut `headers` possède la liste des valeurs d’attribut `id` des en-têtes associés.

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque élément `<td>` ou `<th>` associé à un ou plusieurs en-têtes possédant un attribut `id`, vérifier que :
   * L’élément `<td>` ou `<th>` possède un attribut `headers` ;
   * Et l’attribut `headers` possède la liste des valeurs d’attribut `id` des en-têtes associés.
3. Si c’est le cas pour chaque élément `<td>` ou `<th>` associé à un ou plusieurs en-têtes possédant un attribut `id`, le test est validé.

### 5.7.5 Pour chaque balise pourvue d’un attribut WAI-ARIA `role`="`rowheader`" ou `role`="`columnheader`" dont le contenu s’applique à la totalité de la ligne ou de la colonne, la balise vérifie-t-elle une de ces conditions ?

* La balise possède un attribut WAI-ARIA `role`="`rowheader`" pour les en-têtes de ligne ;
* La balise possède un attribut WAI-ARIA `role`="`columnheader`" pour les en-têtes de colonne.

#### Méthodologie

1. Retrouver dans le document les tableaux de données ;
2. Pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut WAI-ARIA `role`="`rowheader`" ou "`columnheader`", vérifier que l’élément possède :
   * Soit un attribut WAI-ARIA `role`="`rowheader`" pour les en-têtes de ligne ;
   * Soit un attribut WAI-ARIA `role`="`columnheader`" pour les en-têtes de colonne.
3. Si c’est le cas pour chaque en-tête s’appliquant à la totalité de la ligne ou de la colonne et pourvu d’un attribut WAI-ARIA `role`="`rowheader`" ou "`columnheader`", le test est validé.

#### Cas particuliers

Dans le cas de tableaux de données ayant des en-têtes sur une seule ligne ou une seule colonne, les en-têtes peuvent être structurés à l’aide de balise `<th>` sans attribut `scope`.

#### Notes techniques

Si l’attribut `headers` est implémenté sur une cellule déjà reliée à un en-tête (de ligne ou de colonne) avec l’attribut `scope` (avec la valeur col ou row), c’est l’en-tête ou les en-têtes référencés par l’attribut `headers` qui seront restitués aux technologies d’assistance. Les en-têtes reliés avec l’attribut `scope` seront ignorés.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H43 H63 F90

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 5.8 Chaque tableau de mise en forme ne doit pas utiliser d’éléments propres aux tableaux de données. Cette règle est-elle respectée ?

### 5.8.1 Chaque tableau de mise en forme (balise `<table>`) vérifie-t-il ces conditions ?

* Le tableau de mise en forme (balise `<table>`) n’a pas d’attribut `summary` (sinon vide) et ne contient pas de balises `<caption>`, `<th>`, `<thead>`, `<tfoot>` ou de balises ayant un attribut WAI-ARIA `role`="`rowheader`", `role`="`columnheader`" ;
* Les cellules du tableau de mise en forme (balises `<td>`) ne possèdent pas d’attributs `scope`, `headers` et axis.

#### Méthodologie

1. Retrouver dans le document les tableaux de mise en forme ;
2. Pour chaque tableau de mise en forme, vérifier que :
   * L’élément `<table>` ne possède pas d’attribut `summary`, d’éléments enfant `<caption>`, `<thead>`, `<th>`, `<tfoot>` ou d’éléments pourvus d’un attribut WAI-ARIA `role`=“`rowheader`” ou `role`=“`columnheader`” ;
   * Les éléments `<td>` ne possèdent pas d’attributs `scope`, `headers` et axis.
3. Si c’est le cas pour chaque tableau de mise en forme, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F46

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

# 6. Liens

## 6.1 Chaque lien est-il explicite (hors cas particuliers) ?

### 6.1.1 Chaque lien texte vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
* L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

#### Méthodologie

1. Retrouver dans le document les liens texte ;
2. Pour chaque lien texte, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
   * Soit l’intitulé du lien seul ;
   * Soit le contexte du lien.
3. Si c’est le cas pour chaque lien texte, le test est validé.

### 6.1.2 Chaque lien image vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
* L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

#### Méthodologie

1. Retrouver dans le document les liens image (lien avec pour contenu un élément `<img>` ou un élément ayant l’attribut WAI-ARIA `role`="img", un élément `<area>` possédant un attribut `href`, un élément `<object>`, un élément `<canvas>` ou un élément `<svg>`) ;
2. Pour chaque lien image, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
   * Soit l’intitulé du lien seul, fourni par l’alternative textuelle de l’image ;
   * Soit le contexte du lien.
3. Si c’est le cas pour chaque lien image, le test est validé.

### 6.1.3 Chaque lien composite vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
* L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

#### Méthodologie

1. Retrouver dans le document les liens composites (lien composé à la fois de contenu texte et d’éléments de type image) ;
2. Pour chaque lien composite, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
   * Soit l’intitulé du lien seul, fourni par la combinaison du contenu texte et de l’alternative textuelle de l’image ;
   * Soit le contexte du lien.
3. Si c’est le cas pour chaque lien composite, le test est validé.

### 6.1.4 Chaque lien SVG vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’intitulé de lien seul permet d’en comprendre la fonction et la destination ;
* L’intitulé de lien additionné au contexte du lien permet d’en comprendre la fonction et la destination.

#### Méthodologie

1. Retrouver dans le document les liens SVG (élément `<svg>` qui possède un élément `<a>` pourvu d’un attribut xlink-`href` (SVG 1.1) ou `href` (SVG 2)) ;
2. Pour chaque lien SVG, vérifier que ce qui permet d’en comprendre la fonction et la destination est :
   * Soit l’intitulé du lien seul, fourni par le nom accessible de l’élément `<svg>` (résolu généralement à partir du contenu d’un élément `<text>`) ;
   * Soit le contexte du lien.
3. Si c’est le cas pour chaque lien SVG, le test est validé.

### 6.1.5 Pour chaque lien ayant un intitulé visible, le nom accessible du lien contient-il au moins l’intitulé visible (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les liens autres que SVG dont le contenu est fourni à la fois par un intitulé visible et par le contenu soit d’un attribut `title` ou d’un attribut `aria-label` ou d’un attribut `aria-labelledby` ;
2. Pour chaque lien, vérifier que le contenu de l’attribut `title` ou de l’attribut `aria-label` ou de l’attribut `aria-labelledby` contient l’intitulé visible ;
3. Si c’est le cas pour chaque lien, le test est validé pour les liens autres que SVG.
4. Retrouver dans le document les liens SVG dont le contenu est fourni à la fois par un intitulé visible et par le contenu soit d’un attribut `aria-labelledby`, ou d’un attribut `aria-label` ou d’un élément `title` (enfant direct de l’élément `<svg>`) ou d’un attribut x-link:`title` (SVG 1.1) ou d’un ou plusieurs éléments `<text>`;
5. Pour chaque lien SVG, vérifier que le contenu de l’attribut `aria-labelledby` ou de l’attribut `aria-label` ou de l’élément `<title>` ou de l’attribut x-link:`title` ou d’un ou plusieurs éléments `<text>` contient l’intitulé visible ;
6. Si c’est le cas pour chaque lien SVG, le test est validé pour les liens SVG.
7. Si le test est validé à la fois pour les liens non SVG et pour les liens SVG, le test est globalement validé.

*Note : considérant la détermination du nom accessible, il existe deux cas particuliers et une particularité liée aux expressions mathématiques :*

La ponctuation et les lettres majuscules présentes dans le texte de l’intitulé visible peuvent être ignorées dans le nom accessible sans porter à conséquence.

Si le texte de l’intitulé visible sert de symbole, il ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir le point ci-dessous).

Si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (par exemple, “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).

#### Cas particuliers

Il existe une gestion de cas particuliers pour les tests 6.1.1, 6.1.2, 6.1.3 et 6.1.4 lorsque le lien est ambigu pour tout le monde. Dans cette situation, où il n’est pas possible de rendre le lien explicite dans son contexte, le critère est non applicable.

Il existe une gestion de cas particuliers pour le test 6.1.5 lorsque :

La ponctuation et les lettres majuscules sont présentes dans le texte de l’intitulé visible : elles peuvent être ignorées dans le nom accessible sans porter à conséquence ;

Le texte de l’intitulé visible sert de symbole : le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).

*Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).*

#### Notes techniques

Lorsque l’intitulé visible est complété par une autre expression dans le nom accessible :

WCAG insiste sur le placement de l’intitulé visible au début du nom accessible sans toutefois réserver l’exclusivité de cet emplacement ;

WCAG considère comme un cas d’échec une correspondance non exacte de la chaîne de caractères de l’intitulé visible au sein du nom accessible.

Par exemple, si l’on considère l’intitulé visible « Commander maintenant » complété dans le nom accessible par l’expression « produit X », on peut avoir les différents cas suivants :

« Commander maintenant produit X » est valide (bonne pratique) ;

« Produit X : commander maintenant » est valide ;

« Commander produit X maintenant » est non valide.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **2.4.4 Fonction du lien (selon le contexte) (Niveau A)** :
  La fonction de chaque lien est déterminée par le texte du lien seul ou par le texte du lien associé à un contexte du lien déterminé par un programme informatique, sauf si la fonction du lien est ambiguë pour tout utilisateur.
* **2.5.3 Étiquette dans le nom (Niveau A)** :
  Pour les composants d’interface utilisateur dont les étiquettes contiennent du texte ou du texte sous forme d’image, le nom contient le texte qui est présenté visuellement.

  * **Note** : Une bonne pratique consiste à placer le texte de l’étiquette au début du nom.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H30 H78 H79 H80 H81 G53 G91 F63 F89 ARIA7 ARIA8

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.2.4.4 Link Purpose (In Context) (A)
  * 9.2.5.3 Label in Name (A)

## 6.2 Dans chaque page web, chaque lien a-t-il un intitulé ?

### 6.2.1 Dans chaque page web, chaque lien a-t-il un intitulé entre `<a>` et `</a>` ?

#### Méthodologie

1. Retrouver dans le document les liens quels qu’ils soient ;
2. Pour chaque lien, vérifier que le contenu de l’élément `<a>` (ou d’un élément pourvu d’un attribut WAI-ARIA `role`=link) contient un intitulé (texte ou alternative) ;
3. Si c’est le cas pour chaque lien, le test est validé.

#### Notes techniques

Une ancre n’est pas un lien même si pendant longtemps l’élément `<a>` a servi de support à cette technique. Elle n’est donc pas concernée par le présent critère.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **2.4.4 Fonction du lien (selon le contexte) (Niveau A)** :
  La fonction de chaque lien est déterminée par le texte du lien seul ou par le texte du lien associé à un contexte du lien déterminé par un programme informatique, sauf si la fonction du lien est ambiguë pour tout utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H30 G91 F89

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.2.4.4 Link Purpose (In Context) (A)

# 7. Scripts

## 7.1 Chaque script est-il, si nécessaire, compatible avec les technologies d’assistance ?

### 7.1.1 Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il, si nécessaire, une de ces conditions ?

* Le nom, le rôle, la valeur, le paramétrage et les changements d’états sont accessibles aux technologies d’assistance via une API d’accessibilité ;
* Un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités est présent dans la page ;
* Une alternative accessible permet d’accéder aux mêmes fonctionnalités.

#### Méthodologie

1. Retrouver dans le document tous les composants d’interface générés ou contrôlés au moyen de JavaScript ;
2. Vérifier que :
   * Le composant possède un rôle cohérent avec son usage (généralement un bouton ou un lien) ;
   * Le composant possède un nom explicite ;
   * Le nom du composant est cohérent avec l’état de la fonctionnalité ou des contenus contrôlés (par exemple pour une fonctionnalité permettant d’afficher ou de masquer une zone de contenu).
   * Sinon, vérifier la présence d’un composant d’interface accessible permettant d’accéder aux mêmes fonctionnalités ;
   * Sinon, vérifier la présence d’une alternative accessible permettant d’accéder aux mêmes fonctionnalités.
3. Si c’est le cas, le test est validé.

### 7.1.2 Chaque script qui génère ou contrôle un composant d’interface respecte-t-il une de ces conditions ?

* Le composant d’interface est correctement restitué par les technologies d’assistance ;
* Une alternative accessible permet d’accéder aux mêmes fonctionnalités.

#### Méthodologie

1. Pour chacun des composants d’interface ayant validé le test 7.1.1, vérifier que le composant d’interface est correctement restitué par les technologies d’assistance ;
2. Sinon, vérifier qu’une alternative accessible au composant d’interface permet d’accéder aux mêmes fonctionnalités ;
3. Si c’est le cas, le test est validé.

### 7.1.3 Chaque script qui génère ou contrôle un composant d’interface vérifie-t-il ces conditions (hors cas particuliers) ?

* Le composant possède un nom pertinent ;
* Le nom accessible du composant contient au moins l’intitulé visible ;
* Le composant possède un rôle pertinent.

#### Méthodologie

1. Pour chacun des composants d’interface ayant validé le test 7.1.1, vérifier que le composant d’interface possède :
   * Un nom pertinent (intitulé visible) ;
   * Un rôle pertinent.
2. Si le composant d’interface possède un nom accessible, vérifier que ce nom est pertinent et contient au moins l’intitulé visible.
3. Si c’est le cas, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particuliers pour le test 7.1.3 lorsque :

La ponctuation et les lettres majuscules sont présentes dans le texte de l’intitulé visible : elles peuvent être ignorées dans le nom accessible sans porter à conséquence ;

Le texte de l’intitulé visible sert de symbole : le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).

*Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).*

#### Notes techniques

Le critère 7.1 implémente la notion de « compatible avec les technologies d’assistance » telle que définie par les WCAG, ainsi que le recours à WAI-ARIA pour rendre un composant ou une fonctionnalité accessible. Le bon usage de WAI-ARIA est vérifié via les tests 7.1.1, 7.1.2, 7.1.3.

Note importante : dans un environnement HTML5, beaucoup de composants peuvent nécessiter JavaScript pour fonctionner ; en conséquence la fourniture d’une alternative à un composant JavaScript qui ne pourrait pas être rendu accessible devra bénéficier d’une méthode spécifique au composant en cause, permettant de le remplacer par une alternative accessible (et de le réactiver). Cela signifie que la désactivation de JavaScript pour l’ensemble de la page ne sera pas acceptée comme une méthode valable, à moins qu’elle ne remette pas en cause l’utilisation des autres composants.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.5.3 Étiquette dans le nom (Niveau A)** :
  Pour les composants d’interface utilisateur dont les étiquettes contiennent du texte ou du texte sous forme d’image, le nom contient le texte qui est présenté visuellement.

  * **Note** : Une bonne pratique consiste à placer le texte de l’étiquette au début du nom.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G10 G135 G136 F15 F19 F20 F42 F59 F79 ARIA4 ARIA5 ARIA18 ARIA19 SCR21

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.5.3 Label in Name (A)
  * 9.4.1.2 Name, Role, Value (A)

## 7.2 Pour chaque script ayant une alternative, cette alternative est-elle pertinente ?

### 7.2.1 Chaque script débutant par la balise `<script>` et ayant une alternative vérifie-t-il une de ces conditions ?

* L’alternative entre `<noscript>` et `</noscript>` permet d’accéder à des contenus et des fonctionnalités similaires ;
* La page affichée, lorsque JavaScript est désactivé, permet d’accéder à des contenus et des fonctionnalités similaires ;
* La page alternative permet d’accéder à des contenus et des fonctionnalités similaires ;
* Le langage de script côté serveur permet d’accéder à des contenus et des fonctionnalités similaires ;
* L’alternative présente dans la page permet d’accéder à des contenus et des fonctionnalités similaires.

#### Méthodologie

1. Retrouver les alternatives aux fonctionnalités JavaScript :
   * Chercher dans la page, les alternatives à un composant ou une fonctionnalité JavaScript mises à disposition.
   * Désactiver JavaScript dans le document et retrouver les alternatives proposées.
2. Pour chacune des alternatives proposées, vérifier qu’elle permet d’accéder aux mêmes contenus et à des fonctionnalités similaires.
3. Si c’est le cas, le test est validé.

### 7.2.2 Chaque élément non textuel mis à jour par un script (dans la page, ou dans un cadre) et ayant une alternative vérifie-t-il ces conditions ?

* L’alternative de l’élément non textuel est mise à jour ;
* L’alternative mise à jour est pertinente.

#### Méthodologie

1. Retrouver dans le document tous les éléments non textuels mis à jour par une fonctionnalité JavaScript.
2. Si l’élément non textuel a une alternative, vérifier que :
   * L’alternative est mise à jour lorsque le contenu non textuel est mis à jour ;
   * L’alternative mise à jour est pertinente.
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G136 F19 F20

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.4.1.2 Name, Role, Value (A)

## 7.3 Chaque script est-il contrôlable par le clavier et par tout dispositif de pointage (hors cas particuliers) ?

### 7.3.1 Chaque élément possédant un gestionnaire d’événement contrôlé par un script vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’élément est accessible par le clavier et tout dispositif de pointage ;
* Un élément accessible par le clavier et tout dispositif de pointage permettant de réaliser la même action est présent dans la page.

#### Méthodologie

1. Retrouver dans le document, tous les éléments sur lesquels est implémenté un gestionnaire d’événements JavaScript (par exemple `click`, `focus`, `mouseover`, `blur`, `keydown`, `touch`…).
2. Vérifier que l’élément est accessible au moyen du clavier :
   * Il est atteignable avec la touche de tabulation (tab) ;
3. Si l’élément gère une action simple, il est activable au clavier avec la touche entrée (Entrée) ;
4. Si l’élément gère une action complexe, il est utilisable avec le clavier (généralement avec les touches de direction).
5. Sinon, vérifier qu’un élément accessible par le clavier permettant de réaliser la même action est présent dans la page.
6. Vérifier que l’élément est accessible par tout dispositif de pointage (souris, toucher, stylet…).
7. Sinon, vérifier qu’un élément accessible au moyen d’un dispositif de pointage et permettant de réaliser la même action est présent dans la page.
8. Si c’est le cas, le test est validé.

### 7.3.2 Un script ne doit pas supprimer le `focus` d’un élément qui le reçoit. Cette règle est-elle respectée (hors cas particuliers) ?

#### Méthodologie

1. Activer, l’un après l’autre, tous les éléments capables de recevoir le `focus`.
2. Vérifier que le `focus` n’est pas supprimé via une fonctionnalité JavaScript.
3. Si c’est le cas, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particuliers lorsque la fonctionnalité dépend de l’utilisation d’un gestionnaire d’événement sans équivalent universel ; par exemple, une application de dessin à main levée ne pourra pas être rendue contrôlable au clavier. Dans ces situations, le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **2.1.1 Clavier (Niveau A)** :
  Toutes les fonctionnalités du contenu sont utilisables à l’aide d’une interface clavier sans exiger un rythme de frappe propre à l’utilisateur, sauf lorsque la fonction sous-jacente nécessite une saisie qui dépend du tracé du mouvement effectué par l’utilisateur et pas seulement des points de départ et d’arrivée de ce tracé.

  * **Note** : Cette exception ne concerne que la fonction sous-jacente et non la technique de saisie. Par exemple, lorsqu’on utilise l’écriture manuscrite pour saisir du texte, la technique de saisie (l’écriture manuscrite) nécessite une saisie qui dépend d’un tracé, mais la fonction sous-jacente (la saisie de texte) ne le requiert pas.

  * **Note** : Cela n’interdit pas et ne devrait pas décourager l’utilisation de la souris ou de toute autre méthode de saisie en plus de l’utilisation du clavier.
* **2.4.7 Visibilité du focus (Niveau AA)** :
  Toute interface utilisable au clavier comporte un mode de fonctionnement où le focus est visible.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G90 G202 F42 F54 F55 SCR2 SCR20 SCR29 SCR35

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.2.1.1 Keyboard (A)
  * 9.2.4.7 Focus Visible (AA)

## 7.4 Pour chaque script qui initie un changement de contexte, l’utilisateur est-il averti ou en a-t-il le contrôle ?

### 7.4.1 Chaque script qui initie un changement de contexte vérifie-t-il une de ces conditions ?

* L’utilisateur est averti par un texte de l’action du script et du type de changement avant son déclenchement ;
* Le changement de contexte est initié par un bouton (input de type `submit`, button ou image ou balise `<button>`) explicite ;
* Le changement de contexte est initié par un lien explicite.

#### Méthodologie

1. Retrouver dans le document tous les événements JavaScript qui initient un changement de contexte, par exemple :
   * Une mise à jour dynamique de champs de formulaire ;
   * L’ouverture d’une nouvelle page à l’activation d’une option d’une liste de sélection (élément `<select>`) ;
   * La mise à jour, via un procédé AJAX d’une partie essentielle de la page ;
   * Le lancement automatique d’un lecteur vidéo suite à la sélection d’une playlist ;
   * La manipulation du `focus` ayant pour résultat de modifier la position courante de l’utilisateur dans la page.
2. Vérifier que :
   * L’utilisateur est averti par un message de l’action du script et du type de changement avant son déclenchement ;
   * Ou bien le changement de contexte est initié par un bouton (input de type `submit`, button ou image ou la balise button) explicite ;
   * Ou bien le changement de contexte est initié par un lien explicite.
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.2.1 Au focus (Niveau A)** :
  Quand un composant d’interface utilisateur reçoit le focus, il ne doit pas initier de changement de contexte.
* **3.2.2 À la saisie (Niveau A)** :
  Le changement de paramètre d’un composant d’interface utilisateur ne doit pas initier de changement de contexte à moins que l’utilisateur n’ait été avisé de ce comportement avant d’utiliser le composant.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G13 G76 G80 G107 H32 H84 F9 F22 F36 F37 F41 SCR19

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.2.1 On Focus (A)
  * 9.3.2.2 On Input (A)

## 7.5 Dans chaque page web, les messages de statut sont-ils correctement restitués par les technologies d’assistance ?

### 7.5.1 Chaque message de statut qui informe de la réussite, du résultat d’une action ou bien de l’état d’une application utilise-t-il l’attribut WAI-ARIA `role`="status" ?

#### Méthodologie

1. Retrouver dans le document les messages qui valent pour message de statut.
2. Pour chacun de ces messages, déterminer la nature de l’information dont est porteur le message :
3. Si le message informe de la réussite, du résultat d’une action ou bien de l’état d’une application, vérifier que l’élément qui contient le message :
   * Soit utilise l’attribut WAI-ARIA `role`=”status” ;
   * Soit utilise les attributs WAI-ARIA `aria-live`=”`polite`” et `aria-atomic`=”`true`”.
4. Si le message présente une suggestion, ou avertit de l’existence d’une erreur, vérifier que l’élément qui contient le message :
   * Soit utilise l’attribut WAI-ARIA `role`=”alert” ;
   * Soit utilise les attributs `aria-live`=”`assertive`” et `aria-atomic`=”`true`”.
5. Si le message indique la progression d’un processus, vérifier que l’élément qui contient le message :
   * Soit utilise l’un des attributs WAI-ARIA `role`=”log”, `role`=”progressbar” ou `role`=”status” ;
   * Soit utilise l’attribut WAI-ARIA `aria-live`=”`polite`” si l’intention est de signaler l’équivalent d’un rôle “log” ;
   * Soit utilise les attributs WAI-ARIA `aria-live`=”`polite`” et `aria-atomic`=”`true` si l’intention est de signaler l’équivalent d’un rôle “status”.
6. Si c’est le cas, le test est validé.

### 7.5.2 Chaque message de statut qui présente une suggestion, ou avertit de l’existence d’une erreur utilise-t-il l’attribut WAI-ARIA `role`="alert" ?

#### Méthodologie

1. Tests identiques à 7.5.1

### 7.5.3 Chaque message de statut qui indique la progression d’un processus utilise-t-il l’un des attributs WAI-ARIA `role`="log", `role`="progressbar" ou `role`="status" ?

#### Méthodologie

1. Tests identiques à 7.5.1

#### Notes techniques

Les rôles WAI-ARIA log, status et alert ont implicitement une valeur d’attribut WAI-ARIA `aria-live` et `aria-atomic`. On pourra donc considérer (conformément à la spécification WAI-ARIA 1.1) que :

Un attribut WAI-ARIA `aria-live`="`polite`" associé à un message de statut peut valoir pour un rôle WAI-ARIA log ;

Un attribut WAI-ARIA `aria-live`="`polite`" et un attribut WAI-ARIA `aria-atomic`="`true`" associés à un message de statut peuvent valoir pour un rôle WAI-ARIA status ;

Un attribut WAI-ARIA `aria-live`="`assertive`" et un attribut WAI-ARIA `aria-atomic`="`true`" associés à un message de statut peuvent valoir pour un rôle WAI-ARIA alert.

C’est sous réserve que la nature du message de statut satisfasse bien à la correspondance implicitement établie. Dans le cas d’un message de statut indiquant la progression d’un processus et matérialisé graphiquement par une barre de progression, un rôle WAI-ARIA progressbar explicite est nécessaire.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **4.1.3 Messages d’état (Niveau AA)** :
  Dans un contenu implémenté via un langage de balisage, les messages d’état peuvent être déterminés par un programme informatique grâce à un rôle ou des propriétés afin qu’ils puissent être présentés à l’utilisateur par des technologies d’assistance sans recevoir le focus.

  * **5. Conformité§** : Cette section reprend les exigences de conformité aux WCAG 2.1. Elle explique aussi comment faire une déclaration de conformité, ce qui est optionnel. Finalement, elle décrit la signification du terme compatible avec l’accessibilité puisque la conformité ne peut dépendre que des technologies qui sont utilisées de manière compatible avec l’accessibilité. Le document Comprendre la conformité (en anglais) comprend des explications plus précises sur la notion de compatibilité avec l’accessibilité.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** ARIA19 ARIA22 ARIA23

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.4.1.3 Status Messages (AA)

# 8. Éléments obligatoires

## 8.1 Chaque page web est-elle définie par un type de document ?

### 8.1.1 Pour chaque page web, le type de document (balise doctype) est-il présent ?

#### Méthodologie

1. Retrouver dans le document la balise DOCTYPE (par exemple <!DOCTYPE html>) ;
2. Vérifier que :
   * La balise DOCTYPE est placée avant la balise `<html>` ;
   * Le type de document est valide.
3. Si c’est le cas, le test est validé.

### 8.1.2 Pour chaque page web, le type de document (balise doctype) est-il valide ?

#### Méthodologie

1. Tests identiques à 8.1.1

### 8.1.3 Pour chaque page web possédant une déclaration de type de document, celle-ci est-elle située avant la balise `<html>` dans le code source ?

#### Méthodologie

1. Tests identiques à 8.1.1

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **4.1.1 Analyse syntaxique (Niveau A)** :
  À moins que les spécifications ne le permettent, dans un contenu implémenté via un langage de balisage, les éléments ont des balises de début et de fin complètes, ils sont imbriqués conformément à leurs spécifications, ils ne contiennent pas d’attributs dupliqués et chaque ID est unique.

  * **Note** : Les balises de début et de fin auxquelles il manque un caractère critique, comme un chevron fermant ou un guillemet pour une valeur d’attribut, sont considérées incomplètes.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G134 G192

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.4.1.1 Parsing (A)

## 8.2 Pour chaque page web, le code source généré est-il valide selon le type de document spécifié ?

### 8.2.1 Pour chaque déclaration de type de document, le code source généré de la page vérifie-t-il ces conditions ?

* Les balises, attributs et valeurs d’attributs respectent les règles d’écriture ;
* L’imbrication des balises est conforme ;
* L’ouverture et la fermeture des balises sont conformes ;
* Les valeurs d’attribut `id` sont uniques dans la page ;
* Les attributs ne sont pas doublés sur un même élément.

#### Méthodologie

1. Dans le menu « Check », activer l’option « W3C Nu markup checker (all frames) ».
2. Dans la page de résultats, vérifier que :
   * Les balises, attributs et valeurs d’attributs respectent les règles d’écriture ;
   * L’imbrication des balises est conforme ;
   * L’ouverture et la fermeture des balises sont conformes ;
   * Les valeurs d’attribut `id` sont uniques dans la page ;
   * Les attributs ne sont pas doublés sur un même élément.
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **4.1.1 Analyse syntaxique (Niveau A)** :
  À moins que les spécifications ne le permettent, dans un contenu implémenté via un langage de balisage, les éléments ont des balises de début et de fin complètes, ils sont imbriqués conformément à leurs spécifications, ils ne contiennent pas d’attributs dupliqués et chaque ID est unique.

  * **Note** : Les balises de début et de fin auxquelles il manque un caractère critique, comme un chevron fermant ou un guillemet pour une valeur d’attribut, sont considérées incomplètes.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H74 H93 H94 F70 F77

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.4.1.1 Parsing (A)
  * 9.4.1.2 Name, Role, Value (A)

## 8.3 Dans chaque page web, la langue par défaut est-elle présente ?

### 8.3.1 Pour chaque page web, l’indication de langue par défaut vérifie-t-elle une de ces conditions ?

* L’indication de la langue de la page (attribut `lang` et/ou xml:`lang`) est donnée pour l’élément html ;
* L’indication de la langue de la page (attribut `lang` et/ou xml:`lang`) est donnée sur chaque élément de texte ou sur l’un des éléments parents.

#### Méthodologie

1. Retrouver dans le document l’indication de langue par défaut ;
2. Vérifier la présence d’une indication de langue :
   * Soit au moyen de l’attribut `lang` sur la balise html si le code est du HTML5 ou du HTML4 ;
   * Soit au moyen des attributs `lang` et xml:`lang` sur la balise html si le code est du XHTML 1.0 ;
   * Soit au moyen de l’attribut xml:`lang` sur la balise html si le code est du XHTML 1.1 ;
   * Sinon, vérifier la présence d’une indication de langue sur chaque élément de texte ou l’un de ses parents.
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.1.1 Langue de la page (Niveau A)** :
  La langue par défaut de chaque page Web peut être déterminée par un programme informatique.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H57

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.1.1 Language of Page (A)

## 8.4 Pour chaque page web ayant une langue par défaut, le code de langue est-il pertinent ?

### 8.4.1 Pour chaque page web ayant une langue par défaut, le code de langue vérifie-t-il ces conditions ?

* Le code de langue est valide ;
* Le code de langue est pertinent.

#### Méthodologie

1. Retrouver dans le document l’indication de langue par défaut ;
2. Vérifier la présence d’un code de langue :
   * Valide (conforme à la norme ISO 639-1 ou ISO 639-2 et suivantes) ;
   * Et pertinent (qui indique la langue principale du document).
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.1.1 Langue de la page (Niveau A)** :
  La langue par défaut de chaque page Web peut être déterminée par un programme informatique.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H57

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.1.1 Language of Page (A)

## 8.5 Chaque page web a-t-elle un titre de page ?

### 8.5.1 Chaque page web a-t-elle un titre de page (balise `<title>`) ?

#### Méthodologie

1. Test 8.5.1
2. Retrouver dans le document le titre structuré au moyen d’un élément `<title>` ;
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.2 Titre de page (Niveau A)** :
  Les pages Web présentent un titre qui décrit leur sujet ou leur but.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G88 G127 H25

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.2 Page Titled (A)

## 8.6 Pour chaque page web ayant un titre de page, ce titre est-il pertinent ?

### 8.6.1 Pour chaque page web ayant un titre de page (balise `<title>`), le contenu de cette balise est-il pertinent ?

#### Méthodologie

1. Retrouver dans le document le titre structuré au moyen d’un élément `<title>` ;
2. Vérifier si le contenu de l’élément `<title>` est suffisamment pertinent (il permet de retrouver la page dans l’historique de navigation ou la liste des onglets).
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.2 Titre de page (Niveau A)** :
  Les pages Web présentent un titre qui décrit leur sujet ou leur but.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G88 G127 H25

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.2 Page Titled (A)

## 8.7 Dans chaque page web, chaque changement de langue est-il indiqué dans le code source (hors cas particuliers) ?

### 8.7.1 Dans chaque page web, chaque texte écrit dans une langue différente de la langue par défaut vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’indication de langue est donnée sur l’élément contenant le texte (attribut `lang` et/ou xml:`lang`) ;
* L’indication de langue est donnée sur un des éléments parents (attribut `lang` et/ou xml:`lang`)

#### Méthodologie

1. Retrouver les passages de texte en langue étrangère, à l’exception :
   * Des noms propres ;
   * Des mots d’origine étrangère, présents dans le dictionnaire de la langue du document ;
   * Des mots d’origine étrangère et d’usage courant dont la prononciation ne provoque pas d’incompréhension.
2. Vérifier que chaque passage de texte retenu possède une indication de langue (attribut `lang` et/ou xml:`lang` sur l’élément lui-même ou l’un de ses parents).
3. Si c’est le cas, le test est validé.

#### Cas particuliers

Il y a une gestion de cas particuliers sur le changement de langue pour les cas suivants :

Nom propre, le critère est non applicable ;

Nom commun de langue étrangère présent dans le dictionnaire officiel de la langue (voir note 1 ci-dessous) par défaut de la page web, le critère est non applicable ;

Le terme de langue étrangère soumis, via un champ de formulaire et rappelé dans la page (par exemple comme indication du terme recherché dans le cas d’un moteur de recherche), le critère est non applicable ;

Passage de texte dont la langue ne peut pas être déterminée : le critère est non applicable ;

Terme ou passage de texte issus d’une langue morte ou imaginaire pour laquelle il n’existe pas d’interprétation vocale : le critère est non applicable.

Note 1 : le dictionnaire officiel est celui recommandé par l’académie en charge de la langue en question. Pour la France, par exemple, le lien vers le dictionnaire officiel se trouve sur le site de l’Académie française à l’adresse suivante : http://www.academie-francaise.fr/le-dictionnaire/la-9e-edition. Pour toute demande auprès du service du dictionnaire de l’Académie française, utiliser le formulaire de contact du service du dictionnaire.

Note 2 : pour les noms communs de langue étrangère, absents dans le dictionnaire officiel de la langue par défaut de la page web, et qui sont passés dans le langage commun (exemple : newsletter) : le critère est applicable, uniquement lorsque l’absence d’indication de langue peut provoquer une incompréhension pour la restitution.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.1.2 Langue d’un passage (Niveau AA)** :
  La langue de chaque passage ou expression du contenu peut être déterminée par un programme informatique sauf pour un nom propre, pour un terme technique, pour un mot dont la langue est indéterminée ou pour un mot ou une expression faisant partie du langage courant de la langue utilisée dans le contexte immédiat.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H58

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.1.2 Language of Parts (AA)

## 8.8 Dans chaque page web, le code de langue de chaque changement de langue est-il valide et pertinent ?

### 8.8.1 Pour chaque page web, le code de langue de chaque changement de langue vérifie-t-il ces conditions ?

* Le code de langue est valide ;
* Le code de langue est pertinent.

#### Méthodologie

1. Pour chaque passage de texte validé au test 8.7.1, vérifier que :
   * L’indication de langue est valide ;
   * L’indication de langue est pertinente.
2. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.1.2 Langue d’un passage (Niveau AA)** :
  La langue de chaque passage ou expression du contenu peut être déterminée par un programme informatique sauf pour un nom propre, pour un terme technique, pour un mot dont la langue est indéterminée ou pour un mot ou une expression faisant partie du langage courant de la langue utilisée dans le contexte immédiat.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H58

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.1.2 Language of Parts (AA)

## 8.9 Dans chaque page web, les balises ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?

### 8.9.1 Dans chaque page web les balises (à l’exception de `<div>`, `<span>` et `<table>`) ne doivent pas être utilisées uniquement à des fins de présentation. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document l’ensemble des éléments sémantiques utilisés à des fins de présentation ;
2. Pour chacun de ces éléments, vérifier que :
   * L’élément est pourvu d’un attribut `role`=“`presentation`” ;
   * L’utilisation de cet élément à des fins de présentation reste justifée.
3. Si c’est le cas, le test est validé.

*Note : Quelques exemples, non exhaustifs de détournement de balisage : un élément `<div>` utilisé comme paragraphe, un titre utilisé comme légende, un élément `<blockquote>` ou des paragraphes vides ou encore des espaces utilisés pour créer des effets de marges. L’utilisation d’un `role`=“`presentation`” est formellement déconseillée, mais peut toutefois se justifier dans de rares cas. Cela peut être acceptable sur un élément `<blockquote>` ou un paragraphe vide, mais sera considéré comme non-conforme sur un titre. Le cas des tableaux : à noter que ce test aborde les tableaux de présentation qui ne devraient finalement pas apparaître au sein de la thématique Tableaux.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G115 H88 F43 F92

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 8.10 Dans chaque page web, les changements du sens de lecture sont-ils signalés ?

### 8.10.1 Dans chaque page web, chaque texte dont le sens de lecture est différent du sens de lecture par défaut est contenu dans une balise possédant un attribut dir ?

#### Méthodologie

1. Retrouver dans le document les passages de textes qui utilisent une langue qui se lit dans le sens inverse de la langue du document (comme l’arabe ou l’hébreu pour le français par exemple).
2. Pour chaque passage de texte, vérifier que le passage de texte est contenu dans une balise qui possède un attribut dir.
3. Si c’est le cas pour chaque passage de texte, le test est validé.

### 8.10.2 Dans chaque page web, chaque changement du sens de lecture (attribut dir) vérifie-t-il ces conditions ?

* La valeur de l’attribut dir est conforme (rtl ou ltr) ;
* La valeur de l’attribut dir est pertinente.

#### Méthodologie

1. Pour chaque passage de texte validé au test 8.10.1, vérifier que :
   * L’indication de sens de lecture est conforme (ltr, pour le sens « de gauche à droite » et rtl pour le sens « de droite à gauche ») ;
   * L’indication de sens de lecture est pertinente.
2. Si c’est le cas pour chaque passage de texte, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H56

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.2 Meaningful Sequence (A)

# 9. Structuration de l’information

## 9.1 Dans chaque page web, l’information est-elle structurée par l’utilisation appropriée de titres ?

### 9.1.1 Dans chaque page web, la hiérarchie entre les titres (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role`="heading" associé à un attribut WAI-ARIA `aria-level`) est-elle pertinente ?

#### Méthodologie

1. Retrouver dans le document les titres (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role`="heading" associé à un attribut WAI-ARIA `aria-level`) ;
2. Vérifier que la hiérarchie entre les titres est pertinente ;
3. Si c’est le cas, le test est validé.

### 9.1.2 Dans chaque page web, le contenu de chaque titre (balise `<hx>` ou balise possédant un attribut WAI-ARIA `role`="heading" associé à un attribut WAI-ARIA `aria-level`) est-il pertinent ?

#### Méthodologie

1. Pour chaque titre identifié au test 9.1.1, vérifier que son contenu est pertinent ;
2. Si c’est le cas pour chaque titre, le test est validé.

### 9.1.3 Dans chaque page web, chaque passage de texte constituant un titre est-il structuré à l’aide d’une balise `<hx>` ou d’une balise possédant un attribut WAI-ARIA `role`="heading" associé à un attribut WAI-ARIA `aria-level` ?

#### Méthodologie

1. Pour chaque titre identifié au test 9.1.1, vérifier que :
   * Soit il est structuré au moyen d’une balise `<hx>` (“x” désignant une valeur numérique comprise entre 1 et 6);
   * Soit il est structuré au moyen d’une balise possédant un attribut WAI-ARIA `role`="heading" et un attribut WAI-ARIA `aria-level`=x (“x” désignant une valeur numérique).
2. Si c’est le cas pour chaque titre, le test est validé.

#### Notes techniques

WAI-ARIA permet de définir des titres via le rôle heading et l’attribut `aria-level` (indication du niveau de titre). Bien qu’il soit préférable d’utiliser l’élément de titre natif en HTML `<hx>`, l’utilisation du rôle WAI-ARIA heading est compatible avec l’accessibilité.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **2.4.1 Contourner des blocs (Niveau A)** :
  Un mécanisme permet de contourner les blocs de contenu qui sont répétés sur plusieurs pages Web.
* **2.4.6 En-têtes et étiquettes (Niveau AA)** :
  Les en-têtes et les étiquettes décrivent le sujet ou le but.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G115 G130 H42 G141 ARIA4 ARIA12

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**

9.1.3.1 Info and Relationships (A)
9.2.4.1 Bypass Blocks (A)
9.2.4.6 Headings and Labels (AA)
9.4.1.2 Name, Role, Value (A)
## 9.2 Dans chaque page web, la structure du document est-elle cohérente (hors cas particuliers) ?

### 9.2.1 Dans chaque page web, la structure du document vérifie-t-elle ces conditions (hors cas particuliers) ?

* La zone d’en-tête de la page est structurée via une balise `<header>` ;
* Les zones de navigation principales et secondaires sont structurées via une balise `<nav>` ;
* La balise `<nav>` est réservée à la structuration des zones de navigation principales et secondaires ;
* La zone de contenu principal est structurée via une balise `<main>` ;
* La structure du document utilise une balise `<main>` visible unique ;
* La zone de pied de page est structurée via une balise `<footer>`.

#### Méthodologie

1. Vérifier que la zone d’en-tête est structurée au moyen d’un élément `<header>` ;
2. Vérifier que les zones de navigation principales et secondaires sont structurées au moyen d’un élément `<nav>` ;
3. Vérifier que l’élément `<nav>` n’est pas utilisé en dehors de la structuration des zones de navigation principales et secondaires ;
4. Vérifier que la zone de contenu principal est structurée au moyen d’un élément `<main>` ;
5. Si le document possède plusieurs éléments `<main>`, vérifier qu’un seul de ces éléments est visible (les autres occurrences de l’élément sont pourvues d’un attribut `hidden`) ;
6. Vérifier que la zone de pied de page est structurée au moyen d’un élément `<footer>`.
7. Si c’est le cas pour chaque zone de contenu, le test est validé.

#### Cas particuliers

Lorsque le doctype déclaré dans la page n’est pas le doctype HTML5, ce critère est non applicable.

#### Notes techniques

La balise `<main>` peut être utilisée plusieurs fois dans le même document HTML. Néanmoins, il ne peut y avoir en permanence qu’une seule balise visible et lisible par les technologies d’assistances, les autres devant disposer d’un attribut `hidden` ou d’un `style` permettant de les masquer aux technologies d’assistances. À noter cependant que l’utilisation d’un `style` seul restera insuffisante pour assurer l’unicité d’une balise `<main>` visible en cas de désactivation des feuilles de styles.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G115 ARIA11

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**

9.1.3.1 Info and Relationships (A)
## 9.3 Dans chaque page web, chaque liste est-elle correctement structurée ?

### 9.3.1 Dans chaque page web, les informations regroupées visuellement sous forme de liste non ordonnée vérifient-elles une de ces conditions ?

* La liste utilise les balises HTML `<ul>` et `<li>` ;
* La liste utilise les attributs WAI-ARIA `role`="list" et `role`="listitem".

#### Méthodologie

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste non ordonnée ;
2. Pour chaque liste, vérifier que la liste est structurée :
   * Soit au moyen des éléments `<ul>` et `<li>` ;
   * Soit au moyen d’éléments pourvus d’attributs WAI-ARIA `role`="list" et `role`="listitem".
3. Si c’est le cas pour chaque liste non ordonnée, le test est validé.

### 9.3.2 Dans chaque page web, les informations regroupées visuellement sous forme de liste ordonnée vérifient-elles une de ces conditions ?

* La liste utilise les balises HTML `<ol>` et `<li>` ;
* La liste utilise les attributs WAI-ARIA `role`="list" et `role`="listitem".

#### Méthodologie

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste ordonnée ;
2. Pour chaque liste, vérifier que la liste est structurée :
   * Soit au moyen des éléments `<ol>` et `<li>` ;
   * Soit au moyen d’éléments pourvus d’attributs WAI-ARIA `role`="list" et `role`="listitem".
3. Si c’est le cas pour chaque liste ordonnée, le test est validé.

### 9.3.3 Dans chaque page web, les informations regroupées sous forme de liste de description utilisent-elles les balises `<dl>` et `<dt>`/`<dd>` ?

#### Méthodologie

1. Retrouver dans le document les éléments regroupés visuellement sous la forme d’une liste de description ;
2. Pour chaque liste, vérifier que la liste est structurée au moyen des éléments `<dl>`, `<dt>` et `<dd>` ;
3. Si c’est le cas pour chaque liste de description, le test est validé.

#### Notes techniques

Les attributs WAI-ARIA `role`="list" et `role`="listitem" peuvent nécessiter l’utilisation des attributs WAI-ARIA `aria-setsize` et `aria-posinset` dans le cas où l’ensemble de la liste n’est pas disponible via le DOM généré au moment de la consultation.

Les attributs WAI-ARIA `role`="tree", `role`="tablist", `role`="menu", `role`="combobox" et `role`="listbox" ne sont pas équivalents à une liste HTML `<ul>` ou `<ol>`.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G115 G153 H40 H48 F2

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**

9.1.3.1 Info and Relationships (A)
## 9.4 Dans chaque page web, chaque citation est-elle correctement indiquée ?

### 9.4.1 Dans chaque page web, chaque citation courte utilise-t-elle une balise `<q>` ?

#### Méthodologie

1. Retrouver dans le document les citations courtes (ou en ligne) ;
2. Pour chaque citation, vérifier que la citation est structurée au moyen d’un élément `<q>` ;
3. Si c’est le cas pour chaque citation courte, le test est validé.

### 9.4.2 Dans chaque page web, chaque bloc de citation utilise-t-il une balise `<blockquote>` ?

#### Méthodologie

1. Retrouver dans le document les blocs de citation ;
2. Pour chaque bloc de citation, vérifier que le bloc de citation est structuré au moyen d’un élément `<blockquote>` ;
3. Si c’est le cas pour chaque bloc de citation, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G115 H49 F2

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**

9.1.3.1 Info and Relationships (A)
Haut de page
# 10. Présentation de l’information

## 10.1 Dans le site web, des feuilles de styles sont-elles utilisées pour contrôler la présentation de l’information ?

### 10.1.1 Dans chaque page web, les balises servant à la présentation de l’information ne doivent pas être présentes dans le code source généré des pages. Cette règle est-elle respectée ?

#### Méthodologie

1. Vérifier l’absence des éléments de présentation `<basefont>`, `<big>`, `<blink>`, `<center>`, `<font>`, `<marquee>`, `<s>`, `<strike>`, `<tt>` ;
2. Vérifier l’absence de l’élément `<u>` uniquement si le DOCTYPE du document ne correspond pas à HTML 5 ;
3. Si c’est le cas, le test est validé.

### 10.1.2 Dans chaque page web, les attributs servant à la présentation de l’information ne doivent pas être présents dans le code source généré des pages. Cette règle est-elle respectée ?

#### Méthodologie

1. Vérifier l’absence des attributs de présentation : align, alink, background, bgcolor, border, cellpadding, cellspacing, char, charoff, clear, color, compact, frameborder, hspace, link, marginheight, marginwidth, text, valign, vlink, vspace, size(exception faite de l’élément `<select>`), width (exception faite des éléments `<img>`, `<object>`, `<embed>`, `<canvas>` et `<svg>`), height (exception faite des éléments `<img>`, `<object>`, `<embed>`, `<canvas>` et `<svg>`) ;
2. Si c’est le cas, le test est validé.

### 10.1.3 Dans chaque page web, l’utilisation des espaces vérifie-t-elle ces conditions ?

* Les espaces ne sont pas utilisées pour séparer les lettres d’un mot ;
* Les espaces ne sont pas utilisées pour simuler des tableaux ;
* Les espaces ne sont pas utilisées pour simuler des colonnes de texte.

#### Méthodologie

1. Désactiver les styles (CSS) du document ;
2. Vérifier l’absence d’espaces utilisées :
   * Entre les lettres d’un mot ;
3. Pour créer des effets de marges ou d’alignement ;
4. Pour simuler des tableaux ou des colonnes.
5. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G140 F32 F33 F34 F48 C6 C8 C18 C22

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.1.3.2 Meaningful Sequence (A)

## 10.2 Dans chaque page web, le contenu visible porteur d’information reste-t-il présent lorsque les feuilles de styles sont désactivées ?

### 10.2.1 Dans chaque page web, l’information reste-t-elle présente lorsque les feuilles de styles sont désactivées ?

#### Méthodologie

1. Désactiver les styles (CSS) du document ;
2. Comparer le document dépourvu de styles avec le document mis en forme ;
3. Vérifier si dans le document dépourvu de styles, les contenus visibles porteurs d’information restent présents ;
4. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G140 F3 F87

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.1.3.1 Info and Relationships (A)

## 10.3 Dans chaque page web, l’information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?

### 10.3.1 Dans chaque page web, l’information reste-t-elle compréhensible lorsque les feuilles de styles sont désactivées ?

#### Méthodologie

1. Désactiver les styles (CSS) du document ;
2. Vérifier que l’ordre dans lequel les contenus sont implémentés ne pose pas de problème de compréhension ;
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.
* **2.4.3 Parcours du focus (Niveau A)** :
  Si une page Web peut être parcourue de façon séquentielle et que les séquences de navigation affectent la signification ou l’action, les éléments reçoivent le focus dans un ordre qui préserve la signification et l’opérabilité.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G59 G140 F1

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.2 Meaningful Sequence (A)
  * 9.2.4.3 Focus Order (A)

## 10.4 Dans chaque page web, le texte reste-t-il lisible lorsque la taille des caractères est augmentée jusqu’à 200 %, au moins (hors cas particuliers) ?

### 10.4.1 Dans chaque page web, l’augmentation de la taille des caractères jusqu’à 200 %, au moins, ne doit pas provoquer de perte d’information. Cette règle est-elle respectée selon une de ces conditions (hors cas particuliers) ?

* Lors de l’utilisation de la fonction d’agrandissement du texte du navigateur ;
* Lors de l’utilisation des fonctions de zoom graphique du navigateur ;
* Lors de l’utilisation d’un composant d’interface propre au site permettant d’agrandir le texte ou de zoomer.

#### Méthodologie

1. Vérifier dans le document si les textes restent présents et lisibles lorsque :
   * Le zoom texte du navigateur est réglé à 200 % ;
   * Le zoom graphique du navigateur est réglé à 200 % ;
   * Les fonctionnalités de zoom personnalisées proposé par le document sont utilisés.
2. Si c’est le cas, le test est validé.

### 10.4.2 Dans chaque page web, l’augmentation de la taille des caractères jusqu’à 200 %, au moins, doit être possible pour l’ensemble du texte dans la page. Cette règle est-elle respectée selon une de ces conditions (hors cas particuliers) ?

* Lors de l’utilisation de la fonction d’agrandissement du texte du navigateur ;
* Lors de l’utilisation des fonctions de zoom graphique du navigateur ;
* Lors de l’utilisation d’un composant d’interface propre au site permettant d’agrandir le texte ou de zoomer.

#### Méthodologie

1. Vérifier dans le document si les textes sont effectivement agrandis lorsque :
   * Le zoom texte du navigateur est réglé à 200 % ;
   * Le zoom graphique du navigateur est réglé à 200 % ;
   * Les fonctionnalités de zoom personnalisées proposé par le document sont utilisés.
2. Si c’est le cas, le test est validé.

#### Cas particuliers

Font exception à ce critère, les contenus pour lesquels l’utilisateur n’a pas de possibilité de personnalisation :

Les sous-titres incrustés dans une vidéo ;

Les textes en image ;

Le texte au sein d’une balise `<canvas>`.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.4 Redimensionnement du texte (Niveau AA)** :
  À l’exception des sous-titres et du texte sous forme d’image, le texte peut être redimensionné jusqu’à 200 pour cent sans l’aide d’une technologie d’assistance et sans perte de contenu ou de fonctionnalité.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G146 G179 F69 F80 SCR34 C12 C13 C14 C17 C28

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.4 Resize Text (AA)

## 10.5 Dans chaque page web, les déclarations CSS de couleurs de fond d’élément et de police sont-elles correctement utilisées ?

### 10.5.1 Dans chaque page web, chaque déclaration CSS de couleurs de police (color), d’un élément susceptible de contenir du texte, est-elle accompagnée d’une déclaration de couleur de fond (background, background-color), au moins, héritée d’un parent ?

#### Méthodologie

1. Retrouver dans le document les textes mis en couleur, à l’exception des couleurs par défaut (par exemple les liens, etc.) ;
2. Déterminer l’élément qui contient le texte et vérifier la présence d’une valeur calculée pour la propriété background-color de l’élément ;
3. Si c’est le cas, le test est validé.

### 10.5.2 Dans chaque page web, chaque déclaration de couleur de fond (background, background-color), d’un élément susceptible de contenir du texte, est-elle accompagnée d’une déclaration de couleur de police (color) au moins, héritée d’un parent ?

#### Méthodologie

1. Retrouver dans le document les textes mis en couleur, à l’exception des couleurs par défaut (par exemple les liens, etc.) ;
2. Déterminer l’élément qui contient le texte et vérifier la présence d’une valeur calculée pour la propriété color de l’élément ;
3. Si c’est le cas, le test est validé.

### 10.5.3 Dans chaque page web, chaque utilisation d’une image pour créer une couleur de fond d’un élément susceptible de contenir du texte, via CSS (background, background-image), est-elle accompagnée d’une déclaration de couleur de fond (background, background-color), au moins, héritée d’un parent ?

#### Méthodologie

1. Retrouver dans le document les textes dont l’arrière-plan est constitué d’une image (propriété background-image) ;
2. Déterminer l’élément qui contient le texte et vérifier que si l’image d’arrière-plan est absente, le texte reste lisible ;
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.3 Contraste (minimum) (Niveau AA)** :
  La présentation visuelle du texte et du texte sous forme d’image a un rapport de contraste d’au moins 4,5:1, sauf dans les cas suivants :

  * **Texte agrandi** : le texte agrandi et le texte agrandi sous forme d’image ont un rapport de contraste d’au moins 3:1.

  * **Texte décoratif** : aucune exigence de contraste pour le texte ou le texte sous forme d’image qui fait partie d’un composant d’interface utilisateur inactif, qui est purement décoratif, qui est invisible pour tous ou qui est une partie d’une image contenant un autre contenu significatif.

  * **Logotypes** : aucune exigence de contraste pour le texte faisant partie d’un logo ou d’un nom de marque.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F24

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.3 Contrast (Minimum) (AA)

## 10.6 Dans chaque page web, chaque lien dont la nature n’est pas évidente est-il visible par rapport au texte environnant ?

### 10.6.1 Dans chaque page web, chaque lien texte signalé uniquement par la couleur, et dont la nature n’est pas évidente, vérifie-t-il ces conditions ?

* La couleur du lien a un rapport de contraste supérieur ou égal à 3:1 par rapport au texte environnant ;
* Le lien dispose d’une indication visuelle au survol autre qu’un changement de couleur ;
* Le lien dispose d’une indication visuelle au `focus` autre qu’un changement de couleur.

#### Méthodologie

1. Retrouver dans le document les éléments de type lien (élément `<a>` ou élément pourvu d’un attribut WAI-ARIA `role`="link") ;
2. Pour chaque élément de type lien, s’il peut être confondu avec un texte normal lorsqu’il est signalé uniquement par la couleur, vérifier que le contraste entre la couleur de police du lien et la couleur de police du texte environnant est de 3:1, au moins ;
3. Cette vérification doit être faite pour les différents états du lien s’ils sont présentés au moyen d’une couleur différente : l’état non visité, l’état visité, l’état activé, l’état au survol et l’état à la prise de `focus` ;
4. Si c’est le cas pour chaque élément de type lien, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.1 Utilisation de la couleur (Niveau A)** :
  La couleur n’est pas utilisée comme la seule façon de véhiculer de l’information, d’indiquer une action, de solliciter une réponse ou de distinguer un élément visuel.

  * **Note** : Ce critère de succès traite spécifiquement de la perception des couleurs. Les autres formes de perception sont traitées à la règle 1.3 comme l’accès à la couleur par programme informatique et les autres formes de codage de la présentation visuelle.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G183 F73

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.1 Use of Color (A)

## 10.7 Dans chaque page web, pour chaque élément recevant le focus, la prise de focus est-elle visible ?

### 10.7.1 Pour chaque élément recevant le `focus`, la prise de `focus` vérifie-t-elle une de ces conditions ?

* Le `style` du `focus` natif du navigateur n’est pas supprimé ou dégradé ;
* Un `style` du `focus` défini par l’auteur est visible.

#### Méthodologie

1. Retrouver dans le document les éléments susceptibles de recevoir le `focus` (les éléments d’interface tels que les liens ou les contrôles de formulaire, ainsi que tout élément pourvu d’un attribut `tabindex` d’une valeur égale ou supérieure à 1) ;
2. Pour chaque élément susceptible de recevoir le `focus`, vérifier que l’indication visuelle de la prise de `focus` est présente (en agissant sur le contour ou le fond ou les deux) et est suffisamment contrastée (ratio de contraste égal ou supérieur à 3:1) ;
3. Si c’est le cas pour chaque élément susceptible de recevoir le `focus`, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.1 Utilisation de la couleur (Niveau A)** :
  La couleur n’est pas utilisée comme la seule façon de véhiculer de l’information, d’indiquer une action, de solliciter une réponse ou de distinguer un élément visuel.

  * **Note** : Ce critère de succès traite spécifiquement de la perception des couleurs. Les autres formes de perception sont traitées à la règle 1.3 comme l’accès à la couleur par programme informatique et les autres formes de codage de la présentation visuelle.
* **2.4.7 Visibilité du focus (Niveau AA)** :
  Toute interface utilisable au clavier comporte un mode de fonctionnement où le focus est visible.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G149 G165 G183 G195 F73 F78 SCR31 C15

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.1 Use of Color (A)
  * 9.2.4.7 Focus Visible (AA)

## 10.8 Pour chaque page web, les contenus cachés ont-ils vocation à être ignorés par les technologies d’assistance ?

### 10.8.1 Dans chaque page web, chaque contenu caché vérifie-t-il une de ces conditions ?

* Le contenu caché a vocation à être ignoré par les technologies d’assistance ;
* Le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance et est rendu restituable par les technologies d’assistance suite à une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ou suite à un repositionnement du `focus` dessus.

#### Méthodologie

1. Retrouver les contenus cachés (éléments pourvus de l’attribut `hidden` ou de l’attribut WAI-ARIA `aria-hidden`, ou bien d’une classe ou d’un ensemble de styles CSS susceptibles de masquer le contenu).
2. Pour chaque contenu caché, vérifier que :
   * Soit le contenu caché a vocation à être ignoré par les technologies d’assistance (un élément statistique de visites par exemple) ;
   * Soit le contenu caché n’a pas vocation à être ignoré par les technologies d’assistance, et dans ce cas il est rendu restituable par les technologies d’assistance au moyen :
   * Soit d’une action de l’utilisateur réalisable au clavier ou par tout dispositif de pointage sur un élément précédent le contenu caché ;
   * Soit d’une fonction de programmation qui repositionne le `focus` sur le contenu.
3. Si c’est le cas pour chaque contenu caché, le test est validé.

#### Notes techniques

WAI-ARIA propose un attribut `aria-hidden` (`true` ou `false`) qui permet d’inhiber la restitution d’un contenu en direction des technologies d’assistance, sans action sur sa visibilité en direction des agents utilisateurs : un contenu avec `aria-hidden`="`true`" ne sera donc plus vocalisable, mais restera visible.

Sauf si le contenu contrôlé par `aria-hidden` n’a pas vocation à être restitué par les technologies d’assistance, la valeur de l’attribut `aria-hidden` doit être cohérente avec l’état affiché ou masqué du contenu à l’écran.

La spécification HTML5 propose un attribut `hidden` qui permet de rendre indisponible (quand l’attribut `hidden` est présent) un contenu dans le DOM généré (de manière similaire au type="`hidden`" sur un contrôle de formulaire).

Il est possible d’avoir des situations où un contenu contrôlé par `hidden` ou `aria-hidden` se trouve momentanément dans un état incohérent avec le statut affiché ou masqué du contenu, par exemple si l’on désire rendre disponible un élément, mais que son affichage à l’écran reste dépendant d’une action ultérieure. Dans ce cas, c’est l’état final du contenu qui doit être considéré.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G57

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.2 Meaningful Sequence (A)
  * 9.4.1.2 Name, Role, Value (A)

## 10.9 Dans chaque page web, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?

### 10.9.1 Dans chaque page web, pour chaque texte ou ensemble de textes, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations d’un texte données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier qu’il existe un autre moyen de récupérer cette information ;
3. Si c’est le cas pour chaque information, le test est validé.

### 10.9.2 Dans chaque page web, pour chaque image ou ensemble d’images, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations d’une image données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier qu’il existe un autre moyen de récupérer cette information ;
3. Si c’est le cas pour chaque information, le test est validé.

### 10.9.3 Dans chaque page web, pour chaque média temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations d’un média temporel données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier qu’il existe un autre moyen de récupérer cette information ;
3. Si c’est le cas pour chaque information, le test est validé.

### 10.9.4 Dans chaque page web, pour chaque média non temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle respectée ?

#### Méthodologie

1. Retrouver dans le document les informations d’un média non temporel données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier qu’il existe un autre moyen de récupérer cette information ;
3. Si c’est le cas pour chaque information, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.3 Caractéristiques sensorielles (Niveau A)** :
  Les instructions données pour la compréhension et l’utilisation du contenu ne doivent pas reposer uniquement sur les caractéristiques sensorielles des éléments comme la forme, la couleur, la taille, l’emplacement visuel, l’orientation ou le son.

  * **Note** : Pour les exigences liées à la couleur, se référer à la Règle 1.4.
* **1.4.1 Utilisation de la couleur (Niveau A)** :
  La couleur n’est pas utilisée comme la seule façon de véhiculer de l’information, d’indiquer une action, de solliciter une réponse ou de distinguer un élément visuel.

  * **Note** : Ce critère de succès traite spécifiquement de la perception des couleurs. Les autres formes de perception sont traitées à la règle 1.3 comme l’accès à la couleur par programme informatique et les autres formes de codage de la présentation visuelle.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G96 G140 F14 F26

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.3 Sensory Characteristics (A)
  * 9.1.4.1 Use of Color (A)

## 10.10 Dans chaque page web, l’information ne doit pas être donnée par la forme, taille ou position uniquement. Cette règle est-elle implémentée de façon pertinente ?

### 10.10.1 Dans chaque page web, pour chaque texte ou ensemble de textes, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?

#### Méthodologie

1. Retrouver dans le document les informations d’un texte données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier que le moyen alternatif de récupérer cette information est pertinent, c’est-à-dire qu’il permet de transmettre l’information dans tous les contextes de consultation et pour tous les utilisateurs.
3. Si c’est le cas pour chaque information, le test est validé.

### 10.10.2 Dans chaque page web, pour chaque image ou ensemble d’images, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?

#### Méthodologie

1. Retrouver dans le document les informations d’une image données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier que le moyen alternatif de récupérer cette information est pertinent, c’est-à-dire qu’il permet de transmettre l’information dans tous les contextes de consultation et pour tous les utilisateurs.
3. Si c’est le cas pour chaque information, le test est validé.

### 10.10.3 Dans chaque page web, pour chaque média temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?

#### Méthodologie

1. Retrouver dans le document les informations d’un média temporel données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier que le moyen alternatif de récupérer cette information est pertinent, c’est-à-dire qu’il permet de transmettre l’information dans tous les contextes de consultation et pour tous les utilisateurs.
3. Si c’est le cas pour chaque information, le test est validé.

### 10.10.4 Dans chaque page web, pour chaque média non temporel, l’information ne doit pas être donnée uniquement par la forme, taille ou position. Cette règle est-elle implémentée de façon pertinente ?

#### Méthodologie

1. Retrouver dans le document les informations d’un média non temporel données par la forme, la taille ou la position ;
2. Pour chaque information donnée par la forme, la taille ou la position, vérifier que le moyen alternatif de récupérer cette information est pertinent, c’est-à-dire qu’il permet de transmettre l’information dans tous les contextes de consultation et pour tous les utilisateurs.
3. Si c’est le cas pour chaque information, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.3 Caractéristiques sensorielles (Niveau A)** :
  Les instructions données pour la compréhension et l’utilisation du contenu ne doivent pas reposer uniquement sur les caractéristiques sensorielles des éléments comme la forme, la couleur, la taille, l’emplacement visuel, l’orientation ou le son.

  * **Note** : Pour les exigences liées à la couleur, se référer à la Règle 1.4.
* **1.4.1 Utilisation de la couleur (Niveau A)** :
  La couleur n’est pas utilisée comme la seule façon de véhiculer de l’information, d’indiquer une action, de solliciter une réponse ou de distinguer un élément visuel.

  * **Note** : Ce critère de succès traite spécifiquement de la perception des couleurs. Les autres formes de perception sont traitées à la règle 1.3 comme l’accès à la couleur par programme informatique et les autres formes de codage de la présentation visuelle.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G96 G140 F14 F26

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.3 Sensory Characteristics (A)
  * 9.1.4.1 Use of Color (A)

## 10.11 Pour chaque page web, les contenus peuvent-ils être présentés sans perte d’information ou de fonctionnalité et sans avoir recours soit à un défilement vertical pour une fenêtre ayant une hauteur de 256 px, soit à un défilement horizontal pour une fenêtre ayant une largeur de 320 px (hors cas particuliers) ?

### 10.11.1 Pour chaque page web, lorsque le contenu dont le sens de lecture est horizontal est affiché dans une fenêtre réduite à une largeur de 320 px, l’ensemble des informations et des fonctionnalités sont-elles disponibles sans aucun défilement horizontal (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document si son contenu est conçu pour défiler verticalement (le sens de lecture du texte est horizontal), les informations et fonctionnalités ;
2. Réduire la fenêtre d’affichage à une largeur de 320 px et vérifier que les informations et les fonctionnalités restent disponibles sans aucun défilement horizontal ;
3. Si c’est le cas, le test est validé.

### 10.11.2 Pour chaque page web, lorsque le contenu dont le sens de lecture est vertical est affiché dans une fenêtre réduite à une hauteur de 256 px, l’ensemble des informations et des fonctionnalités sont-elles disponibles sans aucun défilement vertical (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document si son contenu est conçu pour défiler horizontalement (le sens de lecture du texte est vertical), les informations et fonctionnalités ;
2. Réduire la fenêtre d’affichage à une hauteur de 256 px et vérifier que les informations et les fonctionnalités restent disponibles sans aucun défilement vertical ;
3. Si c’est le cas, le test est validé.

#### Cas particuliers

L'objectif de ce critère est de garantir un défilement dans une unique direction pour une lecture facilitée selon le sens de l'écriture.

Font exception à ce critère, les contenus dont l'agencement requiert deux dimensions pour être compris ou utilisés comme :

Les images, les graphiques ou les vidéos ;

Les jeux (jeux de plateforme, par exemple) ;

Les présentations (type diaporama, par exemple) ;

Les tableaux de données ;

Les interfaces où il est nécessaire d'avoir un ascenseur horizontal lors de la manipulation de l'interface.

*Note : la majorité des navigateurs sur les systèmes d'exploitation sur mobile (Android, iOS) ne gère pas correctement la redistribution en cas de zoom. Dans ce contexte, le critère sera considéré comme non applicable sur ces environnements.*

#### Note technique

Lorsqu'il est ici question de pixel, il s'agit du pixel CSS tel que défini par le W3C https://www.w3.org/TR/css3-values/

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.10 Redistribution (Niveau AA)** :
  Le contenu peut être présenté sans perte d’information ou de fonctionnalité et sans nécessité de défilement dans les deux dimensions pour : un contenu à défilement vertical avec une largeur équivalente à 320 pixels CSS ;
  un contenu à défilement horizontal avec une hauteur équivalente à 256 pixels CSS.
  Sauf pour les parties du contenu dont l’utilisation ou la compréhension nécessite une mise en page en deux dimensions.

  * **Note** : 320 pixels CSS équivaut à une largeur d’affichage initiale de 1280 pixels CSS avec un zoom de 400 %. Pour les contenus Web conçus pour défiler horizontalement (par exemple, avec du texte vertical), la valeur de 256 pixels CSS équivaut à une hauteur d’affichage initiale de 1024 pixels avec un zoom de 400 %.

  * **Note** : On compte parmi les exemples de contenu nécessitant une mise en page en deux dimensions : les images, les cartes, les diagrammes, les vidéos, les jeux, les présentations, les tableaux de données, et les interfaces où il est nécessaire de garder les barres d’outils visibles pendant la manipulation du contenu.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** C34 C37

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.10 Reflow (AA)

## 10.12 Dans chaque page web, les propriétés d’espacement du texte peuvent-elles être redéfinies par l’utilisateur sans perte de contenu ou de fonctionnalité (hors cas particuliers) ?

### 10.12.1 Dans chaque page web, le texte reste-t-il lisible lorsque l’affichage est modifié selon ces conditions (hors cas particuliers) ?

* L’espacement entre les lignes (line-height) est augmenté jusqu’à 1,5 fois la taille de la police ;
* L’espacement suivant les paragraphes (balise `<p>`) est augmenté jusqu’à 2 fois la taille de la police ;
* L’espacement des lettres (letter-spacing) est augmenté jusqu’à 0,12 fois la taille de la police ;
* L’espacement des mots (word-spacing) est augmenté jusqu’à 0,16 fois la taille de la police.

#### Méthodologie

1. Modifier les styles du document en donnant :
   * Une valeur de 1.5 à la propriété line-height de tous les éléments du document ;
   * Une valeur de 2em à la propriété margin-bottom des éléments `<p>` ;
   * Une valeur de 0.12em à la propriété letter-spacing de tous les éléments du document ;
   * Une valeur de 0.16em à la propriété word-spacing de tous les éléments du document ;
2. Pour chaque passage de texte, vérifier qu’il reste lisible, à l’exception :
   * Des sous-titres directement intégrés à une vidéo ;
   * Des images texte ;
   * Des textes au sein d’une balise `<canvas>`.
3. Si c’est le cas pour chaque passage de texte, le test est validé.

*Note : une implémentation de ces règles de modification est disponible dans les ressources du critère de succès WCAG 1.4.12 (https://github.com/alastc/adaptation-scripts/blob/master/scripts/text-adaptation.js).*

#### Cas particuliers

Font exception à ce critère, les contenus pour lesquels l’utilisateur n’a pas de possibilité de personnalisation :

Les sous-titres directement intégrés à une vidéo ;

Les images texte ;

Le texte au sein d’une balise `<canvas>`.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.12 Espacement du texte (Niveau AA)** :
  Dans un contenu implémenté via un langage de balisage qui prend en charge les propriétés de style de texte suivantes, il n’y a aucune perte de contenu ou de fonctionnalité lorsqu’on applique toutes les valeurs ci-dessous sans modifier aucune autre propriété de style : La hauteur de ligne (interlignage) définie à au moins 1,5 fois la taille de la police ;
  L’espacement entre les paragraphes consécutifs défini à au moins 2 fois la taille de la police ;
  L’espacement des lettres (interlettrage) défini à au moins 0,12 fois la taille de la police ;
  L’espacement entre les mots défini à au moins 0,16 fois la taille de la police.
  Exception : les langues et systèmes d’écritures qui n’utilisent pas une ou plusieurs de ces propriétés de style de texte pour le texte écrit peuvent être conformes en utilisant uniquement les propriétés qui existent pour cette combinaison de langue et de système d’écriture.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** C8 C21 C35 C36

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.12 Text Spacing (AA)

## 10.13 Dans chaque page web, les contenus additionnels apparaissant à la prise de focus ou au survol d’un composant d’interface sont-ils contrôlables par l’utilisateur (hors cas particuliers) ?

### 10.13.1 Chaque contenu additionnel devenant visible à la prise de `focus` ou au survol d’un composant d’interface peut-il être masqué par une action de l’utilisateur sans déplacer le `focus` ou le pointeur de la souris (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les contenus additionnels devenant visible à la prise de `focus` ou au survol d’un composant d’interface, à l’exception :
   * Des contenus additionnels contrôlés par l’agent utilisateur (par exemple, les infobulles associées à l’attribut `title` ou à la validation native d’un formulaire ;
   * Des contenus additionnels devenant visibles par une activation de l’utilisateur (par exemple, une fenêtre de dialogue).
2. Pour chaque contenu additionnel, vérifier que :
   * Soit le contenu additionnel est positionné de façon à ce qu’il ne gêne pas la consultation des autres contenus informatifs sur lesquels il viendrait se superposer (y compris le composant d’interface qui a déclenché son apparition), quelles que soient les conditions de consultation (y compris lors de l’utilisation d’un mécanisme de zoom) ;
   * Soit un mécanisme (au clavier) permet de faire disparaître le contenu additionnel (par exemple, la touche Echap).
3. Si c’est le cas pour chaque contenu additionnel, le test est validé.

### 10.13.2 Chaque contenu additionnel qui apparait au survol d’un composant d’interface peut-il être survolé par le pointeur de la souris sans disparaître (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les contenus additionnels devenant visible au survol d’un composant d’interface, à l’exception :
   * Des contenus additionnels contrôlés par l’agent utilisateur (par exemple, les infobulles associées à l’attribut `title` ou à la validation native d’un formulaire) ;
   * Des contenus additionnels devenant visibles par une activation de l’utilisateur (par exemple, une fenêtre de dialogue).
2. Pour chaque contenu additionnel, vérifier qu’il peut être survolé par le pointeur de la souris sans disparaître ;
3. Si c’est le cas pour chaque contenu additionnel, le test est validé.

### 10.13.3 Chaque contenu additionnel qui apparaît à la prise de `focus` ou au survol d’un composant d’interface vérifie-t-il une de ces conditions (hors cas particuliers) ?

* Le contenu additionnel reste visible jusqu’à ce que l’utilisateur retire le pointeur souris ou le `focus` du contenu additionnel et du composant d’interface ayant déclenché son apparition ;
* Le contenu additionnel reste visible jusqu’à ce que l’utilisateur déclenche une action masquant ce contenu sans déplacer le `focus` ou le pointeur de la souris du composant d’interface ayant déclenché son apparition ;
* Le contenu additionnel reste visible jusqu’à ce qu’il ne soit plus valide.

#### Méthodologie

1. Retrouver dans le document les contenus additionnels devenant visible à la prise de `focus` ou au survol d’un composant d’interface, à l’exception :
   * Des contenus additionnels contrôlés par l’agent utilisateur (par exemple, les infobulles associées à l’attribut `title` ou à la validation native d’un formulaire) ;
   * Des contenus additionnels devenant visibles par une activation de l’utilisateur (par exemple, une fenêtre de dialogue).
2. Pour chaque contenu additionnel, vérifier qu’il reste visible :
   * Jusqu’à ce que l’utilisateur retire le pointeur souris ou le `focus` du contenu additionnel ou du composant d’interface ayant déclenché son apparition ;
   * Jusqu’à ce l’utilisateur déclenche le mécanisme prévu pour faire disparaître le contenu additionnel ;
   * Jusqu’à ce que l’information proposée par le contenu additionnel ne soit plus valide (par exemple un contenu additionnel signalant l’état “occupé” du composant d’interface que l’utilisateur souhaite activer ou encore un message d’erreur signalé sous la forme d’un contenu additionnel tant que l’utilisateur n’a pas rectifié sa saisie).
3. Si c’est le cas pour chaque contenu additionnel, le test est validé.

#### Cas particuliers

Lorsque le contenu additionnel est contrôlé par l’agent utilisateur (par exemple, attribut `title` ou validation native de formulaire) ou correspond à une fenêtre modale conforme au motif de conception WAI-ARIA dialog, le critère 10.13 est non applicable.

Lorsque le contenu additionnel ne masque ou ne remplace aucun contenu porteur d’information, le test 10.13.1 est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.4.13 Contenu au survol ou au focus (Niveau AA)** :
  Lorsque la réception puis le retrait du survol du pointeur ou du focus du clavier déclenche l’affichage puis le masquage d’un contenu additionnel, les éléments suivants sont vrais :

  * **Masquer** : il existe un mécanisme permettant de masquer le contenu additionnel sans déplacer le pointeur ou le focus du clavier, à moins que le contenu additionnel ne communique une erreur de saisie ou ne masque ni ne remplace un autre contenu ;

  * **Survoler** : si le survol du pointeur peut déclencher le contenu additionnel, alors le pointeur peut être déplacé sur le contenu additionnel sans que celui-ci disparaisse ;

  * **Persister** : le contenu additionnel reste visible jusqu’à ce que le survol ou le focus soit retiré, que l’utilisateur le masque ou que ses informations ne soient plus valables.
  Exception : la présentation visuelle du contenu additionnel est contrôlée par l’agent utilisateur et n’est pas modifiée par l’auteur.

  * **Note** : Parmi les exemples de contenu additionnel contrôlé par l’agent utilisateur figurent les infobulles du navigateur créées à l’aide de l’attribut HTML title.

  * **Note** : Les infobulles personnalisées, les sous-menus et autres fenêtres non modales qui s’affichent au survol et à la prise de focus sont des exemples de contenu additionnel couvert par ce critère.

  * **2. Utilisable§** : Les composants de l’interface utilisateur et de navigation doivent être utilisables.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F95

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.4.13 Content on Hover or Focus (AA)

## 10.14 Dans chaque page web, les contenus additionnels apparaissant via les styles CSS uniquement peuvent-ils être rendus visibles au clavier et par tout dispositif de pointage ?

### 10.14.1 Dans chaque page web, les contenus additionnels apparaissant au survol d’un composant d’interface via les styles CSS respectent-ils si nécessaire une de ces conditions ?

* Les contenus additionnels apparaissent également à l’activation du composant via le clavier et tout dispositif de pointage ;
* Les contenus additionnels apparaissent également à la prise de `focus` du composant ;
* Les contenus additionnels apparaissent également par le biais de l’activation ou de la prise de `focus` d’un autre composant.

#### Méthodologie

1. Retrouver dans le document les contenus additionnels devenant visible au survol d’un composant d’interface au moyen d’un mécanisme CSS (pseudo-classe :hover) ;
2. Pour chaque contenu additionnel, vérifier que les contenus additionnels apparaissent également :
   * À l’activation du composant au moyen du clavier ou de tout autre dispositif de pointage ;
   * À la prise de `focus` du composant ;
   * À l’activation ou à la prise de `focus` d’un autre composant.
3. Si c’est le cas pour chaque contenu additionnel, le test est validé.

### 10.14.2 Dans chaque page web, les contenus additionnels apparaissant au `focus` d’un composant d’interface via les styles CSS respectent-ils si nécessaire une de ces conditions ?

* Les contenus additionnels apparaissent également à l’activation du composant via le clavier et tout dispositif de pointage ;
* Les contenus additionnels apparaissent également au survol du composant ;
* Les contenus additionnels apparaissent également par le biais de l’activation ou du survol d’un autre composant.

#### Méthodologie

1. Retrouver dans le document les contenus additionnels devenant visible à la prise de `focus` d’un composant d’interface au moyen d’un mécanisme CSS (pseudo-classe :`focus`) ;
2. Pour chaque contenu additionnel, vérifier que les contenus additionnels apparaissent également :
   * À l’activation du composant au moyen du clavier ou de tout autre dispositif de pointage ;
   * Au survol du composant ;
   * À l’activation ou du survol d’un autre composant.
3. Si c’est le cas pour chaque contenu additionnel, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.1.1 Clavier (Niveau A)** :
  Toutes les fonctionnalités du contenu sont utilisables à l’aide d’une interface clavier sans exiger un rythme de frappe propre à l’utilisateur, sauf lorsque la fonction sous-jacente nécessite une saisie qui dépend du tracé du mouvement effectué par l’utilisateur et pas seulement des points de départ et d’arrivée de ce tracé.

  * **Note** : Cette exception ne concerne que la fonction sous-jacente et non la technique de saisie. Par exemple, lorsqu’on utilise l’écriture manuscrite pour saisir du texte, la technique de saisie (l’écriture manuscrite) nécessite une saisie qui dépend d’un tracé, mais la fonction sous-jacente (la saisie de texte) ne le requiert pas.

  * **Note** : Cela n’interdit pas et ne devrait pas décourager l’utilisation de la souris ou de toute autre méthode de saisie en plus de l’utilisation du clavier.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G202

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.1.1 Keyboard (A)

# 11. Formulaires

## 11.1 Chaque champ de formulaire a-t-il une étiquette ?

### 11.1.1 Chaque champ de formulaire vérifie-t-il une de ces conditions ?

* Le champ de formulaire possède un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte identifié ;
* Le champ de formulaire possède un attribut WAI-ARIA `aria-label` ;
* Une balise `<label>` ayant un attribut `for` est associée au champ de formulaire ;
* Le champ de formulaire possède un attribut `title` ;
* Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément `<label>` visuellement caché ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire ;
2. Pour chaque champ de formulaire, vérifier que le champ de formulaire :
   * Possède un attribut WAI-ARIA `aria-labelledby` référençant un passage de texte identifié ;
   * Possède un attribut WAI-ARIA `aria-label` ;
   * Est associé à un élément `<label>` ayant un attribut `for` ;
   * Possède un attribut `title` ;
   * Un bouton adjacent au champ de formulaire lui fournit une étiquette visible et un élément `<label>` visuellement caché ou un attribut WAI-ARIA `aria-label`, `aria-labelledby` ou `title` lui fournit un nom accessible.
3. Si c’est le cas pour champ de formulaire, le test est validé.

### 11.1.2 Chaque champ de formulaire associé à une balise `<label>` ayant un attribut `for`, vérifie-t-il ces conditions ?

* Le champ de formulaire possède un attribut `id` ;
* La valeur de l’attribut `for` est égale à la valeur de l’attribut `id` du champ de formulaire associé.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire associé à un élément `<label>` ;
2. Pour chaque champ de formulaire, vérifier que :
   * Le champ de formulaire possède un attribut `id` ;
   * La valeur de l’attribut `for` de l’élément `<label>` est égale à la valeur de l’attribut `id`.
3. Si c’est le cas pour champ de formulaire, le test est validé.

### 11.1.3 Chaque champ de formulaire ayant une étiquette dont le contenu n’est pas visible ou à proximité (masqué, `aria-label`) ou qui n’est pas accolé au champ (`aria-labelledby`), vérifie-t-il une de ses conditions ?

* Le champ de formulaire possède un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue ;
* Le champ de formulaire est accompagné d’un passage de texte accolé au champ qui devient visible à la prise de `focus` permettant de comprendre la nature de la saisie attendue ;
* Le champ de formulaire est accompagné d’un passage de texte visible accolé au champ permettant de comprendre la nature de la saisie attendue.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette n’est pas visible ou à proximité (masquée, utilisation de l’attribut `aria-label`) ou n’est pas accolée au champ (utilisation de l’attribut `aria-labelledby`) ;
2. Pour chaque champ de formulaire, vérifier que le champ de formulaire :
   * soit possède un attribut `title` dont le contenu permet de comprendre la nature de la saisie attendue ;
   * est accompagné d’un passage de texte accolé au champ qui devient visible à la prise de `focus` permettant de comprendre la nature de la saisie attendue ;
   * est accompagné d’un passage de texte visible accolé au champ permettant de comprendre la nature de la saisie attendue.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **2.4.6 En-têtes et étiquettes (Niveau AA)** :
  Les en-têtes et les étiquettes décrivent le sujet ou le but.
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G82 G131 H44 H65 F68 F82 F86 ARIA6 ARIA9 ARIA14 ARIA16

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.2.4.6 Headings and Labels (AA)
  * 9.3.3.2 Labels or Instructions (A)
  * 9.4.1.2 Name, Role, Value (A)

## 11.2 Chaque étiquette associée à un champ de formulaire est-elle pertinente (hors cas particuliers) ?

### 11.2.1 Chaque balise `<label>` permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un élément `<label>` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.2.2 Chaque attribut `title` permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut `title` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.2.3 Chaque étiquette implémentée via l’attribut WAI-ARIA `aria-label` permet-elle de connaître la fonction exacte du champ de formulaire auquel elle est associée ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA `aria-label` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’attribut est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.2.4 Chaque passage de texte associé via l’attribut WAI-ARIA `aria-labelledby` permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie par un attribut WAI-ARIA `aria-labelledby` ;
2. Pour chaque champ de formulaire, vérifier que le contenu du passage de texte référencé est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.2.5 Chaque champ de formulaire ayant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` du champ de formulaire contient au moins l’intitulé visible ;
* S’il est présent, le passage de texte lié au champ de formulaire via un attribut WAI-ARIA `aria-labelledby` contient au moins l’intitulé visible ;
* S’il est présent, le contenu de l’attribut `title` du champ de formulaire contient au moins l’intitulé visible ;
* S’il est présent le contenu de la balise `<label>` associé au champ de formulaire contient au moins l’intitulé visible.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette est fournie à la fois par un intitulé visible et par le contenu soit d’un élément `<label>`, soit d’un attribut `title` ou d’un attribut `aria-label` ou d’un attribut `aria-labelledby` ;
2. Pour chaque champ de formulaire, vérifier que le contenu de l’élément `<label>` ou de l’attribut `title` ou de l’attribut `aria-label` ou de l’attribut `aria-labelledby` contient l’intitulé visible ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.2.6 Chaque bouton adjacent au champ de formulaire qui fournit une étiquette visible permet-il de connaître la fonction exacte du champ de formulaire auquel il est associé ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire dont l’étiquette visible est fournie par un bouton adjacent ;
2. Pour chaque champ de formulaire, vérifier que le contenu visible du bouton est pertinent ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particuliers pour le test 11.2.5 lorsque :

La ponctuation et les lettres majuscules sont présentes dans le texte de l’intitulé visible : elles peuvent être ignorées dans le nom accessible sans porter à conséquence ;

Le texte de l’intitulé visible sert de symbole : le texte ne doit pas être interprété littéralement au niveau du nom accessible. Le nom doit exprimer la fonction véhiculée par le symbole (par exemple, “B” au niveau d’un éditeur de texte aura pour nom accessible “Mettre en gras”, le signe “>” en fonction du contexte signifiera “Suivant” ou “Lancer la vidéo”). Le cas des symboles mathématiques fait cependant exception (voir la note ci-dessous).

*Note : si l’étiquette visible représente une expression mathématique, les symboles mathématiques peuvent être repris littéralement pour servir d’étiquette au nom accessible (ex. : “A>B”). Il est laissé à l’utilisateur le soin d’opérer la correspondance entre l’expression et ce qu’il doit épeler compte tenu de la connaissance qu’il a du fonctionnement de son logiciel de saisie vocale (“A plus grand que B” ou “A supérieur à B”).*

Ce cas particulier s’applique également au test 11.9.2.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.6 En-têtes et étiquettes (Niveau AA)** :
  Les en-têtes et les étiquettes décrivent le sujet ou le but.
* **2.5.3 Étiquette dans le nom (Niveau A)** :
  Pour les composants d’interface utilisateur dont les étiquettes contiennent du texte ou du texte sous forme d’image, le nom contient le texte qui est présenté visuellement.

  * **Note** : Une bonne pratique consiste à placer le texte de l’étiquette au début du nom.
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G82 G131 H44 H65 ARIA6 ARIA9 ARIA14 ARIA16

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.6 Headings and Labels (AA)
  * 9.2.5.3 Label in Name (A)
  * 9.3.3.2 Labels or Instructions (A)

## 11.3 Dans chaque formulaire, chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page ou dans un ensemble de pages est-elle cohérente ?

### 11.3.1 Chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée plusieurs fois dans une même page est-elle cohérente ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire ayant une même fonction (par exemple plusieurs champs d’adresse) ;
2. Pour chaque champ de formulaire, vérifier que les étiquettes sont cohérentes (elles permettent de comprendre qu’il s’agit de saisies de natures identiques) ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.3.2 Chaque étiquette associée à un champ de formulaire ayant la même fonction et répétée dans un ensemble de pages est-elle cohérente ?

#### Méthodologie

1. Retrouver dans l’ensemble des pages considérées les champs de formulaire ayant une même fonction (par exemple le champ de saisie d’un moteur de recherche ou le champ de saisie d’inscription à une newsletter) ;
2. Pour chaque champ de formulaire, vérifier que les étiquettes sont cohérentes (elles permettent de comprendre qu’il s’agit de saisies de natures identiques) ;
3. Si c’est le cas pour chaque champ de formulaire de l’ensemble des pages considérées, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.2.4 Identification cohérente (Niveau AA)** :
  Dans un ensemble de pages Web les composants qui ont la même fonctionnalité sont identifiés de la même façon.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F31

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.2.4 Consistent Identification (AA)

## 11.4 Dans chaque formulaire, chaque étiquette de champ et son champ associé sont-ils accolés (hors cas particuliers) ?

### 11.4.1 Chaque étiquette de champ et son champ associé sont-ils accolés ?

#### Méthodologie

1. Retrouver dans le document les champs de formulaire ;
2. Pour chaque champ de formulaire, vérifier qu’il est accolé à son étiquette ;
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.4.2 Chaque étiquette accolée à un champ (à l’exception des cases à cocher, bouton radio ou balises ayant un attribut WAI-ARIA `role`="checkbox", `role`="radio" ou `role`="switch"), vérifie-t-elle ces conditions (hors cas particuliers) ?

* L’étiquette est visuellement accolée immédiatement au-dessus ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
* L’étiquette est visuellement accolée immédiatement au-dessus ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire qui ne sont pas des éléments `<input>` de type checkbox ou de type radio ou des éléments ayant un attribut WAI-ARIA `role`="checkbox", `role`="radio" ou `role`="switch";
2. Pour chaque champ de formulaire, vérifier que l’étiquette est visuellement accolée :
   * Immédiatement au-dessus ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
   * Immédiatement au-dessus ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

### 11.4.3 Chaque étiquette accolée à un champ de type checkbox ou radio ou à une balise ayant un attribut WAI-ARIA `role`="checkbox", `role`="radio" ou `role`="switch", vérifie-t-elle ces conditions (hors cas particuliers) ?

* L’étiquette est visuellement accolée immédiatement au-dessous ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
* L’étiquette est visuellement accolée immédiatement au-dessous ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire qui sont `<input>` de type checkbox ou de type radio ou des éléments ayant un attribut WAI-ARIA `role`="checkbox", `role`="radio" ou `role`="switch";
2. Pour chaque champ de formulaire, vérifier que l’étiquette est visuellement accolée :
   * Immédiatement au-dessous ou à droite du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de gauche à droite ;
   * Immédiatement au-dessous ou à gauche du champ de formulaire lorsque le sens de lecture de la langue de l’étiquette est de droite à gauche.
3. Si c’est le cas pour chaque champ de formulaire, le test est validé.

#### Cas particuliers

Les tests 11.4.2 et 11.4.3 seront considérés comme non applicables :

Dans le cas où l’étiquette mélange une portion de texte qui se lit de droite à gauche avec une portion de texte qui se lit de gauche à droite ;

Dans le cas où un formulaire contient des labels de plusieurs langues qui se liraient de droite à gauche et inversement. Par exemple, un formulaire de commande en arabe qui propose une liste de cases à cocher de produit en langue française ou mixant des produits en langue arabe ou en langue française ;

Dans le cas où les champs de type radio ou checkbox et les balises ayant un attribut WAI-ARIA `role`="checkbox", `role`="radio" ou `role`="switch" ne sont pas visuellement présentés sous forme de bouton radio ou de case à cocher ;

Dans le cas où les champs seraient utilisés dans un contexte où il pourrait être légitime, du point de vue de l’expérience utilisateur, de placer les étiquettes de manière différente à celle requise dans les tests 11.4.2 et 11.4.3.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G162

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.3.2 Labels or Instructions (A)

## 11.5 Dans chaque formulaire, les champs de même nature sont-ils regroupés, si nécessaire ?

### 11.5.1 Les champs de même nature vérifient-ils l’une de ces conditions, si nécessaire ?

* Les champs de même nature sont regroupés dans une balise `<fieldset>` ;
* Les champs de même nature sont regroupés dans une balise possédant un attribut WAI-ARIA `role`="group" ;
* Les champs de même nature de type radio (`<input type="radio">`) ou balises possédant un attribut WAI-ARIA `role`="radio") sont regroupés dans une balise possédant un attribut WAI-ARIA `role`="radiogroup" ou `role`="group".

#### Méthodologie

1. Retrouver dans le document les champs de formulaire de même nature (par exemple un groupe de saisie d’informations d’identité, une série de cases à cocher, une saisie de date sur plusieurs champs successifs…) ;
2. Pour chaque groupe de champs de formulaire de même nature, vérifier que ces champs de même nature sont regroupés :
   * Soit dans un élément `<fieldset>` ;
   * Soit dans un élément possédant un attribut WAI-ARIA `role`="group" ;
   * Soit dans un élément possédant un attribut WAI-ARIA `role`="radiogroup" ou "group", s’il s’agit d’éléments `<input>` de type radio ( ou d’éléments possédant un attribut WAI-ARIA `role`="radio").
3. Si c’est le cas pour chaque groupe de champs de formulaire de même nature, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H71 ARIA17

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.3.3.2 Labels or Instructions (A)

## 11.6 Dans chaque formulaire, chaque regroupement de champs de même nature a-t-il une légende ?

### 11.6.1 Chaque regroupement de champs de même nature possède-t-il une légende ?

#### Méthodologie

1. Retrouver dans le document les groupes de champs de formulaire de même nature ;
2. Pour chaque groupe de champs de formulaire de même nature, vérifier que :
3. Si le regroupement utilise un élément `<fieldset>`, l’élément `<fieldset>` possède un élément `<legend>` ;
4. Si l’élément de regroupement utilise un attribut WAI-ARIA `role`="group" ou "radiogroup", il possède un attribut WAI-ARIA `aria-label` ou `aria-labelledby`.
5. Sinon, pour chacun des champs de même nature, vérifier la présence :
   * Soit d’un attribut `title` permettant de déterminer l’appartenance du champ au groupement de champ ;
   * Soit d’un attribut `aria-label` permettant de déterminer l’appartenance du champ au groupement de champ ;
   * Soit d’un attribut `aria-labelledby` qui référence un passage de texte permettant de déterminer l’appartenance du champ au groupement de champ ;
   * Soit d’un attribut `aria-describedby` qui référence un passage de texte permettant de déterminer l’appartenance du champ au groupement de champ.
6. Si c’est le cas pour chaque groupe de champs de formulaire ou pour chacun des champs de même nature, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H71 ARIA17

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.3.3.2 Labels or Instructions (A)

## 11.7 Dans chaque formulaire, chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?

### 11.7.1 Chaque légende associée à un regroupement de champs de même nature est-elle pertinente ?

#### Méthodologie

1. Retrouver dans le document les groupes de champs de formulaire de même nature ;
2. Pour chaque groupe de champs de formulaire de même nature ou pour chacun des champs de même nature qui dispose d’une légende, vérifier que le texte de cette légende est pertinent ;
3. Si c’est le cas pour chaque groupe de champs de formulaire ou pour chacun des champs de même nature, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H71 ARIA17

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.3.3.2 Labels or Instructions (A)

## 11.8 Dans chaque formulaire, les items de même nature d’une liste de choix sont-ils regroupés de manière pertinente ?

### 11.8.1 Pour chaque balise `<select>`, les items de même nature d’une liste de choix sont-ils regroupés avec une balise `<optgroup>`, si nécessaire ?

#### Méthodologie

1. Retrouver dans le document les listes de sélection (élément `<select>`) ;
2. Pour chaque liste de sélection proposant des groupes d’items de même nature, vérifier que ces items sont regroupés au moyen d’éléments `<optgroup>` ;
3. Si c’est le cas pour chaque liste de sélection proposant des groupes d’items de même nature, le test est validé.

### 11.8.2 Dans chaque balise `<select>`, chaque balise `<optgroup>` possède-t-elle un attribut label ?

#### Méthodologie

1. Retrouver dans le document les listes de sélection (élément `<select>`) qui possèdent des éléments `<optgroup>` ;
2. Pour chaque élément `<optgroup>`, vérifier qu’il possède un attribut label ;
3. Si c’est le cas pour chaque élément `<optgroup>`, le test est validé.

### 11.8.3 Pour chaque balise `<optgroup>` ayant un attribut label, le contenu de l’attribut label est-il pertinent ?

#### Méthodologie

1. Retrouver dans le document les listes de sélection (élément `<select>`) qui possèdent des éléments `<optgroup>` pourvus d’un attribut label ;
2. Pour chaque attribut label, vérifier que son contenu est pertinent ;
3. Si c’est le cas pour chaque attribut label, le test est validé.

#### Notes techniques

Il est possible d’utiliser une balise ayant un attribut WAI-ARIA `role`="listbox" en remplacement d’une balise `<select>`. En revanche, il est impossible de créer des groupes d’options via l’utilisation de WAI-ARIA. De ce fait, une liste nécessitant un regroupement d’options structurée à l’aide d’une balise ayant un attribut WAI-ARIA `role`="listbox" sera considérée comme non conforme au critère 11.8.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H85

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)

## 11.9 Dans chaque formulaire, l’intitulé de chaque bouton est-il pertinent (hors cas particuliers) ?

### 11.9.1 L’intitulé de chaque bouton vérifie-t-il ces conditions (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` est pertinent ;
* S’il est présent, le passage de texte lié au bouton via un attribut WAI-ARIA `aria-labelledby` est pertinent ;
* S’il est présent, le contenu de l’attribut `value` d’une balise `<input>` de type `submit`, reset ou button est pertinent ;
* S’il est présent, le contenu de la balise `<button>` est pertinent ;
* S’il est présent, le contenu de l’attribut `alt` d’une balise `<input>` de type image est pertinent ;
* S’il est présent, le contenu de l’attribut `title` est pertinent.

#### Méthodologie

1. Retrouver dans le document les boutons présents au sein d’un formulaire ;
2. Pour chaque bouton, vérifier que son intitulé visible et son nom accessible sont pertinents ;
3. Si c’est le cas pour chaque bouton, le test est validé.

### 11.9.2 Chaque bouton affichant un intitulé visible vérifie-t-il ces conditions (hors cas particuliers) ?

* S’il est présent, le contenu de l’attribut WAI-ARIA `aria-label` contient au moins l’intitulé visible ;
* S’il est présent, le passage de texte lié au bouton via un attribut WAI-ARIA `aria-labelledby` contient au moins l’intitulé visible ;
* S’il est présent, le contenu de l’attribut `value` d’une balise `<input>` de type `submit`, reset ou button contient au moins l’intitulé visible ;
* S’il est présent, le contenu de la balise `<button>` contient au moins l’intitulé visible ;
* S’il est présent, le contenu de l’attribut `alt` d’une balise `<input>` de type image contient au moins l’intitulé visible ;
* S’il est présent, le contenu de l’attribut `title` contient au moins l’intitulé visible.

#### Méthodologie

1. Retrouver dans le document les boutons présents au sein d’un formulaire ;
2. Pour chaque bouton, vérifier que son nom accessible contient au moins son intitulé visible ;
3. Si c’est le cas pour chaque bouton, le test est validé.

#### Cas particuliers

Pour le test 11.9.2, voir cas particuliers critère 11.2.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.5.3 Étiquette dans le nom (Niveau A)** :
  Pour les composants d’interface utilisateur dont les étiquettes contiennent du texte ou du texte sous forme d’image, le nom contient le texte qui est présenté visuellement.

  * **Note** : Une bonne pratique consiste à placer le texte de l’étiquette au début du nom.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H36 H91 ARIA6 ARIA9 ARIA14 ARIA16

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.5.3 Label in Name (A)
  * 9.4.1.2 Name, Role, Value (A)

## 11.10 Dans chaque formulaire, le contrôle de saisie est-il utilisé de manière pertinente (hors cas particuliers) ?

### 11.10.1 Les indications du caractère obligatoire de la saisie des champs vérifient-elles une de ces conditions (hors cas particuliers) ?

* Une indication de champ obligatoire est visible et permet d’identifier nommément le champ concerné préalablement à la validation du formulaire ;
* Le champ obligatoire dispose de l’attribut `aria-required`="`true`" ou `required` préalablement à la validation du formulaire.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire obligatoires ;
2. Pour chaque champ de formulaire, vérifier que préalablement à la validation du formulaire :
   * Soit une indication de champ obligatoire est visible et permet d’identifier nommément le champ concerné ;
   * Soit le champ possède un attribut `aria-required`="`true`" ou `required`.
3. Si c’est le cas pour chaque champ de formulaire obligatoire, le test est validé.

### 11.10.2 Les champs obligatoires ayant l’attribut `aria-required`="`true`" ou `required` vérifient-ils une de ces conditions ?

* Une indication de champ obligatoire est visible et située dans l’étiquette associée au champ préalablement à la validation du formulaire ;
* Une indication de champ obligatoire est visible et située dans le passage de texte associé au champ préalablement à la validation du formulaire.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire obligatoires qui possèdent un attribut `aria-required`="`true`" ou `required` ;
2. Pour chaque champ de formulaire, vérifier que préalablement à la validation du formulaire :
   * Soit une indication de champ obligatoire est visible et située dans l’étiquette associée au champ ;
   * Soit une indication de champ obligatoire est visible et située dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire qui possèdent un attribut `aria-required`="`true`" ou `required`, le test est validé.

### 11.10.3 Les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire vérifient-ils une de ces conditions ?

* Le message d’erreur indiquant l’absence de saisie d’un champ obligatoire est visible et permet d’identifier nommément le champ concerné ;
* Le champ obligatoire dispose de l’attribut `aria-invalid`="`true`".

#### Méthodologie

1. Retrouver dans le document les messages d’erreur indiquant l’absence de saisie d’un champ obligatoire ;
2. Pour chaque message d’erreur, vérifier que :
   * Soit le message d’erreur est visible et permet d’identifier nommément le champ concerné ;
   * Soit le champ obligatoire associé au message d’erreur possède un attribut `aria-invalid`="`true`".
3. Si c’est le cas pour chaque message d’erreur indiquant l’absence de saisie d’un champ obligatoire, le test est validé.

### 11.10.4 Les champs obligatoires ayant l’attribut `aria-invalid`="`true`" vérifient-ils une de ces conditions ?

* Le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans l’étiquette associée au champ ;
* Le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans le passage de texte associé au champ.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire obligatoires qui possèdent un attribut `aria-invalid`="`true`" ;
2. Pour chaque champ de formulaire, vérifier que :
   * Soit le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans l’étiquette associée au champ ;
   * Soit le message d’erreur indiquant le caractère invalide de la saisie est visible et situé dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire qui possède un attribut `aria-invalid`="`true`", le test est validé.

### 11.10.5 Les instructions et indications du type de données et/ou de format obligatoires vérifient-elles une de ces conditions ?

* Une instruction ou une indication du type de données et/ou de format obligatoire est visible et permet d’identifier nommément le champ concerné préalablement à la validation du formulaire ;
* Une instruction ou une indication du type de données et/ou de format obligatoire est visible dans l’étiquette ou le passage de texte associé au champ préalablement à la validation du formulaire.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire obligatoires auxquels est associée une instruction ou une indication du type de données et/ou de format obligatoire ;
2. Pour chaque champ de formulaire, vérifier que l’instruction ou l’indication du type de données et/ou de format obligatoire est préalablement à la validation du formulaire :
   * Soit visible et permet d’identifier nommément le champ concerné ;
   * Soit visible dans l’étiquette ou le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire obligatoire auquel est associée une instruction ou une indication du type de données et/ou de format obligatoire, le test est validé.

### 11.10.6 Les messages d’erreurs fournissant une instruction ou une indication du type de données et/ou de format obligatoire des champs vérifient-ils une de ces conditions ?

* Le message d’erreur fournissant une instruction ou une indication du type de données et/ou de format obligatoires est visible et identifie le champ concerné ;
* Le champ dispose de l’attribut `aria-invalid`="`true`".

#### Méthodologie

1. Retrouver dans le document les messages d’erreur fournissant une instruction ou une indication du type de données et/ou de format obligatoire d’un champ ;
2. Pour chaque message d’erreur, vérifier que :
   * Soit le message d’erreur est visible et permet d’identifier nommément le champ concerné ;
   * Soit le champ associé au message d’erreur possède un attribut `aria-invalid`="`true`".
3. Si c’est le cas pour chaque message d’erreur indiquant l’absence de saisie d’un champ obligatoire, le test est validé.

### 11.10.7 Les champs ayant l’attribut `aria-invalid`="`true`" dont la saisie requiert un type de données et/ou de format obligatoires vérifient-ils une de ces conditions ?

* Une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans la balise `<label>` associée au champ ;
* Une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans le passage de texte associé au champ.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire qui possèdent un attribut `aria-invalid`="`true`" ;
2. Pour chaque champ de formulaire, vérifier que :
   * Soit une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans l’élément `<label>` associé au champ ;
   * Soit une instruction ou une indication du type de données et/ou de format obligatoire est visible et située dans le passage de texte associé au champ.
3. Si c’est le cas pour chaque champ de formulaire qui possède un attribut `aria-invalid`="`true`", le test est validé.

#### Cas particuliers

Le test 11.10.1 et le test 11.10.2 seront considérés comme non applicables lorsque le formulaire comporte un seul champ de formulaire ou qu’il indique les champs optionnels de manière :

Visible ;

Dans la balise `<label>` ou dans la légende associée au champ.

Dans le cas où l’ensemble des champs d’un formulaire sont obligatoires, les tests 11.10.1 et 11.10.2 restent applicables.

#### Notes techniques

Dans un long formulaire dont la majorité des champs sont obligatoires, on pourrait constater que ce sont les quelques champs restés facultatifs qui sont explicitement signalés comme tels. Dans ce cas, il faudrait s’assurer que :

Un message précise visuellement en haut de formulaire que “tous les champs sont obligatoires sauf ceux indiqués comme étant facultatifs” ;

Une mention “facultatif” est présente visuellement dans le libellé des champs facultatifs ou dans la légende d’un groupe de champs facultatifs ;

Un attribut `required` ou `aria-required`="`true`" reste associé à chaque champ qui n’est pas concerné par ce caractère facultatif.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.3.1 Identification des erreurs (Niveau A)** :
  Si une erreur de saisie est détectée automatiquement, l’élément en erreur est identifié et l’erreur est décrite à l’utilisateur sous forme de texte.
* **3.3.2 Étiquettes ou instructions (Niveau A)** :
  Des étiquettes sont présentées ou des instructions sont fournies quand un contenu requiert une saisie utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G83 G84 G85 G89 G184 H44 H81 H89 H90 F81 SCR18 SCR32 ARIA1 ARIA2 ARIA6 ARIA9 ARIA16 ARIA21

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.3.1 Error Identification (A)
  * 9.3.3.2 Labels or Instructions (A)

## 11.11 Dans chaque formulaire, le contrôle de saisie est-il accompagné, si nécessaire, de suggestions facilitant la correction des erreurs de saisie ?

### 11.11.1 Pour chaque erreur de saisie, les types et les formats de données sont-ils suggérés, si nécessaire ?

#### Méthodologie

1. Retrouver dans le document les messages d’erreur ;
2. Pour chaque message d’erreur, vérifier que les types et les formats de données attendus sont suggérés ;
3. Si c’est le cas pour chaque message d’erreur , le test est validé.

### 11.11.2 Pour chaque erreur de saisie, des exemples de valeurs attendues sont-ils suggérés, si nécessaire ?

#### Méthodologie

1. Retrouver dans le document les messages d’erreur ;
2. Pour chaque message d’erreur, vérifier que des exemples de valeurs attendues sont suggérés ;
3. Si c’est le cas pour chaque message d’erreur , le test est validé.

#### Notes techniques

Certains types de contrôles en HTML5 proposent des messages d’aide à la saisie automatique : par exemple le type email affiche un message du type « veuillez saisir une adresse e-mail valide » dans le cas où l’adresse e-mail saisie ne correspond pas au format attendu. Ces messages sont personnalisables via l’API Constraint Validation, ce qui permet de personnaliser les messages d’erreur et de valider le critère. L’attribut pattern permet d’effectuer automatiquement des contrôles de format (via des expressions régulières) et affiche un message d’aide personnalisable via l’attribut `title` : ce dispositif valide également le critère.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.3.3 Suggestion après une erreur (Niveau AA)** :
  Si une erreur de saisie est automatiquement détectée et que des suggestions de corrections sont connues, ces suggestions sont alors proposées à l’utilisateur à moins que cela puisse compromettre la sécurité ou la finalité du contenu.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G84 G85 G89 G177 H89

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.3.3 Error Suggestion (AA)

## 11.12 Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou à un examen, ou dont la validation a des conséquences financières ou juridiques, les données saisies peuvent-elles être modifiées, mises à jour ou récupérées par l’utilisateur ?

### 11.12.1 Pour chaque formulaire qui modifie ou supprime des données, ou qui transmet des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques, la saisie des données vérifie-t-elle une de ces conditions ?

* L’utilisateur peut modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ;
* L’utilisateur peut vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ;
* Un mécanisme de confirmation explicite, via une case à cocher (balise `<input>` de type checkbox ou balise ayant un attribut WAI-ARIA `role`="checkbox") ou une étape supplémentaire, est présent.

#### Méthodologie

1. Retrouver dans le document les formulaires qui modifient ou suppriment des données, ou qui transmettent des réponses à un test ou un examen, ou dont la validation a des conséquences financières ou juridiques ;
2. Pour chaque formulaire, vérifier que l’utilisateur peut :
   * Soit modifier ou annuler les données et les actions effectuées sur ces données après la validation du formulaire ;
   * Soit vérifier et corriger les données avant la validation d’un formulaire en plusieurs étapes ;
   * Soit disposer d’un mécanisme de confirmation explicite (par exemple, une case à cocher ou une étape supplémentaire).
3. Si c’est le cas pour chaque formulaire retrouvé, le test est validé.

### 11.12.2 Chaque formulaire dont la validation modifie ou supprime des données à caractère financier, juridique ou personnel vérifie-t-il une de ces conditions ?

* Un mécanisme permet de récupérer les données supprimées ou modifiées par l’utilisateur ;
* Un mécanisme de demande de confirmation explicite de la suppression ou de la modification, via un champ de formulaire ou une étape supplémentaire, est proposé.

#### Méthodologie

1. Retrouver dans le document les formulaires qui modifient ou suppriment des données à caractère financier, juridique ou personnel ;
2. Pour chaque formulaire, vérifier que l’utilisateur dispose :
   * Soit d’un mécanisme qui permet de récupérer les données supprimées ou modifiées ;
   * Soit d’un mécanisme de demande de confirmation explicite de la suppression ou de la modification (par exemple, une case à cocher ou une étape supplémentaire).
3. Si c’est le cas pour chaque formulaire retrouvé, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.3.4 Prévention des erreurs (juridiques, financières, de données) (Niveau AA)** :
  Pour les pages Web qui entraînent des engagements juridiques ou des transactions financières de la part de l’utilisateur, qui modifient ou effacent des données contrôlables par l’utilisateur dans des systèmes de stockages de données, qui enregistrent les réponses de l’utilisateur à un test ou un examen, au moins l’une des conditions suivantes est vraie :

  * **Réversible** :

  * **les actions d’envoi sont réversibles.** :

  * **Vérifiée** : les données saisies par l’utilisateur sont vérifiées au niveau des erreurs de saisie et la possibilité est donnée à l’utilisateur de les corriger.

  * **Confirmée** : un mécanisme est disponible pour revoir, confirmer et corriger les informations avant leur soumission finale.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G98 G99 G155 G164 G168

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.3.4 Error Prevention (Legal, Financial, Data) (AA)

## 11.13 La finalité d’un champ de saisie peut-elle être déduite pour faciliter le remplissage automatique des champs avec les données de l’utilisateur ?

### 11.13.1 Chaque champ de formulaire dont l’objet se rapporte à une information concernant l’utilisateur vérifie-t-il ces conditions ?

* Le champ de formulaire possède un attribut `autocomplete` ;
* L’attribut `autocomplete` est pourvu d’une valeur présente dans la liste des valeurs possibles pour l’attribut `autocomplete` associés à un champ de formulaire ;
* La valeur indiquée pour l’attribut `autocomplete` est pertinente au regard du type d’information attendu.

#### Méthodologie

1. Retrouver dans le document les champs de formulaire qui se rapportent à une information concernant l’utilisateur (nom, prénom, numéro de téléphone, etc.) ;
2. Pour chaque champ de formulaire, vérifier que :
   * Le champ de formulaire possède un attribut `autocomplete` ;
   * L’attribut `autocomplete` est pourvu d’une valeur présente dans la liste des valeurs possibles ;
   * La valeur indiquée pour l’attribut `autocomplete` est pertinente au regard du type d’information attendu.
3. Si c’est le cas pour chaque champ de formulaire retrouvé, le test est validé.

#### Notes techniques

La liste des valeurs possibles pour l’attribut `autocomplete` repose sur la liste des valeurs présentes dans la spécification WCAG2.1 qui reprend elle-même la liste des valeurs de type “field name” de la spécification HTML5.2. Le critère WCAG demande à ce que l’une de ces valeurs soit présente pour qualifier un champ de saisie concernant l’utilisateur.

Ce que le critère WCAG laisse implicite, ce sont les différentes règles de construction possibles pour obtenir une valeur (simple ou composée) pour l’attribut `autocomplete`. C’est cependant l’affaire du développeur de fournir à l’attribut `autocomplete` une valeur ou un ensemble de valeurs valides au regard des exigences de l’algorithme fourni par la spécification HTML5.2. Ainsi, un attribut `autocomplete` ne peut contenir qu’une seule valeur de type “field name”, comme "name" ou "street-address". On peut avoir également un ensemble composé de différentes valeurs comme, par exemple, `autocomplete`="shipping name" ou `autocomplete`="section-software shipping street-address" : "section-software" renvoie à une valeur de type “`scope`” et "shipping" à une valeur de type “hint set”, mais toujours une seule valeur de type “field name”.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.5 Identifier la finalité de la saisie (Niveau AA)** :
  La finalité de chaque champ de saisie recueillant des informations sur l’utilisateur peut être déterminée par un programme informatique lorsque : Le champ de saisie répond à une finalité identifiée dans la section Finalités de saisie des composants d’interface utilisateur ; et
  Le contenu est implémenté via des technologies permettant d’identifier la finalité de la saisie attendue pour le champ.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H98

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.5 Identify Input Purpose (AA)

# 12. Navigation

## 12.1 Chaque ensemble de pages dispose-t-il de deux systèmes de navigation différents, au moins (hors cas particuliers) ?

### 12.1.1 Chaque ensemble de pages vérifie-t-il une de ces conditions (hors cas particuliers) ?

* Un menu de navigation et un plan du site sont présents ;
* Un menu de navigation et un moteur de recherche sont présents ;
* Un moteur de recherche et un plan du site sont présents.

#### Méthodologie

1. Pour chaque ensemble de pages du site, vérifier la présence :
   * Soit d’un menu de navigation et d’un plan du site ;
   * Soit d’un menu de navigation et d’un moteur de recherche ;
   * Soit d’un moteur de recherche et d’un plan du site.
2. Si c’est le cas pour chaque ensemble de pages du site, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque le site web est constitué d’une seule page ou d’un nombre très limité de pages (cf. note). Dans ce cas-là, le critère est non applicable.

Le critère est également non applicable pour les pages d’un ensemble de pages qui sont le résultat ou une partie d’un processus (un processus de paiement ou de prise de commande, par exemple).

*Note : l’appréciation d’un nombre très limité de pages devrait être réservé à un site dont l’ensemble des pages sont atteignables depuis la page d’accueil.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.5 Accès multiples (Niveau AA)** :
  Une page Web peut être située par plus d’un moyen dans un ensemble de pages Web sauf si cette page est le résultat ou une étape d’un processus.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G63 G64 G161

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.5 Multiple Ways (AA)

## 12.2 Dans chaque ensemble de pages, le menu et les barres de navigation sont-ils toujours à la même place (hors cas particuliers) ?

### 12.2.1 Dans chaque ensemble de pages, chaque page disposant d’un menu et les barres de navigation vérifie-t-elle ces conditions (hors cas particuliers) ?

* Le menu et les barres de navigation sont toujours à la même place dans la présentation ;
* Le menu et les barres de navigation se présentent toujours dans le même ordre relatif dans le code source.

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer visuellement les deux pages et vérifier que le menu ou les barres de navigation sont toujours à la même place dans la présentation ;
3. Comparer le code source (généré côté client) des deux pages et vérifier que le menu ou les barres de navigation se présentent toujours dans le même ordre relatif dans la structure ;
4. Si c’est le cas, le test est validé.

*Note : le critère est non applicable dans les situations où :*

Les pages d’un ensemble de pages sont le résultat ou une partie d’un processus (un processus de paiement ou de prise de commande, par exemple) ;

La page est la page d’accueil ;

Le site web est constitué d’une seule page.

#### Cas particuliers

Il existe une gestion de cas particuliers lorsque :

La page est la page d’accueil ;

Le site web est constitué d’une seule page ;

Le changement fait suite à une modification initiée par l’utilisateur.

Dans ces situations, le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.2.3 Navigation cohérente (Niveau AA)** :
  Dans un ensemble de pages, les mécanismes de navigation qui se répètent sur plusieurs pages Web se présentent dans le même ordre relatif chaque fois qu’ils sont répétés, à moins qu’un changement soit initié par l’utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G61 F66

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.2.3 Consistent Navigation (AA)

## 12.3 La page « plan du site » est-elle pertinente ?

### 12.3.1 La page « plan du site » est-elle représentative de l’architecture générale du site ?

#### Méthodologie

1. Vérifier que le plan du site est représentatif de l’architecture générale du site (cf. note) ;
2. Si c’est le cas, le test est validé.

*Note : Un plan du site trop complexe ou trop profond n’est pas recommandé pour aider à la navigation. Il n’est pas obligatoire que toutes les pages soient présentes dans le plan du site si elles peuvent être atteintes, par exemple, à partir de la page d’accueil d’une rubrique ou d’un catalogue.*

### 12.3.2 Les liens du plan du site sont-ils fonctionnels ?

#### Méthodologie

1. Pour tous les liens du plan du site, vérifier qu’ils sont fonctionnels ;
2. Si c’est le cas, le test est validé.

### 12.3.3 Les liens du plan du site renvoient-ils bien vers les pages indiquées par l’intitulé ?

#### Méthodologie

1. Pour tous les liens du plan du site, vérifier qu’ils sont à jour (ni obsolètes ni en erreur) et conduisent à la page indiquée par leur intitulé ;
2. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.5 Accès multiples (Niveau AA)** :
  Une page Web peut être située par plus d’un moyen dans un ensemble de pages Web sauf si cette page est le résultat ou une étape d’un processus.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G63

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.5 Multiple Ways (AA)

## 12.4 Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir d’une fonctionnalité identique ?

### 12.4.1 Dans chaque ensemble de pages, la page « plan du site » est-elle accessible à partir d’une fonctionnalité identique ?

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer le code source (généré côté client) des deux pages et vérifier que le moyen d’accès au plan du site est toujours le même (un lien ou un bouton, par exemple) ;
3. Si c’est le cas, le test est validé.

### 12.4.2 Dans chaque ensemble de pages, la fonctionnalité vers la page « plan du site » est-elle située à la même place dans la présentation ?

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer le code source (généré côté client) des deux pages et vérifier que le moyen d’accès au plan du site est toujours à la même place dans la structure (par rapport à l’ordre relatif des éléments de la page, par exemple il est toujours en haut de page) ;
3. Si c’est le cas, le test est validé.

### 12.4.3 Dans chaque ensemble de pages, la fonctionnalité vers la page « plan du site » se présente-t-elle toujours dans le même ordre relatif dans le code source ?

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer visuellement les deux pages et vérifier que le moyen d’accès au plan du site est toujours à la même place dans la présentation ;
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.5 Accès multiples (Niveau AA)** :
  Une page Web peut être située par plus d’un moyen dans un ensemble de pages Web sauf si cette page est le résultat ou une étape d’un processus.
* **3.2.3 Navigation cohérente (Niveau AA)** :
  Dans un ensemble de pages, les mécanismes de navigation qui se répètent sur plusieurs pages Web se présentent dans le même ordre relatif chaque fois qu’ils sont répétés, à moins qu’un changement soit initié par l’utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G61 G63

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.5 Multiple Ways (AA)
  * 9.3.2.3 Consistent Navigation (AA)

## 12.5 Dans chaque ensemble de pages, le moteur de recherche est-il atteignable de manière identique ?

### 12.5.1 Dans chaque ensemble de pages, le moteur de recherche est-il accessible à partir d’une fonctionnalité identique ?

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer le code source (généré côté client) des deux pages et vérifier que le moyen d’accès au moteur de recherche est toujours le même (un champ de formulaire, par exemple) ;
3. Si c’est le cas, le test est validé.

### 12.5.2 Dans chaque ensemble de pages, la fonctionnalité vers le moteur de recherche est-elle située à la même place dans la présentation ?

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer visuellement les deux pages et vérifier que le moyen d’accès au moteur de recherche est toujours à la même place dans la présentation ;
3. Si c’est le cas, le test est validé.

### 12.5.3 Dans chaque ensemble de pages, la fonctionnalité vers le moteur de recherche se présente-t-elle toujours dans le même ordre relatif dans le code source ?

#### Méthodologie

1. Choisir une page de l’échantillon appartenant au même ensemble que la page en cours d’audit ;
2. Comparer le code source (généré côté client) des deux pages et vérifier que le moyen d’accès au moteur de recherche est toujours à la même place dans la structure (par rapport à l’ordre relatif des éléments de la page, par exemple il est toujours en haut de page) ;
3. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.2.3 Navigation cohérente (Niveau AA)** :
  Dans un ensemble de pages, les mécanismes de navigation qui se répètent sur plusieurs pages Web se présentent dans le même ordre relatif chaque fois qu’ils sont répétés, à moins qu’un changement soit initié par l’utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G61 F66

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.2.3 Consistent Navigation (AA)

## 12.6 Les zones de regroupement de contenus présentes dans plusieurs pages web (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) peuvent-elles être atteintes ou évitées ?

### 12.6.1 Dans chaque page web où elles sont présentes, la zone d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche respectent-elles au moins une de ces conditions ?

* La zone possède un rôle WAI-ARIA de type landmark correspondant à sa nature ;
* La zone possède un titre dont le contenu permet de comprendre la nature du contenu de la zone ;
* La zone peut être masquée par le biais d’un bouton précédent directement la zone dans l’ordre du code source ;
* La zone peut être évitée par le biais d’un lien d’évitement précédent directement la zone dans l’ordre du code source ;
* La zone peut être atteinte par le biais d’un lien d’accès rapide visible ou, à défaut, visible à la prise de `focus`.

#### Méthodologie

1. Retrouver dans le document les zones de regroupement de contenus (zones d’en-tête, de navigation principale, de contenu principal, de pied de page et de moteur de recherche) ;
2. Pour chaque zone, vérifier que la zone :
   * Soit possède un rôle WAI-ARIA de type landmark correspondant à sa nature ;
   * Soit possède un titre de hiérarchie dont le contenu permet de comprendre la nature du contenu de la zone ;
   * Soit peut être masquée au moyen d’un bouton précédant directement la zone dans l’ordre du code source ;
   * Soit peut être évitée au moyen d’un lien d’évitement précédant directement la zone dans l’ordre du code source ;
   * Soit peut être atteinte au moyen d’un lien d’accès rapide soit visible par défaut, soit visible à la prise de `focus` lors d’une tabulation.
3. Si c’est le cas pour chaque zone de regroupement de contenus, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **2.4.1 Contourner des blocs (Niveau A)** :
  Un mécanisme permet de contourner les blocs de contenu qui sont répétés sur plusieurs pages Web.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** H69 G115 ARIA4 ARIA11

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.1 Info and Relationships (A)
  * 9.2.4.1 Bypass Blocks (A)
  * 9.4.1.2 Name, Role, Value (A)

## 12.7 Dans chaque page web, un lien d’évitement ou d’accès rapide à la zone de contenu principal est-il présent (hors cas particuliers) ?

### 12.7.1 Dans chaque page web, un lien permet-il d’éviter la zone de contenu principal ou d’y accéder (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document la zone de contenu principal (indiquée par l’élément main visible) ;
2. Vérifier que la zone :
   * Soit peut être évitée au moyen d’un lien d’évitement précédant directement la zone dans l’ordre du code source ;
   * Soit peut être atteinte au moyen d’un lien d’accès rapide visible à la prise de `focus` lors d’une tabulation.
3. Si c’est le cas, le test est validé.

### 12.7.2 Dans chaque ensemble de pages, le lien d’évitement ou d’accès rapide à la zone de contenu principal vérifie-t-il ces conditions (hors cas particuliers) ?

* Le lien est situé à la même place dans la présentation ;
* Le lien se présente toujours dans le même ordre relatif dans le code source ;
* Le lien est visible ou, à défaut, visible à la prise de `focus` ;
* Le lien est fonctionnel.

#### Méthodologie

1. Retrouver dans le document la zone de contenu principal (indiquée par l’élément main visible) ;
2. Vérifier que le lien d’évitement ou d’accès rapide à la zone est :
   * Situé à la même place dans la présentation ;
   * Présent toujours dans le même ordre relatif dans le code source (généré côté client) ;
   * Visible à la prise de `focus` lors d’une tabulation ;
   * Fonctionnel.
3. Si c’est le cas, le test est validé.

*Note : lorsque le site web est constitué d’une seule page, l’obligation de la présence d’un lien d’accès rapide est liée au contexte de la page (présence ou absence de navigation ou de contenus additionnels, par exemple). Le critère peut être considéré comme non applicable lorsqu’il est avéré qu’un lien d’accès rapide est inutile.*

#### Cas particuliers

Il existe une gestion de cas particuliers lorsque le site web est constitué d’une seule page.

Dans ce cas de figure, l’obligation de la présence d’un lien d’accès rapide est liée au contexte de la page : présence ou absence de navigation ou de contenus additionnels, par exemple. Le critère peut être considéré comme non applicable lorsqu’il est avéré qu’un lien d’accès rapide est inutile.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.1 Contourner des blocs (Niveau A)** :
  Un mécanisme permet de contourner les blocs de contenu qui sont répétés sur plusieurs pages Web.
* **2.4.3 Parcours du focus (Niveau A)** :
  Si une page Web peut être parcourue de façon séquentielle et que les séquences de navigation affectent la signification ou l’action, les éléments reçoivent le focus dans un ordre qui préserve la signification et l’opérabilité.
* **3.2.3 Navigation cohérente (Niveau AA)** :
  Dans un ensemble de pages, les mécanismes de navigation qui se répètent sur plusieurs pages Web se présentent dans le même ordre relatif chaque fois qu’ils sont répétés, à moins qu’un changement soit initié par l’utilisateur.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G1 G59 G123 G124 SCR28 F66

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.1 Bypass Blocks (A)
  * 9.2.4.3 Focus Order (A)
  * 9.3.2.3 Consistent Navigation (AA)

## 12.8 Dans chaque page web, l’ordre de tabulation est-il cohérent ?

### 12.8.1 Dans chaque page web, l’ordre de tabulation dans le contenu est-il cohérent ?

#### Méthodologie

1. Parcourir dans le document l’ensemble des contenus au moyen de la touche de tabulation vers l’avant (touche Tab) et vers l’arrière (touches Maj+Tab) ;
2. Vérifier que l’ordre de déplacement du `focus` reste cohérent relativement au contenu considéré (par exemple, l’ordre de tabulation dans une fenêtre modale ne doit considérer que les éléments d’interface présents au sein de cette fenêtre) ;
3. Si c’est le cas, le test est validé.

*Note : il n’est pas obligatoire que la tabulation suive l’ordre de lecture naturel (de gauche à droite et de haut en bas par exemple) tant que les éléments sont accessibles dans un ordre cohérent.*

### 12.8.2 Pour chaque script qui met à jour ou insère un contenu, l’ordre de tabulation reste-t-il cohérent ?

#### Méthodologie

1. Retrouver dans le document l’ensemble des contenus insérés au moyen d’un script (affichage d’éléments masqués, mise jour de contenu via AJAX par exemple) ;
2. Positionner la tabulation sur l’élément déclencheur et l’activer ;
3. Après l’affichage du contenu mis à jour, vérifier que la tabulation reste cohérente (repositionnement correct du `focus`) ;
4. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.4.3 Parcours du focus (Niveau A)** :
  Si une page Web peut être parcourue de façon séquentielle et que les séquences de navigation affectent la signification ou l’action, les éléments reçoivent le focus dans un ordre qui préserve la signification et l’opérabilité.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G59 H4 F44 F85 SCR26 SCR27 SCR37 C27

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.4.3 Focus Order (A)

## 12.9 Dans chaque page web, la navigation ne doit pas contenir de piège au clavier. Cette règle est-elle respectée ?

### 12.9.1 Dans chaque page web, chaque élément recevant le `focus` vérifie-t-il une de ces conditions ?

* Il est possible d’atteindre l’élément suivant ou précédent pouvant recevoir le `focus` avec la touche de tabulation ;
* L’utilisateur est informé d’un mécanisme fonctionnel permettant d’atteindre au clavier l’élément suivant ou précédent pouvant recevoir le `focus`.

#### Méthodologie

1. Retrouver dans le document l’ensemble des éléments d’interface susceptibles de recevoir le `focus` (au moyen de la tabulation ou au moyen d’un script) ;
2. Pour chaque élément d’interface, vérifier que l’utilisateur peut atteindre l’élément suivant ou précédent pouvant recevoir le `focus` :
   * Soit au moyen de la touche de tabulation (Tab ou Maj+Tab) ;
   * Soit au moyen d’une autre interaction clavier dont l’utilisateur est informé (par exemple, les flèches de direction).
3. Si c’est le cas pour chaque élément d’interface, le test est validé.

*Note : certains éléments d’interface complexes, comme un groupe de boutons radio, une liste de sélection et tous les composants développés avec WAI-ARIA font appel à des navigations optimisées qui utilisent généralement les flèches de direction pour passer d’une partie du composant à l’autre. Par exemple, dans un groupe de boutons radio les options sont navigables avec les flèches de direction. De même dans un système d’onglets l’utilisateur active les onglets avec les flèches de direction. Le test sur le piège au clavier se limite alors à vérifier que le composant est atteint avec la tabulation et qu’il est possible de passer au composant suivant ou revenir au composant précédent.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.1.1 Clavier (Niveau A)** :
  Toutes les fonctionnalités du contenu sont utilisables à l’aide d’une interface clavier sans exiger un rythme de frappe propre à l’utilisateur, sauf lorsque la fonction sous-jacente nécessite une saisie qui dépend du tracé du mouvement effectué par l’utilisateur et pas seulement des points de départ et d’arrivée de ce tracé.

  * **Note** : Cette exception ne concerne que la fonction sous-jacente et non la technique de saisie. Par exemple, lorsqu’on utilise l’écriture manuscrite pour saisir du texte, la technique de saisie (l’écriture manuscrite) nécessite une saisie qui dépend d’un tracé, mais la fonction sous-jacente (la saisie de texte) ne le requiert pas.

  * **Note** : Cela n’interdit pas et ne devrait pas décourager l’utilisation de la souris ou de toute autre méthode de saisie en plus de l’utilisation du clavier.
* **2.1.2 Pas de piège au clavier (Niveau A)** :
  Si le focus du clavier peut être positionné sur un élément de la page à l’aide d’une interface clavier, réciproquement, il peut être déplacé hors de ce même composant simplement à l’aide d’une interface clavier et, si ce déplacement exige plus que l’utilisation d’une simple touche flèche ou tabulation ou toute autre méthode standard de sortie, l’utilisateur est informé de la méthode permettant de déplacer le focus hors de ce composant.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Voir l’exigence de conformité 5 : Non-interférence.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G21 H91 F10

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.1.1 Keyboard (A)
  * 9.2.1.2 No Keyboard Trap (A)

## 12.10 Dans chaque page web, les raccourcis clavier n’utilisant qu’une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) sont-ils contrôlables par l’utilisateur ?

### 12.10.1 Dans chaque page web, chaque raccourci clavier n’utilisant qu’une seule touche (lettre minuscule ou majuscule, ponctuation, chiffre ou symbole) vérifie-t-il l’une de ces conditions ?

* Un mécanisme est disponible pour désactiver le raccourci clavier ;
* Un mécanisme est disponible pour configurer la touche de raccourci clavier au moyen des touches de modification (Ctrl, Alt, Maj, etc.) ;
* Dans le cas d’un composant d’interface utilisateur, le raccourci clavier qui lui est associé ne peut être activé que si le `focus` clavier est sur ce composant.

#### Méthodologie

1. Retrouver dans le document l’ensemble des raccourcis clavier proposés à l’utilisateur ;
2. Pour chaque raccourci clavier, vérifier que :
   * Soit un mécanisme est disponible pour désactiver le raccourci clavier ;
   * Soit un mécanisme est disponible pour configurer la touche de raccourci clavier au moyen des touches de modification (Ctrl, Alt, Maj, etc.) ;
   * Soit, dans le cas d’un composant d’interface utilisateur, le raccourci clavier qui lui est associé ne peut être activé que si le `focus` clavier est sur ce composant.
3. Si c’est le cas pour chaque raccourci clavier, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.1.4 Raccourcis clavier utilisant des caractères (Niveau A)** :
  Si un raccourci clavier est implémenté dans du contenu en utilisant uniquement des caractères de type lettres (y compris les majuscules et les minuscules), des signes de ponctuation, des chiffres ou des symboles, alors au moins l’une des conditions suivantes est vraie :

  * **Désactiver** : un mécanisme est disponible pour désactiver le raccourci ;

  * **Réassigner** : un mécanisme est disponible pour réassigner le raccourci afin d’utiliser un ou plusieurs caractères non imprimables du clavier (par exemple, Ctrl, Alt, etc.) ;

  * **Actif uniquement au focus** : le raccourci clavier pour un composant d’interface utilisateur n’est actif que lorsque ce composant a le focus.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F99 G217

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.1.4 Character Key Shortcuts (A)

## 12.11 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de focus ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier ?

### 12.11.1 Dans chaque page web, les contenus additionnels apparaissant au survol, à la prise de `focus` ou à l’activation d’un composant d’interface sont-ils si nécessaire atteignables au clavier ?

#### Méthodologie

1. Retrouver dans le document l’ensemble des contenus additionnels apparaissant au survol, à la prise de `focus` ou à l’activation d’un composant d’interface ;
2. Pour chaque contenu additionnel, s’il contient des composants d’interface avec lesquels l’utilisateur peut interagir au clavier (par exemple, une infobulle personnalisée qui propose un lien dans son contenu), vérifier que ces composants d’interface sont atteignables au clavier ;
3. Si c’est le cas pour chaque contenu additionnel, le test est validé.

#### Notes techniques

Ce critère adresse les situations où un contenu additionnel contient des composants d’interface avec lesquels il doit être possible d’interagir au clavier. Par exemple, une infobulle personnalisée qui propose un lien dans son contenu.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.1.1 Clavier (Niveau A)** :
  Toutes les fonctionnalités du contenu sont utilisables à l’aide d’une interface clavier sans exiger un rythme de frappe propre à l’utilisateur, sauf lorsque la fonction sous-jacente nécessite une saisie qui dépend du tracé du mouvement effectué par l’utilisateur et pas seulement des points de départ et d’arrivée de ce tracé.

  * **Note** : Cette exception ne concerne que la fonction sous-jacente et non la technique de saisie. Par exemple, lorsqu’on utilise l’écriture manuscrite pour saisir du texte, la technique de saisie (l’écriture manuscrite) nécessite une saisie qui dépend d’un tracé, mais la fonction sous-jacente (la saisie de texte) ne le requiert pas.

  * **Note** : Cela n’interdit pas et ne devrait pas décourager l’utilisation de la souris ou de toute autre méthode de saisie en plus de l’utilisation du clavier.

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.1.1 Keyboard (A)

# 13. Consultation

## 13.1 Pour chaque page web, l’utilisateur a-t-il le contrôle de chaque limite de temps modifiant le contenu (hors cas particuliers) ?

### 13.1.1 Pour chaque page web, chaque procédé de rafraîchissement (balise `<object>`, balise `<embed>`, balise `<svg>`, balise `<canvas>`, balise `<meta>`) vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’utilisateur peut arrêter ou relancer le rafraîchissement ;
* L’utilisateur peut augmenter la limite de temps entre deux rafraîchissements de dix fois, au moins ;
* L’utilisateur est averti de l’imminence du rafraîchissement et dispose de vingt secondes, au moins, pour augmenter la limite de temps avant le prochain rafraîchissement ;
* La limite de temps entre deux rafraîchissements est de vingt heures, au moins.

#### Méthodologie

1. Retrouver dans le document les rafraîchissements initiés dans le contenu par un élément `<object>`, `<embed>`, `<svg>`, `<canvas>` ou par un élément `<meta http-equiv="refresh" content="[compteur]">` (dans l’élément `<head>` de la page) ;
2. Pour chaque rafraîchissement, vérifier que :
   * Soit la présence d’un mécanisme permet à l’utilisateur de stopper et de relancer le rafraîchissement ;
   * Soit la présence d’un mécanisme permet à l’utilisateur d’augmenter la limite de temps entre deux rafraîchissements de dix fois, au moins ;
   * Soit la présence d’un mécanisme qui avertit l’utilisateur de l’imminence du rafraîchissement, laisse 20 secondes, au moins, à l’utilisateur, pour augmenter la limite de temps avant le prochain rafraîchissement ;
   * Soit la limite de temps entre deux rafraîchissements est de vingt heures, au moins.
3. Si c’est le cas, le test est validé.

### 13.1.2 Pour chaque page web, chaque procédé de redirection effectué via une balise `<meta>` est-il immédiat (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document une redirection automatique initiée par un élément `<meta http-equiv="refresh" content="0;URL=‘[URL ciblée]’" />` ;
2. Vérifier que la redirection est immédiate ;
3. Si c’est le cas, le test est validé.

### 13.1.3 Pour chaque page web, chaque procédé de redirection effectué via un script vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’utilisateur peut arrêter ou relancer la redirection ;
* L’utilisateur peut augmenter la limite de temps avant la redirection de dix fois, au moins ;
* L’utilisateur est averti de l’imminence de la redirection et dispose de vingt secondes, au moins, pour augmenter la limite de temps avant la prochaine redirection ;
* La limite de temps avant la redirection est de vingt heures, au moins.

#### Méthodologie

1. Retrouver dans le document les redirections automatiques initiées par un script (sous la forme d’un décompte par exemple) ;
2. Pour chaque redirection automatique, vérifier que :
   * Soit la présence d’un mécanisme permet à l’utilisateur de stopper et relancer la redirection ;
   * Soit la présence d’un mécanisme permet à l’utilisateur d’augmenter la limite de temps avant le rafraîchissement de dix fois, au moins ;
   * Soit la présence d’un mécanisme qui avertit l’utilisateur de l’imminence du rafraîchissement, laisse 20 secondes, au moins, à l’utilisateur, pour augmenter la limite de temps avant le prochain rafraîchissement ;
   * Soit la limite de temps avant la redirection est de vingt heures, au moins.
3. Si c’est le cas, le test est validé.

### 13.1.4 Pour chaque page web, chaque procédé limitant le temps d’une session vérifie-t-il une de ces conditions (hors cas particuliers) ?

* L’utilisateur peut supprimer la limite de temps ;
* L’utilisateur peut augmenter la limite de temps ;
* La limite de temps avant la fin de la session est de vingt heures au moins.

#### Méthodologie

1. Retrouver dans le document les procédés limitant le temps d’une session (par exemple, après une authentification) ;
2. Pour chaque procédé, vérifier que :
   * Soit la présence d’un mécanisme permet à l’utilisateur de supprimer la limite de temps ;
   * Soit la présence d’un mécanisme permet à l’utilisateur d’augmenter la limite de temps ;
   * Soit la limite de temps est de vingt heures, au moins.
3. Si c’est le cas, le test est validé.

*Note : lorsque la limite de temps est essentielle, notamment lorsqu’elle ne pourrait pas être supprimée sans changer fondamentalement le contenu ou les fonctionnalités liées au contenu, le critère est non applicable. Par exemple, le rafraîchissement d’un flux RSS dans une page n’est pas une limite de temps essentielle ; le critère est applicable. En revanche, une redirection automatique qui amène vers la nouvelle version d’une page à partir d’une url obsolète est essentielle ; le critère est non applicable.*

#### Cas particuliers

Il existe une gestion de cas particuliers lorsque la limite de temps est essentielle, notamment lorsqu’elle ne pourrait pas être supprimée sans changer fondamentalement le contenu ou les fonctionnalités liées au contenu.

Dans ces situations, le critère est non applicable. Par exemple, le rafraîchissement d’un flux RSS dans une page n’est pas une limite de temps essentielle ; le critère est applicable. En revanche, une redirection automatique qui amène vers la nouvelle version d’une page à partir d’une URL obsolète est essentielle ; le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.2.1 Réglage du délai (Niveau A)** :
  Pour chaque limite de temps fixée par le contenu, au moins l’un des points suivants est vrai :

  * **Suppression** : l’utilisateur a la possibilité de supprimer la limite de temps avant de la rencontrer ; ou

  * **Ajustement** : l’utilisateur a la possibilité d’ajuster la limite de temps avant de la rencontrer dans un intervalle d’au moins dix fois la durée paramétrée par défaut ; ou

  * **Extension** : l’utilisateur est averti avant que la limite de temps n’expire et il lui est accordé au moins 20 secondes pour étendre cette limite par une action simple (par exemple, « appuyer sur la barre d’espace ») et l’utilisateur a la possibilité d’étendre la limite de temps au moins dix fois ; ou

  * **L’exception du temps réel** : la limite de temps est une partie constitutive d’un événement en temps réel (par exemple, une enchère) et aucune alternative n’est possible ; ou

  * **L’exception de la limite essentielle** : la limite de temps est essentielle et l’étendre invaliderait alors l’activité ; ou

  * **L’exception des 20 heures** : la limite de temps est supérieure à 20 heures.

  * **Note** : Ce critère de succès permet de s’assurer que les utilisateurs peuvent compléter leurs tâches sans changement inattendu de contenu ou de contexte résultant de la limite de temps. Il devrait être considéré conjointement avec le critère de succès 3.2.1, qui pose des limites aux changements de contenu ou de contexte résultant d’une action de l’utilisateur.
* **2.2.2 Mettre en pause, arrêter, masquer (Niveau A)** :
  Pour toute information en mouvement, clignotante, défilante ou mise à jour automatiquement, tous les points suivants sont vrais :

  * **Déplacement, clignotement, défilement** : pour toute information en mouvement, clignotante ou défilante qui (1) démarre automatiquement, (2) dure plus de cinq secondes et (3) est présentée conjointement avec un autre contenu, il y a un mécanisme à la disposition de l’utilisateur pour la mettre en pause, l’arrêter ou la masquer, à moins que le mouvement, le clignotement ou le défilement s’avère un élément essentiel au bon déroulement de l’activité; et

  * **Mise à jour automatique** : pour toute information mise à jour automatiquement qui (1) démarre automatiquement (2) et est présentée conjointement avec un autre contenu, il y a un mécanisme à la disposition de l’utilisateur pour la mettre en pause, l’arrêter ou pour en contrôler la fréquence des mises à jour à moins que la mise à jour automatique s’avère essentielle au bon déroulement de l’activité.

  * **Note** : Pour les exigences relatives au contenu scintillant ou flashant, se référer à la règle 2.3.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Lire Exigence de conformité 5 : Non-interférence.

  * **Note** : Il n’est pas exigé que le contenu mis à jour périodiquement par logiciel ou diffusé en flux à l’agent utilisateur conserve ou présente l’information générée ou reçue entre la mise en pause et la reprise de la présentation, puisque cela peut ne pas être techniquement possible et s’avérer trompeur dans beaucoup de situations.

  * **Note** : Une animation survenant dans une phase de pré-chargement ou dans une situation similaire peut être considérée comme essentielle si aucune interaction n’est permise à tous les utilisateurs durant cette phase et si l’absence d’indication de progression est susceptible de perturber les utilisateurs ou de leur faire croire que le contenu est figé ou défectueux.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F40 F41 F58 F61 G75 G76 G110 G133 G180 G186 G198 H76 SCR1 SCR16 SCR36 SVR1

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.2.1 Timing Adjustable (A)
  * 9.2.2.2 Pause, Stop, Hide (A)

## 13.2 Dans chaque page web, l’ouverture d’une nouvelle fenêtre ne doit pas être déclenchée sans action de l’utilisateur. Cette règle est-elle respectée ?

### 13.2.1 Dans chaque page web, l’ouverture d’une nouvelle fenêtre ne doit pas être déclenchée sans action de l’utilisateur. Cette règle est-elle respectée ?

#### Méthodologie

1. Vérifier qu’à l’ouverture du document, aucune nouvelle fenêtre (pop-up ou pop-under, par exemple) n’est ouverte.
2. Si c’est le cas, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **3.2.1 Au focus (Niveau A)** :
  Quand un composant d’interface utilisateur reçoit le focus, il ne doit pas initier de changement de contexte.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F55 G107

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.3.2.1 On focus (A)

## 13.3 Dans chaque page web, chaque document bureautique en téléchargement possède-t-il, si nécessaire, une version accessible (hors cas particuliers) ?

### 13.3.1 Dans chaque page web, chaque fonctionnalité de téléchargement d’un document bureautique vérifie-t-elle une de ces conditions ?

* Le document en téléchargement est compatible avec l’accessibilité ;
* Il en existe une version alternative en téléchargement compatible avec l’accessibilité ;
* Il en existe une version alternative au format HTML compatible avec l’accessibilité.

#### Méthodologie

1. Retrouver dans le document les liens et les contrôles de formulaire (un bouton de formulaire ou un formulaire de téléchargement par exemple) permettant de télécharger un fichier au format bureautique ;
2. Pour chaque fichier au format bureautique, vérifier la présence d’une version alternative présentée comme accessible :
3. Pour les documents au format .pdf, analyser le fichier avec l’outil PAC (PDF Accessibility Checker) et vérifier l’absence d’erreur d’accessibilité dans le document (cf. note) ;
4. Pour les documents au format .doc ou .docx, analyser le fichier avec l’outil de vérification d’accessibilité de Microsoft Office (à partir de la version 2010) et vérifier l’absence d’erreur d’accessibilité (cf. note) ;
5. Pour les documents au format .odt, analyser le document avec l’éditeur OpenOffice et vérifier que l’ensemble des contenus est conforme avec la liste des critères « Liste document bureautique en téléchargement » (cf. note pour une méthode alternative) ;
6. Pour les documents au format EPUB/DAISY, analyser le document avec un éditeur EPUB/DAISY et vérifier que l’ensemble des contenus est conforme avec la liste des critères « Liste document bureautique en téléchargement ».
7. Pour les documents eux-mêmes au format .html, analyser l’accessibilité du document.
8. Si c’est le cas pour chaque fichier au format bureautique, le test est validé.
9. Note au sujet de l’outil PAC : l’outil analyse le document PDF du point de vue de l’accessibilité mais également de critères de qualité (par exemple la norme PDF/UA). Seules les erreurs relatives à des critères présents dans la liste des critères « Liste document bureautique en téléchargement » rendent le critère « Non conforme ». Par ailleurs, cet outil ne fonctionne que sur la plateforme Windows. Sur Mac, le contrôle doit se faire manuellement. Note au sujet Microsoft Office : le logiciel offre un vérificateur d’accessibilité en standard, (accessible via le menu « Fichier > Informations > Vérifier la présence de problèmes > Vérifier l’accessibilité »). Ce vérificateur peut être considérablement amélioré via le plugin Word Accessibility Plug-in (voir dans la section Outils). Ce plugin ne fonctionne que sur Windows. Sur Mac, le contrôle doit se faire manuellement. Note au sujet des documents au format .odt : OpenOffice et LibreOffice ne possèdent pas de vérificateur d’accessibilité. Une méthode plus rapide qu’une analyse manuelle peut consister à enregistrer le document au format .docx et le vérifier via le vérificateur d’accessibilité de Microsoft Office 2010. Attention cependant : cette méthode rapide est à réserver aux documents très simples car certaines informations liées à l’accessibilité ne sont pas correctement transcodées. C’est le cas des indications de langue, de certaines alternatives d’images ou d’en-têtes fusionnées sur les tableaux par exemple. Note au sujet du format EPUB : l’utilitaire Ace by DAISY App permet d’effectuer le travail de validation d’un fichier EPUB 3 de manière efficace. Note au sujet des documents dérogés : le référentiel propose un statut de dérogation dans certains cas (cf. guide d’accompagnement). Dans ce cas, les tests ne sont pas à réaliser, la version accessible étant fournie sur demande de l’utilisateur. Note à l’attention des personnes de droit privé mentionnées aux 2° à 4° du I de l’article 47 de la loi du 11 février 2005 : si les fichiers bureautiques (ex : PDF, documents Microsoft ou LibreOffice, etc.) ont été publiés avant le 23 septembre 2018 (sauf si ce sont des documents nécessaires pour accomplir une démarche administrative relevant des tâches effectuées par l’organisme concerné), ils sont exemptés de l’obligation d’accessibilité.

#### Cas particuliers

Il existe une gestion de cas particuliers :

Pour les personnes de droit privé mentionnées aux 2° à 4° du I de l’article 47 de la loi du 11 février 2005 : si les fichiers bureautiques (ex : PDF, documents Microsoft ou LibreOffice, etc.) ont été publiés avant le 23 septembre 2018 (sauf si ce sont des documents nécessaires pour accomplir une démarche administrative relevant des tâches effectuées par l’organisme concerné), ils sont exemptés de l’obligation d’accessibilité.

Dans cette situation, le critère est non applicable.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.
* **2.4.1 Contourner des blocs (Niveau A)** :
  Un mécanisme permet de contourner les blocs de contenu qui sont répétés sur plusieurs pages Web.
* **2.4.3 Parcours du focus (Niveau A)** :
  Si une page Web peut être parcourue de façon séquentielle et que les séquences de navigation affectent la signification ou l’action, les éléments reçoivent le focus dans un ordre qui préserve la signification et l’opérabilité.
* **3.1.1 Langue de la page (Niveau A)** :
  La langue par défaut de chaque page Web peut être déterminée par un programme informatique.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F15 G10 G135

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.1.3.1 Info and Relationships (A)
  * 9.1.3.2 Meaningful Sequence (A)
  * 9.2.4.1 Bypass Blocks (A)
  * 9.2.4.3 Focus Order (A)
  * 9.3.1.1 Language of Page (A)
  * 9.4.1.2 Name, Role, Value (A)

## 13.4 Pour chaque document bureautique ayant une version accessible, cette version offre-t-elle la même information ?

### 13.4.1 Chaque document bureautique ayant une version accessible vérifie-t-il une de ces conditions ?

* La version compatible avec l’accessibilité offre la même information ;
* La version alternative au format HTML est pertinente et offre la même information.

#### Méthodologie

1. Retrouver dans le document les fichiers en téléchargement au format bureautique accompagné de leur version alternative accessible ;
2. Pour chaque couple de fichiers, ouvrir les deux documents (le document d’origine et le document accessible) et vérifier que les deux documents apportent la même information ;
3. Si c’est le cas pour chaque couple de fichiers, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.
* **1.3.1 Information et relations (Niveau A)** :
  L’information, la structure, et les relations véhiculées par la présentation peuvent être déterminées par un programme informatique ou sont disponibles sous forme de texte.
* **1.3.2 Ordre séquentiel logique (Niveau A)** :
  Lorsque l’ordre de présentation du contenu affecte sa signification, un ordre de lecture correct peut être déterminé par un programme informatique.
* **2.4.1 Contourner des blocs (Niveau A)** :
  Un mécanisme permet de contourner les blocs de contenu qui sont répétés sur plusieurs pages Web.
* **2.4.3 Parcours du focus (Niveau A)** :
  Si une page Web peut être parcourue de façon séquentielle et que les séquences de navigation affectent la signification ou l’action, les éléments reçoivent le focus dans un ordre qui préserve la signification et l’opérabilité.
* **3.1.1 Langue de la page (Niveau A)** :
  La langue par défaut de chaque page Web peut être déterminée par un programme informatique.
* **4.1.2 Nom, rôle et valeur (Niveau A)** :
  Pour tout composant d’interface utilisateur (comprenant mais n’étant pas limité aux éléments de formulaire, liens et composants générés par des scripts), le nom et le rôle peuvent être déterminés par un programme informatique ; les états, les propriétés et les valeurs qui peuvent être paramétrés par l’utilisateur peuvent être définis par programmation ; et la notification des changements de ces éléments est disponible aux agents utilisateurs, incluant les technologies d’assistance.

  * **Note** : Ce critère de succès s’adresse d’abord aux auteurs qui développent ou programment leurs propres composants d’interface utilisateur. Toutefois, les contrôles HTML standards se conforment déjà à ce critère de succès lorsqu’ils sont utilisés conformément à la spécification.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F15 G10 G135

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)
  * 9.1.3.1 Info and Relationships (A)
  * 9.1.3.2 Meaningful Sequence (A)
  * 9.2.4.1 Bypass Blocks (A)
  * 9.2.4.3 Focus Order (A)
  * 9.3.1.1 Language of Page (A)
  * 9.4.1.2 Name, Role, Value (A)

## 13.5 Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) a-t-il une alternative ?

### 13.5.1 Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) vérifie-t-il une de ces conditions ?

* Un attribut `title` est disponible ;
* Une définition est donnée par le contexte adjacent.

#### Méthodologie

1. Retrouver dans le document les contenus cryptiques (art ASCII, émoticône, syntaxe cryptique) ;
2. Pour chaque contenu cryptique, vérifier que :
   * Soit une définition est disponible au moyen d’un attribut `title`, sur un lien, un contrôle de formulaire, une abréviation (élément `<abbr>`) par exemple ;
   * Soit une définition est donnée dans le contexte adjacent (immédiatement avant ou après).
3. Si c’est le cas pour chaque contenu cryptique, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F71 F70 G135 H86

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 13.6 Dans chaque page web, pour chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) ayant une alternative, cette alternative est-elle pertinente ?

### 13.6.1 Dans chaque page web, chaque contenu cryptique (art ASCII, émoticône, syntaxe cryptique) vérifie-t-il une de ces conditions ?

* Le contenu de l’attribut `title` est pertinent ;
* La définition donnée par le contexte adjacent est pertinente.

#### Méthodologie

1. Retrouver dans le document les contenus cryptiques (art ASCII, émoticône, syntaxe cryptique) ;
2. Pour chaque contenu cryptique, vérifier que la définition donnée est pertinente.
3. Si c’est le cas pour chaque contenu cryptique, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.1.1 Contenu non textuel (Niveau A)** :
  Tout contenu non textuel présenté à l’utilisateur a un équivalent textuel qui remplit une fonction équivalente sauf dans les situations énumérées ci-dessous.

  * **Composant d’interface ou de saisie** : si le contenu non textuel est un composant d’interface ou s’il permet la saisie d’informations par l’utilisateur, alors il a un nom qui décrit sa fonction. (Se référer au Critère de succès 4.1.2 pour des exigences supplémentaires à propos des composants d’interfaces utilisateur ou des contenus qui permettent la saisie d’informations par l’utilisateur.)

  * **Média temporel** : si le contenu non textuel est un média temporel, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel. (Se référer à la Règle 1.2 pour des exigences supplémentaires concernant les médias temporels.)

  * **Test** : si le contenu non textuel est un test ou un exercice qui serait invalide s’il était présenté en texte, alors l’équivalent textuel fournit au moins une identification descriptive du contenu non textuel.

  * **Contenu sensoriel** : si le contenu non textuel vise d’abord à créer une expérience sensorielle spécifique, l’équivalent textuel fournit au moins une identification descriptive de ce contenu non textuel.

  * **CAPTCHA** : si ce contenu non textuel vise à confirmer que le contenu est consulté par une personne plutôt que par un ordinateur, alors un équivalent textuel est fourni pour identifier et décrire la fonction du contenu non textuel, et des formes alternatives du CAPTCHA sont proposées pour différents types de perception sensorielle afin d’accommoder différents types de limitations fonctionnelles.

  * **Décoration, formatage, invisibilité** : si le contenu non textuel est purement décoratif, s’il est utilisé seulement pour un formatage visuel ou s’il n’est pas présenté à l’utilisateur, alors il est implémenté de manière à être ignoré par les technologies d’assistance.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F71 F72 H86

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.1.1 Non-text Content (A)

## 13.7 Dans chaque page web, les changements brusques de luminosité ou les effets de flash sont-ils correctement utilisés ?

### 13.7.1 Dans chaque page web, chaque image ou élément multimédia (balise `<video>`, balise `<img>`, balise `<svg>`, balise `<canvas>`, balise `<embed>` ou balise `<object>`) qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?

* La fréquence de l’effet est inférieure à 3 par seconde ;
* La surface totale cumulée des effets est inférieure ou égale à 21824 pixels.

#### Méthodologie

1. Retrouver dans le document les contenus clignotants ou qui provoquent des effets de flash de type image animée, vidéo (cf. note) ou animation (éléments `<img>`, `<svg>`, `<canvas>`, `<embed>`, `<object>` ou `<video>`) ;
2. Pour chaque contenu clignotant ou provoquant des effets de flash, vérifier que :
   * Soit la fréquence de l’effet est inférieur à 3 par seconde ;
   * Soit la surface cumulée est inférieure à 21824 pixels.
3. Si c’est le cas pour chaque contenu clignotant ou provoquant des effets de flash, le test est validé.

*Note : l’évaluation de ce critère peut être complexe. Lorsque l’effet est géré par un script ou au moyen de CSS, l’analyse du code est suffisante. L’outil PEAT permet d’analyser les vidéos au format .avi, par exemple. Un exemple de vidéo ayant provoqué des crises d’épilepsie peut être consulté ici : London 2012 Olympics Seizure (https://www.youtube.com/watch?v=vs0hfhSje9M).*

### 13.7.2 Dans chaque page web, chaque script qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?

* La fréquence de l’effet est inférieure à 3 par seconde ;
* La surface totale cumulée des effets est inférieure ou égale à 21824 pixels.

#### Méthodologie

1. Retrouver dans le document les contenus clignotants ou qui provoquent des effets de flash obtenus au moyen d’un script ;
2. Pour chaque contenu clignotant ou provoquant des effets de flash, vérifier que :
   * Soit la fréquence de l’effet est inférieur à 3 par seconde ;
   * Soit la surface cumulée est inférieure à 21824 pixels.
3. Si c’est le cas pour chaque contenu clignotant ou provoquant des effets de flash, le test est validé.

### 13.7.3 Dans chaque page web, chaque mise en forme CSS qui provoque un changement brusque de luminosité ou un effet de flash vérifie-t-il une de ces conditions ?

* La fréquence de l’effet est inférieure à 3 par seconde ;
* La surface totale cumulée des effets est inférieure ou égale à 21824 pixels.

#### Méthodologie

1. Retrouver dans le document les contenus clignotants ou qui provoquent des effets de flash obtenus au moyen d’une animation CSS ;
2. Pour chaque contenu clignotant ou provoquant des effets de flash, vérifier que :
   * Soit la fréquence de l’effet est inférieur à 3 par seconde ;
   * Soit la surface cumulée est inférieure à 21824 pixels.
3. Si c’est le cas pour chaque contenu clignotant ou provoquant des effets de flash, le test est validé.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.3.1 Pas plus de trois flashs ou sous le seuil critique (Niveau A)** :
  Une page Web doit être exempte de tout élément qui flashe plus de trois fois dans n’importe quel intervalle d’une seconde ou ce flash doit se situer sous le seuil de flash générique et le seuil de flash rouge.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Voir l’exigence de conformité 5 : Non-interférence.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G15 G19 G176

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.3.1 Three Flashes or Below Threshold (A)

## 13.8 Dans chaque page web, chaque contenu en mouvement ou clignotant est-il contrôlable par l’utilisateur ?

### 13.8.1 Dans chaque page web, chaque contenu en mouvement déclenché automatiquement, vérifie-t-il une de ces conditions ?

* La durée du mouvement est inférieure ou égale à 5 secondes ;
* L’utilisateur peut arrêter et relancer le mouvement ;
* L’utilisateur peut afficher et masquer le contenu en mouvement ;
* L’utilisateur peut afficher la totalité de l’information sans le mouvement.

#### Méthodologie

1. Retrouver dans le document les contenus en mouvement (obtenus au moyen d’une image, d’un script ou d’un effet CSS) déclenchés automatiquement au chargement de la page ou lors de l’affichage d’un contenu (cf. note) ;
2. Pour chaque contenu, vérifier que :
   * Soit la durée du mouvement est inférieure à 5 secondes ;
   * Soit la présence d’un mécanisme (un bouton, par exemple) permet d’arrêter et de relancer le mouvement ;
   * Soit la présence d’un mécanisme (un bouton, par exemple) permet de cacher et d’afficher à nouveau le contenu en mouvement ;
   * Soit la présence d’un mécanisme (un bouton, par exemple) permet d’afficher la totalité du contenu sans mouvement.
3. Si c’est le cas pour chaque contenu en mouvement, le test est validé.

### 13.8.2 Dans chaque page web, chaque contenu clignotant déclenché automatiquement, vérifie-t-il une de ces conditions ?

* La durée du clignotement est inférieure ou égale à 5 secondes ;
* L’utilisateur peut arrêter et relancer le clignotement ;
* L’utilisateur peut afficher et masquer le contenu clignotant ;
* L’utilisateur peut afficher la totalité de l’information sans le clignotement.

#### Méthodologie

1. Retrouver dans le document les contenus clignotants (obtenus au moyen d’une image, d’un script ou d’un effet CSS) déclenchés automatiquement au chargement de la page ou lors de l’affichage d’un contenu (cf. note).
2. Pour chaque contenu, vérifier que :
   * Soit la durée du clignotement est inférieure à 5 secondes ;
   * Soit la présence d’un mécanisme (un bouton, par exemple) permet d’arrêter et de relancer le clignotement ;
   * Soit la présence d’un mécanisme (un bouton, par exemple) permet de cacher et d’afficher à nouveau le contenu clignotant ;
   * Soit la présence d’un mécanisme (un bouton, par exemple) permet d’afficher la totalité du contenu clignotant.
3. Si c’est le cas pour chaque contenu clignotant, le test est validé.

*Note : l’arrêt ou la mise en pause d’un contenu en mouvement ou clignotant au moyen de la prise de `focus` (par exemple, l’effet est suspendu uniquement pendant la prise de `focus`) n’est pas considéré comme un procédé conforme. Dans certains cas, le mouvement ne peut pas être arrêté, par exemple dans le cas d’une barre de progression, dans ce cas, le critère est non applicable.*

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.2.1 Réglage du délai (Niveau A)** :
  Pour chaque limite de temps fixée par le contenu, au moins l’un des points suivants est vrai :

  * **Suppression** : l’utilisateur a la possibilité de supprimer la limite de temps avant de la rencontrer ; ou

  * **Ajustement** : l’utilisateur a la possibilité d’ajuster la limite de temps avant de la rencontrer dans un intervalle d’au moins dix fois la durée paramétrée par défaut ; ou

  * **Extension** : l’utilisateur est averti avant que la limite de temps n’expire et il lui est accordé au moins 20 secondes pour étendre cette limite par une action simple (par exemple, « appuyer sur la barre d’espace ») et l’utilisateur a la possibilité d’étendre la limite de temps au moins dix fois ; ou

  * **L’exception du temps réel** : la limite de temps est une partie constitutive d’un événement en temps réel (par exemple, une enchère) et aucune alternative n’est possible ; ou

  * **L’exception de la limite essentielle** : la limite de temps est essentielle et l’étendre invaliderait alors l’activité ; ou

  * **L’exception des 20 heures** : la limite de temps est supérieure à 20 heures.

  * **Note** : Ce critère de succès permet de s’assurer que les utilisateurs peuvent compléter leurs tâches sans changement inattendu de contenu ou de contexte résultant de la limite de temps. Il devrait être considéré conjointement avec le critère de succès 3.2.1, qui pose des limites aux changements de contenu ou de contexte résultant d’une action de l’utilisateur.
* **2.2.2 Mettre en pause, arrêter, masquer (Niveau A)** :
  Pour toute information en mouvement, clignotante, défilante ou mise à jour automatiquement, tous les points suivants sont vrais :

  * **Déplacement, clignotement, défilement** : pour toute information en mouvement, clignotante ou défilante qui (1) démarre automatiquement, (2) dure plus de cinq secondes et (3) est présentée conjointement avec un autre contenu, il y a un mécanisme à la disposition de l’utilisateur pour la mettre en pause, l’arrêter ou la masquer, à moins que le mouvement, le clignotement ou le défilement s’avère un élément essentiel au bon déroulement de l’activité; et

  * **Mise à jour automatique** : pour toute information mise à jour automatiquement qui (1) démarre automatiquement (2) et est présentée conjointement avec un autre contenu, il y a un mécanisme à la disposition de l’utilisateur pour la mettre en pause, l’arrêter ou pour en contrôler la fréquence des mises à jour à moins que la mise à jour automatique s’avère essentielle au bon déroulement de l’activité.

  * **Note** : Pour les exigences relatives au contenu scintillant ou flashant, se référer à la règle 2.3.

  * **Note** : Puisque tout contenu ne satisfaisant pas à ce critère de succès peut interférer avec la capacité de l’utilisateur à exploiter la page entière, tout le contenu présent dans la page Web (qu’il soit utilisé pour satisfaire à d’autres critères de succès ou non) doit satisfaire à ce critère de succès. Lire Exigence de conformité 5 : Non-interférence.

  * **Note** : Il n’est pas exigé que le contenu mis à jour périodiquement par logiciel ou diffusé en flux à l’agent utilisateur conserve ou présente l’information générée ou reçue entre la mise en pause et la reprise de la présentation, puisque cela peut ne pas être techniquement possible et s’avérer trompeur dans beaucoup de situations.

  * **Note** : Une animation survenant dans une phase de pré-chargement ou dans une situation similaire peut être considérée comme essentielle si aucune interaction n’est permise à tous les utilisateurs durant cette phase et si l’absence d’indication de progression est susceptible de perturber les utilisateurs ou de leur faire croire que le contenu est figé ou défectueux.

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** F4 F7 F16 F47 F50 G4 G11 G152 G186 G187 G191 SCR22 SCR33 SCR36 SM11 SM12

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.2.1 Timing Adjustable (A)
  * 9.2.2.2 Pause, Stop, Hide (A)

## 13.9 Dans chaque page web, le contenu proposé est-il consultable quelle que soit l’orientation de l’écran (portrait ou paysage) (hors cas particuliers) ?

### 13.9.1 Dans chaque page web, chaque contenu vérifie-t-il ces conditions (hors cas particuliers) ?

* La consultation est possible quel que soit le mode d’orientation de l’écran ;
* Le contenu proposé reste le même quel que soit le mode d’orientation de l’écran utilisé même si sa présentation et le moyen d’y accéder peut différer.

#### Méthodologie

1. Consulter le document dans un mode d’orientation portrait puis dans un mode d’orientation paysage ;
2. Vérifier que :
   * La consultation est possible quel que soit le mode d’orientation de l’écran.
   * Le contenu proposé reste le même quel que soit le mode d’orientation de l’écran utilisé même si sa présentation et le moyen d’y accéder peut différer.
3. Si c’est le cas, le test est validé.

*Note : il existe des interfaces pour lesquelles l’orientation du périphérique est essentielle à leur utilisation. Dans ces situations, le critère est non applicable. Il peut s’agir d’interfaces de jeu, de piano, de dépôt de chèques bancaires, etc. Si l’interface est le seul moyen d’accéder au service proposé, une alternative devrait être mise en place pour pallier cette carence.*

#### Cas particuliers

Il existe des interfaces pour lesquelles l’orientation du périphérique est essentielle à leur utilisation.

Dans ces situations, le critère est non applicable. Il peut s’agir d’interfaces de jeu, de piano, de dépôt de chèques bancaires, etc.

Si l’interface est le seul moyen d’accéder au service proposé, une alternative devrait être mise en place pour pallier cette carence.

Références documentaires

API JS : https://www.w3.org/TR/screen-orientation/

API Viewport : https://www.w3.org/TR/css-device-adapt-1/

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **1.3.4 Orientation (Niveau AA)** :
  La consultation et le fonctionnement du contenu ne sont pas limités à une seule orientation de l’affichage, comme le portrait ou le paysage, à moins qu’une orientation spécifique de l’affichage ne soit essentielle.

  * **Note** : On compte parmi les exemples où une orientation spécifique de l’affichage est essentielle : un chèque de banque, une application de piano, des diapositives pour un projecteur ou une télévision, ou un contenu de réalité virtuelle où l’orientation binaire de l’affichage n’est pas applicable.

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.1.3.4 Orientation (AA)

## 13.10 Dans chaque page web, les fonctionnalités utilisables ou disponibles au moyen d’un geste complexe peuvent-elles être également disponibles au moyen d’un geste simple (hors cas particuliers) ?

### 13.10.1 Dans chaque page web, chaque fonctionnalité utilisable ou disponible suite à un contact multipoint est-elle également utilisable ou disponible suite à un contact en un point unique de l’écran (hors cas particuliers).

#### Méthodologie

1. Retrouver dans le document les fonctionnalités utilisables ou disponibles au moyen d’une interaction au toucher de type contact multipoint ;
2. Pour chaque fonctionnalité, vérifier qu’elle reste disponible au moyen d’une interaction au toucher de type contact en un point unique de l’écran (par exemple, la possibilité de consulter les éléments d’une liste par un mouvement de balayage horizontal droit ou gauche doit aussi être disponible au moyen de boutons “précédent” et “suivant” ou encore un geste de pincer et zoomer qui peut être alternativement réalisé au moyen de boutons “plus” et “moins”) ;
3. Si c’est le cas pour chaque fonctionnalité utilisable ou disponible au moyen d’une interaction au toucher de type contact multipoint, le test est validé.

### 13.10.2 Dans chaque page web, chaque fonctionnalité utilisable ou disponible suite à un geste basé sur le suivi d’une trajectoire sur l’écran est-elle également utilisable ou disponible suite à un contact en un point unique de l’écran (hors cas particuliers).

#### Méthodologie

1. Retrouver dans le document les fonctionnalités utilisables ou disponibles au moyen d’une interaction au toucher qui implique le suivi d’une trajectoire sur l’écran ;
2. Pour chaque fonctionnalité, vérifier qu’elle reste disponible au moyen d’une interaction au toucher de type contact en un point unique de l’écran (par exemple, la possibilité de composer son mot de passe en suivant une trajectoire sur un clavier virtuel doit aussi être disponible au moyen de pressions successives sur les touches du clavier) ;
3. Si c’est le cas pour chaque fonctionnalité utilisable ou disponible au moyen d’une interaction au toucher qui implique le suivi d’une trajectoire sur l’écran, le test est validé.
4. Il existe une gestion de cas particuliers dans deux types de situation :
   * Le critère ne s’applique qu’à des fonctionnalités mises en place par l’auteur du site. Il ne concerne donc pas les gestes requis par l’agent utilisateur ou le système d’exploitation.
   * Le critère ne s’applique pas aux fonctionnalités dont la réalisation d’un geste complexe est essentielle (exécuter le tracé d’une signature, par exemple).

#### Cas particuliers

Il existe une gestion de cas particuliers dans deux types de situation :

Le critère ne s’applique qu’à des fonctionnalités mises en place par l’auteur du site. Il ne concerne donc pas les gestes requis par l’agent utilisateur ou le système d’exploitation ;

Le critère ne s’applique pas aux fonctionnalités dont la réalisation d’un geste complexe est essentielle (exécuter le tracé d’une signature, par exemple).

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.5.1 Gestes pour le contrôle du pointeur (Niveau A)** :
  Toutes les fonctionnalités qui utilisent des gestes multipoints ou basés sur un tracé peuvent être utilisées avec un pointage à contact unique sans geste basé sur un tracé, à moins qu’un geste multipoint ou basé sur un tracé ne soit essentiel.

  * **Note** : Cette exigence s’applique aux contenus Web qui interprètent les actions du pointeur (elle ne s’applique donc pas aux actions nécessaires à l’utilisation d’un agent utilisateur ou d’une technologie d’assistance).

* **Technique(s) suffisante(s) et/ou échec(s) (en anglais) :** G215 G216

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.5.1 Pointer Gestures (A)

## 13.11 Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran peuvent-elles faire l’objet d’une annulation (hors cas particuliers) ?

### 13.11.1 Dans chaque page web, les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran vérifient-elles l’une de ces conditions (hors cas particuliers) ?

* L’action est déclenchée au moment où le dispositif de pointage est relâché ou relevé ;
* L’action est déclenchée au moment où le dispositif de pointage est pressé ou posé puis annulée lorsque le dispositif de pointage est relâché ou relevé ;
* Un mécanisme est disponible pour abandonner (avant achèvement de l’action) ou annuler (après achèvement) l’exécution de l’action.

#### Méthodologie

1. Retrouver dans le document les actions déclenchées au moyen d’un dispositif de pointage sur un point unique de l’écran ;
2. Pour chaque action, vérifier que :
   * Soit l’action est déclenchée au moment où le dispositif de pointage est relâché ou relevé ;
   * Soit l’action est déclenchée au moment où le dispositif de pointage est pressé ou posé puis annulée lorsque le dispositif de pointage est relâché ou relevé ;
   * Soit il existe un mécanisme pour abandonner (avant achèvement de l’action) ou annuler (après achèvement) l’exécution de l’action ; par exemple, lors d’une interaction de type glisser-déposer un relâchement du dispositif de pointage doit permettre d’abandonner l’interaction en cours et une fois la zone de dépôt atteinte, l’utilisateur doit rester en mesure d’annuler son opération de dépôt au moyen d’un dialogue de confirmation (choix de confirmer ou d’annuler le dépôt) ou par le fait de pouvoir replacer l’élément déposé à sa position initiale.
3. Si c’est le cas pour chaque action déclenchée au moyen d’un dispositif de pointage sur un point unique de l’écran, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque la fonctionnalité nécessite que le comportement attendu soit réalisé lors d’un événement descendant, par exemple, un émulateur de clavier dont les touches doivent s’activer à la pression comme sur un clavier physique. Dans ces situations, le critère est non applicable.

#### Notes techniques

Deux exemples de mécanisme mis en place pour annuler ou abandonner une action déclenchée au moyen d’un dispositif de pointage sur un point unique de l’écran :

Une fenêtre modale permettant d’annuler l’action après son achèvement ;

Pour une fonction de glisser/déposer, le fait d’abandonner l’action si l’utilisateur relâche l’élément en dehors de la zone cible.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.5.2 Annulation de l’action du pointeur (Niveau A)** :
  Pour une fonctionnalité qui peut être activée avec un dispositif de pointage à contact unique, au moins une des conditions suivantes est vraie :

  * **Aucun événement descendant** : l’événement descendant (down-event) du pointeur n’est pas utilisé pour exécuter une partie ou la totalité de la fonction ;

  * **Abandon ou annulation** : l’achèvement de la fonction se fait sur l’événement ascendant (up-event), et un mécanisme est disponible pour interrompre la fonction avant l’achèvement ou pour annuler la fonction après l’achèvement ;

  * **Inversion sur l’événement ascendant** : l’événement ascendant inverse tout résultat de l’événement descendant précédent ;

  * **Essentiel** : l’achèvement de la fonction lors de l’événement descendant est essentiel.

  * **Note** : Les fonctions qui émulent l’appui d’une touche du clavier ou du pavé numérique sont considérées comme essentielles.

  * **Note** : Cette exigence s’applique aux contenus Web qui interprètent les actions du pointeur (elle ne s’applique donc pas aux actions nécessaires à l’utilisation d’un agent utilisateur ou d’une technologie d’assistance).

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.5.2 Pointer Cancellation (A)

## 13.12 Dans chaque page web, les fonctionnalités qui impliquent un mouvement de l’appareil ou vers l’appareil peuvent-elles être satisfaites de manière alternative (hors cas particuliers) ?

### 13.12.1 Dans chaque page web, les fonctionnalités disponibles en bougeant l’appareil peuvent-elles être accomplies avec des composants d’interface utilisateur (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les fonctionnalités disponibles en bougeant l’appareil ;
2. Pour chaque fonctionnalité, vérifier qu’elle peut être accomplie au moyen de composants d’interface utilisateur ;
3. Si c’est le cas pour chaque fonctionnalité disponible en bougeant l’appareil, le test est validé.

### 13.12.2 Dans chaque page web, les fonctionnalités disponibles en faisant un geste en direction de l’appareil peuvent-elles être accomplies avec des composants d’interface utilisateur (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les fonctionnalités disponibles en faisant un geste en direction de l’appareil ;
2. Pour chaque fonctionnalité, vérifier qu’elle peut être accomplie au moyen de composants d’interface utilisateur ;
3. Si c’est le cas pour chaque fonctionnalité disponible en faisant un geste en direction de l’appareil, le test est validé.

### 13.12.3 L’utilisateur a-t-il la possibilité de désactiver la détection du mouvement pour éviter un déclenchement accidentel de la fonctionnalité (hors cas particuliers) ?

#### Méthodologie

1. Retrouver dans le document les fonctionnalités disponibles en mettant en mouvement l’appareil ;
2. Vérifier si l’utilisateur à la possibilité de désactiver la détection du mouvement ;
3. Si c’est le cas, pour chaque fonctionnalité, vérifier qu’elle ne peut pas être déclenchée ;
4. Si c’est le cas pour chaque fonctionnalité disponible en mettant en mouvement l’appareil, le test est validé.

#### Cas particuliers

Il existe une gestion de cas particulier lorsque :

Le mouvement est essentiel à l’accomplissement de la fonctionnalité (ex. podomètre) ;

La détection du mouvement est utilisée pour contrôler une fonctionnalité au travers d’une interface compatible avec l’accessibilité.

### Références

**Critère(s) de succès (WCAG 2.1) :**
* **2.5.4 Activation par le mouvement (Niveau A)** :
  Les fonctionnalités qui peuvent être activées par un mouvement de l’appareil ou un mouvement de l’utilisateur peuvent également être activées par des composants d’interface utilisateur et la réponse au mouvement peut être désactivée pour éviter une activation accidentelle, sauf dans les cas suivants :

  * **Interface compatible** : le mouvement est utilisé pour activer la fonctionnalité par l’intermédiaire d’une interface compatible avec l’accessibilité ;

  * **Essentiel** : le mouvement est essentiel à la fonction et le désactiver invaliderait l’activité.

* **EN 301 549 V2.1.2 (2018-08) (en anglais) :**
  * 9.2.5.4 Motion Actuation (A)

