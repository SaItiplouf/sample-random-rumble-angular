# Random Rumble 

# Partie 1 : 

Pour commencer vous allez fork et cloner ce projet. 
Utilisez la commande `npm install` qui installera tous les modules nécessaire (ngrx est inclus)

Si vous avez un problème durant l'installation veuillez supprimer le fichier package-lock.json

# Partie 2 : 

## Ngrx States, Reducer et Store 

Premièrement nous allons créer les différents Models et States de Ngrx : 

  - Créer ce fichier dans app/models/player.model.ts
  ```ts 
    export interface IPlayer { 
      id: number; 
      name: string; 
      pv: number; 
      pvMax: number; 
      mana: number; 
      manaMax: number; 
    } 

    
    export class Player implements IPlayer { 
      id: number; 
      name: string; 
      pv: number; 
      pvMax: number; 
      mana: number; 
      manaMax: number; 
      
      constructor(id: number, name: string, pv: number, pvMax: number, mana: number, manaMax: number) { 
        this.id = id; 
        this.name = name; 
        this.pv = pv; 
        this.pvMax = pvMax; 
        this.mana = mana; 
        this.manaMax = manaMax; 
      } 
    } 

    // Le state initial contiendra nos 4 joueurs
    export const initialPlayers: IPlayer[] = [
      // Dans ce tableau créons plusieurs instances de la classe player
      new Player(1, 'John', 100, 100, 30, 30),
      new Player(2, 'Jack', 100, 100, 30, 30),
      new Player(3, 'Jessy', 100, 100, 30, 30),
      new Player(4, 'Jenny', 100, 100, 30, 30)
    ]; 
  ```
  - Créer ce fichier dans app/models/monster.model.ts
  ```ts 
    export interface IMonster { 
      id: number; 
      name: string; 
      pvMax: number, 
      pv: number, 
    } 
      
    export const initialMonster: IMonster = { 
      id: 1, 
      name: 'Monster', 
      pvMax: 800, 
      pv: 800, 
    };
 
  ```

Nous allons ensuite créer le reducer de Ngrx pour créer l’état initial de l'application que nous utiliserons dans nos composants.
  
  - Créer ce fichier dans app/reducers/game.reducer.ts
  ```ts
    import { createReducer, createSelector, on } from '@ngrx/store'; 
    import { IMonster, initialMonster } from './../models/monster.model'; 
    import { IPlayer, initialPlayers } from './../models/player.model'; 
    
    
    export interface GameState { 
      monster: IMonster; 
      players: IPlayer[]; 
    } 
      
    export const initialState: GameState = { 
      monster: initialMonster, 
      players: initialPlayers
    }; 
      
    export const gameReducer = createReducer( 
      initialState 
    );
  ```
  Notez qu’on utilise bien un tableau de ‘players’ au lieu d’un objet. 
  L'avantage avec typescript est qu'il connaîtra totalement la structure et les types de données que l'on utilisera.
  
  Il faut ensuite fournir le gameReducer à la configuration du store
  **Pour que nos components correspondent au store, il va maintenant falloir lier leur state avec le store**
  Pour cela nous allons modifier notre app.module.ts à la racine app et ajouter le store.

  - Ajoutez ces 2 imports dans le fichier app.module.ts
  ```ts
  import { StoreModule } from '@ngrx/store'; 
  import { EffectsModule } from '@ngrx/effects'; 
  import { gameReducer } from './reducers/reducers';
    
  @NgModule({ 
    ... 
    imports: [ 
      ...
      StoreModule.forRoot({game: gameReducer}), 
      EffectsModule.forRoot([]), 
    ], 
    ...
  }) 
  export class AppModule { }

  ```
  - Vous remarquerez ici que l'on ajoute qu'un objet contenant la clé game qui contient notre reducer
  - Notre petit jeu est assez simple et ne demande pas d'avoir plusieur reducer mais il est totalement possible sur de grosse application de posséder plusieur réducer dans un store pour que cela soit plus claire nous pourrions créer un fichier store.ts et exporter un objet store contenant plusieurs réducer.
  

## Récupération du state dans nos composants 

Nous allons utiliser un sélecteur pour souscrire au state qui nous intéresse.

  - Pour commencer nous allons modifier le component monster.component.ts afin de récupérer les donnéees du monstre :

  ```ts
  import { Component, OnInit } from '@angular/core'; 
  import { Store } from '@ngrx/store';  
  import { IMonster } from 'src/app/models/monster.model'; 
  import { GameState } from 'src/app/reducers/reducers'; 
    
  @Component({ 
    selector: 'app-monster', 
    templateUrl: './monster.component.html', 
    styleUrls: ['./monster.component.scss'] 
  }) 
  export class MonsterComponent implements OnInit { 
    monster?: IMonster; 
    
    // Récupérons le store grace a l'injection de dépendance
    constructor(private store: Store<{ game: GameState }>) { 
    } 
    
    // Lorsque le composant est initialisé la méthode ngOnInit se lance et initialise la propriété monster de notre composant
    //Ici nous récupérons le state Monster pour initialiser la propriété Monster de notre composants ce qui nous permet de l'utiliser dans monster.component.html
    ngOnInit(): void { 
      this.store.select(state => state.game).subscribe((game: GameState) => { 
        this.monster = game.monster; 
        // un petit console log pour s'assurer de ce qu'on fait 
        //console.log('MonsterComponent', game.monster); 
      }); 
    }  
  }
  ```

  - Maintenant que les données du monstre sont récupérer par notre composant dynamisons la vue du composant Monster :
  ```html
  <section> 
    <div class="container"> 
      <div class="row"> 
        <div class="card-monster col-sm-12"> 
          <div id="monsterCard" *ngIf="monster"> 
            <div class="text-center"> 
              <div class="row"> 
                <div class="col"> 
                  <span class="badge badge-danger ml-2" id="degatSpanMonster"></span> 
                  <img class="img-fluid" src="http://res.publicdomainfiles.com/pdf_view/67/13925387417373.png" width="150px" alt="monster" /> 
                </div> 
              </div> 
            </div> 
            <app-progress-bar [pv]="monster.pv" [pvMax]="monster.pvMax" bgType="bg-primary" faType="fa-heart" barName=": pv"></app-progress-bar> 
          </div> 
        </div> 
      </div> 
    </div> 
  </section>

  ```

  Avec l'instruction ngif nous vérifions que l'objet monster est bien présent, ensuite nous envoyons ses propriétés à un composant enfants ProgressBar qui sera chargé d'afficher la bar de vie de notre monstre.

  Envoyer des données d'un composant parents à un enfant porte un nom, nous appelons ça des **Props**

  Vérifier que tout fonctionne correctement avant de passer à la prochaine étape !

# Partie 3 

## 🔨 Mise en pratique 


  À votre tour de jouer récupérer le state des players dans le composant player-list.component.ts. 

  Aidez-vous de ce qui a été fait avec le composant Monster. 

  **Souvenez vous que le state ‘players’ est un tableau d'objets player, il faudra donc boucler ce tableau pour afficher chaque player-card.**

# Partie 4 

## 🎬️ Actions

  Maintenant que nous avons appris à utiliser le store, nous allons le modifier !

## Création d'actions

  - Créer un nouveau fichier app/actions/player.action.ts
  ```ts
    export const hitMonster = createAction('[Player] Attack Monster', props<{ damage: number }>());
  ```
  `props` contiendra ici les valeurs de notre action, ça peut être une valeur simple, un array ou un objet qu'il va falloir typer.

## Utilisation dans le reducer

  Nous allons maintenant intégrer notre action dans le reducer en y intégrant une fonction a appeler quand l'action sera lancé :
  ```ts 
  // Modification fu fichier app/reducers/reducers.ts
  ...
  import { hitMonster } from './../actions/player.action';

  ...
  export const gameReducer = createReducer(
    initialState,
    on(hitMonster, (state, { damage }) => {
      return {
        //TODO 
      }
    }),
  )
  ``` 

  Le but ici est de modifier monster qui se trouve dans notre state qui devrait ressembler à ceci : 
  ```ts
   const initialState: GameState = { 
      monster: {
        id: 1, 
        name: 'Monster', 
        pvMax: 800, 
        pv: 800, 
      }, 
      players: [
         {id: 1, name: "John", pv: 100, pvMax: 100, mana: 30, manaMax: 30 },
         ...
      ]
    }; 
  ```

  Il nous faudra alors utiliser **le spread operator** pour conserver **l'état immuable** du store. 

## Utilisation de l'action avec les boutons

  Vous avez réussi ? on va bien voir ... allez dans le composant button-capacity.componant.ts pour faire appel à l'action 

  Pour le moment click déclanche un ```console.log('aie !')```
  
  - Lancer l'action pour poermetre a notre bouton de déclancher l'action 
  ```ts 
  import { Component, Input } from '@angular/core';

  @Component({
    selector: 'app-button-capacity',
    templateUrl: './button-capacity.component.html',
    styleUrls: ['./button-capacity.component.scss']
  })
  export class ButtonCapacityComponent {
    @Input() player?: any;
    constructor(private store: Store<{game: GameState}>) {
    }

    onClick() {
      //TODO Dispatch l'action hitMonster
      console.log('aie !');
    }
  }
  ```
### Si tout marche bien, chaque click d'un bouton enlève des PV au monstre ! 

## 🔨 Mise en pratique  2

  Allons coder le retour de bâton : hitBack 


  Maintenant que vous pouvez frapper le monstre, il va répliquer ! 
  - Créer l'action hitBack 
  - Intégrer le déclanchement lorsque le monstre ce fait taper 
  - Au déclanchement de l'action, dans le reducer, retirer 10pv à un joueur
  - Faire en sorte que le joueur qui à tapé le monstre reçoit les dégâts en retour sur sa barre de pv
  - Le spread opérator sera complexe, regarder cette documentation : 
    - [Immutable Update Patterns · Redux](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)
    - [Ngrx reducer function](https://v8.ngrx.io/guide/store/reducers#creating-the-reducer-function)
    - [Syntaxe de décomposition](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax)


# Partie 5 😱 Getting serious 

## Ajout de gameplay ! 😱

  Voici une liste de fonctionnalité à ajouter si vous êtes arrivé au bout du TP ! 
## Implémenter un système de tour ! 
  - si un joueur attaque le monstre, il ne peut plus attaquer tant que les autres joueurs n'on pas agi. 
  - représenter cette fonctionnalité en changeant le background de la carte du joueur et en rendant les boutons non clickable.
## Capacité avancé 😱
  - Chaque joueur reçoit 4 capacités différentes.
  - Une des capacités doit être un sort de soin qui coûte autant de mana que de pv restauré. 
  - Une des capacités doit rendre du mana, le coût de cette capacité se manifeste par la perte de point de vie par le joueur. 
  - Une des capacités doit permettre au player de se proteger des attaques du monstre pendant 2 tours

## Gestion de la Mana 😱
  - Si un joueur n'a pas la mana suffisante pour lancer un sort, le bouton devient bleue et ne peut plus être utilisé. 

## Animation visuelle 😱
  - Lorsqu'un joueur perd des pv, déclencher une animation visuelle

## Riposte aléatoire 😱
  - Lorsqu'un joueur attaque le monstre, la riposte à une chance sur deux d'être déclenchée
  - La cible de la riposte est aléatoire entre les 4 joueurs
  - A la fin du tour des 4 joueurs, le monstre déclenche une attaque 2 fois plus puissante qu'une attaque normale  


## D'autre idée ? Ajoutez un système de level ? Différents monstres encore plus puissant ? A vous de jouer !



