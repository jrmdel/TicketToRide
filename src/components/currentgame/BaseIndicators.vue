<template>
  <div>
    <v-container fluid>
      <v-row justify="center" justify-sm="space-around">
        <v-col v-show="leftCondition" class="mx-8 mx-sm-0" cols="auto">
          <span class="text-caption">{{ leftText }}</span>
          <span class="ml-4 text-h3">{{
            leftIsPercentage
              ? `${(leftIndicator * 100).toFixed(1)} %`
              : leftIndicator
          }}</span>
        </v-col>
        <v-col v-show="centerCondition" class="mx-8 mx-sm-0" cols="auto">
          <span class="text-caption">{{ centerText }}</span>
          <span class="ml-4 text-h3">{{
            centerIsPercentage
              ? `${(centerIndicator * 100).toFixed(1)} %`
              : centerIndicator
          }}</span>
        </v-col>
        <v-col v-show="rightCondition" class="mx-8 mx-sm-0" cols="auto">
          <span class="text-caption">{{ rightText }}</span>
          <span class="ml-4 text-h3">{{
            rightIsPercentage
              ? `${(rightIndicator * 100).toFixed(1)} %`
              : rightIndicator
          }}</span>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'BaseIndicators',
  props: {
    leftText: { type: String, default: '' },
    leftIndicator: { type: Number, default: 0 },
    leftCondition: { type: Boolean, default: true },
    leftIsPercentage: { type: Boolean, default: false },
    centerText: { type: String, default: '' },
    centerIndicator: { type: Number, default: 0 },
    centerCondition: { type: Boolean, default: true },
    centerIsPercentage: { type: Boolean, default: false },
    rightText: { type: String, default: '' },
    rightIndicator: { type: Number, default: 0 },
    rightCondition: { type: Boolean, default: true },
    rightIsPercentage: { type: Boolean, default: false },
  },
};
</script>
