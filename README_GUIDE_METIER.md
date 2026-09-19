# Shipora - guide métier des tables et du workflow

## À quoi sert Shipora ?

Shipora est un outil de gestion logistique. Il aide une entreprise à organiser
le transport de marchandises depuis la demande d'un client jusqu'à la livraison
et au paiement.

Pour comprendre l'application, il faut imaginer une entreprise qui reçoit des
marchandises, les stocke temporairement, les transporte et doit suivre chaque
étape.

Le système transforme ce processus réel en informations organisées.

```text
Organisation
  -> Clients
  -> Entrepôts
  -> Tarifs
  -> Expéditions
  -> Colis
  -> Facturation
  -> Paiements
  -> Suivi
```

Chaque table correspond à un élément réel de l'activité.

## Pourquoi utiliser des tables ?

Une table permet de regrouper les informations de même nature.

Par exemple :

- la table **Clients** contient les personnes ou entreprises servies ;
- la table **Expéditions** contient les opérations de transport ;
- la table **Colis** contient les marchandises transportées ;
- la table **Paiements** contient l'argent reçu.

Cette séparation est importante parce que chaque information a un rôle différent.
Elle permet aussi de relier les données sans tout mélanger.

## Vue générale du processus

Une opération logistique suit généralement cet ordre :

1. L'entreprise crée son espace de travail.
2. Elle enregistre le client.
3. Elle configure ses entrepôts.
4. Elle configure ses règles de prix.
5. Elle crée une expédition.
6. Elle ajoute les colis de l'expédition.
7. Elle suit l'état du transport.
8. Elle crée ou consulte la facturation.
9. Elle enregistre les paiements.
10. Le client final suit son colis avec son code.

Chaque étape dépend de la précédente.

## 1. Organisation

### Qu'est-ce que c'est ?

L'organisation représente l'entreprise qui utilise Shipora.

Exemples :

- Maison Kivu Logistics ;
- Global Transit Cameroun ;
- Express Afrique.

### Informations conservées

- nom de l'organisation ;
- description ;
- adresse ;
- ville ;
- pays ;
- email ;
- téléphone ;
- devise ;
- logo.

### Qui l'utilise ?

L'organisation est utilisée par tous les modules. Elle permet de savoir à quelle
entreprise appartiennent les clients, les expéditions, les colis et les paiements.

### Pourquoi c'est important ?

Shipora peut être utilisé par plusieurs entreprises. L'organisation sert donc de
frontière entre leurs données.

```text
Organisation A -> ses clients, ses colis, ses paiements
Organisation B -> ses clients, ses colis, ses paiements
```

Les données de l'organisation A ne doivent jamais apparaître chez B.

## 2. Utilisateurs et staff

### Qu'est-ce que c'est ?

Un utilisateur est une personne qui se connecte à Shipora.
Le staff représente l'équipe de l'organisation.

Exemples :

- propriétaire de l'entreprise ;
- administrateur ;
- manager ;
- agent logistique ;
- comptable.

### Différence entre organisation et utilisateur

L'organisation est l'entreprise.
L'utilisateur est une personne qui travaille dans cette entreprise.

```text
Organisation : Maison Kivu Logistics
  - Amina : propriétaire
  - Paul : manager
  - Grace : agent
  - Marc : comptable
```

### Rôles

| Rôle | Utilité |
| --- | --- |
| OWNER | Propriétaire de l'organisation, accès complet |
| ADMIN | Administration et gestion du staff |
| MANAGER | Supervision des opérations |
| AGENT | Travail opérationnel quotidien |
| ACCOUNTANT | Facturation et paiements |

### Pourquoi c'est important ?

Tout le monde ne doit pas pouvoir supprimer un paiement ou modifier les membres
de l'équipe. Les rôles permettent de donner à chaque personne uniquement les
permissions nécessaires à son travail.

## 3. Clients

### Qu'est-ce que c'est ?

Un client est la personne ou l'entreprise qui demande le transport.

Exemples :

- Maison Kivu ;
- une boutique ;
- une entreprise industrielle ;
- un particulier.

### Informations conservées

- nom ;
- email ;
- téléphone ;
- adresse ;
- ville ;
- pays.

### Comment l'utiliser ?

Avant de créer une expédition, l'équipe doit choisir le client concerné.

Sur `/dashboard/customers`, l'utilisateur peut :

- rechercher un client ;
- ajouter un client ;
- modifier ses coordonnées ;
- supprimer un client selon ses permissions ;
- consulter son historique.

### Pourquoi c'est important ?

Le client est le point de départ commercial de l'opération. Sans lui, on ne sait
pas pour qui l'expédition est créée ni à qui rattacher l'historique.

## 4. Entrepôts

### Qu'est-ce que c'est ?

Un entrepôt est un lieu où les marchandises peuvent être reçues, stockées,
préparées ou récupérées.

Un entrepôt n'est pas forcément le lieu d'origine ou de destination finale.
Il représente le lieu physique utilisé par l'entreprise pendant ses opérations.

### Exemple

```text
Entrepôt : Bonaberi
Ville : Douala
Code : BON-001
Statut : Actif
```

### Comment l'utiliser ?

Lors de la création d'une expédition, l'équipe peut choisir l'entrepôt concerné.

La page `/dashboard/warehouses` permet de :

- créer un entrepôt ;
- rechercher un entrepôt ;
- modifier ses informations ;
- l'activer ou le désactiver ;
- le supprimer selon les droits.

### Pourquoi c'est important ?

L'entrepôt permet de savoir où se trouvent les marchandises et quelle équipe ou
quel site doit les gérer.

Sans cette information, il devient difficile de répondre à une question simple :

> Où se trouve actuellement la marchandise ?

## 5. Tarification

### Qu'est-ce que c'est ?

Une règle tarifaire explique comment calculer le prix d'une expédition.

Elle peut dépendre :

- de l'origine ;
- de la destination ;
- du mode de transport ;
- du poids ;
- du volume ;
- d'un prix fixe.

### Types de prix

| Type | Explication |
| --- | --- |
| FIXED | Prix fixe pour l'opération |
| PER_KG | Prix calculé selon le poids |
| PER_CBM | Prix calculé selon le volume |

### Exemple

```text
Règle : Maritime Europe
Origine : Douala
Destination : Paris
Type : Prix au kilogramme
Prix : 2 500 XAF par kilogramme
```

### Comment l'utiliser ?

Lorsqu'une expédition est créée, l'utilisateur choisit une règle tarifaire.
Le système vérifie ensuite que la règle correspond aux informations de
l'expédition.

### Pourquoi c'est important ?

Une règle tarifaire évite de recalculer le prix manuellement à chaque opération.
Elle rend le calcul plus cohérent et limite les erreurs de facturation.

## 6. Expédition

### Qu'est-ce que c'est ?

Une expédition représente une opération complète de transport.

Elle répond à la question :

> Quel transport doit être effectué, pour quel client, de quel endroit vers quel
> endroit ?

### Informations conservées

- client ;
- entrepôt ;
- règle tarifaire ;
- origine ;
- destination ;
- mode de transport ;
- description ;
- date estimée d'arrivée ;
- statut ;
- numéro de suivi.

### Exemple

```text
Client : Maison Kivu
Origine : Douala
Destination : Paris
Transport : Maritime
Entrepôt : Bonaberi
Numéro : SHP-MK-2026-014
```

### Statuts possibles

- **PENDING** : l'expédition est créée mais pas encore prise en charge ;
- **RECEIVED** : la marchandise a été reçue ;
- **IN_WAREHOUSE** : elle se trouve dans un entrepôt ;
- **IN_TRANSIT** : elle est en cours de transport ;
- **ARRIVED** : elle est arrivée à destination ;
- **CUSTOMS** : elle est en cours de traitement douanier ;
- **READY_FOR_PICKUP** : elle est prête à être récupérée ;
- **PICKED_UP** : elle a été récupérée ou livrée ;
- **CANCELLED** : l'opération a été annulée.

### Pourquoi c'est important ?

L'expédition est le dossier principal du transport. Les colis, la facturation et
le suivi sont rattachés à cette opération.

## 7. Colis

### Qu'est-ce que c'est ?

Un colis est une unité physique transportée dans une expédition.

Une expédition peut contenir un seul colis ou plusieurs colis.

```text
Expédition SHP-MK-2026-014
  - Colis 1 : pièces automobiles
  - Colis 2 : filtres
  - Colis 3 : accessoires
```

### Informations conservées

- expédition liée ;
- nom de l'article ;
- description ;
- quantité ;
- poids ;
- dimensions ;
- statut ;
- code de suivi colis.

### Différence entre numéro d'expédition et code colis

Le numéro d'expédition identifie le transport complet.
Le code colis identifie une marchandise précise dans ce transport.

```text
Expédition : SHP-MK-2026-014
Colis : PKG-2026-0038
```

### Scan QR

L'agent peut retrouver un colis avec :

- la caméra de son appareil ;
- une image contenant un QR code.

### Pourquoi c'est important ?

Le colis permet de suivre les marchandises individuellement. Une expédition
peut être partiellement reçue, déplacée ou livrée, colis par colis.

## 8. Facturation

### Qu'est-ce que c'est ?

La facturation représente le montant demandé pour une expédition.

Elle est généralement créée à partir de l'expédition et de sa règle tarifaire.

### Informations conservées

- expédition liée ;
- numéro de facture ;
- montant ;
- devise ;
- statut ;
- lien éventuel vers un document de facture.

### Statuts

- **PENDING** : rien n'a encore été payé ;
- **PARTIALLY_PAID** : une partie a été payée ;
- **PAID** : la totalité a été payée ;
- **CANCELLED** : la facturation est annulée.

### Pourquoi c'est important ?

La facturation sépare la valeur commerciale de l'opération logistique. Une
expédition décrit le transport ; la facturation décrit ce que le client doit
payer.

## 9. Paiements

### Qu'est-ce que c'est ?

Un paiement représente une somme réellement reçue pour une facturation.

Une même facturation peut avoir plusieurs paiements.

### Exemple

```text
Facturation : 1 250 000 XAF
Premier paiement : 500 000 XAF
Deuxième paiement : 750 000 XAF
Total reçu : 1 250 000 XAF
```

### Méthodes disponibles

- espèces ;
- virement bancaire ;
- Mobile Money ;
- carte bancaire.

### Comment l'utiliser ?

1. Ouvrir `/dashboard/payments`.
2. Cliquer sur **Ajouter un paiement**.
3. Rechercher une facturation par numéro, tracking ou identifiant.
4. Sélectionner la facturation.
5. Entrer le montant et la méthode.
6. Enregistrer.

Depuis la table, un utilisateur autorisé peut aussi :

- modifier le montant ;
- modifier la méthode ;
- modifier la devise ou les notes ;
- supprimer un paiement avec confirmation.

### Pourquoi c'est important ?

Le paiement permet de connaître la situation réelle de la facture et le solde
restant. Le statut de la facturation est recalculé après chaque modification ou
suppression.

## 10. Tableau de bord

### Qu'est-ce que c'est ?

Le tableau de bord est une vue synthétique de l'activité.

Il ne remplace pas les autres tables. Il rassemble leurs informations pour aider
le responsable à prendre rapidement une décision.

### Exemples de questions auxquelles il répond

- Combien d'expéditions sont en cours ?
- Combien de colis sont dans le réseau ?
- Combien d'expéditions sont prêtes à être récupérées ?
- Quelle est la répartition des statuts ?
- Quel est le niveau de revenus ?

### Pourquoi c'est important ?

Un responsable ne doit pas ouvrir chaque table pour comprendre la situation
actuelle. Le dashboard donne une première vue de contrôle.

## 11. Paramètres de l'organisation

### Qu'est-ce que c'est ?

Cette page contient les informations générales de l'entreprise :

- nom ;
- description ;
- logo ;
- adresse ;
- ville ;
- pays ;
- téléphone ;
- email ;
- devise.

### Pourquoi c'est important ?

Ces informations servent à identifier correctement l'entreprise dans l'application
et pourront être réutilisées dans ses futurs documents commerciaux.

## 12. Profil utilisateur

### Qu'est-ce que c'est ?

Le profil concerne la personne actuellement connectée, et non toute l'entreprise.

L'utilisateur peut modifier :

- son nom ;
- son email ;
- son mot de passe.

### Différence avec les paramètres organisation

```text
Paramètres organisation -> informations de l'entreprise
Profil utilisateur      -> informations de la personne connectée
```

## 13. Workflow complet avec exemple

Imaginons le scénario suivant :

```text
Entreprise : Maison Kivu Logistics
Client : Maison Kivu
Origine : Douala
Destination : Paris
```

### Étape 1 - Créer le client

L'agent enregistre Maison Kivu avec son nom, son email et son téléphone.

**Pourquoi ?**

Pour pouvoir rattacher toutes les opérations au bon client.

### Étape 2 - Vérifier l'entrepôt

L'agent choisit l'entrepôt Bonaberi.

**Pourquoi ?**

Pour savoir où la marchandise doit être reçue et gérée.

### Étape 3 - Choisir le tarif

L'agent choisit la règle Maritime Europe.

**Pourquoi ?**

Pour appliquer un prix cohérent à l'expédition.

### Étape 4 - Créer l'expédition

L'agent indique Douala comme origine et Paris comme destination.

Shipora crée le numéro `SHP-MK-2026-014`.

**Pourquoi ?**

Pour identifier le transport complet et suivre son évolution.

### Étape 5 - Ajouter les colis

L'agent ajoute trois colis et Shipora génère un code pour chacun.

**Pourquoi ?**

Pour suivre chaque marchandise individuellement.

### Étape 6 - Mettre à jour le statut

L'expédition passe de `RECEIVED` à `IN_WAREHOUSE`, puis à `IN_TRANSIT`.

**Pourquoi ?**

Pour que l'équipe et le client sachent où en est le transport.

### Étape 7 - Suivre la facturation

Une facturation de 1 250 000 XAF est associée à l'expédition.

**Pourquoi ?**

Pour séparer le suivi opérationnel du suivi financier.

### Étape 8 - Enregistrer le paiement

Le client paie 500 000 XAF par Mobile Money.

La facturation devient `PARTIALLY_PAID`.

**Pourquoi ?**

Pour connaître immédiatement le montant déjà encaissé et le solde restant.

### Étape 9 - Finaliser le paiement

Le client paie les 750 000 XAF restants par virement bancaire.

La facturation devient `PAID`.

### Étape 10 - Donner le code de suivi

Le client utilise le code de suivi sur `/track`.

**Pourquoi ?**

Pour suivre l'expédition sans demander une intervention manuelle à l'équipe.

## Pourquoi ce workflow est nécessaire

Le processus est organisé dans cet ordre parce que chaque étape apporte une
information nécessaire à la suivante.

```text
Client
  -> identifie le bénéficiaire

Entrepôt
  -> identifie le lieu physique

Tarif
  -> explique comment calculer le prix

Expédition
  -> décrit le transport

Colis
  -> décrit les marchandises

Facturation
  -> décrit ce qui doit être payé

Paiement
  -> décrit ce qui a réellement été reçu

Tracking
  -> rend l'information visible au client
```

Si on mélange ces éléments, on risque :

- d'associer une marchandise au mauvais client ;
- de calculer un mauvais prix ;
- de perdre la trace d'un colis ;
- de ne pas connaître le solde d'une facture ;
- de donner une information incorrecte au destinataire.

## Résumé très simple

| Élément | Question à laquelle il répond |
| --- | --- |
| Organisation | Quelle entreprise utilise Shipora ? |
| Utilisateur | Qui travaille dans l'espace ? |
| Client | Pour qui travaille-t-on ? |
| Entrepôt | Où la marchandise est-elle gérée ? |
| Tarif | Comment calculer le prix ? |
| Expédition | Quel transport doit être effectué ? |
| Colis | Quelle marchandise est transportée ? |
| Facturation | Combien le client doit-il payer ? |
| Paiement | Combien a-t-il déjà payé ? |
| Dashboard | Quelle est la situation globale ? |
| Tracking | Où en est le colis ? |

## Phrase de conclusion pour une présentation

> Shipora transforme une opération logistique complexe en un processus clair :
> on sait pour quel client on travaille, où se trouve la marchandise, comment le
> prix est calculé, où en est le transport, ce qui doit être payé et ce qui a
> déjà été encaissé.
