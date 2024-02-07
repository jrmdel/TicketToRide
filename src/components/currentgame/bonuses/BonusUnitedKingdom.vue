<template>
  <div v-frag>
    <bonus-item-counter
      ref="doubleHeadingItem"
      :isActive="isActive"
      :title="$t('current.bonuses.uk.double-heading')"
      :minCount="0"
      :maxCount="1"
      logo="mdi-checkbox-marked-circle-plus-outline"
      @value-change="updateDoubleHeadingScore($event)"
    />
    <bonus-item-counter
      ref="riskyContractsItem"
      :isActive="isActive"
      :title="$t('current.bonuses.uk.risky-contracts')"
      :minCount="-1"
      :maxCount="1"
      logo="mdi-invoice-text-plus-outline"
      @value-change="updateRiskyContractsScore($event)"
    />
    <bonus-item-counter
      ref="equalisingBeamItem"
      :isActive="isActive"
      :title="$t('current.bonuses.uk.equalising-beam')"
      :minCount="-1"
      :maxCount="1"
      logo="mdi-transit-connection-variant"
      @value-change="updateEqualisingBeamScore($event)"
    />
    <bonus-item-counter
      ref="boilerLaggingItem"
      :isActive="isActive"
      :title="$t('current.bonuses.uk.boiler-lagging')"
      :minCount="0"
      :maxCount="1"
      :logo="plusOneIcon"
      @value-change="updateBoilerLaggingScore($event)"
    />
    <bonus-item-counter
      ref="steamTurbinesItem"
      :isActive="isActive"
      :title="$t('current.bonuses.uk.steam-turbines')"
      :minCount="0"
      :maxCount="1"
      :logo="plusTwoIcon"
      @value-change="updateSteamTurbinesScore($event)"
    />
  </div>
</template>

<script>
import BonusItemCounter from './ui/BonusItemCounter.vue';
import { PLUS_ONE_ICON, PLUS_TWO_ICON } from '@/assets/icons/icons.js';

export default {
  components: { BonusItemCounter },
  name: 'BonusUnitedKingdom',
  props: {
    isActive: {
      type: Boolean,
      default: false,
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
  watch: {
    completedRoutes: {
      handler(value) {
        if (value == null) {
          return;
        }
        const customEvent = { value: this.doubleHeadingBonus };
        this.updateDoubleHeadingScore(customEvent);
      },
    },
  },
  data: () => ({
    doubleHeadingBonus: 0,
    plusOneIcon: PLUS_ONE_ICON,
    plusTwoIcon: PLUS_TWO_ICON,
  }),
  methods: {
    resetBonus() {
      const bonusesRefs = [
        'doubleHeadingItem',
        'riskyContractsItem',
        'equalisingBeamItem',
      ];
      for (const ref of bonusesRefs) {
        this.$refs[ref].setBonus(0);
      }
    },
    updateDoubleHeadingScore(event) {
      const count = event.value;
      const score = 2 * count * this.completedRoutes;

      this.doubleHeadingBonus = count;
      this.sendEvent({ doubleHeading: { count, score } });
      // this.localStorageService.setLongest(count);
    },
    updateRiskyContractsScore(event) {
      const count = event.value;
      const score = count * 20;

      this.sendEvent({ riskyContracts: { count: Math.abs(count), score } });
    },
    updateEqualisingBeamScore(event) {
      const count = event.value;
      const score = count * 15;

      this.sendEvent({ equalisingBeam: { count: Math.abs(count), score } });
    },
    updateBoilerLaggingScore(event) {
      const count = event.value;
      console.log(count);
    },
    updateSteamTurbinesScore(event) {
      const count = event.value;
      console.log(count);
    },
    sendEvent(content) {
      this.$emit('update-bonus', {
        name: 'uk',
        ...content,
      });
    },
  },
  mounted() {
    // const bonus = this.localStorageService?.getLongest() ?? 0;
    // this.$refs.bonusItem.setBonus(bonus);
  },
};
</script>
