<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-dialog
    v-model="isActive"
    max-width="660"
    @click:outside="closeAddHarbor()"
  >
    <v-card color="background">
      <v-toolbar flat color="quaternary" dark>
        <v-toolbar-title>
          {{ $t('current.dialog.add-harbor.title') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeAddHarbor()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="harborForm" ref="harborForm">
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <span class="text-h6 tertiary--text">
                  {{ $t('current.dialog.add-harbor.subtitle') }}
                </span>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="selectedHarbor"
                  :items="cities"
                  :rules="rule"
                  solo
                  :label="$t('current.dialog.add-harbor.label')"
                  :error-messages="
                    harbors.includes(selectedHarbor)
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
        <v-btn large text color="accent" @click="closeAddHarbor()">
          {{ $t('main.btn.close') }}
        </v-btn>
        <v-btn
          large
          :disabled="!harborForm || harbors.includes(selectedHarbor)"
          text
          color="secondary"
          @click="addHarbor()"
          >{{ $t('main.btn.add-harbor') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'HarborDialog',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    cities: {
      type: Array,
      default: () => [],
    },
    harbors: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    isActive: {
      immediate: false,
      handler(value) {
        if (!value) {
          this.closeAddHarbor();
        }
      },
    },
  },
  data: () => ({
    harborForm: false,
    selectedHarbor: null,
    rule: [(v) => !!v || 'A city is required'],
  }),
  methods: {
    addHarbor() {
      this.$emit('add-item', { city: this.selectedHarbor });
      this.selectedHarbor = null;
      this.$refs.harborForm.resetValidation();
    },
    closeAddHarbor() {
      this.$emit('close-dialog');
      this.selectedHarbor = null;
      setTimeout(() => {
        this.$refs.harborForm.resetValidation();
      }, 50);
    },
  },
};
</script>
