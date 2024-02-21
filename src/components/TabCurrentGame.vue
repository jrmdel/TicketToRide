<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <!--Your Game-->
        <v-card color="background">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{ $t('current.game.title') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon large>mdi-map-legend</v-icon>
          </v-toolbar>
          <v-card-subtitle>
            <v-container fluid>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-row>
                    <span class="text-h6 tertiary--text">{{
                      $t('current.game.version')
                    }}</span>
                  </v-row>
                  <v-row justify="center" justify-sm="start">
                    <v-col cols="auto">
                      <v-select
                        class="mx-2"
                        solo
                        v-model="selectVersion"
                        hide-details
                        color="secondary"
                        :label="$t('current.game.version-label')"
                        :items="gamesAndRules"
                        item-text="name"
                        return-object
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-row>
                    <span class="text-h6 tertiary--text">{{
                      $t('current.game.score')
                    }}</span>
                  </v-row>
                  <v-row justify="center" justify-sm="start">
                    <v-col cols="auto">
                      <v-chip class="ml-sm-8" x-large color="secondary">
                        <span class="text-h3">{{ computedTotalScore }}</span>
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-row>
                    <span class="text-h6 tertiary--text">{{
                      $t('current.game.save')
                    }}</span>
                  </v-row>
                  <v-row align="center" justify="center" justify-sm="start">
                    <v-col cols="auto">
                      <v-text-field
                        class="ma-2"
                        solo
                        hide-details
                        :label="$t('current.game.save-label')"
                        v-model="gameId"
                        :placeholder="$t('current.game.save-placeholder')"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row
                    align="center"
                    justify="center"
                    justify-sm="start"
                    no-gutters
                  >
                    <v-col cols="auto">
                      <v-btn
                        class="ma-2"
                        :disabled="gameId.length != 20"
                        large
                        color="primary"
                        @click="openSaveGame"
                      >
                        <v-icon>mdi-content-save-outline</v-icon>
                        <span class="ml-3 mr-1">{{ $t('main.btn.save') }}</span>
                      </v-btn>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        class="ma-2"
                        :disabled="gameId.length != 20"
                        large
                        color="secondary"
                        @click="shareGameId"
                      >
                        <v-icon>mdi-share-variant</v-icon>
                        <span class="ml-3 mr-1">{{
                          $t('main.btn.share')
                        }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-row>
                    <span class="text-h6 tertiary--text">{{
                      $t('current.game.reset')
                    }}</span>
                  </v-row>
                  <v-row justify="center" justify-sm="start">
                    <v-col cols="auto">
                      <v-btn
                        x-large
                        class="ml-sm-8"
                        color="accent"
                        @click="openReset('all')"
                      >
                        <v-icon>mdi-restore</v-icon>
                        <span class="ml-3 mr-1">{{
                          $t('main.btn.reset')
                        }}</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" v-show="selectVersion != null">
        <!-- Your tickets -->
        <tickets-block
          ref="tickets"
          :version="selectVersion"
          :completionCount="computedCompletion"
          @update-routes="updateRoutes($event)"
        />
      </v-col>
      <v-col cols="12" v-show="computedVersionHasHarbors">
        <!-- Your harbors -->
        <harbors-block
          ref="harbors"
          :routes="routes"
          :version="selectVersion"
          @update-score="updateHarborScore($event)"
        />
      </v-col>
      <v-col cols="12" v-show="computedVersionHasTrainStations">
        <!-- Your train stations -->
        <train-stations-block
          ref="trainStations"
          :version="selectVersion"
          @update-score="updateTrainStationScore($event)"
        ></train-stations-block>
      </v-col>
      <v-col cols="12" v-show="computedVersionHasBonuses">
        <!--Your bonuses-->
        <bonuses-block
          ref="bonusesBlock"
          :numberOfBonuses="computedNumberOfBonuses"
          :bonusScore="computedBonusScore"
          :version="selectVersion"
          :completedRoutes="computedCompletion"
          @update-bonus="handleBonusEvent($event)"
        />
      </v-col>
      <v-col cols="12" v-show="computedVersionHasStockShares">
        <!--Your stock shares-->
        <stock-shares-block
          :version="selectVersion"
          @updateStockShareScore="updateStockShareScore($event)"
        />
      </v-col>
      <v-col cols="12" v-show="selectVersion != null">
        <!--Your units-->
        <units-block
          ref="units"
          :unitRules="selectVersion?.pointsPerRoute"
          :hasBoats="computedVersionHasBoats"
          :hasExchanges="computedVersionHasExchanges"
          :availableUnitsOnStart="selectVersion?.units"
          :threshold="selectVersion?.threshold"
          @hasThresholdBeenReached="showThresholdWarning()"
          @updateUnitScore="updateUnitScore($event)"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="dialogReset" max-width="400">
      <v-card color="background">
        <v-card-title
          ><span class="text-h5">{{
            getResetTitle(resetType)
          }}</span></v-card-title
        >

        <v-card-text>
          {{ $t('current.dialog.reset.subtitle') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialogReset = false">{{
            $t('main.btn.cancel')
          }}</v-btn>
          <v-btn color="secondary" text @click="resetTypeOf()">{{
            $t('main.btn.proceed')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSaveGame" max-width="500">
      <v-card color="background">
        <v-toolbar flat color="quaternary" dark>
          <v-toolbar-title>{{
            $t('current.dialog.save.title')
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeSaveGame">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <span class="text-h6 tertiary--text">{{
                  $t('current.dialog.save.subtitle')
                }}</span>
              </v-col>
              <v-col cols="auto">
                <v-select
                  solo
                  v-model="selectedPlayer"
                  :loading="loadingOpenSaveGame"
                  :error-messages="saveGameSelectErrorMessage"
                  color="secondary"
                  :label="$t('current.dialog.save.label')"
                  :items="selectPlayer"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="closeSaveGame">{{
            $t('main.btn.cancel')
          }}</v-btn>
          <v-btn
            color="secondary"
            :loading="loadingSave"
            :disabled="selectedPlayer == null"
            text
            @click="saveGame"
            >{{ $t('main.btn.save') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import HarborsBlock from './currentgame/harbors/HarborsBlock.vue';
import BonusesBlock from './currentgame/bonuses/BonusesBlock.vue';
import StockSharesBlock from './currentgame/stock-shares/StockSharesBlock.vue';
import { db } from '../main';
import UnitsBlock from './currentgame/units/UnitsBlock.vue';
import { DEFAULT_UK_BONUS } from '@/util/constants/game.constants.js';
import TrainStationsBlock from './currentgame/train-stations/TrainStationsBlock.vue';
import TicketsBlock from './currentgame/tickets/TicketsBlock.vue';

export default {
  components: {
    UnitsBlock,
    BonusesBlock,
    StockSharesBlock,
    HarborsBlock,
    TrainStationsBlock,
    TicketsBlock,
  },
  name: 'TabCurrentGame',
  data: () => ({
    dialogReset: false,
    dialogSaveGame: false,
    selectVersion: null,
    selectPlayer: [],
    selectedPlayer: null,
    resetType: '',
    gameId: '',
    loadingOpenSaveGame: false,
    saveGameSelectErrorMessage: null,
    loadingSave: false,

    routes: [],
    routesScore: 0,
    harborScore: 0,
    trainStationsScore: 0,
    longestBonus: 0,
    globeTrotterBonus: 0,
    mandalaBonus: { count: 0, score: 0 },
    unitedKingdomBonus: structuredClone(DEFAULT_UK_BONUS),
    stockSharesScore: 0,
    scoresForAllStockShares: [],
    units: {},
    unitScore: 0,
  }),
  props: {
    id: {
      type: String,
    },
    players: {
      type: Array,
      default: () => [],
    },
    version: {
      type: Object,
      default: () => {},
    },
    gamesAndRules: {
      type: Array,
      default: () => [],
    },
    appLoaded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    computedCompletion: {
      get() {
        return this.routes.filter((route) => route.status !== 'Fail').length;
      },
    },
    computedNumberOfBonuses: {
      get() {
        if (!this.computedVersionHasBonuses) {
          return 0;
        }
        const ukBonuses = Object.values(this.unitedKingdomBonus ?? {}).map(
          (bonus) => bonus.count
        );
        const bonuses = [
          this.longestBonus,
          this.globeTrotterBonus,
          this.mandalaBonus.count,
          ...ukBonuses,
        ];
        return bonuses.reduce((acc, val) => {
          if (val !== 0) {
            acc++;
          }
          return acc;
        }, 0);
      },
    },
    computedGlobeTrotterBonus: {
      get() {
        if (this.computedVersionHasGlobeTrotterBonus) {
          return this.globeTrotterBonus;
        } else {
          return 0;
        }
      },
    },
    computedLongestBonus: {
      get() {
        if (this.computedVersionHasLongest) {
          return this.longestBonus;
        } else {
          return 0;
        }
      },
    },
    computedMandalaBonus: {
      get() {
        if (this.computedVersionHasMandalaBonus) {
          return this.mandalaBonus.score;
        } else {
          return 0;
        }
      },
    },
    computedUnitedKingdomBonus: {
      get() {
        if (this.computedVersionHasUnitedKingdomBonus) {
          const scores = Object.values(this.unitedKingdomBonus ?? {}).map(
            (value) => value.score
          );
          return scores.reduce((acc, val) => acc + val, 0);
        }
        return 0;
      },
    },
    computedBonusScore: {
      get() {
        if (this.computedVersionHasBonuses) {
          return (
            this.computedLongestBonus +
            this.computedGlobeTrotterBonus +
            this.computedMandalaBonus +
            this.computedUnitedKingdomBonus
          );
        } else {
          return 0;
        }
      },
    },
    computedTotalScore: {
      get() {
        if (!this.selectVersion) {
          return 0;
        }
        return parseInt(
          this.routesScore +
            this.unitScore +
            this.harborScore +
            this.trainStationsScore +
            this.computedBonusScore +
            this.stockSharesScore
        );
      },
    },
    computedVersionHasHarbors: {
      get() {
        return this.selectVersion ? this.selectVersion.hasHarbors : false;
      },
    },
    computedVersionHasTrainStations: {
      get() {
        return this.selectVersion ? this.selectVersion.hasTrainStations : false;
      },
    },
    computedVersionHasBoats: {
      get() {
        return this.selectVersion ? this.selectVersion.hasBoats : false;
      },
    },
    computedVersionHasExchanges: {
      get() {
        return this.selectVersion ? this.selectVersion.hasExchanges : false;
      },
    },
    computedVersionHasBonuses: {
      get() {
        return (
          this.computedVersionHasLongest ||
          this.computedVersionHasGlobeTrotterBonus ||
          this.computedVersionHasUnitedKingdomBonus
        );
      },
    },
    computedVersionHasUnitedKingdomBonus: {
      get() {
        return this.selectVersion
          ? this.selectVersion.hasUnitedKingdomBonus
          : false;
      },
    },
    computedVersionHasLongest: {
      get() {
        return this.selectVersion ? this.selectVersion.hasLongest : false;
      },
    },
    computedVersionHasGlobeTrotterBonus: {
      get() {
        return this.selectVersion
          ? this.selectVersion.hasBonusGlobeTrotter
          : false;
      },
    },
    computedVersionHasMandalaBonus: {
      get() {
        return this.selectVersion ? this.selectVersion.hasBonusMandala : false;
      },
    },
    computedVersionHasStockShares: {
      get() {
        return this.selectVersion ? this.selectVersion.hasStockShares : false;
      },
    },
  },
  watch: {
    selectVersion: {
      handler(value) {
        if (value && value.name) {
          localStorage.setItem('version', value.name);
        }
      },
    },
    version: {
      handler(value) {
        if (Object.keys(value).length > 0) {
          this.selectVersion = value;
        }
      },
    },
    id: {
      handler(value) {
        if (value) {
          this.gameId = value;
        }
      },
    },
    gameId: {
      handler(value) {
        if (value) {
          localStorage.setItem('id', value);
        }
      },
    },
    appLoaded: {
      immediate: true,
      handler(value) {
        if (value) {
          this.initialiseFromLocalStorage();
        }
      },
    },
  },
  methods: {
    async openSaveGame() {
      this.dialogSaveGame = true;
      this.loadingOpenSaveGame = true;
      if (this.players.length > 1) {
        this.selectPlayer = this.players;
        this.loadingOpenSaveGame = false;
      } else {
        try {
          // Retrieve document to get the names
          const doc = await db.collection('Games').doc(this.gameId).get();
          const game = doc.data();
          if (game) {
            const num = game.players;
            const names = [];
            for (let i = 0; i < num; i++) {
              const s = `player${i + 1}`;
              names.push(game[s].name);
            }
            this.selectPlayer = names;
          } else {
            // No game found with this ID
            this.saveGameSelectErrorMessage = this.$t(
              'current.dialog.save.error.id'
            );
          }
        } catch (error) {
          this.saveGameSelectErrorMessage = this.$t(
            'current.dialog.save.error.unexpected'
          );
          console.error(
            'When computing names from firebase document : ' + error
          );
          this.notifySnack(this.$t('main.snackbar.error.open-save'), 'error');
        } finally {
          this.loadingOpenSaveGame = false;
        }
      }
    },
    closeSaveGame() {
      this.dialogSaveGame = false;
      this.selectedPlayer = null;
      this.saveGameSelectErrorMessage = null;
    },
    async saveGame() {
      this.loadingSave = true;
      const numPlayer = `player${this.selectPlayer.indexOf(this.selectedPlayer) + 1}`;
      const routes = this.routes.map((x) => {
        return { id: x.id, status: x.status };
      });
      const units = this.$refs.units.getUnits();
      const update = {
        name: this.selectedPlayer,
        score: this.computedTotalScore,
        tickets: routes,
        units,
      };
      if (this.computedVersionHasHarbors) {
        update['harbors'] = this.$refs.harbors.getScoreByCity();
      }
      if (this.computedVersionHasExchanges) {
        update['exchanges'] = this.$refs.units.getExchanges();
      }
      if (this.computedVersionHasTrainStations) {
        update['trainStations'] = this.trainStationsScore;
      }
      if (this.computedVersionHasLongest) {
        update['longestBonus'] = this.computedLongestBonus;
      }
      if (this.computedVersionHasGlobeTrotterBonus) {
        update['globeTrotterBonus'] = this.computedGlobeTrotterBonus;
      }
      if (this.computedVersionHasMandalaBonus) {
        update['mandalaBonus'] = this.mandalaBonus;
      }
      if (this.computedVersionHasStockShares) {
        update['stockShares'] = {
          score: this.stockSharesScore,
          items: this.scoresForAllStockShares,
        };
      }
      if (this.computedVersionHasUnitedKingdomBonus) {
        update['unitedKingdomBonus'] = this.unitedKingdomBonus;
      }
      try {
        await db
          .collection('Games')
          .doc(this.gameId)
          .update({ [numPlayer]: update });
        this.notifySnack(this.$t('main.snackbar.success.save'), 'success');
      } catch (error) {
        console.warn('Oups something went terribly wrong : ' + error);
        this.notifySnack(this.$t('main.snackbar.error.save'), 'error');
      } finally {
        this.closeSaveGame();
        this.loadingSave = false;
      }
    },
    async shareGameId() {
      this.loadingShare = true;
      let isError = false;
      const shareData = {
        title: "Let's play!",
        text: this.gameId,
        url: 'https://jrmdel.github.io/TicketToRide',
      };
      try {
        await navigator.share(shareData);
      } catch (error) {
        isError = true;
        console.warn('Impossible to share the ID : ' + error);
      } finally {
        isError
          ? this.notifySnack(this.$t('main.snackbar.error.share'), 'error')
          : this.notifySnack(this.$t('main.snackbar.success.share'), 'success');
        this.loadingShare = false;
      }
    },
    updateRoutes({ routes, score }) {
      this.routes = [...routes];
      this.routesScore = score;
    },
    updateTrainStationScore({ score }) {
      this.trainStationsScore = score;
    },
    updateHarborScore({ score }) {
      this.harborScore = score;
    },
    updateStockShareScore(event) {
      this.scoresForAllStockShares = event.scoresForAllStockShares;
      this.stockSharesScore = event.totalScore;
    },
    openReset(type) {
      this.resetType = type;
      this.dialogReset = true;
    },
    getResetTitle(resetType) {
      if (resetType == 'tickets') {
        return this.$t('current.dialog.reset.types.tickets');
      } else if (resetType == 'units') {
        return this.$t('current.dialog.reset.types.units');
      } else if (resetType == 'harbors') {
        return this.$t('current.dialog.reset.types.harbors');
      } else if (resetType == 'train stations') {
        return this.$t('current.dialog.reset.types.stations');
      } else if (resetType == 'bonuses') {
        return this.$t('current.dialog.reset.types.bonuses');
      } else {
        return this.$t('current.dialog.reset.types.all');
      }
    },
    resetTypeOf() {
      if (this.resetType == 'tickets') {
        this.resetTickets();
      } else if (this.resetType == 'units') {
        this.resetTrainsAndBoats();
      } else if (this.resetType == 'harbors') {
        this.resetHarbors();
      } else if (this.resetType == 'train stations') {
        this.resetTrainStations();
      } else if (this.resetType == 'bonuses') {
        this.resetBonuses();
      } else {
        this.resetAll();
        this.$emit('resetGameSession');
      }
      this.dialogReset = false;
      this.resetType = '';
    },
    resetTickets() {
      this.$refs.tickets.reset();
    },
    resetTrainsAndBoats() {
      this.$refs.units.resetUnits();
    },
    resetHarbors() {
      this.$refs.harbors.reset();
    },
    resetTrainStations() {
      this.$refs.trainStations.reset();
    },
    handleBonusEvent(event) {
      const { name, ...rest } = event;
      if (name == 'mandala') {
        this.mandalaBonus = rest;
      } else if (name === 'longest') {
        this.longestBonus = event.score;
      } else if (name === 'globeTrotter') {
        this.globeTrotterBonus = event.score;
      } else if (name === 'uk') {
        this.unitedKingdomBonus = { ...this.unitedKingdomBonus, ...rest };
      }
    },
    resetBonuses() {
      this.$refs.bonusesBlock.reset();
    },
    toggleTo(item, status) {
      const id = this.routes.findIndex((route) => route.id == item.id);
      if (id == -1) {
        this.notifySnack(this.$t('main.snackbar.error.toggle-status'), 'error');
      } else {
        this.routes[id].status = status;
        localStorage.setItem('routes', JSON.stringify(this.routes));
      }
    },
    notifySnack(msg, color) {
      this.$emit('popUp', { msg, color });
    },
    getRoutes() {
      return this.routes;
    },
    findVersion(version) {
      const myEvent = { version: version };
      this.$emit('findVersion', myEvent);
    },
    showThresholdWarning() {
      const message = this.$t('main.snackbar.warning.last-units', {
        n: this.selectVersion.threshold,
      });
      this.notifySnack(message, 'warning');
    },
    updateUnitScore({ unit, score }) {
      this.unitScore = score;
      this.units = unit;
    },
    resetAll() {
      this.resetTickets();
      this.resetTrainsAndBoats();
      this.resetHarbors();
      this.resetTrainStations();
      this.resetBonuses();
      this.gameId = '';
      this.selectVersion = null;
      localStorage.removeItem('version');
      localStorage.removeItem('id');
    },
    initialiseFromLocalStorage() {
      if (localStorage.getItem('version')) {
        try {
          this.findVersion(localStorage.getItem('version'));
        } catch (error) {
          localStorage.removeItem('version');
        }
      } else {
        this.selectVersion = null;
      }
      if (localStorage.getItem('id')) {
        try {
          this.gameId = localStorage.getItem('id');
        } catch (error) {
          localStorage.removeItem('id');
        }
      }
    },
  },
};
</script>
