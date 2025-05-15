<template>
    <v-container fluid
        class="pa-4 d-flex flex-column align-center">
        <v-row align="center"
            justify="center"
            class="mb-4"
            gap="4">
            <v-btn @click="toggleTheme"
                elevation="2"
                rounded
                color="primary">
                <v-icon left>mdi-theme-light-dark</v-icon>
                {{ theme === 'light' ? 'Modo Escuro' : 'Modo Claro' }}
            </v-btn>

            <v-btn @click="downloadData"
                elevation="2"
                rounded
                color="accent">
                <v-icon left>mdi-download</v-icon>
                Baixar Dados Simulados
            </v-btn>
        </v-row>

        <v-sheet class="mx-auto mb-6"
            width="300">
            <v-form @submit.prevent="addNewCard">
                <v-text-field v-model="newCardTitle"
                    label="Título"
                    :rules="[v => !!v || 'Título é obrigatório']"
                    required
                    maxLength="20"
                    dense
                    outlined></v-text-field>
                <v-btn class="mt-2"
                    type="submit"
                    block
                    color="success"
                    :disabled="!newCardTitle.trim()">
                    Adicionar Card
                </v-btn>
            </v-form>
        </v-sheet>

        <v-row class="kanban-row"
            gap="24"
            justify="center">
            <v-col v-for="(column, idx) in kanbanColumns"
                :key="idx"
                cols="12"
                sm="6"
                md="4"
                lg="3">
                <fieldset :class="['kanban-column', `kanban-column-${theme}`]">
                    <legend>{{ column.title }}</legend>
                    <div class="draggable-container">
                        <draggable v-model="column.cards"
                            item-key="id"
                            :group="{ name: 'cards', pull: true, put: true }"
                            @start="dragStart"
                            @end="() => dragEnd(idx, column.cards)">
                            <template #item="{ element }">
                                <WidgetCard :title="element.title"
                                    :theme="theme"
                                    :id="element.id"
                                    class="widget-card" />
                            </template>
                        </draggable>
                    </div>
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

        const collectedData = ref({
            tempos: [],
            taxaSucesso: 0,
            sus: 0
        })

        const theme = computed(() => store.state.theme)

        const newCardTitle = ref('')

        onMounted(() => store.dispatch('init'))

        const toggleTheme = () => {
            console.time('Tempo Mudança Tema')
            store.commit('toggleTheme')
            console.timeEnd('Tempo Mudança Tema')

            const tempo = (performance.now() % 1000) / 1000
            collectedData.value.tempos.push(tempo)

            calculateSuccess()
            calculateSUS()
        }

        const saveOrder = () => {
            console.time('Tempo Salvamento Layout')
            kanbanColumns.value.forEach((column, idx) => {
                store.commit('setColumnCards', { idx, cards: column.cards })
            })
            console.timeEnd('Tempo Salvamento Layout')

            const tempo = (performance.now() % 1000) / 1000
            collectedData.value.tempos.push(tempo)

            calculateSuccess()
            calculateSUS()
        }

        const calculateSuccess = () => {
            const completedActions = collectedData.value.tempos.length
            collectedData.value.taxaSucesso = Math.min((completedActions / 20) * 100, 100)
        }

        const calculateSUS = () => {
            const ratings = [4, 5, 4]
            const susScore = (ratings.reduce((sum, rate) => sum + rate, 0) - 3) * 2.5
            collectedData.value.sus = susScore
        }

        const dragStart = () => {
            console.log('Arrasto iniciado')
        }

        const dragEnd = (idx, updatedCards) => {
            if (!updatedCards || updatedCards.length === 0) {
                kanbanColumns.value[idx].cards = []
                saveOrder()
                return
            }

            const movedCard = updatedCards[updatedCards.length - 1]
            if (!movedCard || !movedCard.id) {
                console.warn('movedCard inválido:', movedCard)
                return
            }

            const fromColumn = kanbanColumns.value.find(col =>
                Array.isArray(col.cards) && col.cards.some(card => card && card.id === movedCard.id)
            )

            if (fromColumn && fromColumn.cards.length > 0) {
                fromColumn.cards = fromColumn.cards.filter(card => card && card.id !== movedCard.id)
            }

            kanbanColumns.value[idx].cards = updatedCards

            saveOrder()
        }

        const addNewCard = () => {
            const title = newCardTitle.value.trim()
            if (!title) return

            const newId = (Math.max(...kanbanColumns.value.flatMap(c => c.cards.map(card => parseInt(card.id)))) + 1).toString()

            const newCard = {
                id: newId,
                title
            }

            kanbanColumns.value[0].cards.push(newCard)

            newCardTitle.value = ''

            saveOrder()
        }

        const downloadData = () => {
            const data = {
                adaptavel: {
                    tempos: collectedData.value.tempos,
                    taxa_sucesso: collectedData.value.taxaSucesso,
                    sus: collectedData.value.sus
                }
            }
            const json = JSON.stringify(data, null, 2)
            const blob = new Blob([json], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'dadosSimulados.json'
            a.click()
            URL.revokeObjectURL(url)
        }

        return {
            theme,
            kanbanColumns,
            toggleTheme,
            saveOrder,
            dragStart,
            dragEnd,
            downloadData,
            newCardTitle,
            addNewCard
        }
    }
}
</script>

<style scoped>
.kanban-row {
    display: flex;
    gap: 24px;
    justify-content: center;
    padding: 20px;
    overflow-x: auto;
}

.kanban-column {
    background: #ebecf0;
    border-radius: 8px;
    width: 320px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    padding: 16px;
    box-sizing: border-box;
    color: #333;
}

.kanban-column-dark {
    background: #2f3136;
    color: #e0e0e0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.7);
}

.kanban-column legend {
    font-weight: 700;
    font-size: 1.4em;
    padding-bottom: 12px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 12px;
}

.kanban-column-dark legend {
    border-bottom-color: #555;
}

.draggable-container {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: 8px;
}

.widget-card {
    background: white;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    cursor: grab;
    transition: box-shadow 0.2s ease;
    user-select: none;
    color: #111;
}

.kanban-column-dark .widget-card {
    background: #40444b;
    color: #e0e0e0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
}

.widget-card:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

.kanban-column-dark .widget-card:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.8);
}
</style>
