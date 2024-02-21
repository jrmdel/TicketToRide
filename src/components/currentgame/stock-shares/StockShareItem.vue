<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12">
        <span class="text-subtitle-1 tertiary--text">{{ name }}</span>
      </v-col>
      <v-col>
        <v-chip-group
          v-model="stockShareScore"
          active-class="success success--text"
        >
          <v-chip
            class="drop-focus-on-click"
            v-for="score in scores"
            :key="score"
            :value="score"
            outlined
            filter
          >
            {{ score }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'StockShare',
  props: {
    name: {
      type: String,
      default: '',
    },
    scores: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    stockShareScore: 0,
  }),
  watch: {
    stockShareScore: {
      handler(value) {
        this.updateScore(value);
      },
    },
  },
  methods: {
    reset() {
      this.updateScore(0);
    },
    updateScore(newScore) {
      const event = { name: this.name, value: newScore };
      this.stockShareScore = newScore ?? 0;
      this.$emit('update-score', event);
    },
  },
};
</script>

<style scoped>
.drop-focus-on-click:focus::before {
  opacity: 0 !important;
}
</style>
