<template>
  <!-- tabindex to make div focusable -->
  <div
    ref="main"
    tabindex="0"
    @keyup.67="newItem()"
    @keyup.69="editItem()"
  >

    <!-- toolbar -->
    <v-toolbar
      dark
      color="primary"
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
      <!-- view -->
      <v-tooltip
        bottom
        v-if="config['post'] && ($can('all', 'global') || $can('view', vlink))"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            :disabled="activeSelection"
            @click="viewItem()"
          >
            <v-icon>visibility</v-icon>
          </v-btn>
        </template>
        <span>View</span>
      </v-tooltip>
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
            :disabled="activeSelection || allowedNewVersion"
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
            :input-value="dense"
            @change="tableSettings({ dense: !dense })"
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
          :show-select="tableSelect"
          :single-select="tableSelect"
          multi-sort
          class="elevation-1 tbl"
          @click:row="rowSingleSelect"
          @dblclick:row="editItem()"
        >

          <template v-slot:item.status="{ item }">
            <v-chip :color="getColor(item.status)">{{ item.status }}</v-chip>
          </template>

          <template v-slot:item.initial_password="{ item }">
            <v-icon
              v-text="item.initial_password ? 'done' : 'clear'"
              :color="item.initial_password ? 'green' : 'red'"
            ></v-icon>
          </template>

          <template v-slot:item.ldap="{ item }">
            <v-icon
              v-text="item.ldap ? 'done' : 'clear'"
              :color="item.ldap ? 'green' : 'red'"
            ></v-icon>
          </template>

          <template v-slot:no-results>
            <v-alert
              color="error"
              icon="warning"
            >
              No results for "{{ search }}" were found.
            </v-alert>
          </template>

          <template v-slot:no-data>
            <v-alert
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
          persistent
        >
          <!-- header -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="dialog = false"
              >
                <v-icon>cancel</v-icon>
              </v-btn>
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
                    v-for="(field, index) in formFields"
                    :key="field.name"
                  >
                    <!-- bool -->
                    <v-switch
                      v-if="field.data_type === 'BooleanField'"
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :disabled="view"
                    ></v-switch>
                    <!-- DateTime -->
                    <app-date-time-picker
                      v-else-if="field.data_type === 'DateTimeField'"
                      :dateTimeProp="editedItem[field.name]"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      @change-val="editedItem[field.name]=$event"
                    ></app-date-time-picker>
                    <!-- Permissions -->
                    <permission-allocation
                      v-else-if="field.verbose_name === 'Permissions'"
                      :value="editedItem[field.name]"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      @input="editedItem[field.name] = $event"
                    ></permission-allocation>
                    <!-- Workflows -->
                    <app-workflow-designer
                      v-else-if="field.name === 'steps'"
                      :meta="field"
                      :data="editedItem[field.name]"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      @input="editedItem[field.name] = $event"
                    ></app-workflow-designer>
                    <!-- lookups -->
                    <template v-else-if="field.lookup !== null">
                      <!-- select -->
                      <app-select
                        v-if="field.lookup.method === 'select'"
                        v-model="editedItem[field.name]"
                        :items="field.lookup['data']"
                        :label="field.verbose_name"
                        :hint="field.help_text"
                        :required="field.required"
                        :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                        :multiple="field.lookup['multi']"
                        :autofocus="index === 0"
                        :error="errorMsgs[field.name] ? true : false"
                        :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
                      >
                      </app-select>
                      <!-- select -->
                      <app-combo-box
                        v-else-if="field.lookup.method === 'new'"
                        v-model="editedItem[field.name]"
                        :items="field.lookup['data']"
                        :label="field.verbose_name"
                        :hint="field.help_text"
                        :required="field.required"
                        :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                        :multiple="field.lookup['multi']"
                        :autofocus="index === 0"
                        :error="errorMsgs[field.name] ? true : false"
                        :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
                      >
                      </app-combo-box>
                    </template>
                    <!-- password -->
                    <app-password-field
                      v-else-if="field.data_type === 'PasswordField'"
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :hint="field.help_text"
                      :required="field.required"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      :autofocus="index === 0"
                      :error="errorMsgs[field.name] ? true : false"
                      :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
                    >
                    </app-password-field>
                    <!-- text -->
                    <!-- TODO: support for @keyup.enter="save" -->
                    <app-text-field
                      v-else
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :hint="field.help_text"
                      :required="field.required"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      :autofocus="index === 0"
                      :error="errorMsgs[field.name] ? true : false"
                      :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
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
import AppSelect from '@/components/inputs/AppSelect'
import AppPasswordField from '@/components/inputs/AppPasswordField'
import { mapGetters, mapActions } from 'vuex'

import PermissionAllocation from '@/components/inputs/PermissionAllocation'
import AppWorkflowDesigner from '@/components/inputs/AppWorkflowDesigner'

export default {
  name: 'BaseDataTable',

  data () {
    return {
      view: false,
      mode: null,
      loaded: false,
      search: '',
      headers: [],
      items: [],
      selected: [],
      // dense: false,
      dialog: false,
      editedIndex: -1,
      formFields: [],
      editedItem: {},
      defaultItem: {},
      meta: {},
      postConfig: {},
      veditable: false,
      errorMsgs: {},
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
    appSelect: AppSelect,
    appTextField: AppTextField,
    appPasswordField: AppPasswordField,
    permissionAllocation: PermissionAllocation,
    appWorkflowDesigner: AppWorkflowDesigner
  },

  computed: {
    ...mapGetters({
      // table session settings
      dense: 'session/dense'
    }),
    tableSelect () {
      return this.$route.params.category !== 'logs'
    },
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
    },
    allowedNewVersion () {
      if (!this.config['version']) return false
      if (this.selected[0]['status'] !== 'draft') return false
      return true
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
      if (!val) {
        this.errorMsgs = {}
        this.view = false
      }
    }
  },

  methods: {
    ...mapActions([
      'INIT_MASTERDATA',
      'DELETE_MASTERDATA'
    ]),
    ...mapActions({
      // snackbar
      activate: 'snackbar/activate',
      // table session settings
      tableSettings: 'session/setTable'
    }),
    convert (obj, config) {
      // iterate fields
      for (let [key, value] of Object.entries(obj)) {
        // check for lookup field
        // TODO: this is a workaround to determine if object has children
        if (key in config && 'lookup' in config[key]) {
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
          this.meta = resp.data.get

          // assign fields to render dialoge
          // assigns according data type to fields
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
            } else if (!('data_type' in postFields[keyField])) {
              initItem[keyField] = []
            } else if (postFields[keyField]['data_type'] === 'CharField' && postFields[keyField]['lookup'] !== null) {
              if (postFields[keyField]['lookup']['multi'] === true) {
                initItem[keyField] = []
              } else {
                initItem[keyField] = ''
              }
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
        .catch(err => { this.activate({ color: 'error', error: err.response.data }) })
    },
    inlineEditItem (item) {
      this.editedIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    editItem () {
      // || this.selected[0].status !== 'draft'
      if (this.selected.length === 0) {
        this.activate({ color: 'error', message: `There is no selected item to edit OR the selection is invalid` })
      } else {
        let item = this.convert(this.selected[0], this.postConfig) // this.selected[0] //
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      }
    },
    viewItem () {
      this.view = true
      this.editItem()
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
          this.activate({ color: 'error', message: err.response.data.validation_errors.join('\r\n') })
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
          this.activate({ color: 'success', error: err.response.data.validation_errors.join('\r\n') })
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
        this.selected = []
      }, 300)
    },
    save () {
      let item = this.selected[0]
      const payload = this.editedItem
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
          .catch(err => {
            if ('validation_errors' in err.response.data) this.activate({ color: 'error', message: err.response.data.validation_errors.join('\r\n') })
            else {
              this.activate({ color: 'error', message: 'Missing and / or wrong data' })
              this.errorMsgs = err.response.data
            }
          })
      } else {
        // new item
        // strip empty fields from payload
        for (let propName in payload) {
          if (payload[propName] === null || payload[propName] === undefined || payload[propName] === '') {
            delete payload[propName]
          }
        }
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
            if ('validation_errors' in err.response.data) this.activate({ color: 'error', message: err.response.data.validation_errors.join('\r\n') })
            else {
              this.activate({ color: 'error', message: 'Missing and / or wrong data' })
              this.errorMsgs = err.response.data
            }
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
    // focus main div
    this.$refs.main.focus()
  }
}
</script>

<style>
tbody.tbl tr:nth-of-type(odd) {
  background-color: rgba(48, 48, 48);
}
</style>
