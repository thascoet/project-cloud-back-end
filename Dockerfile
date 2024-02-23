# Utilisation d'une image de base avec Node.js préinstallé
FROM node:latest

# Création du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie de tous les fichiers de l'application dans le répertoire de travail du conteneur
COPY . .

# Exposition du port sur lequel l'application va écouter
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"]