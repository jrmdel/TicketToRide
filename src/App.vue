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
                    <CurrentGame class="pa-6 pa-sm-12 pa-md-16 ma-md-4" :id="currentGameId" :players="currentGamePlayers" :version="currentGameVersion"/>
                </v-tab-item>
                <v-tab-item>
                    <Scoreboard class="pa-6 pa-sm-12 pa-md-16 ma-md-4"/>
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
                                    <v-select v-model="version" solo :rules="newVersionRules" color="secondary" hide-details label="Game Version" :items="['Around The World', 'Great Lakes']"></v-select>
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
    </v-app>
</template>

<script>
import CurrentGame from './components/CurrentGame';
import Scoreboard from './components/Scoreboard';
import Help from './components/Help';
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
        tab: null,
        newGameForm: false,
        dialogCreate: false,
        currentGameId: "",
        currentGameVersion: "",
        currentGamePlayers: [],
        loadingCreate: false,
    }),
    methods:{
        openCreate(){
            this.dialogCreate = true;
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
        async createGame(){
            this.loadingCreate = true;
            let doc = {date: this.date, players: this.players, version: this.version}
            for(let i=0;i<this.players; i++){
                let n = `player${i+1}`
                doc[n] = {name: this.names[i+1], score:-12}
            }
            console.log(doc)
            let d = await db.collection('Games').add(doc)
            this.currentGameId = d.id;
            console.log(this.currentGameId)
            // Sets the currentGame variables
            this.currentGameVersion = this.version;
            this.currentGamePlayers = Object.values(this.names).splice(0,this.players)
            // Create then close
            this.closeCreate();
        },
        computeLabel(number){
            return `Player ${number}`
        }
    }
};
</script>
