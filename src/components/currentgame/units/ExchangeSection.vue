<template>
  <div v-frag v-if="isActive">
    <v-row>
      <v-col cols="12">
        <span class="text-h6 tertiary--text">
          {{ $t('current.units.subtitle-2') }}
        </span>
      </v-col>
    </v-row>
    <v-row
      class="ml-sm-4"
      align="center"
      justify="center"
      justify-sm="start"
      no-gutters
    >
      <v-btn large icon :disabled="exchanges === 0" @click="updateValue(-1)">
        <v-icon color="red">mdi-minus</v-icon>
      </v-btn>
      <span class="text-h6">{{ exchanges }}</span>
      <v-btn large icon @click="updateValue(1)">
        <v-icon color="green">mdi-plus</v-icon>
      </v-btn>
      <v-icon class="ml-4">mdi-autorenew</v-icon>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ExchangeSection',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    exchanges: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  methods: {
    updateValue(update) {
      this.$emit('update-value', { update });
    },
  },
};
</script>
