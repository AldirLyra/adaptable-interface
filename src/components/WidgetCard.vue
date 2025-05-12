<!-- <template>
    <v-card class="widget-card"
        :elevation="4"
        :style="{
            'background-color': $vuetify.theme.themes[theme].colors.card,
            'color': $vuetify.theme.themes[theme].colors['card-text'],
            'width': 'var(--card-width)'
        }"
        rounded>
        <v-card-text class="text-center">
            <v-icon large
                class="mb-2">mdi-widget</v-icon>
            <div class="text-h6 font-weight-medium">{{ title }}</div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'WidgetCard',
    props: {
        title: String,
        theme: String
    }
}
</script>

<style scoped>
.widget-card {
    min-height: var(--card-min-height);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
}
</style> -->
<template>
    <v-card class="widget-card"
        :elevation="4"
        :style="{
            'background-color': $vuetify.theme.themes[theme].colors.card,
            'color': $vuetify.theme.themes[theme].colors['card-text'],
            'width': 'var(--card-width)'
        }"
        rounded>
        <v-card-text class="text-center">
            <v-icon large
                class="mb-2"
                v-if="isDragging"
                :class="dragClass">mdi-drag</v-icon>
            <div class="text-h6 font-weight-medium">{{ title }}</div>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'WidgetCard',
    props: {
        title: String,
        theme: String,
        id: String
    },
    data() {
        return {
            isDragging: false, // Para mostrar/ocultar o ícone de arraste
            dragClass: 'dragging'
        }
    },
    methods: {
        // Aqui podemos ligar aos eventos de drag para ativar/desativar a classe do ícone
        onDragStart() {
            this.isDragging = true
        },
        onDragEnd() {
            this.isDragging = false
        }
    }
}
</script>

<style scoped>
.widget-card {
    min-height: var(--card-min-height);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    cursor: move;
    /* Adicionando o cursor de mover */
}

.widget-card .mdi-drag {
    opacity: 0.7;
}

.widget-card.dragging {
    background-color: #e3f2fd;
    /* Background claro quando arrastando */
}
</style>
