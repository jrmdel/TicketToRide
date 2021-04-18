<template>
    <div>
        <v-row justify="center" :justify-sm="(leftActive) ? 'space-between' : 'end'">
            <v-col cols="auto" v-if="leftActive">
                <v-btn x-large :disabled="leftDisabledCondition" :color="leftColor" @click="notify('clickLeft')">
                    <v-icon>{{ leftIcon }}</v-icon>
                    <span class="ml-3 mr-1">{{ leftText }}</span>
                </v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn x-large :color="rightColor" @click="notify('clickRight')">
                    <v-icon>{{ rightIcon }}</v-icon>
                    <span class="ml-3 mr-1">{{ rightText }}</span>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props:{
        leftIcon: { type: String, default: "" },
        leftText: { type: String, default: "" },
        leftColor: { type: String, default: "primary" },
        leftDisabledCondition: { type: Boolean, default: false },
        leftActive: { type: Boolean, default: true },
        rightIcon: { type: String, default: "" },
        rightText: { type: String, default: "" },
        rightColor: { type: String, default: "primary" }
    },
    methods:{
        notify(event){
            this.$emit(event);
        }
    }
}
</script>
