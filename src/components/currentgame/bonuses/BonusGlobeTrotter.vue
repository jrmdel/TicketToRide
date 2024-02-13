<template>
  <bonus-item-counter
    ref="bonusItem"
    :isActive="isActive"
    :title="$t('current.bonuses.globe-trotter')"
    :minCount="0"
    :maxCount="1"
    logo="mdi-earth-plus"
    @value-change="updateCountScore($event)"
  />
</template>

<script>
import BonusItemCounter from './ui/BonusItemCounter.vue';

export default {
  components: { BonusItemCounter },
  name: 'BonusGlobeTrotter',
  inject: ['localStorageService'],
  props: {
    version: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    isActive: {
      get() {
        return Boolean(this.version?.hasBonusGlobeTrotter);
      },
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
      this.localStorageService.setGlobeTrotter(count);
    },
    computeScore(bonus = 0) {
      const pointsPerBonus = this.version?.bonusGlobeTrotter ?? 0;
      const score = bonus * pointsPerBonus;
      return isNaN(score) ? 0 : score;
    },
    sendEvent(content) {
      this.$emit('update-bonus', {
        name: 'globeTrotter',
        ...content,
      });
    },
  },
  mounted() {
    const bonus = this.localStorageService?.getGlobeTrotter() ?? 0;
    this.$refs.bonusItem.setBonus(bonus);
  },
};
</script>

<style></style>
