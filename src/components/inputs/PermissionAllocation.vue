<template>
  <v-card elevation="0">
    <v-card-title>
      <span class="headline">Select Permissions</span>
    </v-card-title>

    <v-row>
      <v-col cols="6">
        <v-text-field
          v-model="search"
          label="Search Permisions"
          text
          hide-details
          clearable
          clear-icon="close"
          :disabled="!editable"
        />
      </v-col>
      <v-col cols="6">
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
      </v-col>
    </v-row>

    <v-container
      fluid
      id="scroll-target"
      style="max-height: 600px"
      class="overflow-y-auto"
    >
      <v-row
        v-scroll:#scroll-target="onScroll"
        style="height: 1000px"
      >
        <v-col>
          <v-card-text>
            <v-treeview
              v-model="tree"
              :items="items"
              active-class="grey lighten-4 indigo--text"
              selected-color="primary"
              open-on-click
              selectable
              item-disabled="locked"
              :search="search"
              :open.sync="open"
              @input="handleChange"
            />
          </v-card-text>
        </v-col>

        <!--<v-divider vertical />

        <v-col
        cols="12"
        md="6"
      >
        <v-card-text>
          <div
            v-if="selections.length === 0"
            key="title"
            class="title font-weight-light grey--text pa-4 text-center"
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
              color="primary"
              dark
              small
              class="ma-1"
            >
              <v-icon
                left
                small
              >
                lock
              </v-icon>
              {{ selection.model }} - {{ selection.permission }}
            </v-chip>
          </v-scroll-x-transition>
        </v-card-text>
      </v-col>-->
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    value: {
      type: [Array, String],
      required: true
    },
    editable: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      tree: [],
      permissions: [],
      isLoading: false,
      types: [],
      open: ['All permissions'],
      offsetTop: 0,
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
        this.types = val.reduce((acc, cur) => {
          const type = cur.model

          if (!acc.includes(type)) acc.push(type)

          return acc
        }, []).sort()
      },
      deep: true
    },
    value: {
      handler (newVal) {
        if (this.flatSelection.toString() !== newVal) this.tree = this.conv(newVal)
      },
      immediate: true,
      deep: true
    }
  },

  mounted () {
    if (this.permissions.length) return
    return axios.get('/admin/permissions')
      .then(resp => { this.permissions = resp.data.results })
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
    },
    onScroll (e) {
      this.offsetTop = e.target.scrollTop
    }
  }
}
</script>
