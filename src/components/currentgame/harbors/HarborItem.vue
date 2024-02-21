<template>
  <v-card outlined :disabled="!isActive">
    <v-card-title>
      <span>{{ $t('current.harbors.card.title', { id: index }) }}</span>
      <v-spacer></v-spacer>
      <v-icon v-if="isActive" large color="red" @click="deleteHarbor()">
        mdi-close
      </v-icon>
    </v-card-title>
    <v-card-text class="my-n3">
      <v-container fluid>
        <v-row class="text-body-1" align="center">
          <v-col cols="12">
            <v-icon :color="isActive ? 'primary' : undefined" class="mx-4">
              mdi-city-variant
            </v-icon>
            <span v-if="isActive">{{ city }}</span>
            <span v-else>{{ $t('current.harbors.card.no-city') }}</span>
          </v-col>
        </v-row>
        <v-row class="text-body-1" align="center">
          <v-col cols="12">
            <v-icon :color="isActive ? 'accent' : undefined" class="mx-4">
              mdi-medal-outline
            </v-icon>
            <span>{{ score }}</span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HarborItem',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    version: {
      type: Object,
      default: () => {},
    },
    topSuccessfulCities: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 0,
    },
    city: {
      type: String,
      default: '',
    },
  },
  computed: {
    score: {
      get() {
        if (!this.isActive) {
          return this.version?.pointsPerUnsetHarbor ?? 0;
        }
        return this.computeScoreFromSuccessfulCities();
      },
    },
  },
  watch: {
    score: {
      immediate: true,
      handler(value, oldScore) {
        if (value == null) {
          return;
        }
        this.$emit('update-item-score', {
          index: this.index,
          update: value - (oldScore ?? 0),
        });
      },
    },
  },
  data: () => ({}),
  methods: {
    getItemScore() {
      if (!this.isActive) {
        return null;
      }
      return { city: this.city, score: this.score };
    },
    computeScoreFromSuccessfulCities() {
      const successfulTicketsForCityCount =
        this.topSuccessfulCities.find((x) => x.city == this.city)?.count ?? 0;
      return (
        this.version?.harborRule?.[
          Math.min(successfulTicketsForCityCount, 3) - 1
        ] ?? 0
      );
    },
    deleteHarbor() {
      this.$emit('delete-item', { index: this.index });
    },
  },
};
</script>
