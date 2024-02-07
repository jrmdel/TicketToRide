<template>
  <v-container fluid>
    <v-row align="center" align-content="center">
      <v-col>
        <span class="text-h6 tertiary--text">{{ name }}</span>
      </v-col>
      <v-col>
        <v-select
          v-model="stockShareScore"
          solo
          color="secondary"
          chips
          :label="$t('current.stock-shares.select-label')"
          :items="scores"
          clearable
          :hide-details="true"
        ></v-select>
      </v-col>
      <v-col>
        <span class="text-h6 tertiary--text">{{ stockShareScore }}</span>
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
        this.updateStockShareScore(value);
      },
    },
  },
  methods: {
    reset() {
      this.updateStockShareScore(0);
    },
    updateStockShareScore(newScore) {
      const event = { name: this.name, value: newScore };
      this.stockShareScore = newScore ?? 0;
      this.$emit('updateStockShareScore', event);
    },
  },
};
</script>
