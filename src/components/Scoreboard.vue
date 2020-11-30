<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat dark color="secondary">
                        <v-toolbar-title>Overall Scoreboard</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-medal</v-icon>
                    </v-toolbar>
                    <v-card-text>
                        <v-data-table :loading="loadingData" :headers="headers" :items="games" item-key="id" multi-sort>
                            <template v-slot:[`item.details`]="{ item }">
                                <v-icon  @click="openDetails(item)">mdi-eye</v-icon>
                            </template>
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon v-if="dateInRange(item.date)" color="quaternary" @click="joinGame(item)">mdi-puzzle-edit-outline</v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialogDetails" max-width="800" @click:outside="closeDetails">
            <v-toolbar flat dark color="primary">
                <v-toolbar-title>Game details</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDetails">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-tabs mobile-breakpoint="0" :vertical="$vuetify.breakpoint.mdAndUp" color="secondary">
                <v-tab>
                    <v-icon left>mdi-chart-box-outline</v-icon>
                    Summary
                </v-tab>
                <template v-if="selectedGame">
                    <v-tab v-for="item in selectedGame.players" :key="item.name">
                        <v-icon left>mdi-account-outline</v-icon>
                        <span> {{item.name}} </span>
                    </v-tab>
                </template>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text v-if="selectedGame!=null">
                            <v-container>
                                <v-row>
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Rankings</span>
                                    </v-col>
                                    <v-col cols="10">
                                        <v-card outlined>
                                            <v-simple-table fixed-header>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="blue-grey lighten-4 text-left">Name</th>
                                                            <th class="blue-grey lighten-4 text-left">Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody v-show="selectedGame.rankings.length > 0">
                                                        <tr v-for="player in selectedGame.rankings" :key="player.name">
                                                            <td>{{ player.name }}</td>
                                                            <td>{{ player.score }}</td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody v-show="selectedGame.rankings.length == 0">
                                                        <tr>
                                                            <td colspan="2">No players yet</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Statistics</span>
                                    </v-col>
                                    <v-col cols=""></v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <template v-if="selectedGame!=null">
                    <v-tab-item v-for="i in selectedGame.players.length" :key="i">
                        <v-card flat>
                            <v-container >
                                <v-row>
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Tickets</span>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card outlined>
                                            <v-data-table :headers="ticketHeaders" :items="selectedGame.players[i-1].tickets">
                                                <template v-slot:[`item.status`]="{ item }">
                                                    <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                                                </template>
                                                <template v-slot:[`item.cities`]="{ item }">
                                                    {{item.cities.slice(-1)[0]}}
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Harbors</span>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card outlined>
                                            <v-data-table :headers="harborsHeaders" :items="selectedGame.players[i-1].harbors"
                                            :footer-props="{'items-per-page-options': [-1] }">
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Units</span>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <v-card outlined>
                                            <v-simple-table fixed-header>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="primaryLight text-left">Routes</th>
                                                            <th class="primaryLight text-left">Number</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody v-show="selectedGame.players[i-1].units">
                                                        <tr v-for="(j,x) in selectedGame.players[i-1].units" :key="x">
                                                            <td>{{ x }}</td>
                                                            <td>{{ j }}</td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody v-show="!selectedGame.players[i-1].units">
                                                        <tr>
                                                            <td colspan="2">No units yet</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-tab-item>
                </template>
            </v-tabs>

        </v-dialog>
    </v-container>
</template>

<script>
import { db } from '@/main'
import { Tickets } from '../util/tickets'

export default {
    data(){
        return {
            headers: [
                {text:"Version", align:"start", value:"version", sortable: true},
                {text:"Date", align:"start", value:"date", sortable: true},
                {text:"Players", align:"start", value:"players", sortable: true},
                {text:"Winner", align:"start", value:"winner", sortable: true},
                {text:"Score", align:"start", value:"score", sortable: true},
                {text:"Details", align:"center", value:"details", sortable: false},
                {text:"Actions", align:"center", value:"actions", sortable: false}
                ],
            ticketHeaders:[
                {text:"From", align:"start", value:"cities[0]", sortable: true, class:"primaryLight"},
                {text:"To", align:"start", value:"cities", sortable: true, class:"primaryLight"},
                {text:"Status", align:"start", value:"status", sortable: true, class:"primaryLight"},
            ],
            harborsHeaders:[
                {text: "City", align:"start", value:"city", sortable: false, class:"primaryLight"},
                {text: "Points", align:"start", value:"score", sortable: false, class:"primaryLight"}
            ],
            games: [],
            selectedGame: null,
            dialogDetails: false,
            loadingData: false,
            unsubscribe: null,
        }
    },
    methods:{
        openDetails(item){
            let obj = {
                date: item.date,
                version: item.version,
                winner: item.winner,
                score: item.score,
                rankings: item.rankings
            }
            let computed = []
            for(let i=0;i<item.players;i++){
                let p = `player${i+1}`
                let t = (item.version == "Around The World") ? Tickets.World : Tickets.GreatLakes
                let doc = Object.assign({},item[p]);
                if(doc.tickets) doc.tickets = doc.tickets.map(x => { return {...x, ...t.find(o => x.id==o.id)} })
                computed.push(doc)
            }
            obj.players = computed;
            this.selectedGame = Object.assign({},obj);
            this.dialogDetails = true;
        },
        async deleteItem(item){
            try {
                let ok = window.confirm("You are about to delete this game. Are you sure ?")
                if(ok){
                    await db.collection('Games').doc(item.id).delete();
                    console.log("Game deleted successfully");
                }
            } catch (error) {
                console.warn("An error occured while deleting game : "+error);
            }
        },
        closeDetails(){
            this.dialogDetails = false;
            this.selectedGame = null;
        },
        getStatusColor(status){
            if(status == "Done") return "green"
            else if(status == "Fail") return "red"
            else return "amber"
        },
        dateInRange(date){
            let d = new Date(Date.parse(date))
            let today = new Date()
            if(d > new Date(today.setDate(today.getDate() - 2))){
                return true
            } else return false
        },
        joinGame(item){
            // Changes the tab and send the ID + version
            let myEvent = {id: item.id, version: item.version}
            this.$emit("joinGame",myEvent)
        },
        computeObjectFromFirebase(doc){
            let docData = doc.data();
            let p = []
            for(let i=0;i<docData.players;i++){
                let w = docData[`player${i+1}`]
                p.push({name: w.name, score:w.score})
            }
            p.sort((a,b)=> b.score-a.score)
            let top = p[0].score
            let res = p.filter(x=>x.score==top)
            let winner = ""
            for(let j=0;j<res.length;j++){
                (j==0) ? winner+=res[j].name : winner+=`, ${res[j].name}`
            }
            return {id: doc.id, ...docData, winner: winner, score:top, rankings:p}
        },
        async getFirebaseData(){
            this.loadingData = true
            let snapshot = await db.collection('Games').get();
            let games = []
            snapshot.forEach(doc => {
                games.push(this.computeObjectFromFirebase(doc))
            })
            this.games = games;
            this.loadingData = false;
        },
        async getRealTimeData(){
            this.loadingData = true;
            let unsubscribe = await db.collection('Games').onSnapshot(query => {
                query.docChanges().forEach(change => {
                    if(change.type == "removed") this.games.splice(this.games.findIndex(el => el.id == change.doc.id),1)
                    else {
                        let doc = this.computeObjectFromFirebase(change.doc)
                        if(change.type == "added") this.games.push(doc)
                        else if(change.type == "modified") this.games.splice(this.games.findIndex(el => el.id == change.doc.id),1,doc)
                    }
                })
            }, error=>{
                console.warn("Firebase query failed : "+error);
            })
            this.unsubscribe = unsubscribe;
            this.loadingData = false;
        }
    },
    mounted(){
        //this.getFirebaseData()
        this.getRealTimeData();
    },
    beforeDestroy(){
        this.unsubscribe();
    }
}
</script>
