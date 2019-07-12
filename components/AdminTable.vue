<template>

	<div>

	<bar
		:item="item"
	></bar>

  <v-card>

		<!-- search -->
    <v-card-title class="title">
      {{ inpt.split('/')[1] }}
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <!-- data table -->
    <v-data-table
			v-if="loaded"
      v-model="selected"
      :headers="myHeaders"
      :items="myItems"
      :pagination.sync="pagination"
      select-all
      :item-key="'unique'"
      class="elevation-1"
      :search="search"
    >
      <!-- slot header -->
      <template v-slot:headers="props">
        <tr>
          <th>
            <v-checkbox
              :input-value="props.all"
              :indeterminate="props.indeterminate"
              primary
              hide-details
              @click.stop="toggleAll"
            ></v-checkbox>
          </th>
          <th
            v-for="header in props.headers"
            :key="header.text"
            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
            @click="changeSort(header.value)"
          >
            <v-icon small>arrow_upward</v-icon>
            {{ header.text }}
          </th>
        </tr>
      </template>

      <!-- slot body -->
      <template v-slot:items="props">
        <tr :active="props.selected" @click="props.selected = !props.selected">
          
          <td>
            <v-checkbox
              :input-value="props.selected"
              primary
              hide-details
            ></v-checkbox>
          </td>

          <template v-for="(value, key, index) in props.item">
          <td
            :key="index"
            v-if="render(key)"
            class="text-xs-right"
          >
            <template v-if="key == 'status'"><v-chip :color="getColor(props.item.status)">{{ props.item[key] }}</v-chip></template>
            <template v-else>{{ props.item[key] }}</template>
          </td>
          </template>

          <td v-if="editable" class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="inlineEditItem(props.item)"
            >edit</v-icon>
          </td>

        </tr>
      </template>

      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          No results for "{{ search }}" were found.
        </v-alert>
      </template>

      <template v-slot:no-data>
        <v-alert :value="true" color="error" icon="warning">
          No data available
        </v-alert>
      </template>

    </v-data-table>

  </v-card>

	</div>

</template>

<script>
import axios from 'axios'
import bar from '@/components/AdminTableBar'
import { mapActions } from 'vuex'

export default {
	name: 'AdminTable',

	data () {
		return {
			loaded: false,
      search: '',
      headers: [],
      items: [],
      pagination: {
        sortBy: 'lifecycle_id'
      },
      selected: [],
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
			vname: false,
			inpt: '',
			editable: false,
			baseURL: 'admin'
		}
	},

	components: {
		bar
	},

	computed: {
		item () {
			if (this.selected.length > 0) return this.selected[0]
			return {}
		},
		myItems() {
			return this.$store.getters.instanceItems
		},
		myHeaders () {
			return this.$store.getters.instanceItems
		},
		meta () {
			return this.$store.getters.instanceMeta
		}
	},

	methods:  {
		...mapActions({
      _changeState: 'STATE_CHANGE_MASTERDATA',
      _add: 'NEW_MASTERDATA',
    }),

    changeState (status) {
      this._changeState(`/${this.baseURL}/roles/${this.item.lifecycle_id}/${this.item.version}/${status}`)
    },
    add () {
      this._add(`/${this.baseURL}/roles`, this.item)
    },
		toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.myItems.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
		},
    inlineEditItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
		},
		getColor (status) {
      if (status === 'productive') {
        return '#36B37E'
      } else if (status === 'blocked' || status === 'archived') {
        return '#FF5630'
      } else {
        return '#FFAB00'
      }
		},
		render (key) {
			// TODO: geisteskranken Fehler fixen
			if (this.meta[key]['render']) {
				return true
			}
			return false
		}
	},
	created () {
		this.inpt = `admin/roles`
		// this.load()
		this.$store.dispatch('LOAD_META_MASTERDATA', 'meta/roles')
			.then(() => {
				this.$store.dispatch('LOAD_DATA_MASTERDATA', 'admin/roles')
					.then(() => {
						this.loaded = true
					})
			})
	}
}
</script>

<style>

</style>
