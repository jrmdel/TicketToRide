<template>
  <bonus-item-counter
    ref="bonusItem"
    :isActive="isActive"
    :title="$t('current.bonuses.longest-path')"
    :minCount="0"
    :maxCount="1"
    logo="mdi-transit-connection-variant"
    @value-change="updateCountScore($event)"
  />
</template>

<script>
import BonusItemCounter from './ui/BonusItemCounter.vue';
export default {
  components: { BonusItemCounter },
  name: 'BonusLongest',
  inject: ['localStorageService'],
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Object,
    },
  },
  methods: {
    resetBonus() {
      this.$refs.bonusItem.setBonus(0);
    },
    updateCountScore(event) {
      const count = event.value;
      const score = this.computeScore(count);

      this.sendEvent({ count, score });
      this.localStorageService.setLongest(count);
    },
    computeScore(bonus = 0) {
      const pointsPerBonus = this.version?.longestPoints ?? 0;
      const score = bonus * pointsPerBonus;
      return isNaN(score) ? 0 : score;
    },
    sendEvent(content) {
      this.$emit('update-bonus', {
        name: 'longest',
        ...content,
      });
    },
  },
  mounted() {
    const bonus = this.localStorageService?.getLongest() ?? 0;
    this.$refs.bonusItem.setBonus(bonus);
  },
};
</script>
