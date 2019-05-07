<template>
    <!-- data table -->
    <v-data-table
        :headers="headers"
        :items="items"
    >
        <!-- content slot -->
        <template v-slot:items="props">
            <template v-for="(value, key, index) in props.item">
                <td v-if="meta[key]['render'] === true" :key="index">{{value}}</td>
            </template>
        </template>

    </v-data-table>
</template>

<script>
import axios from 'axios'

export default {
    name: 'LogTable',
    props: {
        endpoint: {
            type: String,
            default: 'access'
        }
    },
    data () {
        return {
            headers: [],
            items: [],
            meta: {}
        }
    },
    methods: {
        load () {
            this.loadMeta()
        },
        loadMeta () {
            axios({
                method: 'get',
                url: `/meta/${this.endpoint}log`
            })
                .then(resp => {
                    // assign meta
                    const _meta = resp.data.get
                    this.meta = _meta
                    console.log(this.meta)
                    // assign headers
                    const _headers = []
                    for (let key of Object.keys(_meta)) {
                        if (_meta[key]['render'] === true) {
                            let obj = Object.assign({}, _meta[key])
                            obj['text'] = _meta[key]['verbose_name']
                            obj['value'] = key
                            _headers.push(obj)
                        }
                    }
                    // _headers.sort((a, b) => (a.order > b.order) ? 1 : -1)
                    this.headers = _headers
                    this.loadData()
                })
        },
        loadData () {
            axios({
                method: 'get',
                url: `/logs/${this.endpoint}`
            })
                .then(resp => {
                    this.items = resp.data
                })
        }
    },
    mounted () {
        this.load()
    }
}
</script>

<style>

</style>
