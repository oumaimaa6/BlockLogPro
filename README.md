# BlockLog Project Guide (Français)

Ce guide détaille toutes les étapes nécessaires pour installer, configurer et exécuter le projet BlockLog localement, y compris la configuration de MetaMask.

## Prérequis

- [Node.js](https://nodejs.org/) (Version LTS recommandée)
- [MetaMask](https://metamask.io/) (Extension de navigateur installée)
- [Git](https://git-scm.com/)

---

## 1. Installation des Dépendances

Le projet est divisé en trois parties : `blockchain`, `server`, et `client`. Vous devez installer les dépendances pour chacune d'elles.

Ouvrez trois terminaux différents ou exécutez ces commandes séquentiellement à la racine du projet :

### Terminal 1 : Blockchain
```bash
cd blockchain
npm install
```

### Terminal 2 : Serveur (Backend)
```bash
cd server
npm install
```

### Terminal 3 : Client (Frontend)
```bash
cd client
npm install
```

---

## 2. Démarrer la Blockchain Locale

Dans le **Terminal 1 (Blockchain)**, lancez le nœud local Hardhat. Cela simulera une blockchain Ethereum sur votre machine.

```bash
cd blockchain
npx hardhat node
```

> **IMPORTANT :** Gardez ce terminal ouvert. Il affichera une liste de comptes de test avec leurs adresses publiques et clés privées (Private Keys). Vous en aurez besoin pour MetaMask.

---

## 3. Déployer le Contrat Intelligent

Ouvrez un **nouveau terminal** (ou utilisez le Terminal 2/3 temporairement) pour déployer le contrat sur votre blockchain locale.

```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

Une fois le déploiement terminé, notez l'adresse du contrat (elle sera affichée dans le terminal).

---

## 4. Configuration de MetaMask

Pour interagir avec l'application, vous devez connecter MetaMask à votre blockchain locale.

### Étape A : Ajouter le réseau Localhost
1. Ouvrez l'extension MetaMask dans votre navigateur.
2. Cliquez sur le sélecteur de réseau (en haut à gauche) et choisissez **"Ajouter un réseau"** puis **"Ajouter un réseau manuellement"**.
3. Remplissez les champs suivants :
   - **Nom du réseau :** Hardhat Localhost
   - **Nouvelle URL de RPC :** `http://127.0.0.1:8545`
   - **ID de chaîne :** `1337`
   - **Symbole de la devise :** ETH
4. Cliquez sur **Enregistrer**.

### Étape B : Importer un Compte de Test
1. Retournez au **Terminal 1** où tourne `npx hardhat node`.
2. Copiez la **Clé Privée (Private Key)** de l'Account #0 (ou n'importe quel autre compte de la liste).
3. Dans MetaMask, cliquez sur le cercle de votre compte (en haut au centre) -> **Ajouter un compte ou un portefeuille matériel** -> **Importer le compte**.
4. Collez la clé privée copiée et cliquez sur **Importer**.
5. Vous devriez maintenant voir un solde de 10000 ETH (fictifs) sur ce compte.

---

## 5. Démarrer le Serveur (Backend)

Dans le **Terminal 2 (Serveur)** :

```bash
cd server
npm start
```

Le serveur démarrera généralement sur `http://localhost:3000`.

---

## 6. Démarrer l'Application Client (Frontend)

Dans le **Terminal 3 (Client)** :

```bash
cd client
npm run dev
```

L'application sera accessible sur l'URL indiquée (souvent `http://localhost:5173`).

---

## Résumé des Commandes d'Exécution

Une fois tout installé, voici l'ordre de lancement à chaque fois que vous reprenez le travail :

1. **Blockchain :** `npx hardhat node` (dans `blockchain/`)
2. **Déploiement (si le noeud a été redémarré) :** `npx hardhat run scripts/deploy.js --network localhost` (dans `blockchain/`)
3. **Serveur :** `npm start` (dans `server/`)
4. **Client :** `npm run dev` (dans `client/`)
