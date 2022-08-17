<template>
    <div v-if="isActive">
        <v-row>
            <v-col cols="12">
                <span class="text-h6 tertiary--text">{{ title }}</span>
            </v-col>
        </v-row>
        <v-row class="ml-sm-4" align="center" justify="center" justify-sm="start">
            <v-btn large icon :disabled="bonus==0" @click="bonus-=1">
                <v-icon color="red">mdi-minus</v-icon>
            </v-btn>
            <span class="text-h6">{{ bonus }}</span>
            <v-btn large icon :disabled="bonus==56" @click="bonus+=1">
                <v-icon color="green">mdi-plus</v-icon>
            </v-btn>
            <v-icon class="ml-4">{{ logo }}</v-icon>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
        logo: {
            type: String,
            default: "mdi-vector-circle",
        },
        title: {
            type: String,
            default: "",
        },
    },
    data: () => ({
        bonus: 0,
    }),
    watch: {
        bonus: {
            handler(value) {
                this.sendEvent(value);
                if (value != null) localStorage.setItem("mandalaBonus", value);
            },
        }
    },
    computed: {
        computeScore: {
            get() {
                let score = 0;
                switch (this.bonus) {
                    case 0:
                        score = 0;
                        break;
                    case 1:
                        score = 5;
                        break;
                    case 2:
                        score = 10;
                        break;
                    case 3:
                        score = 20;
                        break;
                    case 4:
                        score = 30;
                        break;
                    default:
                        score = 40;
                        break;
                }
                return score;
            },
        },
    },
    methods: {
        resetBonus() {
            this.bonus = 0;
            if(localStorage.getItem("mandalaBonus")) localStorage.removeItem("mandalaBonus");
        },
        sendEvent(value) {
            this.$emit("update-bonus", { name: "mandala", count: value, score: this.computeScore });
        },
        getValueFromLocalStorage() {
            if(localStorage.getItem("mandalaBonus")){
                try {
                    this.bonus = parseInt(localStorage.getItem("mandalaBonus"));
                } catch (error) {
                    localStorage.removeItem("mandalaBonus");
                }
            }
        },
    },
    mounted() {
        this.getValueFromLocalStorage();
    },
}
</script>