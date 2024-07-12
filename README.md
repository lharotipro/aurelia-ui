# Introduction 
Le plugin Aurelia UI Toolkit est conçu pour standardiser l'apparence frontale de nos applications en fournissant une collection de ressources et de composants Web construits avec le framework Aurelia. 

# Getting Started

Cette boîte à outils vise à rationaliser le processus de développement en offrant des éléments d'interface utilisateur cohérents, en réduisant la duplication des efforts et en promouvant les meilleures pratiques en matière de conception et de développement d'interface utilisateur.

Caractéristiques:

Composants d'interface utilisateur standardisés : comprend une variété de composants d'interface utilisateur tels que des boutons, des formulaires, des modaux, des barres de navigation, etc., tous conçus pour maintenir un style visuel et une expérience utilisateur cohérents dans l'ensemble de l'application.
Styles personnalisables : les composants de l'interface utilisateur sont livrés avec des styles personnalisables pour s'intégrer de manière transparente aux différents thèmes et exigences de conception de l'application. Les développeurs peuvent facilement modifier les styles pour correspondre aux directives de marque de l'application.
Composants Web réutilisables : tous les composants sont conçus comme des composants Web réutilisables, ce qui les rend faciles à utiliser et à maintenir dans l'ensemble de l'application. Les développeurs peuvent simplement déposer ces composants dans leurs vues Aurelia et les configurer selon leurs besoins.
Conception réactive : les composants de l'interface utilisateur sont conçus pour être réactifs, garantissant une expérience de visualisation et d'interaction optimale sur différents appareils et tailles d'écran.

# Build and Test
Pour installer le plugin Aurelia UI Toolkit dans votre application Aurelia, suivez ces étapes :

1 - Installez le plugin via npm : 

```  
npm install aurelia-ui-toolkit
```

2 - Enregistrez le plugin dans votre application main.tsou main.jsfichier Aurelia :


  ```
import { Aurelia } from 'aurelia';
import { MyPlugin } from 'aurelia-ui-toolkit';

Aurelia
  .register(MyPlugin)
  .app(MyApp)
  .start();
```

3 - Importez et utilisez les composants de l'interface utilisateur dans vos vues Aurelia selon vos besoins :
```
 <template>
  <au-button label="Click me"></au-button>
</template>
```


# Contribute
les contributions au plugin Aurelia UI Toolkit sont les bienvenues ! Si vous trouvez des bugs, avez des suggestions de nouvelles fonctionnalités ou souhaitez contribuer à des améliorations du code, n'hésitez pas à soumettre une pull request sur le référentiel GitHub.

 

 