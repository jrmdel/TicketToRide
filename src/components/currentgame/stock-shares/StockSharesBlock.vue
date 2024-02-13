<template>
  <card-layout logo="mdi-label-percent" title="current.stock-shares.title">
    <template v-slot:header>
      <base-indicators
        :leftText="$t('current.stock-shares.indicators.left')"
        :leftIndicator="nbOfStockShares"
        :centerCondition="false"
        :rightText="$t('current.stock-shares.indicators.right')"
        :rightIndicator="score"
      />
    </template>
    <template v-slot:content>
      <two-buttons
        :leftActive="false"
        rightColor="accent"
        rightIcon="mdi-restore"
        :rightText="$t('main.btn.reset')"
        @clickRight="reset()"
      />
      <stock-share-item
        v-for="(item, index) in stockSharesList"
        ref="stockShare"
        :key="index"
        :name="item.name"
        :scores="item.scores"
        @update-score="updateStockShareScore($event)"
      />
    </template>
  </card-layout>
</template>

<script>
import BaseIndicators from '../BaseIndicators.vue';
import CardLayout from '../CardLayout.vue';
import TwoButtons from '../TwoButtons.vue';
import StockShareItem from './StockShareItem.vue';

export default {
  name: 'StockSharesBlock',
  components: {
    BaseIndicators,
    StockShareItem,
    TwoButtons,
    CardLayout,
  },
  props: {
    version: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    stockSharesList: {
      get() {
        return this.version?.stockSharesList;
      },
    },
    score: {
      get() {
        const totalScore = this.scoresForAllStockShares?.reduce(
          (acc, stock) => acc + stock.score,
          0
        );
        this.$emit('updateStockShareScore', {
          scoresForAllStockShares: this.scoresForAllStockShares,
          totalScore,
        });
        return totalScore;
      },
    },
    nbOfStockShares: {
      get() {
        const earnedStockShares = this.scoresForAllStockShares?.filter(
          (stock) => stock.score > 0
        );
        return earnedStockShares.length;
      },
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
  methods: {
    reset() {
      this.$refs.stockShare?.forEach((ref) => ref.reset());
    },
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
