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
            <v-tabs v-model="tab" align-with-title>
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
                    <CurrentGame/>
                </v-tab-item>
                <v-tab-item>
                    <Scoreboard/>
                </v-tab-item>
                <v-tab-item>
                    <Help/>
                </v-tab-item>
            </v-tabs-items>
        </v-main>

        <v-dialog v-model="dialogCreate" max-width="800">
            <v-card>
                <v-toolbar flat color="primary" dark>
                    <v-toolbar-title>New Game</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-row align="center">
                            <v-col cols="12">
                                <span class="text-h6 tertiary--text">Type of game</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="version" hide-details outlined label="Game Version" :items="['Around The World', 'Great Lakes']"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-subheader>Number of players</v-subheader>
                                <v-slider v-model="players" min=2 max=5 color="secondary" :thumb-label="true" track-color="grey-lighten2"></v-slider>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
import CurrentGame from './components/CurrentGame';
import Scoreboard from './components/Scoreboard';
import Help from './components/Help';

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
        tab: null,
        dialogCreate: false,
    }),
    methods:{
        openCreate(){
            this.dialogCreate = true;
        },
        createGame(){
            
        }
    }
};
</script>
