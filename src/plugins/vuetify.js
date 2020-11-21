import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: colors.blueGrey.base,
                primaryLight: colors.blueGrey.lighten4,
                secondary: "#6A2E35",
                accent: colors.yellow.accent4,
                tertiary: colors.grey.darken4,
                quaternary: "#B57F50",
            }
        }
    }
});
