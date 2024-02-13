<template>
  <v-card outlined>
    <v-card-title>
      <span>
        {{ $t('current.stations.card.title', { id: index }) }}
      </span>
      <v-spacer></v-spacer>
      <v-icon v-if="isActive" large color="red" @click="deleteItem()">
        mdi-close
      </v-icon>
      <v-icon v-else large color="green" @click="addItem()"> mdi-plus </v-icon>
    </v-card-title>
    <v-card-text class="my-n3">
      <v-container fluid>
        <v-row class="text-body-1" align="center">
          <v-col cols="12">
            <v-icon :color="isActive ? 'accent' : undefined" class="mx-4">
              mdi-medal-outline
            </v-icon>
            <span v-if="isActive">
              {{ version?.trainStationRule ?? 0 }}
            </span>
            <span v-else>
              {{ version?.pointsPerUnsetTrainStation ?? 0 }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TrainStationsItem',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    version: {
      type: Object,
      default: () => {},
    },
  },
  data: () => ({}),
  methods: {
    deleteItem() {
      this.$emit('delete-item');
    },
    addItem() {
      this.$emit('add-item');
    },
  },
};
</script>
