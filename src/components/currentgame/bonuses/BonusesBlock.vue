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
          @clickRight="openReset('bonuses')"
        />
        <BonusLongest
          v-show="versionHasLongest"
          :longestBonus="longestBonus"
          @updateLongestBonus="updateLongestBonus($event)"
        />
        <BonusGlobeTrotter
          v-show="versionHasGlobeTrotterBonus"
          :globeTrotterBonus="globeTrotterBonus"
          @updateGlobeTrotterBonus="updateGlobeTrotterBonus($event)"
        />
        <BonusMandala
          ref="mandalaBonus"
          :isActive="versionHasMandalaBonus"
          :title="$t('current.bonuses.mandala')"
          @update-bonus="updateMandalaBonus($event)"
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

export default {
  name: 'BonusesBlock',
  components: {
    BonusMandala,
    BonusLongest,
    BonusGlobeTrotter,
    TwoButtons,
    BaseIndicators,
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
    longestBonus: {
      type: Number,
      default: 0,
    },
    globeTrotterBonus: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    reset() {
      this.$refs.mandalaBonus.resetBonus();
    },
    updateLongestBonus(update) {
      const evnt = { value: update };
      this.$emit('updateLongestBonus', evnt.value);
    },
    updateGlobeTrotterBonus(update) {
      const evnt = { value: update };
      this.$emit('updateGlobeTrotterBonus', evnt.value);
    },
    updateMandalaBonus(event) {
      this.$emit('updateMandalaBonus', event);
    },
  },
};
</script>
