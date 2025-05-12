<template>
    <v-container fluid
        class="pa-4 d-flex flex-column align-center">
        <v-row align="center"
            justify="center"
            class="mb-4">
            <v-btn @click="toggleTheme"
                elevation="2"
                rounded
                color="primary"
                class="me-2">
                <v-icon left>mdi-theme-light-dark</v-icon>
                {{ theme === 'light' ? 'Modo Escuro' : 'Modo Claro' }}
            </v-btn>
            <v-btn @click="downloadData"
                elevation="2"
                rounded
                color="accent">
                <v-icon left>mdi-download</v-icon>
                Baixar Dados
            </v-btn>
        </v-row>

        <v-row class="kanban-row"
            gap="4">
            <v-col v-for="(column, idx) in kanbanColumns"
                :key="idx"
                cols="12"
                sm="6"
                md="2">
                <fieldset class="kanban-column"
                    :class="`kanban-column-${theme}`">
                    <legend>{{ column.title }}</legend>
                    <draggable v-model="column.cards"
                        item-key="id"
                        :group="{ name: 'cards', pull: true, put: true }"
                        @start="dragStart"
                        @end="() => dragEnd(idx, column.cards)">
                        <template #item="{ element }">
                            <WidgetCard :title="element.title"
                                :theme="theme"
                                :id="element.id" />
                        </template>
                    </draggable>
                </fieldset>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import draggable from 'vuedraggable'
import WidgetCard from '@/components/WidgetCard.vue'

export default {
    name: 'DashboardView',
    components: { draggable, WidgetCard },
    setup() {
        const store = useStore()

        const kanbanColumns = ref([
            { title: 'Backlog', cards: [{ id: '1', title: 'Card 1' }, { id: '2', title: 'Card 2' }] },
            { title: 'Em Progresso', cards: [{ id: '3', title: 'Card 3' }] },
            { title: 'Concluído', cards: [{ id: '4', title: 'Card 4' }] }
        ])

        onMounted(() => store.dispatch('init'))

        const theme = computed(() => store.state.theme)
        const toggleTheme = () => store.commit('toggleTheme')

        const saveOrder = () => {
            kanbanColumns.value.forEach((column, idx) => {
                store.commit('setColumnCards', { idx, cards: column.cards })
            })
        }

        const downloadData = () => {
            const data = JSON.stringify({ columns: kanbanColumns.value }, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'kanbanColumns.json'
            a.click()
            URL.revokeObjectURL(url)
        }

        const dragStart = () => {
            console.log('Iniciando arrasto')
        }

        const dragEnd = (idx, updatedCards) => {
            const movedCard = updatedCards[updatedCards.length - 1]
            const fromColumn = kanbanColumns.value.find(col => col.cards.find(card => card.id === movedCard.id))

            if (fromColumn && fromColumn.cards.length > 0) {
                fromColumn.cards = fromColumn.cards.filter(card => card.id !== movedCard.id)
            }

            kanbanColumns.value[idx].cards = updatedCards
            saveOrder()
        }

        return { theme, kanbanColumns, saveOrder, toggleTheme, downloadData, dragStart, dragEnd }
    }
}
</script>

<style scoped>
.kanban-row {
    display: flex;
    gap: 20px;
    justify-content: space-evenly;
}

.kanban-column {
    padding: 16px;
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: #f7f7f7;
    min-height: 400px;
    overflow-y: auto;
    color: var(--text-dark);
}

.kanban-column-dark {
    background-color: #2e2e2e;
    color: #e0e0e0;
}

.kanban-column-light {
    background-color: #f7f7f7;
    color: #333;
}

.kanban-column legend {
    font-size: 1.2em;
    font-weight: bold;
    padding: 0 8px;
    color: var(--primary);
}

.widget-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.widget-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
