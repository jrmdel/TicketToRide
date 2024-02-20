<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog v-model="isActive" max-width="660" @click:outside="closeDialog()">
    <v-card color="background">
      <v-toolbar flat color="quaternary" dark>
        <v-toolbar-title>
          {{ $t('current.dialog.add-ticket.title') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container fluid>
          <v-row align="center">
            <v-col cols="12">
              <span class="text-h6 tertiary--text">
                {{ $t('current.dialog.add-ticket.subtitle') }}
              </span>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="cityFrom"
                solo
                clearable
                color="secondary"
                :label="$t('current.dialog.add-ticket.label.from')"
                :items="cities"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="cityTo"
                :disabled="!cityFrom"
                :error-messages="duplicateTicketErrorMessage"
                :messages="foundTicketsCountMessage"
                solo
                clearable
                color="secondary"
                :label="$t('current.dialog.add-ticket.label.to')"
                :items="citiesMatchingWithOrigin"
              >
              </v-select>
            </v-col>
            <v-col cols="12" v-if="foundTickets.length > 1">
              <span>{{ $t('current.dialog.add-ticket.selection.title') }}</span>
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
        <v-btn large text color="accent" @click="closeDialog()">{{
          $t('main.btn.close')
        }}</v-btn>
        <v-btn
          large
          :disabled="isAddButtonDisabled"
          text
          color="secondary"
          @click="addTicket()"
          >{{ $t('main.btn.add-ticket') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TicketDialog',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
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
    tickets: {
      get() {
        return this.version?.tickets ?? [];
      },
    },
    routesId: {
      get() {
        return (this.routes ?? []).map((route) => route.id);
      },
    },
    cities: {
      get() {
        const cityNames = this.tickets
          .filter((ticket) => !this.routesId.includes(ticket.id))
          .map((ticket) => ticket.cities.map((city) => city.name))
          .flat();
        return [...new Set(cityNames)].sort();
      },
    },
    citiesMatchingWithOrigin: {
      get() {
        if (!this.possibleTickets) {
          return [];
        }
        const cityNames = this.possibleTickets
          .map((ticket) => ticket.cities.map((city) => city.name))
          .flat();
        return [...new Set(cityNames)]
          .filter((city) => city !== this.cityFrom)
          .sort();
      },
    },
    possibleTickets: {
      get() {
        if (!this.cityFrom) {
          return [];
        }
        return (this.version?.tickets ?? []).filter((ticket) => {
          const hasCity = ticket.cities
            .map((city) => city.name)
            .includes(this.cityFrom);
          const isAlreadyTaken = this.routesId.includes(ticket.id);
          return hasCity && !isAlreadyTaken;
        });
      },
    },
    isAddButtonDisabled: {
      get() {
        const isNothingSelected = !this.selectedTicket.length;

        return isNothingSelected || this.isSelectedTicketDuplicated;
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
    isSelectedTicketDuplicated: {
      get() {
        return (this.routes ?? [])
          .map((route) => route?.id)
          .includes(this.selectedTicket[0]?.id);
      },
    },
    duplicateTicketErrorMessage: {
      get() {
        if (!this.selectedTicket.length) {
          return null;
        }
        return this.isSelectedTicketDuplicated
          ? this.$t('current.dialog.add-ticket.error')
          : null;
      },
    },
    foundTicketsCountMessage: {
      get() {
        if (!this.foundTickets.length) {
          return null;
        }
        return this.$tc(
          'current.dialog.add-ticket.message',
          this.foundTickets.length
        );
      },
    },
  },
  watch: {
    cityFrom: {
      handler() {
        this.cityTo = null;
      },
    },
    cityTo: {
      handler(city) {
        this.foundTickets = [];
        this.selectedTicket = [];
        if (!city) {
          return;
        }

        this.foundTickets = this.possibleTickets.filter((ticket) =>
          ticket.cities.map((city) => city.name).includes(city)
        );
        if (this.foundTickets.length === 1) {
          this.selectedTicket = structuredClone(this.foundTickets);
        }
      },
    },
  },
  data: () => ({
    cityFrom: null,
    cityTo: null,
    foundTickets: [],
    selectedTicket: [],
  }),
  methods: {
    reset() {
      this.cityFrom = null;
    },
    closeDialog() {
      this.$emit('close-dialog');
      setTimeout(() => this.reset(), 50);
    },
    addTicket() {
      const event = {
        value: this.selectedTicket[0],
      };
      this.$emit('add-item', event);
      this.reset();
    },
  },
};
</script>
