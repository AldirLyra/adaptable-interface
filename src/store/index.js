import { createStore } from 'vuex'

export default createStore({
    state: {
        theme: 'light',
        kanbanColumns: [
            { title: 'Backlog', cards: [{ id: '1', title: 'Card 1' }, { id: '2', title: 'Card 2' }] },
            { title: 'Em Progresso', cards: [{ id: '3', title: 'Card 3' }] },
            { title: 'Concluído', cards: [{ id: '4', title: 'Card 4' }] }
        ]
    },
    mutations: {
        toggleTheme(state) {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
            document.body.style.backgroundColor =
                state.theme === 'light' ? 'var(--bg-light)' : 'var(--bg-dark)'
        },
        setColumnCards(state, { idx, cards }) {
            state.kanbanColumns[idx].cards = cards
            localStorage.setItem('kanbanColumns', JSON.stringify(state.kanbanColumns))
        },
        loadFromStorage(state) {
            const saved = localStorage.getItem('kanbanColumns')
            if (saved) state.kanbanColumns = JSON.parse(saved)
        }
    },
    actions: {
        init({ commit }) {
            commit('loadFromStorage')
        }
    }
})

