import { type ThemeDefinition } from 'vuetify'
import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

const passwordpassword: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0d0d14',
    surface: '#232323',
    primary: '#ac3232',
    secondary: '#52263e',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  }
}

export default defineVuetifyConfiguration ({
  theme: {
    defaultTheme: 'passwordpassword',
    themes: {
      passwordpassword
    }
  }
})