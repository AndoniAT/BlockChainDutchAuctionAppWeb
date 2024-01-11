# Application décentralisée d'enchères hollandaises

|   Nom   | Prénom |
|---------|--------|
|   Doe   |  Jane  |

Le TP est à réaliser individuellement.

## Présentation

Ce TP est le prolongement du premier et consiste à créer une application décentralisée (dApp) permettant de donner vie à votre Smart Contract (SC). Celle-ci doit pouvoir proposer les fonctionnalités suivantes.

### Authentification et profil

Il doit être possible de se connecter à l'aide de son portefeuille MetaMask. Vous pouvez utiliser la SDK de [MetaMask](https://docs.metamask.io/wallet/how-to/connect/set-up-sdk/).

Les données du portefeuille telles que la clé publique et le solde en ETH doivent être visibles depuis l'application.

### Enchères

La gestion des enchères est composée des éléments suivants :
- Une liste des enchères disponibles ;
- Créer une enchère avec les paramètres souhaités par le propriétaire ;
- Participer à une ou plusieurs enchères ;
- Pouvoir enchérir ;
- Cloturer une enchère (versement des fonds au propriétaire de l'enchère) ;
- Un tableau de bord permettant de visualiser les enchères gagnées, en cours ou perdues.

*N'oubliez pas de créer une barre de navigation pour accéder aux différentes fonctionnalités.*

Pour interagir avec la blockchain depuis votre application, il existe plusieurs bibliothèques telles que [ethers](https://docs.ethers.org/v5/) ou encore [web3js](https://web3js.readthedocs.io/en/v1.10.0/).

## Restitution

**Un rapport concernant l'utilisation de l'application sera à restituer 3 semaines après le dernier TP.**

Pour ce projet, il est imposé d'utiliser le framework [NextJS](https://nextjs.org/) qui utilise la bibliothèque [React](https://react.dev/).
