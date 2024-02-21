<template>
  <v-card color="background">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ $t('current.units.title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon large>mdi-train</v-icon>
    </v-toolbar>
    <v-card-subtitle>
      <base-indicators
        :leftText="$t('current.units.indicators.left')"
        :leftIndicator="numberOfUnits"
        :centerText="$t('current.units.indicators.center')"
        :centerIndicator="availableUnits"
        :rightText="$t('current.units.indicators.right')"
        :rightIndicator="score"
      />
    </v-card-subtitle>
    <v-card-text>
      <v-container fluid>
        <two-buttons
          :leftActive="false"
          rightColor="accent"
          rightIcon="mdi-restore"
          :rightText="$t('main.btn.reset')"
          @clickRight="openReset()"
        />
        <units-bonus-selector
          ref="bonusSelector"
          @update-bonus-selection="updateActiveBonuses($event)"
        />
        <v-row>
          <v-col cols="12">
            <span class="text-h6 tertiary--text">{{
              $t('current.units.subtitle-1')
            }}</span>
          </v-col>
        </v-row>
        <unit-counter
          v-for="i in possibleUnitsLength"
          :key="i"
          :numberOfUnits="i"
          :currentTotal="units[i]"
          :hasBoats="hasBoats"
          :availableUnits="availableUnits"
          @update-value="updateUnitCount($event)"
        />
        <exchange-section
          :isActive="hasExchanges"
          :exchanges="exchanges"
          @update-value="updateExchanges($event)"
        />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import BaseIndicators from '../BaseIndicators.vue';
import TwoButtons from '../TwoButtons.vue';
import UnitCounter from './UnitCounter.vue';
import { DEFAULT_UNITS } from '@/util/constants/game.constants';
import { sumReducer } from '@/util/tools/tools.js';
import UnitsBonusSelector from './UnitsBonusSelector.vue';
import ExchangeSection from './ExchangeSection.vue';

export default {
  name: 'UnitsBlock',
  components: {
    BaseIndicators,
    UnitCounter,
    TwoButtons,
    UnitsBonusSelector,
    ExchangeSection,
  },
  inject: ['localStorageService', 'bonusService'],
  props: {
    unitRules: {
      type: Object,
      default: () => {},
    },
    availableUnitsOnStart: {
      type: Number,
    },
    threshold: {
      type: Number,
    },
    hasExchanges: {
      type: Boolean,
      default: false,
    },
    hasBoats: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    score: 0,
    numberOfUnits: 0,
    exchanges: 0,
    units: structuredClone(DEFAULT_UNITS),
    activeUnitBonuses: [],
  }),
  computed: {
    availableUnits: {
      get() {
        return this.availableUnitsOnStart - this.numberOfUnits;
      },
    },
    possibleUnitsLength: {
      get() {
        if (!this.unitRules) {
          return [];
        }
        return Object.keys(this.unitRules).map((k) => parseInt(k));
      },
    },
    hasThresholdBeenReached: {
      get() {
        return this.availableUnits <= this.threshold;
      },
    },
  },
  watch: {
    score: {
      handler(value) {
        const event = {
          unit: this.units,
          score: value,
        };
        this.$emit('updateUnitScore', event);
      },
    },
    hasThresholdBeenReached: {
      handler(value) {
        if (value) {
          this.$emit('hasThresholdBeenReached');
        }
      },
    },
    unitRules: {
      handler(value) {
        if (!value) {
          return;
        }
        this.score = Object.keys(this.units)
          .map((unit) => (value[unit] ?? 0) * this.units[unit])
          .reduce(sumReducer, 0);
        this.numberOfUnits = Object.keys(this.units)
          .map((unit) => unit * this.units[unit])
          .reduce(sumReducer, 0);
      },
    },
  },
  methods: {
    openReset() {
      this.resetUnits();
      this.resetBonus();
    },
    resetUnits() {
      this.score = 0;
      this.numberOfUnits = 0;
      this.exchanges = 0;
      this.units = structuredClone(DEFAULT_UNITS);
      this.localStorageService.setUnits(null);
    },
    resetBonus() {
      this.$refs.bonusSelector.reset();
      this.bonusService.resetUnits();
    },
    updateUnitCount({ unit, update }) {
      this.units[unit] += update;
      this.numberOfUnits += parseInt(unit) * parseInt(update);
      this.score += this.unitRules[unit] * update;
      this.localStorageService.setUnits(this.units);

      if (this.activeUnitBonuses?.length) {
        this.sendBonusUpdate(update);
      }
    },
    updateExchanges({ update }) {
      this.exchanges += update;
      this.score -= update;
    },
    updateActiveBonuses(event) {
      this.activeUnitBonuses = event?.value ?? [];
    },
    sendBonusUpdate(update) {
      this.activeUnitBonuses.forEach((name) => {
        this.bonusService.addUnitsWithBonus({
          name,
          update,
        });
      });
    },
    getUnits() {
      return this.units;
    },
    getExchanges() {
      return this.exchanges;
    },
  },
  mounted() {
    const units = this.localStorageService?.getUnits();
    if (units) {
      this.units = Object.assign({}, units);
    }
  },
};
</script>
