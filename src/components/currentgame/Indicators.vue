<template>
    <div>
        <v-container fluid>
            <v-row justify="center" justify-sm="space-around">
                <v-col v-show="leftCondition" class="mx-8 mx-sm-0" cols="auto">
                    <span class="text-caption">{{ leftText }}</span>
                    <span class="ml-4 text-h3">{{ leftIndicator }}</span>
                </v-col>
                <v-col v-show="centerCondition" class="mx-8 mx-sm-0" cols="auto">
                    <span class="text-caption">{{centerText}}</span>
                    <span class="ml-4 text-h3">{{centerIndicator}}</span>
                </v-col>
                <v-col v-show="rightCondition" class="mx-8 mx-sm-0" cols="auto">
                    <span class="text-caption">{{rightText}}</span>
                    <span class="ml-4 text-h3">{{rightIndicator}}</span>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    props:{
        leftText: { type: String, default: "" },
        leftIndicator: { type: Number, default: 0 },
        leftCondition: { type: Boolean, default: true },
        centerText: { type: String, default: "" },
        centerIndicator: { type: Number, default: 0 },
        centerCondition: { type: Boolean, default: true },
        rightText: { type: String, default: "" },
        rightIndicator: { type: Number, default: 0 },
        rightCondition: { type: Boolean, default: true },
    }
}
</script>