<template>
  <card-layout logo="mdi-trophy-award" title="current.bonuses.title">
    <template v-slot:header>
      <base-indicators
        :leftText="$t('current.bonuses.indicators.left')"
        :leftIndicator="numberOfBonuses"
        :centerCondition="false"
        :rightText="$t('current.bonuses.indicators.right')"
        :rightIndicator="bonusScore"
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
      <bonus-longest
        ref="longestBonus"
        :version="version"
        @update-bonus="updateBonus($event)"
      />
      <bonus-globe-trotter
        ref="globeTrotterBonus"
        :version="version"
        @update-bonus="updateBonus($event)"
      />
      <bonus-mandala
        ref="mandalaBonus"
        :version="version"
        @update-bonus="updateBonus($event)"
      />
      <bonus-united-kingdom
        ref="unitedKingdomBonus"
        :version="version"
        :completedRoutes="completedRoutes"
        @update-bonus="updateBonus($event)"
      />
    </template>
  </card-layout>
</template>

<script>
import BonusMandala from './BonusMandala.vue';
import TwoButtons from '../TwoButtons.vue';
import BaseIndicators from '../BaseIndicators.vue';
import BonusLongest from './BonusLongest.vue';
import BonusGlobeTrotter from './BonusGlobeTrotter.vue';
import BonusUnitedKingdom from './BonusUnitedKingdom.vue';
import CardLayout from '../CardLayout.vue';

export default {
  name: 'BonusesBlock',
  components: {
    BonusMandala,
    BonusLongest,
    BonusGlobeTrotter,
    TwoButtons,
    BaseIndicators,
    BonusUnitedKingdom,
    CardLayout,
  },
  props: {
    numberOfBonuses: {
      type: Number,
      default: 0,
    },
    bonusScore: {
      type: Number,
      default: 0,
    },
    version: {
      type: Object,
      default: () => {},
    },
    completedRoutes: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    reset() {
      this.$refs.mandalaBonus.resetBonus();
      this.$refs.longestBonus.resetBonus();
      this.$refs.globeTrotterBonus.resetBonus();
      this.$refs.unitedKingdomBonus.resetBonus();
    },
    updateBonus(event) {
      this.$emit('update-bonus', event);
    },
  },
};
</script>
