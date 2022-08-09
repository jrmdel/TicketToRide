<template>
    <v-dialog v-model="isActive" :max-width="maxWidth" @click:outside="closeDialog">
        <v-card color="background">
            <v-toolbar flat color="quaternary" dark>
                <v-toolbar-title>{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text>
                <v-form v-model="form" ref="simple-field-form">
                    <v-container fluid>
                        <v-row align="center">
                            <v-col cols="12">
                                <span class="text-h6 tertiary--text">{{ subtitle }}</span>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="selectedItem" :items="items" :rules="validationRule" solo
                                :label="selectLabel" :loading="isLoading"
                                :error-messages="(hasConflict) ? errorMessage : ''"></v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn large text color="accent" @click="closeDialog">{{$t('main.btn.close')}}</v-btn>
                <v-btn large :loading="validationLoading" :disabled="!form || hasConflict" text color="secondary" @click="actOnClick">
                    {{ actionLabel }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        maxWidth: {
            type: String,
            default: "500",
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        items: {
            type: Array,
            default: () => [],
        },
        title: {
            type: String,
            default: "",
        },
        subtitle: {
            type: String,
            default: "",
        },
        selectLabel: {
            type: String,
            default: "",
        },
        validationRule: {
            type: Array,
            default: () => [],
        },
        hasConflict: {
            type: Boolean,
            default: false,
        },
        errorMessage: {
            type: String,
            default: "",
        },
        actionLabel: {
            type: String,
            default: "",
        },
    },
    data: () => ({
        selectedItem: null,
        validationLoading: false,
        form: false,
    }),
    watch: {
        selectedItem: {
            handler(value) {
                this.$emit("selectedItem", value);
            }
        },
    },
    methods: {
        closeDialog() {
            this.$emit("closeDialog");
            setTimeout(()=>{
                this.$refs["simple-field-form"].resetValidation();
            },50);
        },
        actOnClick(){
            this.$emit("clickBtn", this.selectedItem);
            this.selectedItem = null;
        },
    },
}
</script>