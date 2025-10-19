import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({
    defaults: {
        VTextField:{
            density:'compact',
            variant: 'outlined',
            clearable: true,
        }
    },
    Vbtn:{
        density:'compact',
        class: 'text-none',
        style:['border-radious:2px']
    }
});

export default vuetify;

