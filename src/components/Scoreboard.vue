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
                        <v-data-table :loading="computedLoading" :headers="headers" :items="games" item-key="id" multi-sort>
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

            <v-col>
                <v-card>
                    <v-toolbar flat dark color="secondary">
                        <v-toolbar-title>Games insights</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-chart-arc</v-icon>
                    </v-toolbar>
                    <v-card-text>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around" class="pt-3">
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of games</span>
                                    <span v-if="computedLoading" class="ml-4">
                                        <v-progress-circular size="50" width="3" indeterminate></v-progress-circular>
                                    </span>
                                    <span v-else class="ml-4 text-sm-h3 text-h4">{{games.length || 0}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">points scored</span>
                                    <span v-if="computedLoading" class="ml-4">
                                        <v-progress-circular size="50" width="3" indeterminate></v-progress-circular>
                                    </span>
                                    <span v-else class="ml-4 text-sm-h3 text-h4">{{computedMetadata.points || 0}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of successful tickets</span>
                                    <span v-if="computedLoading" class="ml-4">
                                        <v-progress-circular size="50" width="3" indeterminate></v-progress-circular>
                                    </span>
                                    <span v-else class="ml-4 text-sm-h3 text-h4">{{computedMetadata.nbSuccessTickets || 0}}</span>
                                </v-col>
                            </v-row>
                        </v-container>

                        <v-container fluid>
                            <v-row>
                                
                                <v-col cols="12" md="6">
                                    <v-card color="accent">
                                        <v-card-title>Per player</v-card-title>
                                    </v-card>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-card color="background" elevation="1">
                                        <v-toolbar flat color="accent">
                                            <v-toolbar-title>Per version</v-toolbar-title>
                                        </v-toolbar>
                                        <v-card-text v-if="!computedLoading">
                                            <v-container fluid>
                                                <v-row>
                                                    <v-col cols="12">
                                                        <span class="text-h6 tertiary--text">Select version</span>
                                                    </v-col>
                                                    <v-col cols="12" sm="7">
                                                        <v-select v-model="insightsVersion" solo clearable
                                                        color="secondary" label="Version" :items="computedMetadataVersions">
                                                        </v-select>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col></v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
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
            <v-tabs mobile-breakpoint="0" :vertical="$vuetify.breakpoint.mdAndUp" color="secondary" background-color="primary">
                <v-tabs-slider color="secondary"></v-tabs-slider>
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
                                    <v-col cols="12" sm="10">
                                        <v-card outlined>
                                            <v-simple-table fixed-header>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="primaryLight text-left darkenBlack--text">Name</th>
                                                            <th class="primaryLight text-left darkenBlack--text">Score</th>
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
                                    <v-col cols="12" sm="6">
                                        <v-card tile color="secondary" dark>
                                            <v-card-title class="text-subtitle-1">Total of units</v-card-title>
                                            <v-card-text class="text-h4 white--text">
                                                {{getTotalUnits(selectedGame.players)}}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-card tile color="quaternary" dark>
                                            <v-card-title class="text-subtitle-1">Total of successful tickets</v-card-title>
                                            <v-card-text class="text-h4 white--text">
                                                {{getTotalSuccessfulTickets(selectedGame.players)}}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <template v-if="selectedGame!=null">
                    <v-tab-item v-for="i in selectedGame.players.length" :key="i">
                        <v-card flat>
                            <v-container >
                                <!--
                                <v-row>
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Statistics</span>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12">
                                        <apexchart type="bar" height="160" :options="optionsPointsChartPerPlayer" :series="computePointsGraph(selectedGame.players[i-1])"></apexchart>
                                    </v-col>
                                </v-row> -->
                                <v-row v-if="computedHasLongest">
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Bonuses</span>
                                    </v-col>
                                </v-row>
                                <v-row v-if="computedHasLongest">
                                    <v-col cols="12">
                                        <v-card outlined :disabled="(selectedGame.players[i-1].longestBonus || 0)==0">
                                            <v-toolbar class="text-caption font-weight-bold text--secondary" flat dense color="primaryLight">
                                                Longest path
                                            </v-toolbar>
                                            <v-container>
                                                <v-row justify="space-around">
                                                    <v-icon :color="((selectedGame.players[i-1].longestBonus || 0)!=0) ? 'accent' : 'primary'">
                                                        {{((selectedGame.players[i-1].longestBonus || 0)!=0) ? "mdi-star" : "mdi-star-off-outline"}}
                                                    </v-icon>
                                                    <span class="text-h6 font-weight-regular tertiary--text"> {{selectedGame.players[i-1].longestBonus || 0}} </span>
                                                </v-row>
                                            </v-container>
                                        </v-card>
                                    </v-col>
                                </v-row>
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
                                                <template v-slot:[`item.to`]="{ item }">
                                                    {{item.cities.slice(-1)[0].name}}
                                                </template>
                                                <template v-slot:[`item.from`]="{ item }">
                                                    {{item.cities[0].name}}
                                                </template>
                                                <template v-slot:no-data>
                                                    No tickets yet
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row v-if="computedHasHarbors">
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Harbors</span>
                                    </v-col>
                                </v-row>
                                <v-row v-if="computedHasHarbors">
                                    <v-col cols="12">
                                        <v-card outlined>
                                            <v-data-table :headers="harborsHeaders" :items="selectedGame.players[i-1].harbors"
                                            :footer-props="{'items-per-page-options': [-1] }">
                                                <template v-slot:no-data>
                                                    No harbors yet
                                                </template>
                                            </v-data-table>
                                        </v-card>
                                    </v-col>
                                </v-row>
                                <v-row v-if="computedHasTrainStations">
                                    <v-col cols="12">
                                        <span class="text-h6 tertiary--text">Train stations</span>
                                    </v-col>
                                </v-row>
                                <v-row v-if="computedHasTrainStations">
                                    <v-col cols="12">
                                        <v-card outlined>
                                            <v-simple-table fixed-header>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="primaryLight darkenBlack--text text-left">Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody v-show="selectedGame.players[i-1].trainStations">
                                                        <tr>
                                                            <td>{{ selectedGame.players[i-1].trainStations }}</td>
                                                        </tr>
                                                    </tbody>
                                                    <tbody v-show="!selectedGame.players[i-1].trainStations">
                                                        <tr>
                                                            <td colspan="2">No stations yet</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
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
                                                            <th class="primaryLight darkenBlack--text text-left">Routes</th>
                                                            <th class="primaryLight darkenBlack--text text-left">Number</th>
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
//import jsonGames from '../util/savedGames04-21.json'

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
                {text:"From", align:"start", value:"from", sortable: true, class:"primaryLight darkenBlack--text"},
                {text:"To", align:"start", value:"to", sortable: true, class:"primaryLight darkenBlack--text"},
                {text:"Status", align:"start", value:"status", sortable: true, class:"primaryLight darkenBlack--text"},
            ],
            harborsHeaders:[
                {text: "City", align:"start", value:"city", sortable: false, class:"primaryLight darkenBlack--text"},
                {text: "Points", align:"start", value:"score", sortable: false, class:"primaryLight darkenBlack--text"}
            ],
            games: [],
            //games: jsonGames,
            selectedGame: null,
            selectedVersion: null,
            insightsVersion: null,
            dialogDetails: false,
            loadingData: false,
            unsubscribe: null,
            scoreUnitsRule: {1:1, 2:2, 3:4, 4:7, 5:10, 6: 15, 7: 18, 8:21, 9:27},
            optionsPointsChartPerPlayer: {
                chart: {
                    type: 'bar',
                    stacked: true,
                    stackType: '100%'
                },
                grid:{
                    show:false,
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                    },
                },
                colors:["#6A2E35","#C42348","#B57F50"],
                stroke: {
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: ["Points"],
                    labels:{
                        show:false,
                        maxHeight:10,
                    },
                    axisBorder:{ show: false },
                    axisTicks:{ show: false },
                },
                yaxis:{ show: false },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return Math.round(val) + "%"
                        }
                    }
                },
                fill: {
                    opacity: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                }
            },
        }
    },
    props:{
        gamesAndRules:{
            type: Array,
            default:()=>[]
        }
    },
    computed:{
        computedLoading:{
            get(){
                // Returns true if loading
                return Object.keys(this.computedMetadata).length==0
            }
        },
        computedHasHarbors:{
            get(){
                return this.selectedVersion && this.selectedVersion.hasHarbors
            }
        },
        computedHasLongest:{
            get(){
                return this.selectedVersion && this.selectedVersion.hasLongest
            }
        },
        computedHasTrainStations:{
            get(){
                return this.selectedVersion && this.selectedVersion.hasTrainStations
            }
        },
        computedMetadata:{
            get(){
                if(this.games.length == 0) return {}
                else{
                    let res = {
                        players: new Set(),
                        versions: new Set(),
                        points: 0,
                        nbTickets: 0,
                        nbSuccessTickets: 0,
                        sharedFirst:0
                    }
                    let doc = null, p=null;
                    for(let i=0, l=this.games.length; i<l; i++){
                        try {
                            doc = Object.assign({},this.games[i]);
                            res.versions.add(doc.version);
                            if(doc.draw) res.sharedFirst+= 1;
                            for(let j=1;j<=doc.players;j++){
                                p = Object.assign({},doc[`player${j}`]);
                                res.players.add(p.name);
                                res.points+=p.score;
                                res.nbTickets+=p.tickets.length;
                                if(p.tickets.length>0) res.nbSuccessTickets+=p.tickets.filter(item=>!item.status.match(/fail/ig)).length;
                            }
                        } catch (error) {
                            console.warn(`Game with id ${this.games[i].id} raised an error during computation`)
                        }
                    }
                    return res;
                }
            }
        },
        computedMetadataVersions:{
            get(){
                return (this.computedMetadata?.versions) ? Array.from(this.computedMetadata.versions) : []
            }
        },
        computeFromVersion2(){
            if(this.games.length==0) return {}
            else {
                let t = Tickets.World;
                let res = {
                    topTickets: t.map(doc=>{ return {
                        ...doc, occurrences:0,
                        resultWinDone:0, resultWinFail:0, resultWinUnordered:0,
                        resultLossDone:0, resultLossFail:0, resultLossUnordered:0 } }),
                    totalPoints: 0,
                    firstPlayerWins: 0,
                    numberOfGames: 0,
                    cumulPlayers: 0,
                    pointsTickets: 0,
                    pointsHarbors: 0,
                    pointsTrainStations: 0,
                    pointsUnits: 0,
                    pointsBonus: 0
                }
                let docs = this.games.filter(item=>item.version=="Around The World");
                res.numberOfGames = docs.length;
                let p = 0, player = null, index=0, winner = false;
                for(let doc of docs){
                    p = doc.players;
                    res.cumulPlayers += p;
                    for(let j=1; j<=p; j++){
                        player = Object.assign({},doc[`player${j}`]);
                        if(player.name == doc.winner){
                            if(j==1) res.firstPlayerWins++;
                            winner = true;
                        } else winner = false;
                        res.totalPoints+=player.score;
                        if(player.harbors) res.pointsHarbors+=(player.harbors.map(h=>h.score).reduce((a,b)=>a+b,0)-4*(3-player.harbors.length));
                        if(player.units) res.pointsUnits += this.computeUnitsToPoints(player.units, player.exchanges || 0);
                        for (let ticket of player.tickets) {
                            index = res.topTickets.findIndex(item=>item.id == ticket.id);
                            if(index==-1) console.log(doc);
                            else{
                                res.topTickets[index].occurrences++;
                                if(ticket.status.match(/done/i)) (winner) ? res.topTickets[index].resultWinDone++ : res.topTickets[index].resultLossDone++;
                                else if(ticket.status.match(/fail/i)) (winner) ? res.topTickets[index].resultWinFail++ : res.topTickets[index].resultLossFail++;
                                else (winner) ? res.topTickets[index].resultWinUnordered++ : res.topTickets[index].resultLossUnordered++;
                            }
                        }
                    }
                }
                return res;
            }
        }
    },
    methods:{
        openDetails(item){
            function getScoreAndNumberOfUnits(unitObject, exchanges, rules){
                let count = 0;
                let score = 0;
                for (let [key, value] of Object.entries(unitObject)){
                    count += key*value;
                    score += rules[key]*value;
                }
                return {count: count, score: score-exchanges};
            }
            function getHarborsScore(arr){
                let n = (3-arr.length)*-4;
                return (arr.length>0) ? arr.map(x => x.score).reduce((a,b)=>a+b)+n : n;
            }
            function getTicketData(tickets){
                let score = 0;
                let fail = 0;
                for(let i=0; i<tickets.length; i++){
                    let o = tickets[i];
                    if(o.status == "Done") score += o.points;
                    else if(o.status == "Fail"){
                        score += (o.points_failed) ? o.points_failed : -1*o.points;
                        fail += 1;
                    }
                    else score += o.points_unorderded;
                }
                return {score: score, totalFailed: fail};
            }
            if(this.gamesAndRules.findIndex(game=>game.name==item.version)==-1) return this.popUp("This game version is not supported","error")
            this.selectedVersion = Object.assign({},this.gamesAndRules.find(game=>game.name==item.version));
            let obj = {
                date: item.date,
                version: item.version,
                winner: item.winner,
                score: item.score,
                rankings: item.rankings
            }
            let computed = [];
            let p = "";
            let doc = {};
            for(let i=0;i<item.players;i++){
                p = `player${i+1}`;
                if(item[p]) doc = Object.assign({},item[p]);
                if(doc.tickets) doc.tickets = doc.tickets.map(x => { return {...x, ...this.selectedVersion.tickets.find(o => x.id==o.id)} })
                computed.push({
                    ...doc,
                    computedUnits: getScoreAndNumberOfUnits(doc.units || {}, item.exchanges || 0,this.selectedVersion.pointsPerRoute),
                    computedHarbors: getHarborsScore(doc.harbors || []),
                    computedTickets: getTicketData(doc.tickets || []),
                    computedTrainStations: doc.trainStations || 0,
                    computedLongest: (this.selectedVersion.hasLongest) ? this.selectedVersion.longestPoints*(doc.longestBonus || 0) : 0
                    })
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
        getTotalUnits(playersArr){
            let nb = 0;
            for(let i=0; i<playersArr.length; i++){
                let p = playersArr[i];
                nb += p.computedUnits.count
            }
            return nb;
        },
        getTotalSuccessfulTickets(playersArr){
            let nb = 0;
            for(let i=0; i<playersArr.length; i++){
                let p = playersArr[i];
                nb += (p.tickets?.length || 0) - p.computedTickets.totalFailed;
            }
            return nb;
        },
        computePointsGraph(player){
            let serie = [
                {name: "Tickets", data: [100*player.computedTickets.score/player.score]},
                {name: "Harbors", data: [100*player.computedHarbors/player.score]},
                {name: "Units", data: [100*player.computedUnits.score/player.score]},
            ];
            return serie;
        },
        computeUnitsToPoints(units, exchanges){
            // TODO Rules
            let rules = [1,2,4,7,10,15,18,21,27]
            return Object.values(units).map((val,i)=>val*rules[i]).reduce((a,b)=>a+b)-exchanges
        },
        computeFromVersion(version){
            if(this.games.length == 0) return {}
            else {
                let t = (version == "Around The World") ? Tickets.World : Tickets.GreatLakes;
                let res = {
                    topTickets: t.map(doc=>{ return {
                        ...doc, occurrences:0,
                        resultWinDone:0, resultWinFail:0, resultWinUnordered:0,
                        resultLossDone:0, resultLossFail:0, resultLossUnordered:0 } }),
                    totalPoints: 0,
                    firstPlayerWins: 0,
                    numberOfGames: 0,
                    cumulPlayers: 0,
                    pointsTickets: 0,
                    pointsHarbors: 0,
                    pointsUnits: 0
                }
                let docs = this.games.filter(item=>item.version==version);
                res.numberOfGames = docs.length;
                let p = 0, player = null, index=0, winner = false;
                for(let doc of docs){
                    p = doc.players;
                    res.cumulPlayers += p;
                    for(let j=1; j<=p; j++){
                        player = Object.assign({},doc[`player${j}`]);
                        if(player.name == doc.winner){
                            if(j==1) res.firstPlayerWins++;
                            winner = true;
                        } else winner = false;
                        res.totalPoints+=player.score;
                        if(player.harbors) res.pointsHarbors+=(player.harbors.map(h=>h.score).reduce((a,b)=>a+b,0)-4*(3-player.harbors.length));
                        if(player.units) res.pointsUnits += this.computeUnitsToPoints(player.units, player.exchanges || 0);
                        for (let ticket of player.tickets) {
                            index = res.topTickets.findIndex(item=>item.id == ticket.id);
                            if(index==-1) console.log(doc);
                            else{
                            res.topTickets[index].occurrences++;
                            if(ticket.status.match(/done/i)) (winner) ? res.topTickets[index].resultWinDone++ : res.topTickets[index].resultLossDone++;
                            else if(ticket.status.match(/fail/i)) (winner) ? res.topTickets[index].resultWinFail++ : res.topTickets[index].resultLossFail++;
                            else (winner) ? res.topTickets[index].resultWinUnordered++ : res.topTickets[index].resultLossUnordered++;
                            }
                        }
                    }
                }
                return res;
            }
        },
        closeDetails(){
            this.dialogDetails = false;
            this.selectedGame = null;
            this.selectedVersion = null;
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
            // Will change the tab and send the ID + version
            let myEvent = {id: item.id, version: item.version}
            this.$emit("joinGame",myEvent)
        },
        popUp(msg, color){
            this.$emit("popUp", {msg, color})
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
            return {id: doc.id, ...docData, winner: winner, score:top, rankings:p, draw:(res.length!=1)}
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
            let unsubscribe = await db.collection('Games').orderBy("date").onSnapshot(query => {
                query.docChanges().forEach(change => {
                    if(change.type == "removed") this.games.splice(this.games.findIndex(el => el.id == change.doc.id),1)
                    else {
                        let doc = this.computeObjectFromFirebase(change.doc)
                        if(change.type == "added") this.games.unshift(doc)
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
        // The one below is the good one
        this.getRealTimeData();

        // For development purposes
        /*this.loadingData = true;
        setTimeout(()=>{
            this.loadingData = false
        }, 2500)*/
    },
    beforeDestroy(){
        this.unsubscribe();
    }
}
</script>
