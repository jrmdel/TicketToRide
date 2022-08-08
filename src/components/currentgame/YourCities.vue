<template>
    <v-card color="background">
        <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{ $t('current.cities.title') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon large>mdi-city-variant</v-icon>
        </v-toolbar>
        <v-card-subtitle>
            <Indicators :leftText="$t('current.cities.indicators.left')" :leftIndicator="2"
                :centerCondition="false"
                :rightText="$t('current.cities.indicators.right')" :rightIndicator="3" />
        </v-card-subtitle>
        <v-card-text>
            <v-container fluid>
                <TwoButtons
                    :leftDisabledCondition="cities.length>2" leftColor="primary" leftIcon="mdi-domain-plus" :leftText="$t('main.btn.add-harbor')" @clickLeft="openAddCities"
                    rightColor="accent" rightIcon="mdi-restore" :rightText="$t('main.btn.reset')" @clickRight="resetCities"/>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>

import Indicators from "./Indicators";

export default {
    components:{
        Indicators
    },
    props: {},
    methods: {
        updateValue(update) {
            let evnt = { units: this.numberOfUnits, update: update }
            this.$emit("update-value", evnt)
        }
    }
}
</script>
