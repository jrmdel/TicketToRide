<template>
  <v-row
    align="center"
    justify="center"
    justify-sm="start"
    class="ml-sm-4"
    no-gutters
  >
    <v-btn large icon :disabled="currentTotal == 0" @click="updateValue(-1)">
      <v-icon color="red">mdi-minus</v-icon>
    </v-btn>
    <span class="text-h6">{{ currentTotal }}</span>
    <v-btn
      large
      icon
      @click="updateValue(1)"
      :disabled="availableUnits < numberOfUnits"
    >
      <v-icon color="green">mdi-plus</v-icon>
    </v-btn>
    <span class="ml-4 text-h6">{{ numberOfUnits }}x</span>
    <v-icon>mdi-train</v-icon>
    <span v-show="hasBoats" class="text-h6">/</span>
    <v-icon v-show="hasBoats">mdi-ferry</v-icon>
  </v-row>
</template>

<script>
export default {
  props: {
    currentTotal: {
      type: Number,
      default: 0,
    },
    numberOfUnits: {
      type: Number,
      required: true,
    },
    hasBoats: {
      type: Boolean,
    },
    availableUnits: {
      type: Number,
    },
  },
  methods: {
    updateValue(update) {
      const event = { unit: this.numberOfUnits, update: update };
      this.$emit('update-value', event);
    },
  },
};
</script>
