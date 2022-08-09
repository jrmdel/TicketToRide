<template>
    <div>
    <v-card color="background">
        <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{ $t('current.cities.title') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon large>mdi-city-variant-outline</v-icon>
        </v-toolbar>
        <v-card-subtitle>
            <Indicators :leftText="$t('current.cities.indicators.left')" :leftIndicator="cities.length"
                :centerCondition="false"
                :rightText="$t('current.cities.indicators.right')" :rightIndicator="computedCityScore" />
        </v-card-subtitle>
        <v-card-text>
            <v-container fluid>
                <TwoButtons
                    :leftDisabledCondition="cities.length>2" leftColor="primary" 
                    leftIcon="mdi-domain-plus" :leftText="$t('main.btn.add-city-marker')" @clickLeft="openAddCity"
                    rightColor="accent" 
                    rightIcon="mdi-restore" :rightText="$t('main.btn.reset')" @clickRight="resetCities"/>
                <v-col cols="12">
                    <v-row>
                        <span class="text-h6 tertiary--text">{{$t('current.cities.subtitle')}}</span>
                    </v-row>
                    <v-row>
                        <v-col v-for="i in 3" :key="i" cols="12" md="4">
                            <v-card outlined :disabled="cities.length<i">
                                <v-card-title>
                                    <span>{{$t('current.cities.card.title', {id:i})}}</span>
                                    <v-spacer></v-spacer>
                                    <v-icon v-if="!(cities.length<i)" large color="red" @click="deleteCity(i)">mdi-close</v-icon>
                                </v-card-title>
                                <v-card-text class="my-n3">
                                    <v-container fluid>
                                        <v-row class="text-body-1" align="center">
                                            <v-col cols="12">
                                                <v-icon :color="(cities.length<i) ? undefined : 'primary'" class="mx-4">mdi-city-variant</v-icon>
                                                <span v-if="cities.length>i-1">{{cities[i-1]}}</span>
                                                <span v-else>{{$t('current.cities.card.no-city')}}</span>
                                            </v-col>
                                        </v-row>
                                        <v-row class="text-body-1" align="center">
                                            <v-col cols="12">
                                                <v-icon :color="(cities.length<i) ? undefined : 'accent'" class="mx-4">mdi-medal-outline</v-icon>
                                                <span v-if="cities.length>i-1">{{getCityScore(cities[i-1])}}</span>
                                                <span v-else>0</span>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-container>
        </v-card-text>
    </v-card>
    <SimpleFieldDialog 
        maxWidth="660" :isActive="dialog" :isLoading="false"
        :items="itemsMock"
        :title="$t('current.dialog.add-city-marker.title')"
        :subtitle="$t('current.dialog.add-city-marker.subtitle')"
        :selectLabel="$t('current.dialog.add-city-marker.label')"
        :errorMessage="$t('current.dialog.add-city-marker.error')"
        :actionLabel="$t('main.btn.add-city-marker')"
        :hasConflict="cityAlreadySelected"
        :validationRule="validationRule"
        @closeDialog="dialog = false"
        @selectedItem="checkValidItem($event)"
        @clickBtn="addItemToList($event)"
    />
    </div>
</template>

<script>
import TwoButtons from "./TwoButtons.vue";
import Indicators from "./Indicators.vue";
import SimpleFieldDialog from "../dialogs/SimpleFieldDialog.vue"

export default {
    components:{
        Indicators,
        TwoButtons,
        SimpleFieldDialog
    },
    data: function() {
        return {
            cities: [],
            dialog: false,
            itemsMock: ["Los Angeles", "Sacramento", "Denver", "Idaho Falls"],
            cityAlreadySelected: false,
            unselectedMessage: this.$i18n.t('current.dialog.add-city-marker.unselected'),
        }
    },
    props: {
        items: {
            type: Array,
            default: () => [],
        },
    },
    watch: {
        currentLocale: {
            handler() {
                this.unselectedMessage = this.$i18n.t('current.dialog.add-city-marker.unselected');
            }
        },
    },
    computed: {
        computedCityScore: {
            get() {
                return 0;
            },
        },
        currentLocale: {
            get() {
                return this.$i18n.locale;
            },
        },
        validationRule: {
            // Doesn't update on change...
            get() {
                return [
                    v => !!v || this.unselectedMessage,
                ];
            },
        },
    },
    methods: {
        resetCities() {
            this.cities = [];
        },
        openAddCity() {
            this.dialog = true;
        },
        closeAddCity() {
            this.dialog = false;
        },
        deleteCity(index) {
            this.cities.splice(index-1, 1);
        },
        checkValidItem(event) {
            if(this.cities.includes(event)) {
                this.cityAlreadySelected = true;
            } else this.cityAlreadySelected = false;
        },
        addItemToList(event) {
            this.cities.push(event);
        },
        getCityScore(city) {
            console.log(city);
            return 1;
        },
        // Useless so far
        updateValue(update) {
            let evnt = { units: this.numberOfUnits, update: update }
            this.$emit("update-value", evnt)
        }
    }
}
</script>
