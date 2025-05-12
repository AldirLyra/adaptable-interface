import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi },
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#FF5722',
                    error: '#FF5252',
                    background: '#F5F5F5',
                    card: '#FFFFFF',
                    'card-text': '#000000'
                }
            },
            dark: {
                colors: {
                    primary: '#2196F3',
                    secondary: '#FFCDD2',
                    accent: '#FF4081',
                    error: '#CF6679',
                    background: '#121212',
                    card: '#1E1E1E',
                    'card-text': '#E0E0E0'
                }
            }
        }
    }
})
