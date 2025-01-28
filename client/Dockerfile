# Utiliser l'image officielle Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port utilisé par Vite (par défaut 5173)
EXPOSE 5173

# Lancer Vite en mode développement avec --host pour le rendre accessible depuis Docker
CMD ["npm", "run", "dev", "--", "--host"]
