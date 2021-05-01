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
                darkenBlack: colors.grey.darken4,
                quaternary: "#B57F50",
                success: "#00C49A",
                error:"#C42348",
                background: "#f9f9f9"
            },
            dark: {
                secondary: colors.green.accent4,
                primaryLight: colors.blue.lighten4,
                tertiary: colors.grey.lighten5,
                quaternary: colors.orange.darken2,
                darkenBlack: colors.grey.darken4,
                background: "#232425"
            }
        }
    }
});
