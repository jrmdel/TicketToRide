<template>
  <div v-frag>
    <card-layout
      logo="mdi-ticket-confirmation-outline"
      title="current.tickets.title"
    >
      <template v-slot:header>
        <base-indicators
          :leftText="$t('current.tickets.indicators.left')"
          :leftIndicator="routes.length"
          :centerText="$t('current.tickets.indicators.center')"
          :centerIndicator="completionCount"
          :rightText="$t('current.tickets.indicators.right')"
          :rightIndicator="score"
        />
      </template>
      <template v-slot:content>
        <two-buttons
          leftColor="primary"
          leftIcon="mdi-card-plus-outline"
          :leftText="$t('main.btn.add-ticket')"
          @clickLeft="openDialog()"
          rightColor="accent"
          rightIcon="mdi-restore"
          :rightText="$t('main.btn.reset')"
          @clickRight="reset()"
        />
        <v-row>
          <v-col cols="12">
            <v-card outlined flat color="primaryLight">
              <v-card-title class="text-h4 font-weight-light">
                <span class="darkenBlack--text">
                  {{ $t('current.tickets.routes.title') }}
                </span>
              </v-card-title>
              <v-data-table
                class="py-6"
                :headers="tableHeaders"
                :items="routesAsTableItems"
                item-key="id"
                multi-sort
                :footer-props="{ 'items-per-page-options': [-1] }"
              >
                <template v-slot:[`item.delete`]="{ item }">
                  <v-icon large @click="deleteItem(item)">
                    mdi-delete-forever
                  </v-icon>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-icon
                    class="mx-1"
                    large
                    v-show="item.status != 'Done'"
                    color="green"
                    @click="changeItemStatus(item, 'Done')"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="isTour(item)"
                    class="mx-1"
                    large
                    v-show="item.status != 'Unordered'"
                    color="amber"
                    @click="changeItemStatus(item, 'Unordered')"
                  >
                    mdi-compass-off-outline
                  </v-icon>
                  <v-icon
                    class="mx-1"
                    large
                    v-show="item.status != 'Fail'"
                    color="red"
                    @click="changeItemStatus(item, 'Fail')"
                  >
                    mdi-close
                  </v-icon>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip :color="getStatusColor(item.status)" dark>
                    {{ getStatusText(item.status) }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </card-layout>

    <ticket-dialog
      :isActive="isDialogOpen"
      :routes="routes"
      :version="version"
      @close-dialog="closeDialog()"
      @add-item="addItem($event)"
    />
  </div>
</template>

<script>
import BaseIndicators from '../BaseIndicators.vue';
import CardLayout from '../CardLayout.vue';
import TwoButtons from '../TwoButtons.vue';
import { isTour, sumReducer } from '@/util/tools/tools.js';
import TicketDialog from './TicketDialog.vue';

const coefficientRouteMapper = {
  Fail: -1,
  Done: 1,
};
const keyTourMapper = {
  Fail: 'points_failed',
  Done: 'points',
  Unordered: 'points_unordered',
};

export default {
  components: { CardLayout, BaseIndicators, TwoButtons, TicketDialog },
  name: 'TicketsBlock',
  inject: ['localStorageService'],
  props: {
    version: {
      type: Object,
      default: () => {},
    },
    completionCount: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    score: {
      get() {
        return this.routes?.map(this.computeScore).reduce(sumReducer, 0);
      },
    },
    tableHeaders: {
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
    routesAsTableItems: {
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
  },
  watch: {
    routes: {
      deep: true,
      handler(value) {
        if (!value) {
          return;
        }
        this.localStorageService.setRoutes(value);
        this.$emit('update-routes', { routes: value, score: this.score });
      },
    },
  },
  data: () => ({
    isDialogOpen: false,
    routes: [],
  }),
  methods: {
    reset() {
      this.routes = [];
    },
    computeScore(ticket) {
      if (!this.isTour(ticket)) {
        return ticket.points * coefficientRouteMapper[ticket.status];
      }
      const pointsKey = keyTourMapper[ticket.status];
      return ticket[pointsKey];
    },
    addItem({ value }) {
      this.routes.push({ ...value, status: 'Fail' });
    },
    deleteItem(item) {
      const id = this.routes.findIndex((route) => route.id == item.id);
      if (id < 0) {
        this.showErrorMessage(this.$t('main.snackbar.error.delete'));
        return;
      }
      this.routes.splice(id, 1);
    },
    openDialog() {
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    changeItemStatus(item, status) {
      const id = this.routes.findIndex((route) => route.id == item.id);
      if (id < 0) {
        this.showErrorMessage(this.$t('main.snackbar.error.toggle-status'));
        return;
      }
      this.routes[id].status = status;
    },
    getStatusColor(status) {
      const colorMapper = {
        Fail: 'red',
        Done: 'green',
      };
      return colorMapper[status] ?? 'amber';
    },
    getStatusText(status) {
      const mapper = {
        Fail: 'main.status.fail',
        Done: 'main.status.done',
        Unordered: 'main.status.unordered',
      };
      return this.$t(mapper[status]) ?? '';
    },
    showErrorMessage(message) {
      this.$emit('show-alert', {
        message,
        level: 'error',
      });
    },
    isTour,
  },
  mounted() {
    this.routes = [...this.localStorageService.getRoutes()];
  },
};
</script>
