<template>
  <card-layout logo="mdi-railroad-light" title="current.stations.title">
    <template v-slot:header>
      <base-indicators
        :leftText="$t('current.stations.indicators.left')"
        :leftIndicator="trainStations"
        :centerCondition="false"
        :rightText="$t('current.stations.indicators.right')"
        :rightIndicator="score"
      />
    </template>
    <template v-slot:content>
      <two-buttons
        :leftActive="false"
        rightColor="accent"
        rightIcon="mdi-restore"
        :rightText="$t('main.btn.reset')"
        @clickRight="reset()"
      />
      <v-row>
        <v-col cols="12">
          <v-row>
            <span class="text-h6 tertiary--text">
              {{ $t('current.stations.subtitle') }}
            </span>
          </v-row>
          <v-row>
            <v-col v-for="i in numberOfTrainStations" :key="i" cols="12" md="4">
              <train-stations-item
                :isActive="trainStations >= i"
                :index="i"
                :version="version"
                @delete-item="decrementCounter()"
                @add-item="incrementCounter()"
              ></train-stations-item>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </card-layout>
</template>

<script>
import BaseIndicators from '../BaseIndicators.vue';
import CardLayout from '../CardLayout.vue';
import TwoButtons from '../TwoButtons.vue';
import TrainStationsItem from './TrainStationsItem.vue';

export default {
  components: { CardLayout, BaseIndicators, TwoButtons, TrainStationsItem },
  name: 'TrainStationsBlock',
  inject: ['localStorageService'],
  props: {
    version: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    numberOfTrainStations: {
      get() {
        return this.version?.numberOfTrainStationsPerPlayer ?? 0;
      },
    },
    score: {
      get() {
        const stationsRemaining =
          this.numberOfTrainStations - this.trainStations;
        const score =
          this.trainStations * this.version?.trainStationRule +
          stationsRemaining * this.version?.pointsPerUnsetTrainStation;

        return score ?? 0;
      },
    },
  },
  watch: {
    score: {
      immediate: true,
      handler(value) {
        if (value == null) {
          return;
        }
        this.$emit('update-score', { score: value });
      },
    },
    trainStations: {
      handler(value) {
        this.localStorageService.setTrainStations(value);
      },
    },
  },
  data: () => ({
    trainStations: 0,
  }),
  methods: {
    reset() {
      this.trainStations = 0;
    },
    incrementCounter() {
      this.trainStations = Math.min(
        this.trainStations + 1,
        this.numberOfTrainStations
      );
    },
    decrementCounter() {
      this.trainStations = Math.max(this.trainStations - 1, 0);
    },
  },
  mounted() {
    this.trainStations = this.localStorageService.getTrainStations();
  },
};
</script>
