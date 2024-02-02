<template>
  <div>
    <v-row>
      <span class="text-h6 tertiary--text">{{ title }}</span>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card outlined>
          <v-simple-table fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="primaryLight text-left darkenBlack--text">
                    {{ leftColumn }}
                  </th>
                  <th class="primaryLight text-left darkenBlack--text">
                    {{ rightColumn }}
                  </th>
                </tr>
              </thead>
              <tbody v-show="data.length > 0">
                <tr v-for="item in data" :key="item.city">
                  <td>{{ item.city }}</td>
                  <td>{{ item.num }}</td>
                </tr>
              </tbody>
              <tbody v-show="data.length == 0">
                <tr>
                  <td colspan="2">{{ emptyText }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    leftColumn: { type: String, default: '' },
    rightColumn: { type: String, default: '' },
    data: { type: Array, default: () => [] },
    emptyText: { type: String, default: 'No data' },
  },
};
</script>
