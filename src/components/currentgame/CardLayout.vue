<template>
  <v-card color="background">
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>{{ translatedTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon large>{{ logo }}</v-icon>
    </v-toolbar>
    <v-card-subtitle>
      <slot name="header"></slot>
    </v-card-subtitle>
    <v-card-text>
      <v-container fluid>
        <slot name="content"></slot>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CardLayout',
  props: {
    title: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
  },
  computed: {
    translatedTitle: {
      get() {
        return this.$t(this.title) ?? '';
      },
    },
  },
  data: () => ({}),
};
</script>
