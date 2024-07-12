#!/bin/bash
#README.ME

# Utilisation du script

# Pour exécuter ce script, vous devez fournir le chemin de base du projet comme argument. Par exemple :
# Pour une mise à jour mineure (patch), vous exécutez simplement le script avec le chemin du projet :
# ./publish.sh 'C:/BriquesCommunes/UTILITAIRE/Als.Aurelia.Plugins'
# Pour une mise à jour majeure (breaking change), vous ajoutez un deuxième argument :
# ./publish.sh 'C:/BriquesCommunes/UTILITAIRE/Als.Aurelia.Plugins' breaking
# Pour sauter l'étape d'installation npm, vous ajoutez un troisième argument :
# ./publish.sh 'C:/BriquesCommunes/UTILITAIRE/Als.Aurelia.Plugins' patch --skip-install

# Explication
#
# $1 : Représente le premier argument fourni au script.
#
# PROJECT_PATH : Variable qui stocke le chemin de base du projet.
#
# cd "$PROJECT_PATH" : Change le répertoire courant en utilisant la variable PROJECT_PATH.
#
# VERSION_TYPE : Variable qui détermine si la mise à jour est patch ou major en fonction de la présence du deuxième argument.
#
# npm version $VERSION_TYPE : Commande qui met à jour la version du package en fonction de la valeur de VERSION_TYPE.

#SCRIPT.ME
# Vérifier si le chemin de base du projet a été fourni en argument
if [ -z "$1" ]; then
  echo "Erreur : Vous devez fournir le chemin de base du projet comme premier argument."
  exit 1
fi

# Affecter le premier argument à une variable
PROJECT_PATH=$1

# Vérifier si le deuxième argument (breaking change) a été fourni
if [ "$2" == "breaking" ]; then
  VERSION_TYPE="major"
else
  VERSION_TYPE="patch"
fi

# Vérifier si le troisième argument (--skip-install) a été fourni
if [ "$3" == "--skip-install" ]; then
  SKIP_INSTALL=true
else
  SKIP_INSTALL=false
fi

# Étape 1: Switch source directory
cd "$PROJECT_PATH" || { echo "Erreur : Impossible de se rendre dans le répertoire $PROJECT_PATH"; exit 1; }

# Étape 2: Mettre à jour le registre
npm config set registry https://registry.npmjs.org/

# Étape 3: Switch source directory
cd "$PROJECT_PATH/source/packages/graphiques" || { echo "Erreur : Impossible de se rendre dans le répertoire $PROJECT_PATH/source/packages/graphiques"; exit 1; }

# Étape 4: Augmenter la version du package selon le type de changement
npm version $VERSION_TYPE

# Étape 5: Mettre à jour les modules Node (si l'installation n'est pas sautée)
if [ "$SKIP_INSTALL" = false ]; then
  npm install
  echo "Modules Node installés"
else
  echo "Étape d'installation npm sautée"
fi

# Étape 6: Construire le projet et générer le dossier de distribution
npm run build
echo "Projet construit"

# Étape 7: Switch source directory
cd "$PROJECT_PATH" || { echo "Erreur : Impossible de se rendre dans le répertoire $PROJECT_PATH"; exit 1; }

# Étape 8: Mettre à jour le registre
#npm config set registry https://pkgs.dev.azure.com/actionlogementservices/_packaging/ActionLogementServices/npm/registry/

# Étape 9: Switch source directory
cd "$PROJECT_PATH/source/packages/graphiques" || { echo "Erreur : Impossible de se rendre dans le répertoire $PROJECT_PATH/source/packages/graphiques"; exit 1; }

# Étape 10: Publier le package
npm publish
echo "Aurelia UI plugin publié"

# Étape 11: Switch source directory
cd "$PROJECT_PATH" || { echo "Erreur : Impossible de se rendre dans le répertoire $PROJECT_PATH"; exit 1; }

# Étape 12: Mettre à jour le registre
npm config set registry https://registry.npmjs.org/

# Étape 13: Switch source directory
cd "$PROJECT_PATH/source/packages/graphiques" || { echo "Erreur : Impossible de se rendre dans le répertoire $PROJECT_PATH/source/packages/graphiques"; exit 1; }

# Étape 14: Démarrer le projet
npm run start
