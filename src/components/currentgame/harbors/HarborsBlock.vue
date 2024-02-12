<template>
  <div v-frag>
    <card-layout logo="mdi-anchor" title="current.harbors.title">
      <template v-slot:header>
        <base-indicators
          :leftText="$t('current.harbors.indicators.left')"
          :leftIndicator="topCities.length"
          :centerText="$t('current.harbors.indicators.center')"
          :centerIndicator="harbors.length"
          :rightText="$t('current.harbors.indicators.right')"
          :rightIndicator="totalScore"
        />
      </template>
      <template v-slot:content>
        <two-buttons
          :leftDisabledCondition="isHarborListFull"
          leftColor="primary"
          leftIcon="mdi-ship-wheel"
          :leftText="$t('main.btn.add-harbor')"
          @clickLeft="openDialog()"
          rightColor="accent"
          rightIcon="mdi-restore"
          :rightText="$t('main.btn.reset')"
          @clickRight="reset()"
        />
        <v-row>
          <v-col cols="12">
            <span class="text-h6 tertiary--text">{{
              $t('current.harbors.subtitle')
            }}</span>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col v-for="i in 3" :key="i" cols="12" md="4">
                <harbor-item
                  ref="harborItems"
                  :isActive="harbors.length >= i"
                  :index="i"
                  :version="version"
                  :topSuccessfulCities="topSuccessfulCities"
                  :city="harbors[i - 1]"
                  @update-item-score="updateHarborScore($event)"
                  @delete-item="deleteHarbor($event)"
                ></harbor-item>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6">
            <simple-table
              :data="topCities"
              :title="$t('current.harbors.tables.potential.title')"
              :leftColumn="$t('current.harbors.tables.column-1')"
              :rightColumn="$t('current.harbors.tables.column-2')"
              :emptyText="$t('current.harbors.tables.potential.no-data')"
            />
          </v-col>
          <v-col cols="12" md="6">
            <simple-table
              :data="topSuccessfulCities"
              :title="$t('current.harbors.tables.successful.title')"
              :leftColumn="$t('current.harbors.tables.column-1')"
              :rightColumn="$t('current.harbors.tables.column-2')"
              :emptyText="$t('current.harbors.tables.successful.no-data')"
            />
          </v-col>
        </v-row>
      </template>
    </card-layout>

    <harbor-dialog
      :isActive="isDialogOpen"
      :cities="allCitiesWithHarbor"
      :harbors="harbors"
      @close-dialog="closeDialog()"
      @add-item="addHarbor($event)"
    ></harbor-dialog>
  </div>
</template>

<script>
import BaseIndicators from '../BaseIndicators.vue';
import CardLayout from '../CardLayout.vue';
import SimpleTable from '../SimpleTable.vue';
import TwoButtons from '../TwoButtons.vue';
import HarborDialog from './HarborDialog.vue';
import HarborItem from './HarborItem.vue';

export default {
  name: 'HarborsBlock',
  inject: ['localStorageService'],
  components: {
    CardLayout,
    BaseIndicators,
    HarborDialog,
    HarborItem,
    TwoButtons,
    SimpleTable,
  },
  props: {
    version: {
      type: Object,
      default: () => {},
    },
    routes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    successfulRoutes: {
      get() {
        return this.routes?.filter((route) => route.status !== 'Fail') ?? [];
      },
    },
    topCities: {
      get() {
        const citiesWithHarbor = this.extractCitiesWithHarbors(
          this.routes ?? []
        );
        return this.convertToOrderedListWithCount(citiesWithHarbor);
      },
    },
    topSuccessfulCities: {
      get() {
        const citiesWithHarbor = this.extractCitiesWithHarbors(
          this.successfulRoutes
        );
        return this.convertToOrderedListWithCount(citiesWithHarbor);
      },
    },
    allCitiesWithHarbor: {
      get() {
        if (!this.version) {
          return [];
        }
        const nonUniqueCitiesWithHarbor = this.version.tickets
          .map((ticket) =>
            ticket.cities.filter((city) => city.anchor).map((city) => city.name)
          )
          .flat();
        return [...new Set(nonUniqueCitiesWithHarbor)].sort();
      },
    },
    isHarborListFull: {
      get() {
        return Boolean(this.harbors?.length > 2);
      },
    },
    isDialogOpen: {
      get() {
        return this.isDialogActive && !this.isHarborListFull;
      },
    },
  },
  watch: {
    harbors: {
      handler(value) {
        if (!value) {
          return;
        }
        this.localStorageService.setHarbors(value);
      },
    },
    totalScore: {
      handler(value) {
        if (value == null) {
          return;
        }
        this.$emit('update-score', { score: value });
      },
    },
  },
  data: () => ({
    isDialogActive: false,
    harbors: [],
    totalScore: 0,
  }),
  methods: {
    reset() {
      this.harbors = [];
    },
    getScoreByCity() {
      return (
        this.$refs.harborItems
          ?.map((ref) => ref.getItemScore())
          ?.filter((score) => score) ?? []
      );
    },
    openDialog() {
      this.isDialogActive = true;
    },
    closeDialog() {
      this.isDialogActive = false;
    },
    updateHarborScore({ update }) {
      this.totalScore += update;
    },
    addHarbor({ city }) {
      this.harbors.push(city);
    },
    deleteHarbor({ index }) {
      this.harbors.splice(index - 1, 1);
    },
    extractCitiesWithHarbors(routes) {
      return (
        routes
          .map((route) => route.cities)
          .flat()
          .filter((city) => city.anchor)
          .map((city) => city.name) ?? []
      );
    },
    convertToOrderedListWithCount(cities) {
      const cityCounts = cities?.reduce((acc, city) => {
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(cityCounts)
        .map((city) => ({ city, count: cityCounts[city] }))
        .sort((a, b) => b.count - a.count);
    },
  },
  mounted() {
    this.harbors = this.localStorageService.getHarbors();
  },
};
</script>
