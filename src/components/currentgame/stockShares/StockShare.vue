<template>
  <v-container fluid>
    <v-divider class="divider" />
    <v-row class="stock-row">
      <v-col>
        <h2>{{ name }}</h2></v-col
      >
      <v-col>
        <v-select
          solo
          color="secondary"
          chips
          label="Score obtenu"
          :items="scores"
          clearable
          @change="updateStockShareScore($event)"
        ></v-select
      ></v-col>
      <v-col>
        <h3>{{ stockShareScore }}</h3></v-col
      >
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
  methods: {
    updateStockShareScore(newScore) {
      const evnt = { name: this.name, value: newScore };
      this.stockShareScore = newScore ?? 0;
      this.$emit('updateStockShareScore', evnt);
    },
  },
};
</script>

<style scoped>
.divider {
  margin-bottom: 2rem;
}
.stock-row {
  align-items: center;
  align-content: center;
}
</style>
