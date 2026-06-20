# Le Carnet de mon Toutou

Application web pour des médailles NFC reliées aux chiens. Quand une médaille
est scannée, le téléphone ouvre directement une page web (`/t/[tagCode]`) qui
permet de contacter le propriétaire en un clic — sans aucune application à
installer.

## Ce que contient ce projet

- **Page publique de scan** (`/t/[tagCode]`) : la page la plus importante,
  pensée pour être comprise et utilisée en moins de 5 secondes, à une main.
- **Parcours d'activation** (`/activate`) : un propriétaire relie sa médaille
  physique à la fiche de son chien grâce à un code privé.
- **Tableau de bord propriétaire** (`/dashboard`) : gestion des chiens, des
  médailles, des réglages de confidentialité, du mode "chien perdu", et
  consultation de l'historique des scans.
- **Back-office admin** (`/admin`) : vue d'ensemble, gestion des utilisateurs,
  des chiens, des médailles (génération de lots, désactivation, remplacement)
  et des scans.

## Stack technique

- Next.js 16 (App Router), TypeScript strict, Tailwind CSS
- PostgreSQL + Prisma
- Better Auth (authentification par email / mot de passe, rôles USER / ADMIN)
- Zod pour la validation
- Déploiement cible : Vercel + base de données managée (Neon recommandé) +
  Vercel Blob pour les photos

## Démarrer en local

### 1. Installer les dépendances

```bash
npm install
```

### 2. Créer une base de données PostgreSQL

La solution la plus simple : crée un compte gratuit sur
[neon.com](https://neon.com), crée un projet, et copie l'URL de connexion
fournie.

### 3. Configurer les variables d'environnement

Copie `.env.example` en `.env` et remplis les valeurs :

```bash
cp .env.example .env
```

- `DATABASE_URL` : l'URL de connexion Postgres obtenue à l'étape 2.
- `BETTER_AUTH_SECRET` : génère une valeur aléatoire avec
  `openssl rand -base64 32`.
- `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL` : laisse `http://localhost:3000`
  en local.

### 4. Créer les tables et insérer des données de démonstration

```bash
npm run db:migrate   # crée les tables dans ta base
npm run db:seed       # ajoute un compte et un chien de démonstration
```

La commande de seed affiche à la fin l'URL de la page publique de démo
(quelque chose comme `/t/AB3D9F2K`) ainsi que l'email du compte de
démonstration.

### 5. Lancer l'application

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Déployer en production

1. Pousse ce projet sur un dépôt GitHub.
2. Crée un nouveau projet sur [vercel.com](https://vercel.com) à partir de ce
   dépôt.
3. Dans les réglages du projet Vercel, ajoute les mêmes variables
   d'environnement que dans `.env` (avec ton URL de production pour
   `BETTER_AUTH_URL` et `NEXT_PUBLIC_APP_URL`).
4. Connecte un store **Vercel Blob** au projet (Storage → Create → Blob) :
   la variable `BLOB_READ_WRITE_TOKEN` sera ajoutée automatiquement.
5. Déploie. Vercel exécute automatiquement `npm run build`.
6. Lance la migration sur ta base de production une fois (depuis ton poste,
   en pointant `DATABASE_URL` vers la base de prod) :
   ```bash
   npm run db:migrate
   ```

### Écrire les médailles NFC physiques

Chaque médaille doit contenir une **URL**, pas une app :
`https://<ton-domaine>/t/<tagCode>`. Utilise une application comme
"NFC Tools" sur smartphone pour écrire cette URL sur une puce NFC vierge
(type NTAG213/215/216, très répandues et peu coûteuses). Génère les
`tagCode` / `activationCode` depuis `/admin/tags` → "Générer un lot".

## Checklist de tests manuels avant mise en ligne

- [ ] Créer un compte, se déconnecter, se reconnecter
- [ ] Demander une réinitialisation de mot de passe
- [ ] Créer un chien depuis `/dashboard/pets/new`
- [ ] Activer une médaille depuis `/activate` en la reliant à ce chien
- [ ] Scanner (= ouvrir) `/t/[tagCode]` et vérifier que le scan apparaît dans
      `/dashboard/scans`
- [ ] Cliquer sur "Appeler" et "SMS" sur la page publique et vérifier que
      l'action est tracée
- [ ] Soumettre le formulaire "J'ai trouvé ce chien" et vérifier sa réception
      (table `FoundReport`)
- [ ] Activer le mode "chien perdu" et vérifier le bandeau sur la page
      publique
- [ ] Modifier les réglages de visibilité et vérifier qu'une information
      décochée disparaît bien de la page publique
- [ ] Essayer d'ouvrir `/dashboard` sans être connecté → redirection vers
      `/login`
- [ ] Essayer d'ouvrir `/admin` avec un compte non-admin → redirection
- [ ] Désactiver une médaille depuis `/admin/tags` et vérifier le message
      affiché sur sa page publique
- [ ] Ouvrir une URL `/t/CODEINEXISTANT` et vérifier l'écran "médaille
      introuvable"

## Notes importantes pour la suite

- **Photos des chiens** : le champ `photoUrl` attend une URL HTTPS publique.
  L'upload de fichier (vers Vercel Blob) n'est pas encore branché côté
  formulaire dans cette V1 — c'est la prochaine pièce à ajouter en priorité.
- **Emails** : les emails (confirmation d'activation, notification de
  signalement) ne sont pas encore envoyés. L'architecture s'y prête
  (dossier `emails/`), il manque le branchement d'un fournisseur comme
  Resend.
- **Rôle admin** : aucune interface ne permet de promouvoir un utilisateur en
  admin pour l'instant — passe par `npm run db:studio` (interface Prisma) et
  modifie manuellement le champ `role` d'un utilisateur en `ADMIN`.
