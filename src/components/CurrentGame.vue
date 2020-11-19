<template>
    <v-container fluid class="pa-12 pa-md-16 ma-md-4">
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat color="quaternary" dark>
                        <v-toolbar-title>Your tickets</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-ticket-confirmation-outline</v-icon>
                    </v-toolbar>
                    <v-card-subtitle>
                        <v-container fluid>
                            <v-row justify="center" justify-sm="space-around">
                                <v-col cols="auto">
                                    <span class="text-caption">nb of tickets</span>
                                    <span class="ml-4 text-h3">{{tickets.length}}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="text-caption">nb completed</span>
                                    <span class="ml-4 text-h3">{{tickets.length}}</span>
                                </v-col>
                                <v-col cols="auto">
                                    <span class="text-caption">current score</span>
                                    <span class="ml-4 text-h3">{{tickets.length}}</span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-container fluid>
                            <v-row>
                                <v-col>
                                    <v-btn @click="openAddTicket">ADD A TICKET</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-card outlined flat color="accent">
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
                    <v-card-text>
                        <v-btn>ADD</v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialogTicket" max-width="600" @click:outside="closeAddTicket">
            <v-card>
                <v-toolbar flat color="quaternary" dark>
                    <v-toolbar-title>New Ticket</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-form v-model="newTicketForm" ref="newTicketForm">
                        <v-container fluid>
                            <v-row align="center">
                                <v-col cols="12">
                                    <span class="text-h6 tertiary--text">Cities</span>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select v-model="fromTicket" :rules="simpleRule" color="secondary" hide-details outlined label="From" :items="computedFromCities"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select v-model="toTicket" :disabled="!fromTicket" :rules="simpleRule" color="secondary" hide-details outlined label="To" :items="computedToCities"></v-select>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn large text color="accent" @click="closeCreate">CLOSE</v-btn>
                    <v-btn large :disabled="!newTicketForm" text color="secondary" @click="addTicket">ADD TICKET</v-btn>
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
            {text:"To", align:"start", value:"cities[1]", sortable: true},
            {text:"Steps", align:"start", value:"cities.length", sortable: true},
            {text:"Points", align:"start", value:"points", sortable: true},
            {text:"Status", align:"start", value:"status", sortable: true},
            {text:"Actions", align:"center", value:"actions", sortable: false},
            {text:"Delete", align:"center", value:"delete", sortable: true},
        ],
        searchTours: "",
        // tours: [],
        tours: [
            {id: 6, cities:["Anchorage","Vancouver","Winnipeg","Cambridge Bay"], points: 15, status: "Unordered"}
        ],
    }),
    methods:{
        deleteItem(item){
            let id = this.routes.indexOf(item);
            this.routes.splice(id,1);
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
            let ticket = this.tickets.filter(item => item.cities.includes(this.fromTicket && this.toTicket))[0];
            if(ticket.type == Types.ROUTE) this.routes.push(ticket);
            else this.tours.push(ticket);
        },
        closeAddTicket(){
            this.dialogTicket = false;
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
        this.tickets = Tickets.world
        console.log(this.tickets)
    }
  }
</script>
