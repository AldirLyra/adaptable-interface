<template>
    <v-app :theme="theme">
        <Dashboard />
    </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Dashboard from './views/Dashboard.vue'

export default {
    name: 'App',
    components: {
        Dashboard
    },
    computed: {
        ...mapState(['theme'])
    }
}
</script>

<style>
/* #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
} */

.v-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
