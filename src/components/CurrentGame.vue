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
                            <v-row>
                                <v-col>
                                    <v-btn dark x-large color="primary" @click="openAddTicket">
                                        <v-icon>mdi-card-plus-outline</v-icon>
                                        <span class="ml-3 mr-1">ADD A TICKET</span>
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
                        <v-toolbar-title>Your trains and boats</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-train</v-icon>
                    </v-toolbar>
                    <v-card-subtitle>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col cols="auto">
                                    <span class="text-caption">nb of trains</span>
                                    <span class="ml-4 text-h3">{{routes.length+tours.length}}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="text-caption">nb of boats</span>
                                    <span class="ml-4 text-h3">{{computedCompletion}}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="text-caption">current score</span>
                                    <span class="ml-4 text-h3">{{computedTicketScore}}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Trains</span>
                                </v-col>
                                <v-col>
                                    <span>
                                        <v-icon>mdi-train</v-icon>

                                    </span>
                                </v-col>
                                <v-col>
                                    <span>
                                        <v-icon>mdi-train</v-icon>
                                        <v-icon>mdi-train</v-icon>
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Boats</span>
                                </v-col>
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
                                <v-autocomplete v-model="fromTicket" :rules="simpleRule" placeholder="Type here" clearable color="secondary" hide-details outlined label="From" :items="computedFromCities"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-autocomplete v-model="toTicket" :disabled="!fromTicket" placeholder="Type here" :rules="simpleRule" clearable color="secondary" hide-details outlined label="To" :items="toCities"></v-autocomplete>
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
    </v-container>
</template>

<script>
import { Types } from '../util/types';
import { Tickets } from '../util/tickets';
export default {
    data: () => ({
        dialogTicket: false,
        newTicketForm: false,
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
        // routes: [],
        routes: [
            {id: 1, cities:["Marseille","Christchurch"], points: 23, status:"Fail"},
            {id: 2, cities:["Jakarta","Sydney"], points: 6, status:"Done"},
        ],
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
        // tours: [],
        tours: [
            {id: 6, cities:["Anchorage","Vancouver","Winnipeg","Cambridge Bay"], points:15, points_failed:-19, points_unorderded:9, status: "Unordered"}
        ],
        selectVersion: "Around The World"
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
