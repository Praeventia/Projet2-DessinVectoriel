# Projet2-DessinVectoriel
Projet 2 en génie logiciel à Polytechnique Montreal. Le projet était de développer une application web qui permet de dessiner à l'aide des outils tel que Angular, Node.JS, TypeScript

Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

# Important

Les commandes commençant par `npm` ou `yarn` devront être exécutées dans les dossiers `client` et `server`.

## Installation des dépendances de l'application

-   Installer `npm` (non recommandé) ou `yarn` (très recommandé). `npm` viens avec `Node` que vous pouvez télecharger [ici](https://nodejs.org/en/download/)

-   Lancer `npm install` ou `yarn`

## Développement de l'application

Pour lancer l'application, il suffit d'exécuter: `npm start` ou `yarn start`. Vous devez lancer cette commande dans le dossier `client` et `server`

Pour le client :
Une page menant vers `http://localhost:4200/` s'ouvrira automatiquement.

Pour le serveur :
Votre serveur est accessible sur `http://localhost:3000`. Par défaut, votre client fait une requête `GET` vers le serveur pour obtenir un message.

L'application se relancera automatiquement si vous modifiez le code source de celle-ci.

## Génération de composants du client

Pour créer de nouveaux composants, nous vous recommandons l'utilisation d'angular CLI. Il suffit d'exécuter `ng generate component component-name` pour créer un nouveau composant.

Il est aussi possible de générer des directives, pipes, services, guards, interfaces, enums, muodules, classes, avec cette commande `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Exécution des tests unitaires

-   Exécuter `npm run test` ou `yarn test` pour lancer les tests unitaires.

-   Exécuter `npm run coverage` ou `yarn coverage` pour générer un rapport de couverture de code.

## Exécution de TSLint

-   Exécuter `npm run lint` pour lancer TSLint.

-   Exécuter `npm run lint -- --fix` ou `yarn lint --fix` pour régler automatiquement certaines erreurs de lint.

## Aide supplémentaire

Pour obtenir de l'aide supplémentaire sur Angular CLI, utilisez `ng help` ou [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Pour la documentation d'Angular, vous pouvez la trouver [ici](https://angular.io/docs)

Pour la documentation d'Express, vous pouvez la trouver [ici](https://expressjs.com/en/4x/api.html)

Pour obtenir de l'aide supplémentaire sur les tests avec Angular, utilisez [Angular Testing](https://angular.io/guide/testing)