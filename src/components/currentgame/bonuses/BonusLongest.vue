<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <span class="text-h6 tertiary--text">{{
          $t('current.bonuses.longest-path')
        }}</span>
      </v-col>
    </v-row>
    <v-row class="ml-sm-4" align="center" justify="center" justify-sm="start">
      <v-btn
        large
        icon
        :disabled="longestBonus == 0"
        @click="updateLongestBonus(0)"
      >
        <v-icon color="red">mdi-minus</v-icon>
      </v-btn>
      <span class="text-h6">{{ longestBonus }}</span>
      <v-btn
        large
        icon
        :disabled="longestBonus == 1"
        @click="updateLongestBonus(1)"
      >
        <v-icon color="green">mdi-plus</v-icon>
      </v-btn>
      <v-icon class="ml-4">mdi-transit-connection-variant</v-icon>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BonusLongest',
  props: {
    longestBonus: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    updateLongestBonus(update) {
      const evnt = { value: update };
      this.$emit('updateLongestBonus', evnt);
    },
  },
};
</script>
