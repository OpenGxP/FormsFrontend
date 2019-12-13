<template>
  <v-card elevation="0">

    <v-card-title>
      <span class="headline">Select Permissions</span>
    </v-card-title>

    <v-sheet class="pa-3">
      <v-layout>
        <v-flex
          xs12
          lg6
          md-6
        >
          <v-text-field
            v-model="search"
            label="Search Permisions"
            dark
            text
            background-color="grey lighten-2"
            solo-inverted
            hide-details
            clearable
            clear-icon="close"
            :disabled="!editable"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-sheet>

    <v-layout justify-center>
      <v-flex>
        <v-card-text>
          <v-treeview
            v-model="tree"
            :items="items"
            active-class="grey lighten-4 indigo--text"
            selected-color="indigo"
            open-on-click
            selectable
            item-disabled="locked"
            :search="search"
            :open.sync="open"
            @input="handleChange"
          >
          </v-treeview>
        </v-card-text>
      </v-flex>
      <v-divider vertical></v-divider>
      <v-flex
        xs12
        md6
      >

        <v-card-text>
          <div
            v-if="selections.length === 0"
            key="title"
            class="title font-weight-light grey--text pa-3 text-xs-center"
          >
            Select permissions
          </div>
          <v-scroll-x-transition
            group
            hide-on-leave
          >
            <v-chip
              v-for="(selection, i) in selections"
              :key="i"
              color="green"
              dark
              small
              class="ma-1"
            >
              <v-icon
                left
                small
              >lock</v-icon>
              {{ selection.model }} - {{ selection.permission }}
            </v-chip>
          </v-scroll-x-transition>
        </v-card-text>

      </v-flex>
    </v-layout>

    <v-divider></v-divider>

    <v-card-actions style="padding-top: 30px">
      <v-btn
        text
        :disabled="!editable"
        @click="tree = []"
      >
        Reset
      </v-btn>
      <v-btn
        text
        @click="open = []"
      >
        Collapse
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  props: ['value', 'editable'],

  data () {
    return {
      tree: [],
      permissions: [],
      isLoading: false,
      types: [],
      open: ['All permissions'],
      search: null
    }
  },

  computed: {
    items () {
      // get items including children for tree
      const children = this.types.map(type => ({
        id: type,
        name: this.getName(type),
        children: this.getChildren(type)
      }))

      return [{
        id: 1,
        name: 'All permissions',
        locked: !this.editable,
        children
      }]
    },
    selections () {
      // selected items
      const selections = []
      for (const leaf of this.tree) {
        const permission = this.permissions.find(permission => permission.unique === leaf)
        if (!permission) continue
        selections.push(permission)
      }
      return selections
    },
    flatSelection () {
      return this.selections.map(selection => selection.unique)
    }
  },

  watch: {
    permissions: {
      handler (val) {
        console.log('permissions', val)
        this.types = val.reduce((acc, cur) => {
          const type = cur.model

          if (!acc.includes(type)) acc.push(type)

          return acc
        }, []).sort()
      },
      deep: true
    },
    value: {
      immediate: true,
      handler (newVal) {
        if (this.flatSelection.toString() !== newVal) this.tree = this.conv(newVal)
      }
    }
  },

  methods: {
    getChildren (type) {
      const permissions = []

      for (const permission of this.permissions) {
        if (permission.model !== type) continue

        permissions.push({
          ...permission,
          name: permission.permission,
          id: permission.unique
        })
      }

      return permissions.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    getName (name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    conv (val) {
      // empty string
      if (typeof val === 'string' && val.length === 0) {
        return []
        // no comma separation, single value
      } else if (val.indexOf(',') === -1) {
        return [val]
        // comma separation
      } else {
        return val.split(',')
      }
    },
    handleChange (e) {
      this.$emit('input', this.flatSelection.toString())
    }
  },

  mounted () {
    if (this.permissions.length) return
    return axios.get('/admin/permissions')
      .then(resp => { this.permissions = resp.data.results })
  }
}
</script>
