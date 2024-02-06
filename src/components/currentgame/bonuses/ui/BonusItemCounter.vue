<template>
  <v-container fluid v-if="isActive">
    <v-row>
      <v-col cols="12">
        <span class="text-h6 tertiary--text">{{ title }}</span>
      </v-col>
    </v-row>
    <v-row class="ml-sm-4" align="center" justify="center" justify-sm="start">
      <v-btn large icon :disabled="bonus === minCount" @click="updateValue(-1)">
        <v-icon color="red">mdi-minus</v-icon>
      </v-btn>
      <span class="text-h6">{{ bonus }}</span>
      <v-btn large icon :disabled="bonus === maxCount" @click="updateValue(1)">
        <v-icon color="green">mdi-plus</v-icon>
      </v-btn>
      <v-icon class="ml-4">{{ logo }}</v-icon>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BonusItemCounter',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    minCount: {
      type: Number,
      default: 0,
    },
    maxCount: {
      type: Number,
      default: 1,
    },
    logo: {
      type: String,
    },
  },
  data: () => ({
    bonus: 0,
  }),
  watch: {
    bonus: {
      handler(value) {
        this.$emit('value-change', { value });
      },
    },
  },
  methods: {
    updateValue(change) {
      this.bonus += change;
    },
    setBonus(newValue) {
      this.bonus = newValue;
    },
  },
};
</script>
