<template>
    <v-container>
        <v-layout justify-center row>
            <v-flex>{{id}}</v-flex>
            <v-flex>{{id}}</v-flex>
            <v-flex>{{id}}</v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'UserDetails',
    data() {
        return {
            id: this.$route.params.id
        }
    },
    mounted () {
        axios.get('')
            .then()
    }
}
</script>

<style>

</style>
