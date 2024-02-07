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
        <!--Your tickets-->
        <v-card color="background">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{ $t('current.tickets.title') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon large>mdi-ticket-confirmation-outline</v-icon>
          </v-toolbar>
          <v-card-subtitle>
            <BaseIndicators
              :leftText="$t('current.tickets.indicators.left')"
              :leftIndicator="routes.length"
              :centerText="$t('current.tickets.indicators.center')"
              :centerIndicator="computedCompletion"
              :rightText="$t('current.tickets.indicators.right')"
              :rightIndicator="computedTicketScore"
            />
          </v-card-subtitle>
          <v-card-text>
            <v-container fluid>
              <TwoButtons
                leftColor="primary"
                leftIcon="mdi-card-plus-outline"
                :leftText="$t('main.btn.add-ticket')"
                @clickLeft="openAddTicket"
                rightColor="accent"
                rightIcon="mdi-restore"
                :rightText="$t('main.btn.reset')"
                @clickRight="openReset('tickets')"
              />
              <v-row>
                <v-col cols="12">
                  <v-card outlined flat color="primaryLight">
                    <v-card-title class="text-h4 font-weight-light">
                      <span class="darkenBlack--text">{{
                        $t('current.tickets.routes.title')
                      }}</span>
                      <v-spacer></v-spacer>
                      <v-text-field
                        v-model="searchRoutes"
                        append-icon="mdi-magnify"
                        :label="$t('main.tables.search')"
                        single-line
                        clearable
                        hide-details
                        light
                      ></v-text-field>
                    </v-card-title>
                    <v-data-table
                      class="py-6"
                      :headers="headersRoutes"
                      :items="computedRoutesForHeaders"
                      item-key="id"
                      :search="searchRoutes"
                      multi-sort
                      :footer-props="{ 'items-per-page-options': [-1] }"
                    >
                      <template v-slot:[`item.delete`]="{ item }">
                        <v-icon large @click="deleteItem(item)"
                          >mdi-delete-forever</v-icon
                        >
                      </template>
                      <template v-slot:[`item.actions`]="{ item }">
                        <div v-if="isTour(item.type)">
                          <v-icon
                            class="mx-1"
                            large
                            v-show="item.status != 'Done'"
                            color="green"
                            @click="toggleTo(item, 'Done')"
                            >mdi-check</v-icon
                          >
                          <v-icon
                            class="mx-1"
                            large
                            v-show="item.status != 'Fail'"
                            color="red"
                            @click="toggleTo(item, 'Fail')"
                            >mdi-close</v-icon
                          >
                          <v-icon
                            class="mx-1"
                            large
                            v-show="item.status != 'Unordered'"
                            color="amber"
                            @click="toggleTo(item, 'Unordered')"
                            >mdi-compass-off-outline</v-icon
                          >
                        </div>
                        <div v-else>
                          <v-icon
                            large
                            v-show="item.status != 'Done'"
                            color="green"
                            @click="toggleTo(item, 'Done')"
                            >mdi-check</v-icon
                          >
                          <v-icon
                            large
                            v-show="item.status != 'Fail'"
                            color="red"
                            @click="toggleTo(item, 'Fail')"
                            >mdi-close</v-icon
                          >
                        </div>
                      </template>
                      <template v-slot:[`item.status`]="{ item }">
                        <v-chip :color="getStatusColor(item.status)" dark>{{
                          getStatusText(item.status)
                        }}</v-chip>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-show="computedVersionHasHarbors">
        <!--Your harbors-->
        <v-card color="background">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{ $t('current.harbors.title') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon large>mdi-anchor</v-icon>
          </v-toolbar>
          <v-card-subtitle>
            <BaseIndicators
              :leftText="$t('current.harbors.indicators.left')"
              :leftIndicator="computedTopCities.length"
              :centerText="$t('current.harbors.indicators.center')"
              :centerIndicator="harbors.length"
              :rightText="$t('current.harbors.indicators.right')"
              :rightIndicator="computedHarborsScore"
            />
          </v-card-subtitle>
          <v-card-text>
            <v-container fluid>
              <TwoButtons
                :leftDisabledCondition="harbors.length > 2"
                leftColor="primary"
                leftIcon="mdi-ship-wheel"
                :leftText="$t('main.btn.add-harbor')"
                @clickLeft="openAddHarbor"
                rightColor="accent"
                rightIcon="mdi-restore"
                :rightText="$t('main.btn.reset')"
                @clickRight="openReset('harbors')"
              />
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <span class="text-h6 tertiary--text">{{
                      $t('current.harbors.subtitle')
                    }}</span>
                  </v-row>
                  <v-row>
                    <v-col v-for="i in 3" :key="i" cols="12" md="4">
                      <v-card outlined :disabled="harbors.length < i">
                        <v-card-title>
                          <span>{{
                            $t('current.harbors.card.title', { id: i })
                          }}</span>
                          <v-spacer></v-spacer>
                          <v-icon
                            v-if="!(harbors.length < i)"
                            large
                            color="red"
                            @click="deleteHarbor(i)"
                            >mdi-close</v-icon
                          >
                        </v-card-title>
                        <v-card-text class="my-n3">
                          <v-container fluid>
                            <v-row class="text-body-1" align="center">
                              <v-col cols="12">
                                <v-icon
                                  :color="
                                    harbors.length < i ? undefined : 'primary'
                                  "
                                  class="mx-4"
                                  >mdi-city-variant</v-icon
                                >
                                <span v-if="harbors.length > i - 1">{{
                                  harbors[i - 1]
                                }}</span>
                                <span v-else>{{
                                  $t('current.harbors.card.no-city')
                                }}</span>
                              </v-col>
                            </v-row>
                            <v-row class="text-body-1" align="center">
                              <v-col cols="12">
                                <v-icon
                                  :color="
                                    harbors.length < i ? undefined : 'accent'
                                  "
                                  class="mx-4"
                                  >mdi-medal-outline</v-icon
                                >
                                <span v-if="harbors.length > i - 1">{{
                                  getHarborScore(harbors[i - 1])
                                }}</span>
                                <span v-else>{{
                                  selectVersion
                                    ? selectVersion.pointsPerUnsetHarbor
                                    : 0
                                }}</span>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" md="6">
                  <SimpleTable
                    :data="computedTopCities"
                    :title="$t('current.harbors.tables.potential.title')"
                    :leftColumn="$t('current.harbors.tables.column-1')"
                    :rightColumn="$t('current.harbors.tables.column-2')"
                    :emptyText="$t('current.harbors.tables.potential.no-data')"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <SimpleTable
                    :data="computedTopSuccessfulCities"
                    :title="$t('current.harbors.tables.successful.title')"
                    :leftColumn="$t('current.harbors.tables.column-1')"
                    :rightColumn="$t('current.harbors.tables.column-2')"
                    :emptyText="$t('current.harbors.tables.successful.no-data')"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-show="computedVersionHasTrainStations">
        <!--Your train stations-->
        <v-card color="background">
          <v-toolbar flat color="primary" dark>
            <v-toolbar-title>{{
              $t('current.stations.title')
            }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-icon large>mdi-railroad-light</v-icon>
          </v-toolbar>
          <v-card-subtitle>
            <BaseIndicators
              :leftText="$t('current.stations.indicators.left')"
              :leftIndicator="trainStations"
              :centerCondition="false"
              :rightText="$t('current.stations.indicators.right')"
              :rightIndicator="computedTrainStationsScore"
            />
          </v-card-subtitle>
          <v-card-text>
            <v-container fluid>
              <TwoButtons
                :leftActive="false"
                rightColor="accent"
                rightIcon="mdi-restore"
                :rightText="$t('main.btn.reset')"
                @clickRight="openReset('train stations')"
              />
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <span class="text-h6 tertiary--text">{{
                      $t('current.stations.subtitle')
                    }}</span>
                  </v-row>
                  <v-row>
                    <v-col v-for="i in 3" :key="i" cols="12" md="4">
                      <v-card outlined>
                        <v-card-title>
                          <span>{{
                            $t('current.stations.card.title', { id: i })
                          }}</span>
                          <v-spacer></v-spacer>
                          <v-icon
                            v-if="!(trainStations < i)"
                            large
                            color="red"
                            @click="trainStations--"
                            >mdi-close</v-icon
                          >
                          <v-icon
                            v-else
                            large
                            color="green"
                            @click="trainStations++"
                            >mdi-plus</v-icon
                          >
                        </v-card-title>
                        <v-card-text class="my-n3">
                          <v-container fluid>
                            <v-row class="text-body-1" align="center">
                              <v-col cols="12">
                                <v-icon
                                  :color="
                                    trainStations < i ? undefined : 'accent'
                                  "
                                  class="mx-4"
                                  >mdi-medal-outline</v-icon
                                >
                                <span v-if="trainStations > i - 1">{{
                                  selectVersion
                                    ? selectVersion.trainStationRule
                                    : 0
                                }}</span>
                                <span v-else>{{
                                  selectVersion
                                    ? selectVersion.pointsPerUnsetTrainStation
                                    : 0
                                }}</span>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-show="computedVersionHasBonuses">
        <!--Your bonuses-->
        <BonusesBlock
          ref="bonusesBlock"
          :numberOfBonuses="computedNumberOfBonuses"
          :bonusScore="computedBonusScore"
          :versionHasLongest="computedVersionHasLongest"
          :versionHasGlobeTrotterBonus="computedVersionHasGlobeTrotterBonus"
          :versionHasMandalaBonus="computedVersionHasMandalaBonus"
          :longestBonus="longestBonus"
          :globeTrotterBonus="globeTrotterBonus"
          @updateLongestBonus="updateLongestBonus($event)"
          @updateGlobeTrotterBonus="updateGlobeTrotterBonus($event)"
          @updateMandalaBonus="handleBonusEvent($event)"
        />
      </v-col>
      <v-col cols="12" v-show="computedVersionHasStockShares">
        <!--Your bonuses-->
        <StockSharesBlock
          :stockSharesList="computedVersionStockSharesList"
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

    <v-dialog
      v-model="dialogTicket"
      max-width="660"
      @click:outside="closeAddTicket"
    >
      <v-card color="background">
        <v-toolbar flat color="quaternary" dark>
          <v-toolbar-title>{{
            $t('current.dialog.add-ticket.title')
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeAddTicket">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <span class="text-h6 tertiary--text">{{
                  $t('current.dialog.add-ticket.subtitle')
                }}</span>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="fromTicket"
                  solo
                  clearable
                  color="secondary"
                  :label="$t('current.dialog.add-ticket.label.from')"
                  :items="computedFromCities"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="toTicket"
                  :disabled="!fromTicket"
                  :error-messages="
                    selectedTicket.length == 1
                      ? routes
                          .map((route) => route.id)
                          .includes(selectedTicket[0].id)
                        ? $t('current.dialog.add-ticket.error')
                        : ''
                      : ''
                  "
                  :messages="
                    foundTickets.length == 0
                      ? null
                      : $tc(
                          'current.dialog.add-ticket.message',
                          foundTickets.length
                        )
                  "
                  solo
                  clearable
                  color="secondary"
                  :label="$t('current.dialog.add-ticket.label.to')"
                  :items="toCities"
                >
                </v-select>
              </v-col>
              <v-col cols="12" v-if="foundTickets.length > 1">
                <span>{{
                  $t('current.dialog.add-ticket.selection.title')
                }}</span>
                <v-card flat outlined>
                  <v-data-table
                    v-model="selectedTicket"
                    class="py-6"
                    :headers="headersAddTicket"
                    :items="foundTickets"
                    item-key="id"
                    hide-default-footer
                    single-select
                    show-select
                  >
                    <template v-slot:[`item.to`]="{ item }">
                      {{ item.cities.slice(-1)[0].name }}
                    </template>
                    <template v-slot:[`item.from`]="{ item }">
                      {{ item.cities[0].name }}
                    </template>
                  </v-data-table>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large text color="accent" @click="closeAddTicket">{{
            $t('main.btn.close')
          }}</v-btn>
          <v-btn
            large
            :disabled="
              selectedTicket.length == 0 ||
              routes.map((route) => route.id).includes(selectedTicket[0].id)
            "
            text
            color="secondary"
            @click="addTicket"
            >{{ $t('main.btn.add-ticket') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogHarbor"
      max-width="660"
      @click:outside="closeAddHarbor"
    >
      <v-card color="background">
        <v-toolbar flat color="quaternary" dark>
          <v-toolbar-title>{{
            $t('current.dialog.add-harbor.title')
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeAddHarbor">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form v-model="harborForm" ref="harborForm">
            <v-container fluid>
              <v-row align="center">
                <v-col cols="12">
                  <span class="text-h6 tertiary--text">{{
                    $t('current.dialog.add-harbor.subtitle')
                  }}</span>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="newHarbor"
                    :items="computedAnchorCities"
                    :rules="simpleRule"
                    solo
                    :label="$t('current.dialog.add-harbor.label')"
                    :error-messages="
                      harbors.includes(newHarbor)
                        ? $t('current.dialog.add-harbor.error')
                        : ''
                    "
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn large text color="accent" @click="closeAddHarbor">{{
            $t('main.btn.close')
          }}</v-btn>
          <v-btn
            large
            :disabled="!harborForm || harbors.includes(newHarbor)"
            text
            color="secondary"
            @click="addHarbor"
            >{{ $t('main.btn.add-harbor') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { Types } from '../util/types';
import BaseIndicators from './currentgame/BaseIndicators';
import SimpleTable from './currentgame/SimpleTable';
import TwoButtons from './currentgame/TwoButtons';
import BonusesBlock from './currentgame/bonuses/BonusesBlock.vue';
import StockSharesBlock from './currentgame/stockShares/StockSharesBlock.vue';
import { db } from '../main';
import UnitsBlock from './currentgame/units/UnitsBlock.vue';

export default {
  components: {
    BaseIndicators,
    SimpleTable,
    TwoButtons,
    UnitsBlock,
    BonusesBlock,
    StockSharesBlock,
  },
  name: 'TabCurrentGame',
  data: () => ({
    dialogTicket: false,
    dialogHarbor: false,
    dialogReset: false,
    dialogSaveGame: false,
    newTicketForm: false,
    harborForm: false,
    simpleRule: [(v) => !!v || 'A city is required'],
    fromTicket: null,
    toCities: [],
    toTicket: null,
    foundTickets: [],
    selectedTicket: [],
    //headersAddTicket:,
    tickets: [],
    //headersRoutes:,
    searchRoutes: '',
    routes: [],
    selectVersion: null,
    selectPlayer: [],
    selectedPlayer: null,
    lockSelect: true,
    trainStations: 0,
    longestBonus: 0,
    globeTrotterBonus: 0,
    mandalaBonus: { count: 0, score: 0 },
    stockSharesScore: 0,
    scoresForAllStockShares: [],
    harbors: [],
    newHarbor: null,
    resetType: '',
    gameId: '',
    loadingOpenSaveGame: false,
    saveGameSelectErrorMessage: null,
    loadingSave: false,

    // Units
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
    headersRoutes: {
      get() {
        return [
          {
            text: this.$t('main.tables.headers.from'),
            align: 'start',
            value: 'from',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.to'),
            align: 'start',
            value: 'to',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.points'),
            align: 'start',
            value: 'points',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.status'),
            align: 'start',
            value: 'status',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.actions'),
            align: 'center',
            value: 'actions',
            sortable: false,
          },
          {
            text: this.$t('main.tables.headers.delete'),
            align: 'center',
            value: 'delete',
            sortable: true,
          },
        ];
      },
    },
    headersAddTicket: {
      get() {
        return [
          {
            text: this.$t('main.tables.headers.from'),
            align: 'start',
            value: 'from',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.to'),
            align: 'start',
            value: 'to',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.steps'),
            align: 'start',
            value: 'cities.length',
            sortable: true,
          },
          {
            text: this.$t('main.tables.headers.points'),
            align: 'start',
            value: 'points',
            sortable: true,
          },
        ];
      },
    },
    computedRoutesForHeaders: {
      get() {
        return this.routes.map((route) => {
          return {
            ...route,
            from: route.cities[0].name,
            to: route.cities.slice(-1)[0].name,
          };
        });
      },
    },
    computedFromCities: {
      get() {
        return this.selectVersion
          ? [
              ...new Set(
                this.selectVersion.tickets
                  .map((ticket) => ticket.cities.map((city) => city.name))
                  .flat()
              ),
            ].sort()
          : [];
      },
    },
    computedAnchorCities: {
      get() {
        return this.selectVersion && this.selectVersion.hasHarbors
          ? [
              ...new Set(
                this.selectVersion.tickets
                  .map((ticket) =>
                    ticket.cities
                      .filter((city) => city.anchor)
                      .map((city) => city.name)
                  )
                  .flat()
              ),
            ].sort()
          : [];
      },
    },
    computedCompletion: {
      get() {
        return this.routes.filter((route) => route.status == 'Done').length;
      },
    },
    computedTicketScore: {
      get() {
        function computeScore(item) {
          if (item.type == Types.TOUR) {
            return item.status == 'Fail'
              ? item.points_failed
              : item.status == 'Done'
                ? item.points
                : item.points_unorderded;
          } else {
            return item.status == 'Done' ? item.points : -1 * item.points;
          }
        }
        return this.routes.length > 0
          ? this.routes.map(computeScore).reduce((a, b) => a + b, 0)
          : 0;
      },
    },
    computedTopCities: {
      get() {
        const r = this.routes;
        const counts = {};
        for (let i = 0, l = r.length; i < l; i++) {
          const c = r[i].cities
            .filter((city) => city.anchor)
            .map((city) => city.name);
          for (let j = 0; j < c.length; j++) {
            counts[c[j]] = (counts[c[j]] || 0) + 1;
          }
        }
        return Object.entries(counts)
          .map((x) => {
            return { city: x[0], num: x[1] };
          })
          .sort((a, b) => b.num - a.num);
      },
    },
    computedTopSuccessfulCities: {
      get() {
        const r = this.routes;
        const counts = {};
        for (let i = 0, l = r.length; i < l; i++) {
          if (r[i].status != 'Fail') {
            const c = r[i].cities
              .filter((city) => city.anchor)
              .map((city) => city.name);
            for (let j = 0; j < c.length; j++) {
              counts[c[j]] = (counts[c[j]] || 0) + 1;
            }
          }
        }
        return Object.entries(counts)
          .map((x) => {
            return { city: x[0], num: x[1] };
          })
          .sort((a, b) => b.num - a.num);
      },
    },
    computedHarborsScore: {
      get() {
        if (this.computedVersionHasHarbors) {
          let res = 0;
          for (let i = 0; i < this.harbors.length; i++) {
            const found = this.computedTopSuccessfulCities.find(
              (x) => x.city == this.harbors[i]
            );
            if (found && found.num > 0) {
              res += this.selectVersion.harborRule[Math.min(found.num, 3) - 1];
            }
          }
          return (
            res +
            this.selectVersion.pointsPerUnsetHarbor *
              (this.selectVersion.numberOfHarborsPerPlayer -
                this.harbors.length)
          );
        } else {
          return 0;
        }
      },
    },
    computedTrainStationsScore: {
      get() {
        if (this.computedVersionHasTrainStations) {
          return (
            this.selectVersion.pointsPerUnsetTrainStation *
              (this.selectVersion.numberOfTrainStationsPerPlayer -
                this.trainStations) +
            this.trainStations * this.selectVersion.trainStationRule
          );
        } else {
          return 0;
        }
      },
    },
    computedNumberOfBonuses: {
      get() {
        if (this.computedVersionHasBonuses) {
          return (
            this.longestBonus +
            this.globeTrotterBonus +
            (this.mandalaBonus.count > 0 ? 1 : 0)
          );
        } else {
          return 0;
        }
      },
    },
    computedGlobeTrotterBonus: {
      get() {
        if (this.computedVersionHasGlobeTrotterBonus) {
          return this.selectVersion.bonusGlobeTrotter * this.globeTrotterBonus;
        } else {
          return 0;
        }
      },
    },
    computedLongestBonus: {
      get() {
        if (this.computedVersionHasLongest) {
          return this.selectVersion.longestPoints * this.longestBonus;
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
    computedBonusScore: {
      get() {
        if (this.computedVersionHasBonuses) {
          return (
            this.computedLongestBonus +
            this.computedGlobeTrotterBonus +
            this.computedMandalaBonus
          );
        } else {
          return 0;
        }
      },
    },
    computedTotalScore: {
      get() {
        if (this.selectVersion) {
          return parseInt(
            this.computedTicketScore +
              this.unitScore +
              this.computedHarborsScore +
              this.computedTrainStationsScore +
              this.computedBonusScore +
              this.stockSharesScore
          );
        } else {
          return 0;
        }
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
          this.computedVersionHasGlobeTrotterBonus
        );
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
    computedVersionStockSharesList: {
      get() {
        return this.selectVersion ? this.selectVersion.stockSharesList : null;
      },
    },
  },
  watch: {
    fromTicket: {
      handler(value) {
        this.toCities = [];
        this.toTicket = null;
        if (value) {
          const a = this.selectVersion.tickets
            .filter((ticket) =>
              ticket.cities.map((city) => city.name).includes(value)
            )
            .map((ticket) => ticket.cities.map((city) => city.name))
            .flat()
            .sort();
          this.toCities = [...new Set(a)].filter((city) => city != value);
        }
      },
    },
    toTicket: {
      handler(val) {
        this.foundTickets = [];
        if (val != null) {
          this.foundTickets = this.selectVersion.tickets
            .filter((ticket) =>
              ticket.cities.map((city) => city.name).includes(val)
            )
            .filter((ticket) =>
              ticket.cities.map((city) => city.name).includes(this.fromTicket)
            );
        }
      },
    },
    foundTickets: {
      handler(value) {
        this.selectedTicket = [];
        if (value) {
          if (value.length == 1) {
            this.selectedTicket = value;
          }
        }
      },
    },
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
    longestBonus: {
      handler(value) {
        if (value != null) {
          localStorage.setItem('longestBonus', value);
        }
      },
    },
    globeTrotterBonus: {
      handler(value) {
        if (value != null) {
          localStorage.setItem('globeTrotterBonus', value);
        }
      },
    },
    trainStations: {
      handler(value) {
        if (value != null) {
          localStorage.setItem('trainStations', value);
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
    deleteItem(item) {
      const id = this.routes.findIndex((route) => route.id == item.id);
      if (id < 0) {
        this.notifySnack(this.$t('main.snackbar.error.delete'), 'error');
      } else {
        this.routes.splice(id, 1);
      }
    },
    getStatusColor(status) {
      if (status == 'Fail') {
        return 'red';
      } else if (status == 'Done') {
        return 'green';
      } else {
        return 'amber';
      }
    },
    getStatusText(status) {
      if (status == 'Fail') {
        return this.$t('main.status.fail');
      } else if (status == 'Done') {
        return this.$t('main.status.done');
      } else {
        return this.$t('main.status.unordered');
      }
    },
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
        update['harbors'] = this.harbors.map((x) => {
          return { city: x, score: this.getHarborScore(x) };
        });
      }
      if (this.computedVersionHasExchanges) {
        update['exchanges'] = this.$refs.units.getExchanges();
      }
      if (this.computedVersionHasTrainStations) {
        update['trainStations'] = this.computedTrainStationsScore;
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
    openAddTicket() {
      this.dialogTicket = true;
    },
    isTour(type) {
      return type == Types.TOUR;
    },
    addTicket() {
      const ticket =
        this.foundTickets.length == 1
          ? this.foundTickets[0]
          : this.selectedTicket[0];
      this.routes.push({ ...ticket, status: 'Fail' });
      localStorage.setItem('routes', JSON.stringify(this.routes));
      this.fromTicket = null;
    },
    closeAddTicket() {
      this.dialogTicket = false;
      this.toTicket = null;
      this.fromTicket = null;
    },
    openAddHarbor() {
      this.dialogHarbor = true;
    },
    addHarbor() {
      this.harbors.push(this.newHarbor);
      localStorage.setItem('harbors', JSON.stringify(this.harbors));
      if (this.harbors.length == 3) {
        this.closeAddHarbor();
      } else {
        this.newHarbor = null;
        this.$refs.harborForm.resetValidation();
      }
    },
    deleteHarbor(num) {
      this.harbors.splice(num - 1, 1);
    },
    closeAddHarbor() {
      this.dialogHarbor = false;
      this.newHarbor = null;
      setTimeout(() => {
        this.$refs.harborForm.resetValidation();
      }, 50);
    },
    harborHasCity(city) {
      return this.harbors.includes(city);
    },
    getHarborScore(city) {
      const found = this.computedTopSuccessfulCities.find(
        (x) => x.city == city
      );
      if (found && found.num > 0) {
        return this.selectVersion.harborRule[Math.min(found.num, 3) - 1];
      } else {
        return 0;
      }
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
      this.routes = [];
      if (localStorage.getItem('routes')) {
        localStorage.removeItem('routes');
      }
    },
    resetTrainsAndBoats() {
      this.$refs.units.resetUnits();
    },
    resetHarbors() {
      this.harbors = [];
      if (localStorage.getItem('harbors')) {
        localStorage.removeItem('harbors');
      }
    },
    resetTrainStations() {
      this.trainStations = 0;
      if (localStorage.getItem('trainStations')) {
        localStorage.removeItem('trainStations');
      }
    },
    handleBonusEvent(event) {
      const { name, ...rest } = event;
      if (name == 'mandala') {
        this.mandalaBonus = rest;
      }
    },
    resetBonuses() {
      this.longestBonus = 0;
      this.globeTrotterBonus = 0;
      this.$refs.bonusesBlock.reset();
      if (localStorage.getItem('longestBonus')) {
        localStorage.removeItem('longestBonus');
      }
      if (localStorage.getItem('globeTrotterBonus')) {
        localStorage.removeItem('globeTrotterBonus');
      }
    },
    updateLongestBonus(event) {
      localStorage.setItem('longestBonus', event.value);
      this.longestBonus = event.value;
    },
    updateGlobeTrotterBonus(event) {
      localStorage.setItem('globeTrotterBonus', event.value);
      this.globeTrotterBonus = event.value;
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
    toggleLockSelect() {
      this.lockSelect = !this.lockSelect;
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
      if (localStorage.getItem('longestBonus')) {
        try {
          this.longestBonus = parseInt(localStorage.getItem('longestBonus'));
        } catch (error) {
          localStorage.removeItem('longestBonus');
        }
      }
      if (localStorage.getItem('globeTrotterBonus')) {
        try {
          this.globeTrotterBonus = parseInt(
            localStorage.getItem('globeTrotterBonus')
          );
        } catch (error) {
          localStorage.removeItem('globeTrotterBonus');
        }
      }
      if (localStorage.getItem('trainStations')) {
        try {
          this.trainStations = parseInt(localStorage.getItem('trainStations'));
        } catch (error) {
          localStorage.removeItem('trainStations');
        }
      }
      if (localStorage.getItem('harbors')) {
        try {
          this.harbors = JSON.parse(localStorage.getItem('harbors'));
        } catch (error) {
          localStorage.removeItem('harbors');
        }
      }
      if (localStorage.getItem('routes')) {
        try {
          this.routes = JSON.parse(localStorage.getItem('routes'));
        } catch (error) {
          localStorage.removeItem('routes');
        }
      }
    },
  },
};
</script>
