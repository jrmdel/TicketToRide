<template>
  <v-card color="background">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ $t('current.stock-shares.title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon large>mdi-label-percent</v-icon>
    </v-toolbar>
    <v-card-subtitle>
      <BaseIndicators
        :leftText="$t('current.stock-shares.indicators.left')"
        :leftIndicator="computedNbOfStockShares"
        :centerCondition="false"
        :rightText="$t('current.stock-shares.indicators.right')"
        :rightIndicator="computedTotalScore"
      />
    </v-card-subtitle>
    <v-card-text>
      <v-container fluid>
        <StockShare
          v-for="(item, index) in stockSharesList"
          :key="index"
          :name="item.name"
          :scores="item.scores"
          @updateStockShareScore="updateStockShareScore($event)"
        />
        <!-- <TwoButtons
          :leftActive="false"
          rightColor="accent"
          rightIcon="mdi-restore"
          :rightText="$t('main.btn.reset')"
          @clickRight="openReset('bonuses')"
        /> -->
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import BaseIndicators from '../BaseIndicators.vue';
import StockShare from './StockShare.vue';

export default {
  name: 'StockSharesBlock',
  components: {
    BaseIndicators,
    StockShare,
  },
  props: {
    stockSharesList: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    stockSharesList: {
      handler(value) {
        if (!value) {
          return;
        } else {
          this.scoresForAllStockShares = value?.map((stock) => {
            return {
              name: stock.name,
              score: 0,
            };
          });
        }
      },
    },
  },
  data: () => ({
    scoresForAllStockShares: [],
  }),
  computed: {
    computedTotalScore: {
      get() {
        let total = 0;
        this.scoresForAllStockShares?.forEach(
          (stock) => (total += stock.score)
        );
        this.$emit('updateStockShareScore', {
          scoresForAllStockShares: this.scoresForAllStockShares,
          totalScore: total,
        });
        return total;
      },
    },
    computedNbOfStockShares: {
      get() {
        const earnedStockShares = this.scoresForAllStockShares?.filter(
          (stock) => stock.score > 0
        );
        return earnedStockShares.length;
      },
    },
  },
  methods: {
    updateStockShareScore(event) {
      this.scoresForAllStockShares = this.scoresForAllStockShares.map((el) => {
        if (el.name === event.name) {
          return { name: el.name, score: event.value };
        } else {
          return el;
        }
      });
    },
  },
};
</script>
