<template>
    <v-container fluid class="pa-6 pa-sm-12 pa-md-16 ma-md-4">
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat color="primary" dark>
                        <v-toolbar-title>Your tickets</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-ticket-confirmation-outline</v-icon>
                    </v-toolbar>
                    <v-card-subtitle>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of tickets</span>
                                    <span class="ml-4 text-h3">{{routes.length+tours.length}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb completed</span>
                                    <span class="ml-4 text-h3">{{computedCompletion}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">current score</span>
                                    <span class="ml-4 text-h3">{{computedTicketScore}}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-between">
                                <v-col cols="auto">
                                    <v-btn x-large color="primary" @click="openAddTicket">
                                        <v-icon>mdi-card-plus-outline</v-icon>
                                        <span class="ml-3 mr-1">ADD A TICKET</span>
                                    </v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn x-large color="accent" @click="openReset('tickets')">
                                        <v-icon>mdi-restore</v-icon>
                                        <span class="ml-3 mr-1">RESET</span>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-card outlined flat color="secondary">
                                        <v-card-title class="text-h4 font-weight-light">
                                            Routes
                                            <v-spacer></v-spacer>
                                            <v-text-field v-model="searchRoutes" append-icon="mdi-magnify"
                                            label="Search" single-line clearable hide-details></v-text-field>
                                        </v-card-title>
                                        <v-data-table class="py-6" :headers="headersRoutes" :items="routes" item-key='id'
                                        :search="searchRoutes" multi-sort
                                        :footer-props="{'items-per-page-options': [-1] }">
                                            <template v-slot:[`item.delete`]="{ item }">
                                                <v-icon large @click="deleteItem(item)">mdi-delete-forever</v-icon>
                                            </template>
                                            <template v-slot:[`item.actions`]="{ item }">
                                                <v-icon large v-show="item.status != 'Done'" color="green" @click="toggleToDone(item)">mdi-check</v-icon>
                                                <v-icon large v-show="item.status != 'Fail'" color="red" @click="toggleToFail(item)">mdi-close</v-icon>
                                            </template>
                                            <template v-slot:[`item.status`]="{ item }">
                                                <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                                            </template>
                                        </v-data-table>
                                    </v-card>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-card outlined flat color="secondary">
                                        <v-card-title class="text-h4 font-weight-light">
                                            Tours
                                            <v-spacer></v-spacer>
                                            <v-text-field v-model="searchTours" append-icon="mdi-magnify"
                                            label="Search" single-line clearable hide-details></v-text-field>
                                        </v-card-title>
                                        <v-data-table class="py-6" :headers="headersTours" :items="tours" item-key='id'
                                        :search="searchTours" multi-sort
                                        :footer-props="{'items-per-page-options': [-1] }">
                                            <template v-slot:[`item.delete`]="{ item }">
                                                <v-icon large @click="deleteItem(item)">mdi-delete-forever</v-icon>
                                            </template>
                                            <template v-slot:[`item.actions`]="{ item }">
                                                <v-icon class="mx-1" large v-show="item.status != 'Done'" color="green" @click="toggleToDone(item)">mdi-check</v-icon>
                                                <v-icon class="mx-1" large v-show="item.status != 'Fail'" color="red" @click="toggleToFail(item)">mdi-close</v-icon>
                                                <v-icon class="mx-1" large v-show="item.status != 'Unordered'" color="amber" @click="toggleToUnordered(item)">mdi-compass-off-outline</v-icon>
                                            </template>
                                            <template v-slot:[`item.status`]="{ item }">
                                                <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
                                            </template>
                                            <template v-slot:[`item.to`]="{ item }">
                                                {{item.cities.slice(-1)[0]}}
                                            </template>
                                        </v-data-table>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat color="primary" dark>
                        <v-toolbar-title>Your harbors</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-anchor</v-icon>
                    </v-toolbar>
                    <v-card-subtitle>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of cities</span>
                                    <span class="ml-4 text-h3">{{computedTopCities.length}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of harbors</span>
                                    <span class="ml-4 text-h3">{{harbors.length}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">current score</span>
                                    <span class="ml-4 text-h3">{{computedHarborsScore}}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-between">
                                <v-col cols="auto">
                                    <v-btn x-large :disabled="harbors.length>2" color="primary" @click="openAddHarbor">
                                        <v-icon>mdi-ship-wheel</v-icon>
                                        <span class="ml-3 mr-1">ADD A HARBOR</span>
                                    </v-btn>
                                </v-col>
                                <v-col cols="auto">
                                    <v-btn x-large color="accent" @click="openReset('harbors')">
                                        <v-icon>mdi-restore</v-icon>
                                        <span class="ml-3 mr-1">RESET</span>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Built harbors</span>
                                    </v-row>
                                    <v-row>
                                        <v-col v-for="i in 3" :key="i" cols="12" md="4">
                                            <v-card outlined :disabled="harbors.length<i">
                                                <v-card-title>
                                                    <span>Harbor #{{i}}</span>
                                                    <v-spacer></v-spacer>
                                                    <v-icon>mdi-anchor</v-icon>
                                                </v-card-title>
                                                <v-card-text class="mb-n6">
                                                    <v-container fluid>
                                                        <v-row class="text-body-1" align="center">
                                                            <v-col cols="12">
                                                                <v-icon :color="(harbors.length<i) ? undefined : 'primary'" class="mx-4">mdi-city-variant</v-icon>
                                                                <span v-if="harbors.length>i-1">{{harbors[i-1]}}</span>
                                                                <span v-else>Unknown</span>
                                                            </v-col>
                                                        </v-row>
                                                        <v-row class="text-body-1" align="center">
                                                            <v-col cols="12">
                                                                <v-icon :color="(harbors.length<i) ? undefined : 'accent'" class="mx-4">mdi-medal-outline</v-icon>
                                                                <span v-if="harbors.length>i-1">{{getHarborScore(harbors[i-1])}}</span>
                                                                <span v-else>- 4</span>
                                                            </v-col>
                                                        </v-row>
                                                    </v-container>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn v-if="!(harbors.length<i)" text color="secondary" @click="deleteHarbor(i)">DELETE</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Top potential cities</span>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-card outlined>
                                                <v-simple-table fixed-header>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="blue-grey lighten-4 text-left">City</th>
                                                                <th class="blue-grey lighten-4 text-left">Number</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody v-show="computedTopCities.length > 0">
                                                            <tr v-for="item in computedTopCities" :key="item.city">
                                                                <td>{{ item.city }}</td>
                                                                <td>{{ item.num }}</td>
                                                            </tr>
                                                        </tbody>
                                                        <tbody v-show="computedTopCities.length == 0">
                                                            <tr>
                                                                <td colspan="2">No cities yet</td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Top successful cities</span>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-card outlined>
                                                <v-simple-table fixed-header>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="blue-grey lighten-4 text-left">City</th>
                                                                <th class="blue-grey lighten-4 text-left">Number</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody v-show="computedTopSuccessfulCities.length > 0">
                                                            <tr v-for="item in computedTopSuccessfulCities" :key="item.city">
                                                                <td>{{ item.city }}</td>
                                                                <td>{{ item.num }}</td>
                                                            </tr>
                                                        </tbody>
                                                        <tbody v-show="computedTopSuccessfulCities.length == 0">
                                                            <tr>
                                                                <td colspan="2">No successful cities yet</td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat color="primary" dark>
                        <v-toolbar-title>Your trains and boats</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-train</v-icon>
                    </v-toolbar>
                    <v-card-subtitle>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of units</span>
                                    <span class="ml-4 text-sm-h3 text-h4">{{Object.values(trainsAndBoats).map((x,i)=> x*(i+1) ).reduce((a, b) => a + b, 0)}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">nb of exchanges</span>
                                    <span class="ml-4 text-sm-h3 text-h4">{{exchanges}}</span>
                                </v-col>
                                <v-col class="mx-8 mx-sm-0" cols="auto">
                                    <span class="text-caption">current score</span>
                                    <span class="ml-4 text-sm-h3 text-h4">{{computedTrainsBoatsScore}}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="end">
                                <v-col cols="auto">
                                    <v-btn x-large color="accent" @click="openReset('units')">
                                        <v-icon>mdi-restore</v-icon>
                                        <span class="ml-3 mr-1">RESET</span>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Claimed routes</span>
                                </v-col>
                            </v-row>
                            <TrainBoat v-for="i in 9" :key="i" :numberOfUnits="i" :currentTotal="trainsAndBoats[i]" @update-value="updateTrainsAndBoats($event)"/>
                            <v-row>
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Exchanges</span>
                                </v-col>
                            </v-row>
                            <v-row class="ml-sm-4" align="center" justify="center" justify-sm="start">
                                <v-btn large icon :disabled="exchanges==0" @click="exchanges-=1">
                                    <v-icon color="red">mdi-minus</v-icon>
                                </v-btn>
                                <span class="text-h6">{{exchanges}}</span>
                                <v-btn large icon @click="exchanges+=1">
                                    <v-icon color="green">mdi-plus</v-icon>
                                </v-btn>
                                <v-icon class="ml-4">mdi-autorenew</v-icon>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialogTicket" max-width="660" @click:outside="closeAddTicket">
            <v-card>
                <v-toolbar flat color="quaternary" dark>
                    <v-toolbar-title>New Ticket</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-row align="center">
                            <v-col cols="12">
                                <span class="text-h6 tertiary--text">Cities</span>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="fromTicket" :rules="simpleRule" solo clearable color="secondary" hide-details label="From" :items="computedFromCities"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="toTicket" :disabled="!fromTicket" solo :rules="simpleRule" clearable color="secondary" hide-details label="To" :items="toCities"></v-select>
                            </v-col>
                            <v-col cols="12" v-if="foundTickets.length==1">
                                <v-card flat outlined color="accent">1 match found</v-card>
                            </v-col>
                            <v-col cols="12" v-if="foundTickets.length>1">
                                <span>Select your ticket</span>
                                <v-card flat outlined>
                                    <v-data-table v-model="selectedTicket" class="py-6" :headers="headersAddTicket" :items="foundTickets" item-key='id'
                                    hide-default-footer single-select show-select>
                                        <template v-slot:[`item.to`]="{ item }">
                                            {{item.cities.slice(-1)[0]}}
                                        </template>
                                    </v-data-table>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn large text color="accent" @click="closeAddTicket">CLOSE</v-btn>
                    <v-btn large :disabled="selectedTicket.length==0" text color="secondary" @click="addTicket">ADD TICKET</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogHarbor" max-width="660" @click:outside="closeAddHarbor">
            <v-card>
                <v-toolbar flat color="quaternary" dark>
                    <v-toolbar-title>New Harbor</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form v-model="harborForm" ref="harborForm">
                        <v-container fluid>
                            <v-row align="center">
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Cities</span>
                                </v-col>
                                <v-col cols="12">
                                    <v-select v-model="newHarbor" :error-messages="(harbors.includes(newHarbor) ? 'This city already has a harbor' : '')" :items="computedFromCities" :rules="simpleRule" solo label="Choose a city"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn large text color="accent" @click="closeAddHarbor">CLOSE</v-btn>
                    <v-btn large :disabled="!harborForm || harbors.includes(newHarbor)" text color="secondary" @click="addHarbor">ADD TICKET</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogReset" max-width="400">
            <v-card>
                <v-card-title><span class="text-h5">Reset {{resetType}}</span></v-card-title>

                <v-card-text>
                    Are you sure you want to reset?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" text @click="dialogReset = false">Cancel</v-btn>
                    <v-btn color="secondary" text @click="resetTypeOf()">Proceed</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { Types } from '../util/types';
import { Tickets } from '../util/tickets';
import TrainBoat from './currentgame/TrainBoat'

export default {
    components:{
        TrainBoat
    },
    data: () => ({
        dialogTicket: false,
        dialogHarbor: false,
        dialogReset: false,
        newTicketForm: false,
        harborForm: false,
        simpleRule: [v => !!v || "A city is required"],
        fromTicket:null,
        toCities: [],
        toTicket:null,
        foundTickets: [],
        selectedTicket: [],
        headersAddTicket:[
            {text:"From", align:"start", value:"cities[0]", sortable: true},
            {text:"To", align:"start", value:"to", sortable: true},
            {text:"Steps", align:"start", value:"cities.length", sortable: true},
            {text:"Points", align:"start", value:"points", sortable: true},
        ],
        tickets: [],
        headersRoutes:[
            {text:"From", align:"start", value:"cities[0]", sortable: true},
            {text:"To", align:"start", value:"cities[1]", sortable: true},
            {text:"Points", align:"start", value:"points", sortable: true},
            {text:"Status", align:"start", value:"status", sortable: true},
            {text:"Actions", align:"center", value:"actions", sortable: false},
            {text:"Delete", align:"center", value:"delete", sortable: true},
        ],
        searchRoutes: "",
        routes: [],
        headersTours:[
            {text:"From", align:"start", value:"cities[0]", sortable: true},
            {text:"To", align:"start", value:"to", sortable: true},
            {text:"Steps", align:"start", value:"cities.length", sortable: true},
            {text:"Points", align:"start", value:"points", sortable: true},
            {text:"Status", align:"start", value:"status", sortable: true},
            {text:"Actions", align:"center", value:"actions", sortable: false},
            {text:"Delete", align:"center", value:"delete", sortable: true},
        ],
        searchTours: "",
        tours: [],
        selectVersion: "Around The World",
        harbors: [],
        newHarbor: null,
        trainsAndBoats: {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},
        defaultTrainsAndBoats: {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},
        exchanges: 0,
        resetType: ""
    }),
    computed:{
        computedFromCities:{
            get(){
                return [...new Set(this.tickets.map(ticket => ticket.cities).flat())].sort()
            }
        },
        computedCompletion:{
            get(){
                return this.routes.filter(route => route.status == "Done").length+this.tours.filter(tour => tour.status != "Fail").length
            }
        },
        computedTicketScore:{
            get(){
                let r = (this.routes.length>0) ? this.routes.map(x => (x.status=="Done") ? x.points : -1*x.points).reduce((a, b) => a + b, 0) : 0
                let t = (this.tours.length>0) ? this.tours.map(x => (x.status=="Fail") ? x.points_failed : (x.status=="Done") ? x.points : x.points_unorderded) : 0
                return parseInt(r)+parseInt(t)
            }
        },
        computedTrainsBoatsScore:{
            get(){
                let a = Object.values(this.trainsAndBoats)
                return a[0]+2*a[1]+4*a[2]+7*a[3]+10*a[4]+15*a[5]+18*a[6]+21*a[7]+27*a[8]-this.exchanges
            }
        },
        computedTopCities:{
            get(){
                let r = this.routes
                let t = this.tours
                let counts = {};
                for(let i=0, l=r.length; i<l; i++){
                    let c = r[i].cities
                    for(let j=0; j<c.length; j++){
                        counts[c[j]] = (counts[c[j]] || 0) + 1
                    }
                }
                for(let i=0, l=t.length; i<l; i++){
                    let c = t[i].cities
                    for(let j=0; j<c.length; j++){
                        counts[c[j]] = (counts[c[j]] || 0) + 1
                    }
                }
                return Object.entries(counts).map(x => { return {"city":x[0], "num":x[1]} }).sort((a,b)=>b.num-a.num)
            }
        },
        computedTopSuccessfulCities:{
            get(){
                let r = this.routes
                let t = this.tours
                let counts = {};
                for(let i=0, l=r.length; i<l; i++){
                    if(r[i].status != "Fail"){
                        let c = r[i].cities
                        for(let j=0; j<c.length; j++){
                            counts[c[j]] = (counts[c[j]] || 0) + 1
                        }
                    }
                }
                for(let i=0, l=t.length; i<l; i++){
                    if(t[i].status != "Fail"){
                        let c = t[i].cities
                        for(let j=0; j<c.length; j++){
                            counts[c[j]] = (counts[c[j]] || 0) + 1
                        }
                    }
                }
                return Object.entries(counts).map(x => { return {"city":x[0], "num":x[1]} }).sort((a,b)=>b.num-a.num)
            }
        },
        computedHarborsScore:{
            get(){
                let res = 0;
                let bonus = (this.selectVersion == "Around The World") ? 10 : 0;
                for(let i=0; i<this.harbors.length; i++){
                    let found = this.computedTopSuccessfulCities.find(x => x.city == this.harbors[i])
                    if(found) res += Math.min(10*found.num,30)+bonus
                }
                return res-(4*(3-this.harbors.length));
            }
        }
    },
    watch:{
        fromTicket:{
            handler(value){
                this.toCities = [];
                this.toTicket = null;
                if(value){
                    let a = this.tickets.filter(ticket => ticket.cities.includes(value)).map(ticket => ticket.cities).flat().sort()
                    this.toCities = [...new Set(a)].filter(city => city != value)
                }
            }
        },
        toTicket:{
            handler(val){
                this.foundTickets = []
                if(val != null){
                    this.foundTickets = this.tickets.filter(ticket => ticket.cities.includes(val)).filter(ticket=>ticket.cities.includes(this.fromTicket))
                }
            }
        },
        foundTickets:{
            handler(value){
                this.selectedTicket = []
                if(value){
                    if(value.length == 1) this.selectedTicket = value;
                }
            }
        },
        selectVersion:{
            handler(value){
                this.tickets = [];
                this.routes = [];
                this.tours = [];
                if(value){
                    this.tickets = (value=="Around The World") ? Tickets.World : Tickets.GreatLakes
                }
            }
        }
    },
    methods:{
        deleteItem(item){
            let id = this.routes.indexOf(item);
            if(id < 0) this.tours.splice(this.tours.indexOf(item),1);
            else this.routes.splice(id,1);
        },
        getStatusColor(status){
            if(status == "Fail") return "red"
            else if(status == "Done") return "green"
            else return "amber"
        },
        openAddTicket(){
            this.dialogTicket = true;
        },
        addTicket(){
            let ticket = (this.foundTickets.length == 1) ? this.foundTickets[0] : this.selectedTicket[0]
            if(ticket.type == Types.ROUTE) this.routes.push({...ticket, status:"Fail"});
            else this.tours.push({...ticket, status:"Fail"});
            this.fromTicket = null;
        },
        closeAddTicket(){
            this.dialogTicket = false;
            this.toTicket = null;
            this.fromTicket = null;
        },
        openAddHarbor(){
            this.dialogHarbor = true;
        },
        addHarbor(){
            this.harbors.push(this.newHarbor);
            if(this.harbors.length==3) this.closeAddHarbor();
            else {
                this.newHarbor = null;
                this.$refs.harborForm.resetValidation();
            }
        },
        deleteHarbor(num){
            this.harbors.splice(num-1,1)
        },
        closeAddHarbor(){
            this.dialogHarbor = false;
            this.newHarbor = null;
            setTimeout(()=>{
                this.$refs.harborForm.resetValidation()
            },50)
        },
        harborHasCity(city){
            console.log(city)
            return this.harbors.includes(city)
        },
        getHarborScore(city){
            let found = this.computedTopSuccessfulCities.find(x => x.city == city)
            let bonus = (this.selectVersion == "Around The World") ? 10 : 0
            if(found) return Math.min(10*found.num,30)+bonus
            else return 0
        },
        openReset(type){
            this.resetType = type;
            this.dialogReset = true;
        },
        resetTypeOf(){
            if(this.resetType == "tickets") this.resetTickets();
            else if(this.resetType == "units") this.resetTrainsAndBoats();
            else if(this.resetType == "harbors") this.resetHarbors();
            this.dialogReset = false;
            this.resetType = "";
        },
        resetTickets(){
            this.routes = []
            this.tours = []
        },
        resetTrainsAndBoats(){
            this.trainsAndBoats = Object.assign({},this.defaultTrainsAndBoats);
            this.exchanges = 0;
        },
        resetHarbors(){
            this.harbors = [];
        },
        updateTrainsAndBoats(event){
            this.trainsAndBoats[event.units]+=event.update;
        },
        toggleToDone(item){
            let id = this.routes.indexOf(item);
            if(id == -1){
                this.tours[this.tours.indexOf(item)].status = "Done"
            } else {
                this.routes[id].status = "Done"
            }
        },
        toggleToFail(item){
            let id = this.routes.indexOf(item);
            if(id == -1){
                this.tours[this.tours.indexOf(item)].status = "Fail"
            } else {
                this.routes[id].status = "Fail"
            }
        },
        toggleToUnordered(item){
            let id = this.tours.indexOf(item);
            if(id > -1) this.tours[id].status = "Unordered"
        }
    },
    mounted(){
        this.tickets = Tickets.World
    }
  }
</script>
