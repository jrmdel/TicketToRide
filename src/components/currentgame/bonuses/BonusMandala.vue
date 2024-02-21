<template>
  <bonus-item-counter
    ref="bonusItem"
    :isActive="isActive"
    :title="$t('current.bonuses.mandala')"
    :minCount="0"
    :maxCount="56"
    logo="mdi-vector-circle"
    @value-change="updateCountScore($event)"
  />
</template>

<script>
import BonusItemCounter from './ui/BonusItemCounter.vue';

export default {
  components: { BonusItemCounter },
  name: 'BonusMandala',
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
        return Boolean(this.version?.hasBonusMandala);
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
      this.localStorageService.setMandala(count);
    },
    computeScore(bonus) {
      let score = 0;
      switch (bonus) {
        case 0:
          score = 0;
          break;
        case 1:
          score = 5;
          break;
        case 2:
          score = 10;
          break;
        case 3:
          score = 20;
          break;
        case 4:
          score = 30;
          break;
        default:
          score = 40;
          break;
      }
      return score;
    },
    sendEvent(content) {
      this.$emit('update-bonus', {
        name: 'mandala',
        ...content,
      });
    },
  },
  mounted() {
    const bonus = this.localStorageService?.getMandala() ?? 0;
    this.$refs.bonusItem.setBonus(bonus);
  },
};
</script>
