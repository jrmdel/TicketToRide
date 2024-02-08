<template>
  <v-card color="background">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ $t('current.bonuses.title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon large>mdi-trophy-award</v-icon>
    </v-toolbar>
    <v-card-subtitle>
      <BaseIndicators
        :leftText="$t('current.bonuses.indicators.left')"
        :leftIndicator="numberOfBonuses"
        :centerCondition="false"
        :rightText="$t('current.bonuses.indicators.right')"
        :rightIndicator="bonusScore"
      />
    </v-card-subtitle>
    <v-card-text>
      <v-container fluid>
        <TwoButtons
          :leftActive="false"
          rightColor="accent"
          rightIcon="mdi-restore"
          :rightText="$t('main.btn.reset')"
          @clickRight="reset()"
        />
        <BonusLongest
          ref="longestBonus"
          :isActive="versionHasLongest"
          :version="version"
          @update-bonus="updateLongestBonus($event)"
        />
        <BonusGlobeTrotter
          ref="globeTrotterBonus"
          :isActive="versionHasGlobeTrotterBonus"
          :version="version"
          @update-bonus="updateGlobeTrotterBonus($event)"
        />
        <BonusMandala
          ref="mandalaBonus"
          :isActive="versionHasMandalaBonus"
          @update-bonus="updateMandalaBonus($event)"
        />
        <bonus-united-kingdom
          ref="unitedKingdomBonus"
          :isActive="hasUnitedKingdomBonus"
          :version="version"
          :completedRoutes="completedRoutes"
          @update-bonus="updateUnitedKingdomBonus($event)"
        />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import BonusMandala from './BonusMandala.vue';
import TwoButtons from '../TwoButtons.vue';
import BaseIndicators from '../BaseIndicators.vue';
import BonusLongest from './BonusLongest.vue';
import BonusGlobeTrotter from './BonusGlobeTrotter.vue';
import BonusUnitedKingdom from './BonusUnitedKingdom.vue';

export default {
  name: 'BonusesBlock',
  components: {
    BonusMandala,
    BonusLongest,
    BonusGlobeTrotter,
    TwoButtons,
    BaseIndicators,
    BonusUnitedKingdom,
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
    versionHasLongest: {
      type: Boolean,
      default: false,
    },
    versionHasGlobeTrotterBonus: {
      type: Boolean,
      default: false,
    },
    versionHasMandalaBonus: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasUnitedKingdomBonus: {
      get() {
        return Boolean(this.version?.hasUnitedKingdomBonus);
      },
    },
  },
  methods: {
    reset() {
      this.$refs.mandalaBonus.resetBonus();
      this.$refs.longestBonus.resetBonus();
      this.$refs.globeTrotterBonus.resetBonus();
      this.$refs.unitedKingdomBonus.resetBonus();
    },
    updateLongestBonus(event) {
      this.$emit('updateLongestBonus', event);
    },
    updateGlobeTrotterBonus(event) {
      this.$emit('updateGlobeTrotterBonus', event);
    },
    updateMandalaBonus(event) {
      this.$emit('updateMandalaBonus', event);
    },
    updateUnitedKingdomBonus(event) {
      this.$emit('updateUnitedKingdomBonus', event);
    },
  },
};
</script>
