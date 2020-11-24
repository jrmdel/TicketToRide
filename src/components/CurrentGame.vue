<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-toolbar flat color="primary" dark>
                        <v-toolbar-title>Your game</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-icon large>mdi-map-legend</v-icon>
                    </v-toolbar>
                    <v-card-subtitle>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Game version</span>
                                    </v-row>
                                    <v-row justify="center" justify-sm="start">
                                        <v-col cols="auto">
                                            <v-select class="mx-2" solo v-model="selectVersion" hide-details color="secondary" label="Select the game" :items="['Around The World','Great Lakes']"></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Total score</span>
                                    </v-row>
                                    <v-row justify="center" justify-sm="start">
                                        <v-col cols="auto">
                                            <v-chip class="ml-sm-8" x-large color="secondary">
                                                <span class="text-h3">{{parseInt(computedTicketScore+computedHarborsScore+computedTrainsBoatsScore)}}</span>
                                            </v-chip>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Save your game</span>
                                    </v-row>
                                    <v-row align="center" justify="center" justify-sm="start">
                                        <v-col cols="auto">
                                            <v-text-field class="ma-2" solo hide-details label="Game ID" v-model="gameId" placeholder="Enter 20-character ID here"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row align="center" justify="center" justify-sm="start" no-gutters>
                                        <v-col cols="auto">
                                            <v-btn class="ma-2" :disabled="gameId.length!=20" large color="primary" @click="openSaveGame">
                                                <v-icon>mdi-content-save-outline</v-icon>
                                                <span class="ml-3 mr-1">SAVE</span>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="auto">
                                            <v-btn class="ma-2" :disabled="gameId.length!=20" large color="secondary" @click="shareGameId">
                                                <v-icon>mdi-share-variant</v-icon>
                                                <span class="ml-3 mr-1">SHARE THIS ID</span>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-row>
                                        <span class="text-h6 tertiary--text">Reset everything</span>
                                    </v-row>
                                    <v-row justify="center" justify-sm="start">
                                        <v-col cols="auto">
                                            <v-btn x-large class="ml-sm-8" color="accent" @click="openReset('all')">
                                                <v-icon>mdi-restore</v-icon>
                                                <span class="ml-3 mr-1">RESET</span>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-subtitle>
                </v-card>
            </v-col>
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
                                    <v-card outlined flat color="primaryLight">
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
                            <v-row v-if="selectVersion == 'Around The World'">
                                <v-col cols="12">
                                    <v-card outlined flat class="primaryLight">
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
                                                    <v-icon v-if="!(harbors.length<i)" large color="red" @click="deleteHarbor(i)">mdi-close</v-icon>
                                                </v-card-title>
                                                <v-card-text class="my-n3">
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
                                <v-select v-model="fromTicket" solo clearable color="secondary" label="From" :items="computedFromCities"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="toTicket" :disabled="!fromTicket" :messages="(foundTickets.length == 1) ? '1 match found' : (foundTickets.length > 1) ? `${foundTickets.length} matches found` : null " solo clearable color="secondary" label="To" :items="toCities"></v-select>
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
                    <v-btn large :disabled="!harborForm || harbors.includes(newHarbor)" text color="secondary" @click="addHarbor">ADD HARBOR</v-btn>
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

        <v-dialog v-model="dialogSaveGame" max-width="400">
            <v-card>
                <v-toolbar flat color="quaternary" dark>
                    <v-toolbar-title>Player selection</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                                <span class="text-h6 tertiary--text">Choose which player you are</span>
                            </v-col>
                            <v-col cols="auto">
                                <v-select solo v-model="selectedPlayer" :loading="loadingOpenSaveGame" :error-messages="saveGameSelectErrorMessage" color="secondary" label="Select your name" :items="selectPlayer"></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="accent" text @click="closeSaveGame">Cancel</v-btn>
                    <v-btn color="secondary" :disabled="selectedPlayer==null" text @click="saveGame">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { Types } from '../util/types';
import { Tickets } from '../util/tickets';
import TrainBoat from './currentgame/TrainBoat'
import { db } from '../main';

export default {
    components:{
        TrainBoat
    },
    data: () => ({
        dialogTicket: false,
        dialogHarbor: false,
        dialogReset: false,
        dialogSaveGame: false,
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
        selectPlayer: [],
        selectedPlayer: null,
        harbors: [],
        newHarbor: null,
        trainsAndBoats: {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},
        defaultTrainsAndBoats: {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0},
        exchanges: 0,
        resetType: "",
        gameId: "",
        loadingOpenSaveGame: false,
        saveGameSelectErrorMessage: null,
    }),
    props:{
        id: {
            type: String,
        },
        players: {
            type: Array,
            default: ()=>[]
        },
        version: {
            type: String
        }
    },
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
                this.resetTickets();
                this.resetHarbors();
                this.resetTrainsAndBoats();
                if(value){
                    this.tickets = (value=="Around The World") ? Tickets.World : Tickets.GreatLakes
                }
            }
        },
        version:{
            handler(value){
                if(value){
                    this.selectVersion = value
                }
            }
        },
        id:{
            handler(value){
                if(value){
                    this.gameId = value
                }
            }
        },
        gameId:{
            handler(value){
                if(value){
                    localStorage.setItem("id",value);
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
        async openSaveGame(){
            this.dialogSaveGame = true;
            this.loadingOpenSaveGame = true;
            if(this.players.length > 1){
                this.selectPlayer = this.players;
                this.loadingOpenSaveGame = false;
            } else {
                try {
                    // Retrieve document to get the names
                    let doc = await db.collection('Games').doc(this.gameId).get()
                    let game = doc.data();
                    if(game){
                        let num = game.players
                        let names = []
                        for(let i=0;i<num;i++){
                            let s = `player${i+1}`
                            names.push(game[s].name)
                        }
                        console.log(names)
                        this.selectPlayer = names
                    } else {
                        // No game found with this ID
                        this.saveGameSelectErrorMessage = "The ID you entered is not assigned"
                    }
                } catch (error) {
                    this.saveGameSelectErrorMessage = "Oups, something wrong happened. Contact tha website admin."
                    console.error("When computing names from firebase document : "+error);
                } finally {
                    this.loadingOpenSaveGame = false;
                }
            }
        },
        closeSaveGame(){
            this.dialogSaveGame = false;
            this.selectedPlayer = null;
            this.saveGameSelectErrorMessage = null;
        },
        async saveGame(){
            let numPlayer = `player${this.selectPlayer.indexOf(this.selectedPlayer)+1}`
            let routes = this.routes.map(x => {return {id:x.id, status:x.status}})
            let tours = this.tours.map(x =>{ return{id:x.id, status: x.status}})
            let update = {
                name: this.selectedPlayer,
                score: parseInt(this.computedTicketScore+this.computedHarborsScore+this.computedTrainsBoatsScore),
                tickets: routes.concat(tours),
                harbors: this.harbors.map(x => { return {city:x, score:this.getHarborScore(x)}}),
                units: this.trainsAndBoats,
                exchanges: this.exchanges
            }
            try {
                await db.collection('Games').doc(this.gameId).update({[numPlayer]: update})
            } catch (error) {
                console.warn("Oups something went terribly wrong : "+error)
            } finally {
                this.closeSaveGame();
            }
        },
        async shareGameId(){
            this.loadingShare = true;
            let shareData = {
                title: 'Let\'s play!',
                text: this.gameId,
                url: 'https://jrmdel.github.io/TicketToRide',
            }
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.warn("Impossible to share the ID : "+error)
            } finally {
                this.loadingShare = false;
            }
        },
        openAddTicket(){
            this.dialogTicket = true;
        },
        addTicket(){
            let ticket = (this.foundTickets.length == 1) ? this.foundTickets[0] : this.selectedTicket[0]
            if(ticket.type == Types.TOUR){
                this.tours.push({...ticket, status:"Fail"});
                localStorage.setItem("tours",JSON.stringify(this.tours))
            } else {
                this.routes.push({...ticket, status:"Fail"});
                localStorage.setItem("tours",JSON.stringify(this.tours))
            }
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
            localStorage.setItem("harbors",JSON.stringify(this.harbors));
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
            else {
                this.resetTickets();
                this.resetTrainsAndBoats();
                this.resetHarbors();
                this.gameId = "";
                localStorage.removeItem("id");
            }
            this.dialogReset = false;
            this.resetType = "";
        },
        resetTickets(){
            this.routes = []
            this.tours = []
            if(localStorage.getItem("routes")) localStorage.removeItem("routes")
            if(localStorage.getItem("tours")) localStorage.removeItem("tours")
        },
        resetTrainsAndBoats(){
            this.trainsAndBoats = Object.assign({},this.defaultTrainsAndBoats);
            this.exchanges = 0;
            if(localStorage.getItem("units")) localStorage.removeItem("units");
        },
        resetHarbors(){
            this.harbors = [];
            if(localStorage.getItem("harbors")) localStorage.removeItem("harbors")
        },
        updateTrainsAndBoats(event){
            this.trainsAndBoats[event.units]+=event.update;
            localStorage.setItem("units", JSON.stringify(this.trainsAndBoats));
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
        this.tickets = Tickets.World;
        if(localStorage.getItem("id")){
            try {
                this.gameId = localStorage.getItem("id");
            } catch (error) {
                localStorage.removeItem("id");
            }
        }
        if(localStorage.getItem("units")){
            try {
                this.trainsAndBoats = JSON.parse(localStorage.getItem("units"))
            } catch (error) {
                localStorage.removeItem('units');
            }
        }
        if(localStorage.getItem("harbors")){
            try {
                this.harbors = JSON.parse(localStorage.getItem("harbors"))
            } catch (error) {
                localStorage.removeItem('harbors');
            }
        }
        if(localStorage.getItem("routes")){
            try {
                this.routes = JSON.parse(localStorage.getItem("routes"))
            } catch (error) {
                localStorage.removeItem('routes');
            }
        }
        if(localStorage.getItem("tours")){
            try {
                this.tours = JSON.parse(localStorage.getItem("tours"))
            } catch (error) {
                localStorage.removeItem('tours');
            }
        }
    }
  }
</script>
