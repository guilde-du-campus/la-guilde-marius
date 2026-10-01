# La definition of done de la Guilde

Une quête de sprint (un ticket) est terminée quand TOUTES ces cases sont cochées, pas avant. « Ça marche chez moi » n'est pas une definition of done.

1. **Le code compile strictement** : `npm run typecheck` sans erreur, aucun `any` de confort.
2. **Le lint et le format passent** : `npm run lint` et `npm run format:check` sans erreur.
3. **La fonctionnalité est testée à la main** sur le parcours nominal ET sur au moins un cas d'erreur (API coupée, saisie invalide...).
4. **Le code respecte les conventions** : identifiants en anglais, textes affichés en français, composants de présentation sans appel réseau, couleurs via les design tokens.
5. **La PR est relue et approuvée** par un pair, remarques traitées (corrigées ou discutées, jamais ignorées).
6. **La branche est à jour** avec `main` et se fusionne sans conflit.
7. **Le ticket est déplacé** dans la colonne « Terminé » du tableau, avec un commentaire si le périmètre a bougé.

## Les conventions de commit

Format : `type: description à l'impératif` (en anglais, comme le code).

Types utilisés : `feat` (nouvelle fonctionnalité), `fix` (correction), `refactor` (sans changement de comportement), `style` (CSS, mise en forme), `docs`, `chore` (outillage).

Exemples :

```
feat: add quest board pagination
fix: handle empty quest list on home page
refactor: extract QuestCard status badge
```
