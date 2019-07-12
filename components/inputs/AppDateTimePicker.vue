<template>
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="date"
        lazy
        transition="scale-transition"
        offset-y
        full-width
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="date"
                :label="label"
                :hint='hint'
                prepend-icon="event"
                readonly
                v-on="on"
                clearable
            ></v-text-field>
        </template>
        <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="save()">OK</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: 'AppDateTimePicker',
    data () {
        return {
            menu: false,
        }
    },
    props: {
        date: {
            default: new Date().toISOString().substr(0, 10),
        },
        label: {
            default: 'label'
        },
        hint: {
            default: 'hint'
        }
    },
    methods: {
        sync () {
            this.$emit('syncDate', this.date)
        },
        save () {
            // $refs.menu.save(date)
            this.$refs.menu.save(this.date)
            console.log(this.date)
            this.$emit('sync-date', this.date)
        }
    }
}

</script>

<style>

</style>
