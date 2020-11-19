import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.blueGrey.base,
                secondary: colors.deepOrange.darken1,
                accent: colors.yellow.accent4,
                tertiary: colors.grey.darken4,
                quaternary: colors.brown.base,
            }
        }
    }
});
