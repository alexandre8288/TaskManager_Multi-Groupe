
### <p align="center">Dépendances</p>
  
Nécessite Docker Compose version v2.29.1-desktop.1, téléchargez la dernière version de Docker Engine pour être à jour.
La version 20 de node pour ^ne pas avoir de conflits avec les dépendances.

### <p align="center">Installation</p>
  
Pour démarrer l'installation du projet après avoir téléchargé le répôt Github il vous suffit d'être à la racine du projet et de lancer la commande suivante :
```bash
docker-compose -f install.yaml up -d
```

Si vous n'avez pas NestJS d'installer sur votre ordinateur, exécutez cette commande :
```bash
npm install -g @nestjs/cli
```

Une fois cela fait, il vous suffit de vous placer dans le dossier 'server' et de le démarrer avec cette commande :
```bash
npm run start:dev
```

Une base de données avec un jeu de test sera automatiquement créée, les informations de connexion se situent dans le .env pour cet exemple
