<template>
  <div>

    <!-- toolbar -->
    <v-toolbar
      dark
      color="grey"
      fixed
    >

      <!-- Data table interaction -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="load()"
          >
            <v-icon>update</v-icon>
          </v-btn>
        </template>
        <span>Reload</span>
      </v-tooltip>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <!-- add -->
      <v-tooltip
        bottom
        v-if="config['post'] && ($can('all', 'global') || $can('add', vlink))"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="newItem()"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </template>
        <span>Add</span>
      </v-tooltip>
      <!-- edit -->
      <v-tooltip
        bottom
        v-if="config['patch'] && ($can('all', 'global') || $can('edit', vlink))"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="editItem()"
            :disabled="activeSelection || allowedSelection"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <!-- version -->
      <v-tooltip
        bottom
        v-if="config['version'] && ($can('all', 'global') || $can('version', vlink))"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="newVersion()"
            :disabled="activeSelection"
          >
            <v-icon>plus_one</v-icon>
          </v-btn>
        </template>
        <span>New Version</span>
      </v-tooltip>
      <!-- delete -->
      <v-tooltip
        bottom
        v-if="config['delete'] && ($can('all', 'global') || $can('delete', vlink))"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="deleteItem()"
            :disabled="activeSelection || allowedSelection"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
      <!-- log -->
      <v-tooltip
        bottom
        v-if="($can('all', 'global') || $can('read', `${vlink}log`))"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="openLog()"
          >
            <v-icon>event_note</v-icon>
          </v-btn>
        </template>
        <span>Log</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <!-- Life Cycle Buttons -->
      <template v-if="config['version']">
        <v-btn
          text
          :disabled="allowed('circulation')"
          @click="changeStatus('circulation')"
          v-if="$can('all', 'global') || $can('circulation', vlink)"
        >circulation</v-btn>
        <v-btn
          text
          :disabled="allowed('approve')"
          @click="changeStatus('productive')"
          v-if="$can('all', 'global') || $can('productive', vlink)"
        >approve</v-btn>
        <v-btn
          text
          :disabled="allowed('reject')"
          @click="changeStatus('draft')"
          v-if="$can('all', 'global') || $can('reject', vlink)"
        >reject</v-btn>
        <v-btn
          text
          :disabled="allowed('block')"
          @click="changeStatus('blocked')"
          v-if="$can('all', 'global') || $can('block', vlink)"
        >block</v-btn>
        <v-btn
          text
          :disabled="allowed('inactivate')"
          @click="changeStatus('inactive')"
          v-if="$can('all', 'global') || $can('inactivate', vlink)"
        >inactivate</v-btn>
        <v-btn
          text
          :disabled="allowed('archive')"
          @click="changeStatus('archived')"
          v-if="$can('all', 'global') || $can('archive', vlink)"
        >archive</v-btn>
      </template>
    </v-toolbar>

    <!-- data table wrapper -->
    <template v-if="loaded">
      <v-card>
        <v-card-title>
          {{ config.title }}
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          <v-checkbox
            class="pl-5"
            label="Dense"
            v-model="dense"
          ></v-checkbox>

        </v-card-title>

        <!-- data table -->
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="items"
          :search="search"
          :dense="dense"
          item-key="unique"
          show-select
          multi-sort
          single-select
          class="elevation-1"
          @click:row="rowSingleSelect"
        >

          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getColor(item.status)"
              dark
            >{{ item.status }}</v-chip>
          </template>

          <template v-slot:no-results>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >
              No results for "{{ search }}" were found.
            </v-alert>
          </template>

          <template v-slot:no-data>
            <v-alert
              :value="true"
              color="error"
              icon="warning"
            >
              No data available
            </v-alert>
          </template>

        </v-data-table>
        <!-- dialog -->
        <v-dialog
          v-model="dialog"
          max-width="800px"
        >
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
                  <v-flex
                    xs12
                    sm12
                    md12
                    v-for="field in formFields"
                    :key="field.name"
                  >
                    <!-- bool -->
                    <v-switch
                      v-if="field.data_type === 'BooleanField'"
                      :label="field.verbose_name"
                      v-model="editedItem[field.name]"
                    ></v-switch>
                    <!-- DateTime -->
                    <app-date-time-picker
                      v-else-if="field.data_type === 'DateTimeField'"
                      :dateTimeProp="editedItem[field.name]"
                      @change-val="editedItem[field.name]=$event"
                    ></app-date-time-picker>
                    <!-- Permissions -->
                    <permission-allocation
                      v-else-if="field.verbose_name === 'Permissions'"
                      :value="editedItem[field.name]"
                      @input="editedItem[field.name] = $event"
                    ></permission-allocation>
                    <!-- Workflows -->
                    <app-workflow-designer v-else-if="field.verbose_name === 'Workflow'"></app-workflow-designer>
                    <!-- select -->
                    <app-combo-box
                      v-else-if="field.lookup !== null"
                      v-model="editedItem[field.name]"
                      :items="field.lookup['data']"
                      :label="field.verbose_name"
                      :hint="field.help_text"
                      :required="field.required"
                      :editable="field.editable"
                      :multiple="field.lookup['multi']"
                    >
                    </app-combo-box>
                    <!-- password -->
                    <app-password-field
                      v-else-if="field.data_type === 'PasswordField'"
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :hint="field.help_text"
                      :required="field.required"
                      :editable="field.editable"
                    >
                    </app-password-field>
                    <!-- text -->
                    <app-text-field
                      v-else
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :hint="field.help_text"
                      :required="field.required"
                      :editable="field.editable"
                    >
                    </app-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <!-- footer -->
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >Cancel</v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >Save</v-btn>
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-card>
    </template>

  </div>
</template>

<script>
import axios from 'axios'
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'
import AppComboBox from '@/components/inputs/AppComboBox'
import AppTextField from '@/components/inputs/AppTextField'
import AppPasswordField from '@/components/inputs/AppPasswordField'
import { mapActions } from 'vuex'
import PermissionAllocation from '@/components/inputs/PermissionAllocation'
import AppWorkflowDesigner from '@/components/inputs/AppWorkflowDesigner'

export default {
  name: 'BaseDataTable',

  data () {
    return {
      loaded: false,
      search: '',
      headers: [],
      items: [],
      selected: [],
      dense: false,
      dialog: false,
      editedIndex: -1,
      formFields: [],
      editedItem: {},
      defaultItem: {},
      meta: {},
      postConfig: {},
      veditable: false,
      allowedTransistions: {
        draft: ['circulation'],
        circulation: ['reject', 'approve'],
        productive: ['reject', 'block', 'inactivate', 'archive'],
        blocked: ['approve'],
        inactive: ['blocked'],
        archived: []
      }
    }
  },

  props: {
    vlink: {
      type: String
    },
    config: {
      type: Object
    }
  },

  components: {
    appDateTimePicker: AppDateTimePicker,
    appComboBox: AppComboBox,
    appTextField: AppTextField,
    appPasswordField: AppPasswordField,
    permissionAllocation: PermissionAllocation,
    appWorkflowDesigner: AppWorkflowDesigner
  },

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    roles () {
      return this.$store.getters.validRoles.map(item => item.role)
    },
    activeSelection () {
      if (this.selected.length !== 1) {
        return true
      } else {
        return false
      }
    },
    allowedSelection () {
      if (!this.config['version']) return false
      if (this.selected[0]['status'] === 'draft') return false
      return true
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  methods: {
    ...mapActions([
      'INIT_MASTERDATA',
      'DELETE_MASTERDATA'
    ]),
    ...mapActions({
      // snackbar
      activate: 'snackbar/activate'
    }),
    convert (obj, config) {
      // iterate fields
      for (let [key, value] of Object.entries(obj)) {
        // check for lookup field
        if (key in config) {
          // convert multi look up only
          if (config[key]['lookup'] !== null) {
            if (config[key]['lookup']['multi'] === true) {
              // empty string
              if (value.length === 0) {
                obj[key] = []
                // no comma separation, single value
              } else if (value.indexOf(',') === -1) {
                obj[key] = [value]
                // comma separation
              } else {
                obj[key] = value.split(',')
              }
            }
          }
        }
      }
      return obj
    },
    rowSelect (e) {
      // toggle row selection by click
      if (this.selected.includes(e)) this.selected = this.selected.filter(x => x !== e)
      else this.selected.push(e)
    },
    rowSingleSelect (e) {
      if (this.selected.includes(e)) {
        this.selected = []
      } else if (this.selected.length) {
        this.selected = []
        this.selected.push(e)
      } else {
        this.selected.push(e)
      }
    },
    loadMeta () {
      // TODO:
      // workaround for meta of logs
      // adds 'log' to meta endpoint
      let getMeta = ''
      if (this.inpt.indexOf('logs') !== -1) getMeta = 'log'
      axios.get(`/meta/${this.vlink}${getMeta}`)
        .then(resp => {
          // assign meta
          const _meta = resp.data.get
          this.meta = resp.data.get

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
          this.postConfig = resp.data.post
          const postFields = resp.data.post
          const formFields = []
          const initItem = {}
          for (let keyField of Object.keys(postFields)) {
            let field = postFields[keyField]
            field.name = keyField
            formFields.push(field)
            if (postFields[keyField]['data_type'] === 'BooleanField') {
              initItem[keyField] = false
            } else if (postFields[keyField]['data_type'] === 'CharField' && postFields[keyField]['lookup'] !== null) {
              if (postFields[keyField]['lookup']['multi'] === true) initItem[keyField] = []
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
        .catch(err => { })
    },
    inlineEditItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    editItem () {
      let item = this.convert(this.selected[0], this.postConfig)
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    newItem () {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialog = true
    },
    openLog () {
      this.$router.push({ name: 'logInstance', params: { instance: this.vlink } })
    },
    changeStatus (target) {
      let item = this.selected[0]
      axios.patch(`${this.inpt}/${item.lifecycle_id}/${item.version}/${target}`)
        .then(resp => {
          // snackbar
          this.activate({ color: 'success', message: `Object was successfully set to status ${target}` })
          this.load()
          this.selected = []
        })
        .catch(err => {
          // snackbar
          this.activate({ color: 'error', message: err.response.data.validation_errors[0] })
        })
    },
    deleteItem () {
      const item = this.selected[0]
      // TODO: find better solution
      var u = ''
      if (!this.config['version']) {
        u = `/${this.inpt}/${item.unique}`
      } else {
        u = `/${this.inpt}/${item.lifecycle_id}/${item.version}`
      }
      axios.delete(u)
        .then((resp) => {
          this.activate({ color: 'success', message: 'Object was successfully deleted' })
          this.load()
        })
        .catch((err) => {
          this.activate({ color: 'success', error: err.response.data.validation_errors[0] })
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
        // TODO: find better solution
        var u = ''
        if (!this.config['version']) {
          u = `/${this.inpt}/${item.unique}`
        } else {
          u = `/${this.inpt}/${item.lifecycle_id}/${item.version}`
        }
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
          .catch(err => { })
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
            this.activate({ color: 'error', message: errMsg })
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
          this.activate({ color: 'error', message: err.response.data })
        })
    },
    allowed (transition) {
      if (this.selected.length !== 1) {
        return true
      } else {
        const currentStatus = this.selected[0]['status']
        if (this.allowedTransistions[currentStatus].indexOf(transition) > -1) return false
        return true
      }
    }
  },

  mounted () {
    this.inpt = this.config['url']['rel']
    this.load()
  }
}
</script>

<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
