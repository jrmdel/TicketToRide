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
            v-for="bonus in bonuses"
            :key="bonus"
            :value="bonus"
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
    bonuses: [],
  }),
  computed: {
    hasActiveUnitsBonuses: {
      get() {
        return this.bonuses?.length > 0;
      },
    },
  },
  watch: {
    bonuses: {
      handler(value) {
        if (value?.length === 0) {
          this.reset();
        }
      },
    },
    selectedBonus: {
      handler(value) {
        this.$emit('update-bonus-selection', { value: value ?? [] });
      },
    },
  },
  methods: {
    reset() {
      this.selectedBonus = [];
    },
  },
  mounted() {
    this.bonusService
      .getBonusesRelatedToUnitsObservable()
      .subscribe((bonuses) => {
        this.bonuses = bonuses ?? [];
      });
  },
};
</script>

<style scoped>
.drop-focus-on-click:focus::before {
  opacity: 0 !important;
}
</style>
