<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <div class="d-flex align-center">
                <!-- <v-icon large>mdi-ticket-confirmation-outline</v-icon> -->
                <span class="text-h5 font-weight-light">Ticket To Ride</span>
            </div>

            <v-spacer></v-spacer>

            <v-btn text @click="openCreate">
                <span class="mr-2">New game</span>
                <v-icon>mdi-checkerboard-plus</v-icon>
            </v-btn>
            <v-divider vertical inset></v-divider>
            <v-menu v-model="menuSettings" :close-on-content-click="false" left bottom offset-y>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-card min-width="250">
                    <v-toolbar flat color="primaryLight">
                        <v-toolbar-title class="darkenBlack--text">Settings</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-container>
                            <v-row align="center">
                                <v-switch v-model="computedTheme" class="pt-0 mt-0" label="Dark theme :" inset color="accent"
                                hide-details>
                                </v-switch>
                                <div class="text-subtitle-1 ml-1">{{(computedTheme) ? 'On' : 'Off'}}</div>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-menu>

            <template v-slot:extension>
                <v-tabs v-model="tab" mobile-breakpoint="0">
                <v-tabs-slider color="secondary"></v-tabs-slider>
                <v-tab>Current game</v-tab>
                <v-tab>Scoreboard</v-tab>
                <v-tab>Help</v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <v-main>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <CurrentGame class="pa-6 pa-sm-12 pa-md-16 ma-md-4" ref="currentGame"
                    :id="currentGameId" :players="currentGamePlayers" :version="currentGameVersion"
                    :gamesAndRules="gamesAndRules" :appLoaded="appLoaded"
                    @resetGameSession="resetGameSession()" @popUp="popUp($event)" @findVersion="findVersion($event)"/>
                </v-tab-item>
                <v-tab-item>
                    <Scoreboard class="pa-6 pa-sm-12 pa-md-16 ma-md-4"
                    :gamesAndRules="gamesAndRules"
                    @joinGame="actOnJoinGame($event)" @popUp="popUp($event)"/>
                </v-tab-item>
                <v-tab-item>
                    <Help class="pa-6 pa-sm-12 pa-md-16 ma-md-4"/>
                </v-tab-item>
            </v-tabs-items>
        </v-main>

        <v-dialog v-model="dialogCreate" max-width="800" @click:outside="closeCreate">
            <v-card>
                <v-toolbar flat color="primary" dark>
                    <v-toolbar-title>New Game</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form v-model="newGameForm" ref="newGameForm">
                        <v-container fluid>
                            <v-row align="center">
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Type of game</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select v-model="version" solo :rules="newVersionRules" color="secondary" hide-details label="Game Version" :items="(gamesAndRules.length>0) ? gamesAndRules : []" item-text="name" return-object></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-subheader>Number of players</v-subheader>
                                    <v-slider v-model="players" min=2 max=5 color="secondary" ticks="always" tick-size="3" :tick-labels="['2','3','4','5']" track-color="grey-lighten2"></v-slider>
                                </v-col>
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Players name</span>
                                </v-col>
                                <v-col cols="12" md="6" v-for="player in players" :key="player">
                                    <v-text-field required :rules="newPlayerRules" color="secondary" v-model="names[player]" :label="computeLabel(player)" clearable></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Date</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                                    offset-y min-width="290px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="date" label="Choose a date" prepend-icon="mdi-calendar"
                                            readonly v-bind="attrs" v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker
                                            v-model="date" header-color="primary" color="secondary"
                                            @input="menu = false"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn large text color="accent" @click="closeCreate">CLOSE</v-btn>
                    <v-btn large :disabled="!newGameForm" :loading="loadingCreate" text color="secondary" @click="createGame">CREATE</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogWrongTickets" max-width="500">
            <v-card>
                <v-toolbar flat color="secondary" dark>
                    <v-toolbar-title>Be careful !</v-toolbar-title>
                </v-toolbar>
                <v-card-text class="text-body-1 tertiary--text">
                    <v-container>
                        <v-row>
                            <v-col>
                                <div>You have just joined a game that <span class="font-weight-bold">does not</span> correspond to the tickets you have.</div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <div>Please reset your current game and try joining this one again afterwards.</div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" text @click="dialogWrongTickets=false">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="snack" :timeout="5000" :color="snackColor"> {{snackMsg}} </v-snackbar>
    </v-app>
</template>

<script>
import CurrentGame from './components/CurrentGame';
import Scoreboard from './components/Scoreboard';
import Help from './components/Help';
import { Games } from './util/games';
import { db } from "./main";

export default {
    name: 'App',

    components: {
        CurrentGame,
        Scoreboard,
        Help
    },

    data: () => ({
        players: 3,
        version: null,
        newVersionRules: [v => !!v || "Version is required"],
        newPlayerRules: [v => !!v || "Player name is required", v => v.length>1 && !(/\d/.test(v)) || "Player name must be valid"],
        names: {1: "", 2:"", 3:"", 4:"", 5:""},
        defaultNames: {1: "", 2:"", 3:"", 4:"", 5:""},
        date: new Date().toISOString().substr(0,10),
        menu: false,
        menuSettings: false,
        tab: null,
        newGameForm: false,
        dialogCreate: false,
        dialogWrongTickets: false,
        currentGameId: "",
        currentGameVersion: {},
        currentGamePlayers: [],
        loadingCreate: false,
        gamesAndRules: Games,
        appLoaded: false,
        snack: false,
        snackColor: "",
        snackMsg: ""
    }),
    watch:{
        currentGameVersion: {
            handler(value){
                console.log(`Version changed to ${value.name}`);
            }
        },
        gamesAndRules: {
            immediate: true,
            handler(value){
                if(value){
                    this.appLoaded = true;
                }
            }
        }
    },
    computed:{
        computedTheme:{
            get(){
                return this.$vuetify.theme.dark
            },
            set(value){
                this.$vuetify.theme.dark = value;
                localStorage.setItem("dark-theme", value);
            }
        }
    },
    methods:{
        openCreate(){
            this.dialogCreate = true;
            this.updateTodaysDate();
        },
        closeCreate(){
            this.dialogCreate = false;
            this.loadingCreate = false;
            this.players = 3;
            this.names = Object.assign({}, this.defaultNames);
            this.version = null;
            setTimeout(() => {
                this.$refs.newGameForm.resetValidation();
            }, 50);
        },
        updateTodaysDate(){
            this.date = new Date().toISOString().substr(0,10);
        },
        async actOnJoinGame(event){
            if(this.$refs.currentGame.getRoutes().filter(x => x.game != event.version).length > 0){
                this.dialogWrongTickets = true;
            } else {
                await this.resetGameSession();
                this.currentGameId = event.id;
                this.currentGameVersion = Object.assign({},this.gamesAndRules.find(game=>game.name == event.version));
            }
            this.tab = 0;
        },
        resetGameSession(){
            return new Promise((resolve, reject)=>{
                try {
                    this.currentGameId = "";
                    this.currentGameVersion = {};
                    this.currentGamePlayers = new Array();
                    resolve();
                } catch (error) {
                    reject("An error occured while resetting game variables");
                }
            })
        },
        findVersion(event){
            this.currentGameVersion = this.gamesAndRules.find(game=>game.name==event.version);
            console.log(`Event sent from child: currentGameVerison = ${this.currentGameVersion}`)
        },
        async createGame(){
            this.loadingCreate = true;
            this.$refs.currentGame.resetAll();
            await this.resetGameSession();
            let doc = {date: this.date, players: this.players, version: this.version.name}
            for(let i=0;i<this.players; i++){
                let n = `player${i+1}`
                doc[n] = {name: this.names[i+1], score:this.version.initialScore, tickets:[]}
            }
            console.log(doc)
            let d = await db.collection('Games').add(doc)
            this.currentGameId = d.id;
            // Sets the currentGame variables
            this.currentGameVersion = Object.assign({},this.version);
            this.currentGamePlayers = Object.values(this.names).splice(0,this.players)
            // Create then close
            this.closeCreate();
        },
        popUp(event){
            this.snackColor = event.color;
            this.snackMsg = event.msg;
            this.snack = true;
        },
        computeLabel(number){
            return `Player ${number}`
        },
        toggleTheme(){
            this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        }
    },
    mounted(){
        if(localStorage.getItem("dark-theme")){
            try {
                this.$vuetify.theme.dark = (localStorage.getItem("dark-theme")=='true');
            } catch (error) {
                localStorage.removeItem('dark-theme');
            }
        }
    }
};
</script>

<style>
    /* Fixing selected tab invisible in dark mode */
    .v-tabs-slider-wrapper, .v-tab--active {
        color: #fff !important;
    }
</style>
<style>
    .v-card__text, .v-card__title {
       word-break: normal; /* maybe !important  */
    }
</style>