# Shipora - application client

Shipora est une application web de gestion logistique. Cette partie du
monorepo correspond au client Next.js pour les organisations qui gerent leurs
expeditions, colis, clients, entrepots, tarifs, factures et paiements.

La partie administration sera developpee plus tard. Le backend actuel se trouve
dans le dossier `../bn`.

## Stack

- Next.js 16 avec App Router et React 19
- TypeScript
- TanStack Query pour les donnees serveur et le cache
- Axios avec cookies HTTP-only
- React Hook Form et Zod pour les formulaires
- Tailwind CSS 4, Framer Motion et Lucide React
- ZXing pour le scan de QR codes

## Structure

```text
fn/
  app/
    (landing)/       Pages et composants marketing publics
    (auth)/          Connexion et inscription
    dashboard/       Espace prive de l'organisation
    track/           Suivi public d'un colis
    components/auth/ Gardes ProtectedRoute et GuestRoute
    context/         Etat global de session
    hooks/           Hooks React Query par domaine
    services/        Appels HTTP vers le backend
    types/           Types metier du client
    lib/axios.ts     Client Axios, cookies et renouvellement de session
  public/             Assets statiques
```

## Prerequis

- Node.js compatible avec Next.js 16
- pnpm 10.23 ou une version compatible
- Le backend Shipora lance depuis `../bn`
- Une base de donnees configuree pour le backend

## Installation et lancement

Depuis `fn` :

```bash
pnpm install
pnpm dev
```

Le client est disponible sur `http://localhost:3000`.

Commandes utiles :

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

## Configuration

Creer un fichier `.env.local` dans `fn` :

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

`NEXT_PUBLIC_API_URL` est integre au bundle navigateur. Il ne doit donc jamais
contenir de secret. Les secrets JWT, base de donnees et ImageKit appartiennent
uniquement au backend `bn`.

## Workflow utilisateur

### 1. Visiteur

- `/` affiche la landing page et ses sections marketing.
- `/track` permet de rechercher publiquement un colis avec son code de suivi.
- La navigation publique est rendue par les composants du groupe
  `app/(landing)/`.

Au chargement, `AuthProvider` verifie silencieusement `/auth/me`. Une reponse
`401` sur cette requete signifie simplement que le visiteur est anonyme; elle ne
doit pas rediriger vers `/login`.

### 2. Inscription et connexion

- `/register` valide les champs avec Zod puis appelle `POST /auth/register`.
- `/login` valide l'email et le mot de passe puis appelle `POST /auth/login`.
- Le backend pose les cookies HTTP-only d'acces et de renouvellement.
- Le client place l'utilisateur dans le cache React Query et redirige vers
  `/dashboard`.
- Un utilisateur deja connecte visitant `/login` ou `/register` est redirige
  vers `/dashboard` par `GuestRoute`.

### 3. Session

Les cookies ne sont pas lus par JavaScript. Axios envoie automatiquement les
cookies avec `withCredentials: true`.

Lorsqu'un appel protege renvoie `401`, `app/lib/axios.ts` appelle
`/auth/refresh`, puis rejoue la requete initiale. Le backend fait tourner le
refresh token. Si le renouvellement echoue, le client redirige vers `/login`.

Le cache React Query est vide lors d'une connexion ou d'une deconnexion afin
d'eviter qu'un compte voie les donnees mises en cache par le compte precedent.

### 4. Espace organisation

`/dashboard` et ses sous-pages sont enveloppees par `ProtectedRoute`. Le menu
actuel couvre :

| Fonction | Route client | Domaine API |
| --- | --- | --- |
| Vue generale et indicateurs | `/dashboard` | `/dashboard/*` |
| Expeditions | `/dashboard/shipments` | `/shipment/*` |
| Colis et scan QR | `/dashboard/packages` | `/package/*` |
| Clients | `/dashboard/customers` | `/customer/*` |
| Entrepots | `/dashboard/warehouses` | `/warehouse/*` |
| Tarification | `/dashboard/pricing` | `/pricing/*` |
| Facturation | `/dashboard/billing` | `/billing/*` |
| Paiements | `/dashboard/payments` | `/payment/*` |
| Staffs | `/dashboard/staffs` | `/user/*` |

Depuis la table des clients, l'action d'options ouvre un drawer d'historique.
Il charge les informations du client, ses expeditions, ses colis et ses
paiements via `GET /customer/:id/history`.

Les pages `/dashboard/settings`, `/dashboard/profile` et `/dashboard/staffs` permettent aux rôles
autorisés de modifier les informations de l'organisation et de créer/lister
les membres du staff. La génération PDF des factures sera ajoutée ultérieurement.

Chaque domaine suit le meme decoupage :

```text
page ou composant -> hook React Query -> service HTTP -> route backend
```

Les mutations invalident ensuite les queries concernees pour rafraichir les
listes et les details.

### 5. Suivi public et scan

La page `/track` appelle `GET /package/public-track/:trackingCode` sans session.
Dans l'espace prive, le scanner QR lit localement le code depuis la camera ou
une image, puis utilise `GET /package/scan/:trackingCode` avec la session de
l'utilisateur et son organisation.

## Modele de securite

Le frontend n'est pas une frontiere de securite. `ProtectedRoute`, les roles
affiches dans le menu et les validations Zod ameliorent l'experience, mais un
appel HTTP peut toujours etre fabrique manuellement. Les controles obligatoires
sont donc dans `bn` :

1. `authenticate` verifie le JWT HTTP-only et recharge l'utilisateur depuis la
   base.
2. `requireRole` verifie le role avant chaque operation sensible.
3. Les services doivent filtrer chaque lecture et ecriture par
   `organizationId`.
4. Les schemas Zod backend doivent valider les donnees, meme si le frontend les
   valide deja.

## Audit de securite

Audit realise le 14 septembre 2026 sur le client `fn` et les routes backend
appelees par celui-ci.

### Risques eleves a traiter avant la production

| Priorite | Constat | Solution |
| --- | --- | --- |
| Haute | Les protections de routes sont client-side uniquement. Un utilisateur peut appeler directement l'API. | Conserver `authenticate`, `requireRole` et le filtrage `organizationId` sur chaque route backend. Ajouter des tests d'autorisation par role et par organisation. |
| Haute | Le tracking public retourne nom d'article, quantite, poids, origine et destination. Un code vole permet donc une divulgation de donnees. | Retourner le minimum necessaire, utiliser des codes longs et non predictibles, journaliser les abus et limiter les requetes avec un rate limiter distribue en production. |
| Haute | Le backend utilise `process.env.JWT_SECRET!` sans validation de demarrage. Une configuration absente ou faible peut compromettre toutes les sessions. | Valider toutes les variables obligatoires au demarrage, refuser les secrets courts ou par defaut, et stocker les secrets dans le gestionnaire de secrets de l'environnement. |
| Haute | Le cache navigateur pouvait conserver des donnees d'une organisation apres changement de compte. | Corrige dans `app/hooks/useAuth.ts` avec `queryClient.clear()` au login et au logout. Ajouter un test de changement de compte. |

### Risques moyens et durcissement recommande

| Priorite | Constat | Solution |
| --- | --- | --- |
| Moyenne | La protection CSRF repose principalement sur `SameSite: lax`. | Verifier l'en-tete `Origin` ou ajouter un mecanisme CSRF pour les mutations, surtout si frontend et backend sont deployes sur des sites differents. |
| Moyenne | Le rate limit global et celui du tracking sont en memoire du processus. Ils deviennent insuffisants avec plusieurs instances. | Utiliser un stockage partage et limiter aussi par IP, route et identifiant de suivi. Ajouter une protection contre l'enumeration des codes. |
| Moyenne | Le formulaire d'upload QR accepte un fichier local jusqu'au traitement ZXing. Le backend multipart autorise 5 Mo. | Verifier type MIME, extension, dimensions et contenu cote backend; refuser les fichiers non images et appliquer une limite par utilisateur/IP. |
| Moyenne | Les autorisations sont definies dans les routes, mais la couverture n'est pas testee automatiquement. | Ajouter une matrice role x endpoint et des tests d'integration pour `OWNER`, `ADMIN`, `MANAGER`, `AGENT` et `ACCOUNTANT`. |
| Moyenne | Les erreurs de production et les logs doivent etre controles pour ne pas exposer de details internes. | Desactiver les logs verbeux, normaliser les erreurs publiques et envoyer les traces sensibles vers un outil securise. |

### Points deja corrects ou a conserver

- Les tokens sont dans des cookies `httpOnly`, pas dans `localStorage`.
- `secure` est active en production et `sameSite` vaut `lax`.
- Les routes backend metier inspectees utilisent `authenticate` et
  `requireRole`.
- Les requetes de colis inspectees filtrent par organisation.
- Le backend limite les uploads multipart a 5 Mo.
- Les entrees principales sont validees avec Zod cote client et backend.

## Checklist avant production

- [ ] Backend et frontend servis exclusivement en HTTPS.
- [ ] `JWT_SECRET`, `DATABASE_URL` et cles ImageKit absents du frontend et du
      depot.
- [ ] Variables d'environnement validees au demarrage du backend.
- [ ] CORS limite a l'origine frontend exacte, sans wildcard avec credentials.
- [ ] Tests d'isolation entre deux organisations.
- [ ] Tests de role sur chaque endpoint de lecture, creation, modification et
      suppression.
- [ ] Tests de rotation, expiration, revocation et rejeu des refresh tokens.
- [ ] Tracking public reduit au minimum et protege contre l'enumeration.
- [ ] Rate limit partage et monitoring des erreurs `401`, `403` et `429`.
- [ ] Scan de dependances et mise a jour reguliere de Next.js, Axios et des
      dependances backend.
- [ ] Headers de securite verifies en production, notamment CSP, HSTS et
      `frame-ancestors`.

## Extension future : partie admin

La future interface admin doit rester separee de l'espace organisationnel :

- routes et layout dedies, par exemple `/admin`;
- role admin verifie dans le backend, jamais uniquement dans le menu;
- endpoints admin distincts avec `requireRole` explicite;
- audit logs pour les actions sensibles;
- queries React Query avec des cles et des types separes;
- confirmation renforcee pour suppression, suspension et changement de role.

Ne pas reutiliser un endpoint organisationnel pour une action admin sans definir
clairement son perimetre d'autorisation et son modele d'audit.