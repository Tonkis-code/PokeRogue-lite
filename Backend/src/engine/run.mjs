import Battle from "./battle.mjs";
import Pokemon from "./pokemon.mjs";
import Move from "./move.mjs";

/*

    HARDCODED TEMPORARY GAME DATA

    For now, the player starter and possible enemies are defined directly in this file.

    Later, this will be replaced with:
    - a local JSON dataset
    - PokéAPI Data
    - database-backed Pokémon data

    Keeping the data at the top of the file makes it easier to find and change.

*/

// Player starter data
const PLAYER_TEMPLATE = {
    name: "Charmander",
    stats: {
        hp: 39,
        attack: 52,
        defense: 43,
    },
    moves: [
        { name: "Ember", power: 10 },
        { name: "Scratch", power: 6 },
    ],
};

// Enemy pool data
const ENEMY_TEMPLATES = [
    {
        name: "Wild Squirtle",
        stats: {
            hp: 30,
            attack: 40,
            defense: 30,
        },
        moves: [{ name: "Tackle", power: 8 }],
    },
    {
        name: "Wild Bulbasaur",
        stats: {
            hp: 32,
            attack: 38,
            defense: 35,
        },
        moves: [{ name: "Vine Whip", power: 9 }],
    },
    {
        name: "Wild Pidgey",
        stats: {
            hp: 26,
            attack: 45,
            defense: 20,
        },
        moves: [{ name: "Quick Attack", power: 7 }],
    },
    {
        name: "Wild Rattata",
        stats: {
            hp: 26,
            attack: 40,
            defense: 24,
        },
        moves: [{ name: "Quick Attack", power: 7 }],
    },
];

/*

    HELPER FUNCTIONS

    These functions convert simple template objects into actual Move and Pokemon
    class instances

*/

// Turns template data into real Move objects
function createMoves(moveTemplates) {
    return moveTemplates.map(move => new Move(move.name, move.power));
}

// Creates a Pokemon from a template object
function createPokemonFromTemplate(template) {
    return new Pokemon(
        template.name,
        template.stats,
        createMoves(template.moves)
    );
}



export default class Run {
    constructor() {
        /* 
            A Run represents one full playthrough.

            It stores:
            - the current floor
            - whether the run is over
            - the player's Pokémon
            - the current battle
        */
        this.floor = 1;
        this.isOver = false;

        // Build the player from the starter template
        this.player = createPokemonFromTemplate(PLAYER_TEMPLATE);

        // Start the first battle immeditely 
        this.currentBattle = this.generateBattle();
    }

    generateBattle() {
        /*
            Creates a new enemy battle for the current floor.

            Right now:
            - one enemy is chosen randomly from the current enemy pool
            - enemy stats are scaled slightly based on floor number

            Later this will use:
            - PokéAPI Data
            - a database
            - procedural generation rules
        */

            const randomIndex = Math.floor(Math.random() * ENEMY_TEMPLATES.length);
            const template = ENEMY_TEMPLATES[randomIndex];

            // Scale enemy stats slightly as the player goes deeper in the run
            const scaledEnemy = new  Pokemon(
                template.name,
                {
                    hp: template.stats.hp + this.floor * 2,
                    attack: template.stats.attack + this.floor,
                    defense: template.stats.defense + this.floor,
                },
                createMoves(template.moves)
            );

            return new Battle(this.player, scaledEnemy);
    }

    attack(moveIndex = 0) {
        /*
            Processes one player turn in the current battle.

            moveIndex: 
            - 0 = first move
            - 1 = second move
            - etc.

            The battle object handles the turn logic.
            The Run object handles the larger run progression:
            - moving to the next floor after a win
            - ending the run after a loss
        */

            if (this.isOver) {
                return { message: "Run is over." };
            }

            const state = this.currentBattle.takeTurn(moveIndex);

            // If the player wins the battle, advance to the next floor
            if (state.isOver && state.winner === "player" ) {
                this.floor++;

                this.healBetweenFloors();
                this.currentBattle = this.generateBattle();

                return {
                    ...state,
                    message: "Enemy defeated! Moving to the next floor.",
                    newFloor: this.floor,
                };
            }

            // If the enemy wins, the run ends completely
            if (state.isOver && state.winner === "enemy") {
                this.isOver = true;

                return {
                    ...state,
                    message: "You lost the run.",
                };
            }

            return state;
    }

    getState() {
        /*
            Returns the public state of the run.

            This is what the API send back to the client/frontend.
            It should contain enough information to display the game state.
        */ 

        return {
            floor: this.floor,
            isOver: this.isOver,
            battle: this.currentBattle.getState(),
        };
    }

    healBetweenFloors() {
        /*
            Restores 20% of the player's max HP between floors.

            This makes progression a little more forgivin and gives the run a 
            roguelike "carry forward" feel.
            (This will be eventually be changed to be potions so this is just temporary test data)
        */

        const healAmount = Math.floor(this.player.maxHp * 0.2);

        this.player.hp = Math.min(
            this.player.maxHp,
            this.player.hp + healAmount
        );
    }

    toJSON() {
        /*
            Serializes the run into plain JSON so it can be stored in the database.

            We store plain values only:
            - strings
            - numbers
            - arrays
            - objects

            We do not store class instances directly.
        */
        return {
            floor: this.floor,
            isOver: this.isOver,
            player: {
                name: this.player.name,
                hp: this.player.hp,
                maxHp: this.player.maxHp,
                attack: this.player.attack,
                defense: this.player.defense,
                moves: this.player.moves.map(move => ({
                    name: move.name,
                    power: move.power,
                })),
            },
            enemy: {
                name: this.currentBattle.enemy.name,
                hp: this.currentBattle.enemy.hp,
                maxHp: this.currentBattle.enemy.maxHp,
                attack: this.currentBattle.enemy.attack,
                defense: this.currentBattle.enemy.defense,
                moves: this.currentBattle.enemy.moves.map(move => ({
                    name: move.name,
                    power: move.power,
                })),
            },
        };
    }

    static async fromJSON(data) {
        /*
            Rebuilds a Run instance from saved JSON data.

            This is needed because when data is loaded from the database,
            it comes back as plain objects, not as class instances.
        */

            const { default: Pokemon } = await import("./pokemon.mjs");
            const { default: Move } = await import("./move.mjs");
            const { default: Battle }= await import("./battle.mjs");

            const playerMoves = data.player.moves.map(
                move => new Move(move.name, move.power)
            );

            const enemyMoves = data.enemy.moves.map(
                move => new Move(move.name, move.power)
            );

            const player = new Pokemon(
                data.player.name,
                {
                    hp: data.player.maxHp,
                    attack: data.player.attack,
                    defense: data.player.defense,
                },
                playerMoves
            );
            player.hp = data.player.hp;

            const enemy = new Pokemon(
                data.enemy.name,
                {
                    hp: data.enemy.maxHp,
                    attack: data.enemy.attack,
                    defense: data.enemy.defense,
                },
                enemyMoves
            );
            enemy.hp = data.enemy.hp;

            const run = Object.create(this.prototype);
            run.floor = data.floor;
            run.isOver = data.isOver;
            run.player = player;
            run.currentBattle = new Battle(player, enemy);

            return run;
    }
}