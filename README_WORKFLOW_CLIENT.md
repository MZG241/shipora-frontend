# Shipora - workflow de presentation client

## Introduction

Shipora est une plateforme de gestion logistique conçue pour centraliser les
operations quotidiennes d'une organisation : clients, expeditions, colis,
entrepots, tarification, facturation, paiements et suivi.

L'objectif est simple : remplacer une gestion dispersee entre fichiers Excel,
messages, documents papier et outils differents par un espace de travail unique,
controle et facile a suivre.

Ce document presente le fonctionnement de Shipora avec un angle metier. Il peut
servir de support pour une demonstration client ou un speech commercial.

## Contexte metier

Une entreprise de logistique doit generalement :

- enregistrer ses clients et leurs coordonnees ;
- creer des expeditions avec une origine et une destination ;
- affecter une expedition a un entrepot et a une regle tarifaire ;
- suivre chaque colis avec un code unique ;
- connaitre l'etat d'une expedition a tout moment ;
- generer et suivre la facturation ;
- enregistrer les paiements ;
- permettre au client final de suivre son colis publiquement.

Sans outil centralise, ces informations sont souvent difficiles a retrouver,
les mises a jour sont manuelles et le risque d'erreur augmente.

Shipora reunit ces etapes dans un meme workflow.

## Exemple de scenario

Prenons l'exemple d'une entreprise qui transporte des marchandises de Douala
vers Paris pour le client **Maison Kivu**.

Le processus complet est le suivant :

```text
Client
  -> Expedition
  -> Colis
  -> Suivi du transport
  -> Facturation
  -> Paiement
  -> Suivi public par le destinataire
```

## 1. Accueil public

### Objectif

La page d'accueil presente l'offre Shipora et permet a un visiteur de comprendre
rapidement la valeur de la plateforme.

### Parcours

1. Le visiteur arrive sur `/`.
2. Il decouvre les principales fonctionnalites.
3. Il peut consulter les avantages de la solution.
4. Il peut acceder a la connexion ou a l'inscription.
5. Il peut ouvrir la page de suivi public.

### Message a presenter

> Shipora permet a une organisation de piloter ses operations logistiques depuis
> un espace unique, tout en offrant au client final un suivi simple de son colis.

## 2. Suivi public d'un colis

### Objectif

Le destinataire n'a pas besoin de compte pour consulter l'etat de son colis.

### Parcours

1. Le visiteur ouvre `/track`.
2. Il saisit son code de suivi.
3. Shipora recherche le colis.
4. La page affiche les informations essentielles :
   - le colis ;
   - son statut ;
   - l'expedition associee ;
   - l'origine ;
   - la destination ;
   - le mode de transport.

### Exemple de demonstration

Code saisi : `PKG-KIVU-2026-001`

Resultat attendu :

```text
Colis : Pieces detachees
Statut : En transit
Origine : Douala
Destination : Paris
Transport : Maritime
```

### Message a presenter

> Le client final peut suivre son colis sans contacter le service logistique a
> chaque etape.

## 3. Inscription d'une organisation

### Objectif

Creer un espace de travail propre a une organisation.

### Parcours

1. L'utilisateur ouvre `/register`.
2. Il renseigne :
   - son nom ;
   - son adresse email ;
   - son mot de passe ;
   - le nom de son organisation.
3. Shipora cree l'organisation et son premier utilisateur.
4. Le premier utilisateur devient le proprietaire de l'organisation.
5. Il est invite a se connecter depuis `/login`.

### Exemple

```text
Nom : Amina Nguema
Email : amina@maison-kivu.com
Organisation : Maison Kivu Logistics
```

### Message a presenter

> Chaque organisation dispose de son propre espace et de ses propres donnees.
> Les informations d'une organisation ne sont pas melangees avec celles d'une
> autre.

## 4. Connexion et securite

### Objectif

Donner acces a l'espace prive uniquement aux utilisateurs autorises.

### Parcours

1. L'utilisateur ouvre `/login`.
2. Il saisit son email et son mot de passe.
3. Shipora verifie ses informations.
4. Une session securisee est creee.
5. L'utilisateur est redirige vers `/dashboard`.

Les erreurs sont affichees directement dans le formulaire. Par exemple :

```text
Adresse email ou mot de passe incorrect.
```

Les sessions utilisent des cookies HTTP-only. L'utilisateur n'a pas besoin de
copier ou de gerer manuellement un token.

## 5. Tableau de bord

### Objectif

Donner une vision immediate de l'activite.

Le dashboard presente notamment :

- le nombre total d'expeditions ;
- le nombre total de colis ;
- les expeditions en transit ;
- les expeditions pretes a recuperer ;
- les revenus ;
- la courbe d'activite ;
- la repartition des statuts.

### Exemple de lecture

```text
Expeditions : 248
Colis : 512
En transit : 76
A recuperer : 18
Revenus : 12 450 000 XAF
```

### Message a presenter

> Le responsable n'a pas besoin d'ouvrir plusieurs menus pour savoir ce qui se
> passe dans son activite. Les indicateurs importants sont visibles des l'arrivee.

## 6. Gestion des clients

### Objectif

Centraliser les informations des clients et retrouver rapidement leur activite.

### Parcours

1. L'utilisateur ouvre `/dashboard/customers`.
2. Il recherche un client par son nom, son email ou son telephone.
3. Il peut ajouter un client.
4. Il peut modifier ses informations.
5. Il peut supprimer un client selon ses permissions.
6. Il peut ouvrir l'historique du client depuis la table.

### Historique client

Le drawer d'historique affiche :

- les informations du client ;
- ses expeditions ;
- ses colis ;
- ses paiements ;
- un resume de son activite.

### Exemple

Pour **Maison Kivu**, l'historique peut afficher :

```text
Expeditions : 12
Colis : 37
Paiements : 9
Derniere expedition : SHP-MK-2026-014
Statut : En transit
```

### Message a presenter

> En ouvrant un client, l'equipe retrouve tout son historique sans devoir
> chercher dans plusieurs ecrans.

## 7. Creation d'une expedition

### Objectif

Enregistrer une nouvelle operation de transport.

### Parcours

1. L'utilisateur ouvre `/dashboard/shipments`.
2. Il clique sur **Nouvelle expedition**.
3. Il selectionne le client.
4. Il selectionne l'entrepot si necessaire.
5. Il selectionne une regle tarifaire.
6. Il renseigne :
   - l'origine ;
   - la destination ;
   - le mode de transport ;
   - la description ;
   - la date estimee d'arrivee.
7. Shipora genere un numero de suivi.
8. L'expedition apparait dans la table.

### Exemple

```text
Client : Maison Kivu
Origine : Douala
Destination : Paris
Transport : Maritime
Regle tarifaire : Maritime Europe
Arrivee estimee : 25 octobre 2026
```

### Statuts possibles

- En attente ;
- Reçue ;
- En entrepot ;
- En transit ;
- Arrivee ;
- Douane ;
- Prete au retrait ;
- Recuperee ;
- Annulee.

### Message a presenter

> Une expedition possede son propre numero de suivi et son statut peut evoluer
> au fil des operations.

## 8. Gestion des colis

### Objectif

Associer un ou plusieurs colis a une expedition.

### Parcours

1. L'utilisateur ouvre `/dashboard/packages`.
2. Il clique sur **Creer un package**.
3. Il selectionne l'expedition.
4. Il renseigne le nom de l'article.
5. Il indique la quantite et les dimensions si necessaire.
6. Shipora genere un code de suivi colis.
7. Le colis peut etre recherche, modifie ou supprime selon les permissions.

### Scan QR code

L'utilisateur peut scanner un colis :

- avec la camera de son appareil ;
- ou avec une image contenant le QR code.

### Exemple

```text
Expedition : SHP-MK-2026-014
Article : Pieces detachees automobiles
Quantite : 4
Poids : 125 kg
Statut : Recu
```

### Message a presenter

> Le scan reduit les erreurs de saisie et permet a l'agent de retrouver
> rapidement les informations d'un colis.

## 9. Entrepots

### Objectif

Gerer les lieux de stockage et leur disponibilite.

### Parcours

1. L'utilisateur ouvre `/dashboard/warehouses`.
2. Il recherche un entrepot par nom, code ou ville.
3. Il peut ajouter un entrepot.
4. Il peut modifier ses informations.
5. Il peut activer ou desactiver un entrepot.
6. Il peut le supprimer selon ses permissions.

### Exemple

```text
Nom : Entrepot Bonaberi
Code : BON-001
Ville : Douala
Pays : Cameroun
Statut : Actif
```

## 10. Tarification

### Objectif

Definir les regles utilisées lors de la creation d'une expedition.

### Types de tarification

- prix fixe ;
- prix au kilogramme ;
- prix au metre cube.

### Parcours

1. L'utilisateur ouvre `/dashboard/pricing`.
2. Il cree une regle tarifaire.
3. Il definit l'origine et la destination si necessaire.
4. Il choisit le mode de transport.
5. Il choisit le type de calcul.
6. Il renseigne le prix et la devise.
7. La regle devient disponible lors de la creation d'une expedition.

### Exemple

```text
Nom : Maritime Europe
Origine : Douala
Destination : Paris
Type : Prix au kilogramme
Prix : 2 500 XAF / kg
Statut : Active
```

## 11. Facturation

### Objectif

Associer une facturation a une expedition et suivre son etat.

### Parcours

1. Une facturation est liee a une expedition.
2. Elle possede un numero de facture.
3. Elle indique le montant et la devise.
4. Son statut evolue selon les paiements :
   - En attente ;
   - Partiellement payee ;
   - Payee ;
   - Annulee.
5. L'utilisateur peut consulter le detail de la facturation.

### Exemple

```text
Facture : MKL-2026-00014
Expedition : SHP-MK-2026-014
Montant : 1 250 000 XAF
Statut : Partiellement payee
```

La generation avancee de documents de facture pourra etre ajoutee dans une
prochaine version.

## 12. Paiements

### Objectif

Enregistrer les paiements lies a une facturation et connaitre le solde restant.

### Ajouter un paiement

1. L'utilisateur ouvre `/dashboard/payments`.
2. Il clique sur **Ajouter un paiement**.
3. Il recherche la facturation par :
   - numero de facture ;
   - numero de tracking ;
   - identifiant de facturation.
4. Il selectionne la facturation.
5. Il saisit le montant.
6. Il choisit la methode de paiement.
7. Il ajoute une note si necessaire.
8. Il enregistre le paiement.

### Modifier ou supprimer un paiement

Depuis la table des paiements, l'utilisateur peut :

- modifier le montant ;
- modifier la devise ;
- modifier la methode ;
- modifier les notes ;
- supprimer le paiement apres confirmation.

Le statut de la facturation est recalcule automatiquement apres une modification
ou une suppression.

### Exemple

Facture de 1 250 000 XAF :

```text
Premier paiement : 500 000 XAF par Mobile Money
Solde restant : 750 000 XAF
Statut : Partiellement payee

Deuxieme paiement : 750 000 XAF par virement bancaire
Solde restant : 0 XAF
Statut : Payee
```

### Message a presenter

> Le systeme ne se contente pas d'enregistrer un paiement. Il met aussi a jour
> automatiquement la situation de la facturation.

## 13. Parametres de l'organisation

### Objectif

Personnaliser l'espace de travail de l'organisation.

La page `/dashboard/settings` permet de modifier :

- le nom de l'organisation ;
- la description ;
- l'email ;
- le telephone ;
- l'adresse ;
- la ville ;
- le pays ;
- la devise ;
- le logo de l'organisation.

Le logo est conserve par le service de stockage d'images et pourra etre utilise
sur les futurs documents de l'organisation.

## 14. Profil utilisateur

### Objectif

Permettre a chaque utilisateur de gerer ses propres informations.

La page `/dashboard/profile` permet de modifier :

- le nom ;
- l'email ;
- le mot de passe.

Le profil concerne l'utilisateur connecte, tandis que les parametres concernent
l'organisation entiere.

## 15. Gestion du staff

### Objectif

Permettre aux proprietaires et administrateurs de gerer les utilisateurs de
leur organisation.

La page `/dashboard/staffs` permet :

- de rechercher un membre par nom, email ou role ;
- d'ajouter un membre ;
- de modifier un membre ;
- d'activer ou desactiver un compte ;
- de supprimer un membre avec confirmation.

### Exemple

```text
Nom : Paul Mbarga
Email : paul@maison-kivu.com
Role : Agent
Statut : Actif
```

Les actions sensibles sont protegees par les permissions du backend. Le menu ou
l'interface ne remplacent jamais les controles serveur.

## Roles utilisateurs

| Role | Responsabilite principale |
| --- | --- |
| OWNER | Controle complet de l'organisation |
| ADMIN | Administration operationnelle et gestion du staff |
| MANAGER | Supervision des operations |
| AGENT | Operations quotidiennes et suivi |
| ACCOUNTANT | Facturation et paiements |

Les droits exacts sont toujours verifies côté backend.

## Pagination et recherche

Les grandes listes utilisent une pagination côté backend pour eviter de charger
toutes les donnees dans le navigateur.

Les modules suivants utilisent la pagination serveur :

- clients ;
- expeditions ;
- entrepots ;
- tarification.

Les recherches sont executees côté backend lorsque le module le permet. Le
workflow reste le meme pour l'utilisateur : il saisit une recherche, choisit une
page et ne voit que les resultats correspondants.

## Phrase de conclusion pour le client

> Shipora accompagne toute la chaine logistique, depuis la creation du client
> jusqu'au paiement final. Chaque expedition est suivie, chaque colis est
> identifiable, chaque action est controlee et chaque equipe travaille avec les
> memes informations.

## Perimetre actuel et evolutions

La version actuelle couvre l'espace organisationnel. Les prochaines evolutions
possibles sont :

- generation avancee de factures ;
- pagination serveur des listes restantes ;
- notifications client ;
- rapports avances ;
- application d'administration plateforme ;
- audit detaille des actions sensibles.
