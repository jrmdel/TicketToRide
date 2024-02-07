<template>
  <div v-frag v-if="hasActiveUnitsBonuses">
    <v-row>
      <v-col cols="12">
        <span class="text-h6 tertiary--text">
          {{ $t('current.units.subtitle-optional') }}
        </span>
        <v-chip-group
          v-model="selectedBonus"
          multiple
          active-class="success success--text"
        >
          <v-chip
            class="drop-focus-on-click"
            v-for="bonus in availableBonuses"
            :key="bonus"
            outlined
            filter
          >
            {{ $t(`current.units.bonuses.${bonus}`) }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'UnitsBonusSelector',
  inject: ['bonusService'],
  data: () => ({
    selectedBonus: [],
    availableBonuses: ['plus-one', 'plus-two'],
  }),
  computed: {
    hasActiveUnitsBonuses: {
      get() {
        return true;
      },
    },
  },
  watch: {
    bonuses: {
      handler(value) {
        if (!value || value?.length === 0) {
          this.selectedBonus = [];
          return;
        }
        this.updateSelectedBonusIndexes();
      },
    },
  },
  methods: {
    updateSelectedBonusIndexes() {},
  },
  mounted() {
    // this.bonusService
  },
};
</script>

<style scoped>
.drop-focus-on-click:focus::before {
  opacity: 0 !important;
}
</style>
