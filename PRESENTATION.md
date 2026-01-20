# Présentation du Projet : BlockLog.Pro

Ce document contient le contenu structuré pour votre présentation PowerPoint. Chaque section représente une diapositive (slide).

---

## Slide 1 : Titre
**Titre :** BlockLog.Pro : Sécurisation des Logs par la Blockchain
**Sous-titre :** Système de journalisation immuable et transparent pour l'entreprise
**Présenté par :** [Votre Nom]

---

## Slide 2 : La Problématique
**Titre :** Pourquoi BlockLog ?
*   **Vulnérabilité des Logs Classiques :** Les fichiers de logs sur des serveurs standards peuvent être modifiés, supprimés ou corrompus (par des attaquants ou des erreurs humaines).
*   **Manque de Transparence :** Difficile de prouver l'intégrité de l'historique d'un système à des auditeurs tiers.
*   **Centralisation :** Un seul point de défaillance peut compromettre toute la traçabilité.

---

## Slide 3 : La Solution Audit & Sécurité
**Titre :** Notre Solution : Immutabilité Garantie
*   **Technologie Blockchain :** Utilisation d'Ethereum (via Hardhat en dév) pour stocker les empreintes des logs.
*   **Tamper-Proof (Inviolable) :** Une fois écrit sur la blockchain, un log ne peut plus être modifié.
*   **Transparence Totale :** Chaque entrée est vérifiable via son hash de transaction et son timestamp.

---

## Slide 4 : Fonctionnalités Clés
**Titre :** Ce que permet l'application
1.  **Authentification Décentralisée :** Connexion via portefeuille crypto (MetaMask). Pas de mot de passe stocké.
2.  **Tableau de Bord "Enterprise" :** Visualisation claire des logs, statistiques (Total, Info, Warning, Error).
3.  **Import de Logs :** Support du glisser-déposer (Drag & Drop) pour uploader des fichiers JSON de logs existants.
4.  **Simulation en Temps Réel :** Possibilité de générer ("Commit") des logs manuellement pour tester la réactivité.

---

## Slide 5 : Architecture Technique
**Titre :** Stack Technologique
*   **Frontend (Interface) :**
    *   React 19 + Vite (Rapidité et modernité)
    *   Bootstrap 5 (Design Responsive et Pro)
    *   Ethers.js (Communication avec la Blockchain)
*   **Backend (API) :**
    *   Node.js + Express (Gestion des requêtes)
*   **Blockchain :**
    *   Hardhat (Environnement de dévelopement Ethereum local)
    *   Solidity (Smart Contract `LogStorage`)

---

## Slide 6 : Le Smart Contract
**Titre :** Le Cœur du Système (Smart Contract)
*   **Structure de Données (`LogEntry`) :**
    *   `Timestamp` (Date/Heure blockchain)
    *   `Source` (Origine du log)
    *   `Message` (Contenu)
    *   `Status` (INFO, WARNING, ERROR)
*   **Fonctions Clés :**
    *   `addLog(...)` : Écrit un log et émet un événement.
    *   `getLogs()` : Récupère l'historique complet, garantissant l'intégrité.

---

## Slide 7 : Démonstration
**Titre :** Scénario de Démo
1.  **Connexion :** Login via MetaMask.
2.  **Visualisation :** Affichage du Dashboard avec les stats.
3.  **Action :** Ajout d'un log "Manual Commit" -> Confirmation MetaMask.
4.  **Vérification :** Apparition quasi-instantanée du log dans le tableau après minage du bloc.
5.  **Déconnexion :** Retour à l'accueil sécurisé.

---

## Slide 8 : Conclusion et Avenir
**Titre :** Conclusion
*   **Actuel :** Un MVP (Minimum Viable Product) fonctionnel prouvant la sécurisation des logs.
*   **Futur (Roadmap) :**
    *   Déploiement sur un Testnet public (ex: Sepolia).
    *   Chiffrement des messages sensibles avant stockage (Privacy).
    *   Alertes en temps réel sur Discord/Slack pour les logs "ERROR".

---

## Slide 9 : Questions / Réponses
**Titre :** Merci de votre attention
*   [Espace pour les questions du jury/audience]
