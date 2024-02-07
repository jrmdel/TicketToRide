<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span class="text-h6 tertiary--text">{{
          $t('current.bonuses.globe-trotter')
        }}</span>
      </v-col>
    </v-row>
    <v-row class="ml-sm-4" align="center" justify="center" justify-sm="start">
      <v-btn
        large
        icon
        :disabled="globeTrotterBonus == 0"
        @click="updateGlobeTrotterBonus(0)"
      >
        <v-icon color="red">mdi-minus</v-icon>
      </v-btn>
      <span class="text-h6">{{ globeTrotterBonus }}</span>
      <v-btn
        large
        icon
        :disabled="globeTrotterBonus == 1"
        @click="updateGlobeTrotterBonus(1)"
      >
        <v-icon color="green">mdi-plus</v-icon>
      </v-btn>
      <v-icon class="ml-4">mdi-earth-plus</v-icon>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'BonusGlobeTrotter',
  props: {
    globeTrotterBonus: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    updateGlobeTrotterBonus(update) {
      const evnt = { value: update };
      this.$emit('updateGlobeTrotterBonus', evnt);
    },
  },
};
</script>

<style></style>
