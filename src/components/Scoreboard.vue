<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-btn @click="update">CLICK TO UPDATE</v-btn>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat dark color="secondary">
                        <v-toolbar-title>Overall Scoreboard</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-medal</v-icon>
                    </v-toolbar>
                    <v-card-text>
                        <v-data-table :headers="headers" :items="games" item-key="id" multi-sort>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon  @click="openDetails(item)">mdi-eye</v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialogDetails" max-width="660" @click:outside="closeDetails">
            <v-card>
                <v-toolbar flat dark color="#B57F50">
                    <v-toolbar-title>Game details</v-toolbar-title>
                </v-toolbar>
                <v-card-text v-if="selectedGame!=null">
                    <v-container>
                        <v-row>
                            <v-col cols="12">{{selectedGame.players.length}} players</v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { db } from '@/main'

export default {
    data(){
        return {
            headers: [
                {text:"Version", align:"start", value:"version", sortable: true},
                {text:"Date", align:"start", value:"date", sortable: true},
                {text:"Players", align:"start", value:"players.length", sortable: true},
                {text:"Details", align:"center", value:"actions", sortable: false}
                ],
            games: [
                {
                    id:"3TLh5CIY36OFdBopZETx",
                    date:"2020-11-15",
                    version:"Around The World",
                    players:2,
                    player1: {
                        name: "Jeremie",
                        score: 147,
                        tickets: [
                            {id: 2, status:"Done"},
                            {id: 43, status:"Done"}
                        ],
                        harbors:[
                            {city:"Sydney", score:40}
                        ],
                        units:{
                            "1":4,
                            "2":3,
                            "7":3
                        }
                    },
                    player2: {
                        name: "Delphine",
                        score: 136,
                        tickets:[
                            {id: 5, status:"Done"},
                            {id:61, status:"Unordered"}
                        ],
                        harbors:[
                            {city: "Marseille", score:20}
                        ],
                        units:{
                            "1":6,
                            "2":2,
                            "7":1
                        }
                    }
                }
            ],
            selectedGame: null,
            dialogDetails: false,
        }
    },
    methods:{
        openDetails(item){
            this.selectedGame = Object.assign({},item);
            this.dialogDetails = true;
        },
        closeDetails(){
            this.dialogDetails = false;
            this.selectedGame = null;
        },
        async update(){
            /*
            let docs = await db.collection('Games').get()
            let d = []
            docs.forEach(doc => {
                d.push({...doc.data()})
            })
            console.log(d)
            */
            try {
                let res = await db.collection('Games').doc(this.games[0].id).update({version:"Great Lakes"})
                console.log(res)                
            } catch (error) {
                console.warn(error)
            }
        },
        async getFirebaseData(){
            let snapshot = await db.collection('Games').get();
            let games = []
            snapshot.forEach(doc => {
                games.push({id: doc.id, ...doc.data()})
            })
            this.games = games;
        },
    },
    mounted(){
        //this.getFirebaseData()
    }
}
</script>
