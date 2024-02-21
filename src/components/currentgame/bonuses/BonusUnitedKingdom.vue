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
      @value-change="updateBoilerLaggingBonus($event)"
    />
    <bonus-item-counter
      ref="steamTurbinesItem"
      :isActive="isActive"
      :title="$t('current.bonuses.uk.steam-turbines')"
      :minCount="0"
      :maxCount="1"
      :logo="plusTwoIcon"
      @value-change="updateSteamTurbinesBonus($event)"
    />
  </div>
</template>

<script>
import BonusItemCounter from './ui/BonusItemCounter.vue';
import { PLUS_ONE_ICON, PLUS_TWO_ICON } from '@/assets/icons/icons.js';
import { ENUM_UNIT_BONUS } from '@/util/constants/game.constants';

export default {
  components: { BonusItemCounter },
  name: 'BonusUnitedKingdom',
  inject: ['bonusService'],
  props: {
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
  computed: {
    activeUnitBonuses: {
      get() {
        const result = [];
        if (this.boilerLaggingBonus) {
          result.push(ENUM_UNIT_BONUS.PLUS_ONE);
        }
        if (this.steamTurbinesBonus) {
          result.push(ENUM_UNIT_BONUS.PLUS_TWO);
        }
        return result;
      },
    },
    isActive: {
      get() {
        return Boolean(this.version?.hasUnitedKingdomBonus);
      },
    },
  },
  data: () => ({
    doubleHeadingBonus: 0,
    plusOneIcon: PLUS_ONE_ICON,
    plusTwoIcon: PLUS_TWO_ICON,
    steamTurbinesBonus: 0,
    steamTurbinesScore: 0,
    boilerLaggingBonus: 0,
    boilerLaggingScore: 0,
  }),
  methods: {
    resetBonus() {
      Object.values(this.$refs).forEach((bonusRef) => bonusRef.setBonus(0));
      this.bonusService.resetBonuses();
    },
    resetUnitBonusScore() {
      this.steamTurbinesScore = 0;
      this.boilerLaggingScore = 0;
      this.sendEvent({
        steamTurbines: {
          count: this.steamTurbinesBonus,
          score: 0,
        },
        boilerLagging: {
          count: this.boilerLaggingBonus,
          score: 0,
        },
      });
    },
    updateDoubleHeadingScore(event) {
      const count = event.value;
      const score = 2 * count * this.completedRoutes;

      this.doubleHeadingBonus = count;
      this.sendEvent({ doubleHeading: { count, score } });
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
    updateBoilerLaggingBonus(event) {
      const count = event.value;
      this.boilerLaggingBonus = count;
      if (count === 0) {
        this.boilerLaggingScore = 0;
      }
      this.sendEvent({
        boilerLagging: { count, score: this.boilerLaggingScore },
      });
      this.broadcastActiveUnitBonuses();
    },
    updateBoilerLaggingScore(update) {
      if (!update) {
        return;
      }
      this.boilerLaggingScore += update;
      this.sendEvent({
        boilerLagging: {
          count: this.boilerLaggingBonus,
          score: this.boilerLaggingScore,
        },
      });
    },
    updateSteamTurbinesBonus(event) {
      const count = event.value;
      this.steamTurbinesBonus = count;
      if (count === 0) {
        this.steamTurbinesScore = 0;
      }
      this.sendEvent({
        steamTurbines: { count, score: this.steamTurbinesScore },
      });
      this.broadcastActiveUnitBonuses();
    },
    updateSteamTurbinesScore(update) {
      if (!update) {
        return;
      }
      this.steamTurbinesScore += 2 * update;
      this.sendEvent({
        steamTurbines: {
          count: this.steamTurbinesBonus,
          score: this.steamTurbinesScore,
        },
      });
    },
    sendEvent(content) {
      this.$emit('update-bonus', {
        name: 'uk',
        ...content,
      });
    },
    broadcastActiveUnitBonuses() {
      this.bonusService.setBonusesRelatedToUnits(this.activeUnitBonuses);
    },
  },
  mounted() {
    this.bonusService.getUnitsWithBonusObservable().subscribe((bonus) => {
      if (bonus?.name === ENUM_UNIT_BONUS.PLUS_ONE) {
        this.updateBoilerLaggingScore(bonus?.update);
        return;
      }
      if (bonus?.name === ENUM_UNIT_BONUS.PLUS_TWO) {
        this.updateSteamTurbinesScore(bonus?.update);
        return;
      }
      this.resetUnitBonusScore();
    });
  },
};
</script>
