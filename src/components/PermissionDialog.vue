<template>
  <v-dialog
    v-model="dialog"
    max-width="1000px"
  >

    <template v-slot:activator="{ on }">
      <v-btn
        color="red lighten-2"
        dark
        v-on="on"
      >
        Click Me
      </v-btn>
    </template>

    <v-card>

      <v-card-title class="primary lighten-2">
        <span class="headline white--text">Permissions</span>
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">close</v-icon>
      </v-card-title>

      <v-sheet class="pa-3 primary lighten-2">
        <v-layout>
          <v-flex
            xs12
            lg3
            md-6
          >
            <v-text-field
              v-model="search"
              label="Search Permisions"
              dark
              flat
              solo-inverted
              hide-details
              clearable
              clear-icon="close"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-sheet>

      <v-layout justify-center>
        <v-flex>

          <v-card-text>
            <v-treeview
              v-model="tree"
              :load-children="fetch"
              :items="items"
              activatable
              active-class="grey lighten-4 indigo--text"
              selected-color="indigo"
              open-on-click
              selectable
              :search="search"
              :open.sync="open"
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
              >
                <v-icon
                  left
                  small
                >mdi-beer</v-icon>
                {{ selection.model }} - {{ selection.permission }}
              </v-chip>
            </v-scroll-x-transition>
          </v-card-text>

        </v-flex>
      </v-layout>

      <v-divider></v-divider>

      <v-card-actions style="padding-top: 30px">
        <v-btn
          flat
          @click="tree = []"
        >
          Reset
        </v-btn>
        <v-btn
          flat
          @click="open = []"
        >
          Collapse
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          flat
          color="red darken-1"
          @click="close()"
        >
          Close
        </v-btn>
        <v-btn
          flat
          color="green darken-1"
          @click="save()"
        >
          Save
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import { Stream } from 'stream'
export default {
  props: {
    treeData: {
      type: Array,
      default: []
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    permissions: [],
    isLoading: false,
    tree: [],
    types: [],
    open: [],
    search: null
  }),

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
    },
    shouldShowTree () {
      return this.permissions.length > 0 && !this.isLoading
    }
  },

  watch: {
    permissions (val) {
      this.types = val.reduce((acc, cur) => {
        const type = cur.model

        if (!acc.includes(type)) acc.push(type)

        return acc
      }, []).sort()
    }
  },

  methods: {
    fetch () {
      if (this.permissions.length) return
      return axios.get('/admin/permissions')
        .then(resp => this.permissions = resp.data)
    },
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
    save () {
      this.dialog = false
    },
    close () {
      this.tree = ['00.00', '03.12']
      // this.dialog = false
    }
  },
  mounted () {
    axios.get('/admin/roles/8785b7a1-9284-4e14-996f-1f5625bf73b1/1')
      .then(resp => {
        let p = resp.data.permissions
        // obj to flat list
        const test = this.selections.map(selection => selection.unique)
        // flast list to objs
        const te = []
        for (let i of p) {
          te.push(this.permissions.filter(perm => perm.unique === i)[0])
        }
        this.tree = p.split(',')
      })
  }
}
</script>
