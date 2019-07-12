<template>
  <div>

  <!-- toolbar -->
  <v-toolbar dark color="grey">

    <!-- Data table interaction -->
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="load()"><v-icon>update</v-icon></v-btn>
      </template>
      <span>Reload</span>
    </v-tooltip>
    <v-divider class="mx-2" inset vertical></v-divider>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="newItem()"><v-icon>add</v-icon></v-btn>
      </template>
      <span>Add</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click="editItem()"
          :disabled="activeSelection"
        ><v-icon>edit</v-icon></v-btn>
      </template>
      <span>Edit</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn 
          icon 
          v-on="on" 
          :disabled="activeSelection"
        ><v-icon>file_copy</v-icon></v-btn>
      </template>
      <span>Copy</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
          @click="newVersion()"
          :disabled="activeSelection"
        ><v-icon>plus_one</v-icon></v-btn>
      </template>
      <span>New Version</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon 
          v-on="on"
          @click="deleteItem()"
          :disabled="activeSelection"
        ><v-icon>delete</v-icon></v-btn>
      </template>
      <span>Delete</span>
    </v-tooltip>
    
    <v-spacer></v-spacer>

    <!-- Life Cycle Buttons -->
    <v-btn flat :disabled="activeSelection" @click="changeStatus('circulation')">circulation</v-btn>
    <v-btn flat :disabled="activeSelection" @click="changeStatus('productive')">approve</v-btn>
    <v-btn flat :disabled="activeSelection" @click="changeStatus('draft')">reject</v-btn>
    <v-btn flat :disabled="activeSelection" @click="changeStatus('blocked')">block</v-btn>
    <v-btn flat :disabled="activeSelection" @click="changeStatus('inactive')">inactivate</v-btn>
    <v-btn flat :disabled="activeSelection" @click="changeStatus('archived')">archive</v-btn>
  </v-toolbar>


  <template v-if="loaded">
  <!-- data table wrapper -->
  <v-card>
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

      <!-- dialog -->
      <v-dialog v-model="dialog" max-width="800px">
        <!-- header -->
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <!-- body -->
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <!-- Fields -->
                <v-flex xs12 sm12 md12 v-for="field in formFields" :key="field.name">
                  <!-- bool -->
                  <v-switch v-if="field.data_type === 'BooleanField'"
                    :label="field.verbose_name"
                    v-model="editedItem[field.name]"
                  ></v-switch>
                  <!-- DateTime
                  <app-date-time-picker v-else-if="field.data_type === 'DateTimeField'"
                    @sync-date="editedItem[field.name]=$event"
                    :date="editedItem[field.name]"
                    :label="field.verbose_name"
                    :hint="field.help_text"></app-date-time-picker>
                   -->
                  <!-- select 
                  <app-multi-select v-else-if="field.verbose_name === 'Roles'"
                    :items="roles"
                    label="Roles"
                    @string-value="editedItem[field.name]=$event"></app-multi-select>
                  -->
                  <!-- text -->
                  <v-text-field v-else
                    :label="field.verbose_name"
                    :hint="field.help_text"
                    v-model="editedItem[field.name]"
                    clearable
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <!-- footer -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>

      </v-dialog>

    </v-card-title>


    <!-- data table -->
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="items"
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
            v-if="meta[key]['render'] === true"
            class="text-xs-right"
          >
            <template v-if="key == 'status'"><v-chip :color="getColor(props.item.status)">{{ props.item[key] }}</v-chip></template>
            <template v-else>{{ props.item[key] }}</template>
          </td>
          </template>

          <td v-if="veditable" class="justify-center layout px-0">
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
  </template>

  <v-snackbar
    v-model="snackbar"
    top
    :color="snackbarColor"
    auto-height
    :timeout=6000
  >
    {{ snackbarText }}
    <v-btn
      flat
      @click="snackbar = false"
    >
      Close
    </v-btn>
  </v-snackbar>

  </div>
</template>

<script>
import axios from 'axios'
import AppTooltip from '@/components/AppTooltip'
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'
import AppMultiSelect from '@/components/inputs/AppMultiSelect'
import { mapActions } from 'vuex'

export default {
  name: 'BaseDataTable',
  data () {
    return {
      formFields: [],
      snackbar: false,
      snackbarText: 'I am a snackbar',
      snackbarColor: 'primary',
      loaded: false,
      search: '',
      headers: [],
      items: [],
      pagination: {
        sortBy: 'unique'
      },
      selected: [],
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      defaultItem: {},
      meta: {},
      vname: false,
      veditable: false
    }
  },

   props: {
    vlink: {
      type: String
    }
  },

  components: {
    appTooltip: AppTooltip,
    appDateTimePicker: AppDateTimePicker,
    appMultiSelect: AppMultiSelect
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    roles () {
      return this.$store.getters.validRoles.map(item => item.role)
    },
    activeSelection () {
      if (this.selected.length != 1) {
        return true
      } else {
        return false
      }
    },
    activeSelection () {
      if (this.selected.length != 1) {
        return true
      } else {
        return false
      }
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  methods: {
    ...mapActions([
      'INIT_MASTERDATA', // map `this.increment()` to `this.$store.dispatch('increment')`
      // `mapActions` also supports payloads:
      'DELETE_MASTERDATA', // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      show: 'show', // map `this.add()` to `this.$store.dispatch('increment')`
      setOptions: 'setOptions'
    }),
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.items.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    loadMeta () {
      const endpoint = this.inpt.split('/')[1]
      axios.get(`/meta/${this.vlink}`)
        .then(resp => {
          // assign meta
          const _meta = resp.data.get
          this.meta = _meta


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
          // this.headers = _headers

          // assign fields to render dialoge
          const postFields = resp.data.post
          const formFields = []
          const initItem = {}
          for (let keyField of Object.keys(postFields)) {
            let field = postFields[keyField]
            field.name = keyField
            formFields.push(field)
            if (postFields[keyField]['data_type'] === 'BooleanField') {
              initItem[keyField] = false
            } else {
              initItem[keyField] = ''
            }
          }
          this.formFields = formFields
          this.editedItem = initItem
          this.defaultItem = initItem

          // load actual data
          this.loadData()
        })
    },
    loadData () {
      axios.get(`/${this.inpt}`)
        .then(resp => {
          // bind items and add index for select
          this.items = resp.data
          // test if resp is empty
          const _headers = []
          if (resp.data[0]) {
            for (let key of Object.keys(resp.data[0])) {
              if (this.meta.hasOwnProperty(key)) {
                if (this.meta[key]['render']) {
                  _headers.push(
                    {
                      'value': key,
                      'text': this.meta[key]['verbose_name']
                    }
                  )
                }
              }
            }
          }
          if (_headers) this.headers = _headers
      
          // set laoding state
          this.loaded = true
        })
        .catch(err => {})
    },
    inlineEditItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    editItem () {
      let item = this.selected[0]
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    newItem () {
      this.dialog = true
    },
    changeStatus (target) {
      let item = this.selected[0]
      axios.patch(`${this.inpt}/${item.lifecycle_id}/${item.version}/${target}`)
        .then(resp => {
          //snackbar
          this.setOptions({
            color: 'success',
            message: 'success!',
          })
          this.show()
          /*
          this.snackbarText = 'success'
          this.snackbarColor = 'success'
          this.snackbar = true
          this.load()
          */
        })
        .catch(err => {
          this.snackbarText = err.response.data.validation_errors[0]
          this.snackbarColor = 'error'
          this.snackbar = true
        })
    },
    deleteItem () {
      const item = this.selected[0]
      this.DELETE_MASTERDATA(`${this.inpt}/${item.lifecycle_id}/${item.version}`)
        .then((resp) => {
          this.snackbarText = 'Object was successfully deleted'
          this.snackbarColor = 'success'
          this.snackbar = true
          this.load()
        })
        .catch((err) => {
          this.snackbarText = err.response.data.validation_errors[0]
          this.snackbarColor = 'error'
          this.snackbar = true
          })
    },
    load () {
      this.loadMeta()
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      let item = this.selected[0]
      const payload = this.editedItem
      // strip empty fields from payload
      for (let propName in payload) {
        if (payload[propName] === null || payload[propName] === undefined || payload[propName] === '') {
          delete payload[propName]
        }
      }
      if (this.editedIndex > -1) {
        if (this.$store.getters.shortPatch(this.$route.path.split(/[,/]+/).pop())) {
          var u = `/${this.inpt}/${item.unique}`
        } else {
          var u = `/${this.inpt}/${item.lifecycle_id}/${item.version}`
        }
        console.log(u)
        // edit item
        axios({
          method: 'patch',
          url: u,
          data: payload,
          withCredentials: true
        })
          .then(resp => {
            this.close()
            this.load()
          })
          .catch(err => {
            console.log(err.response.data)
          })
      } else {
        // new item
        axios({
          method: 'post',
          url: `/${this.inpt}`,
          data: payload,
          withCredentials: true
        })
          .then(resp => {
            this.close()
            this.load()
          })
          .catch(err => {
            let errMsg = ''
            for (let key of Object.keys(err.response.data)) {
              errMsg += key + ' : ' + err.response.data[key] + '; '
            }
            this.snackbarColor = 'error'
            this.snackbarText = errMsg
            this.snackbar = true
          })
      }
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
    newVersion () {
      let item = this.selected[0]
      axios({
        method: 'post',
        url: `/${this.inpt}/${item.lifecycle_id}/${item.version}`,
        withCredentials: true
      })
        .then(resp => {
          this.load()
        })
        .catch(err => {
          this.snackbarColor = 'error'
          this.snackbarText = err.response.data
          this.snackbar = true
        })

    }
  },
  
  mounted () {
    console.log(this.vlink)
    this.inpt = `admin/${this.vlink}`
    this.load()
  }
}
</script>
