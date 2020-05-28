<template>
  <div v-hotkey.stop="keymap">
    <!-- toolbar -->
    <v-toolbar
      color="primary"
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
      />
      <!-- view -->
      <v-tooltip
        v-if="$can('all', 'global') || $can('read', vlink)"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            :disabled="!activeSelection"
            v-on="on"
            @click="viewItem()"
          >
            <v-icon>visibility</v-icon>
          </v-btn>
        </template>
        <span>View</span>
      </v-tooltip>
      <!-- add -->
      <v-tooltip
        v-if="config['post'] && ($can('all', 'global') || $can('add', vlink))"
        bottom
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
        v-if="config['patch'] && ($can('all', 'global') || $can('edit', vlink))"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            :disabled="!(activeSelection && allowedSelection)"
            v-on="on"
            @click="editItem()"
          >
            <v-icon>edit</v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <!-- copy -->
      <v-tooltip
        v-if="config['post'] && ($can('all', 'global') || $can('add', vlink))"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            :disabled="!activeSelection"
            v-on="on"
            @click="copyItem()"
          >
            <v-icon>file_copy</v-icon>
          </v-btn>
        </template>
        <span>Copy</span>
      </v-tooltip>
      <!-- version -->
      <v-tooltip
        v-if="config['version'] && ($can('all', 'global') || $can('version', vlink))"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            :disabled="!(activeSelection && allowedNewVersion)"
            v-on="on"
            @click="initiateNewVersion()"
          >
            <v-icon>plus_one</v-icon>
          </v-btn>
        </template>
        <span>New Version</span>
      </v-tooltip>
      <!-- delete -->
      <v-tooltip
        v-if="config['delete'] && ($can('all', 'global') || $can('delete', vlink))"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            :disabled="!(activeSelection && allowedSelection)"
            v-on="on"
            @click="initiateDelete()"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
      <!-- log -->
      <v-tooltip
        v-if="($can('all', 'global') || $can('read', `${vlink}log`))"
        bottom
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
      <!-- ldap sync -->
      <v-tooltip
        v-if="$can('all', 'global') && vlink === 'roles'"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="syncLdapGroups()"
          >
            <v-icon>sync</v-icon>
          </v-btn>
        </template>
        <span>Sync with ldap</span>
      </v-tooltip>

      <v-spacer />

      <!-- Life Cycle Buttons -->
      <template v-if="config['version']">
        <v-btn
          v-if="$can('all', 'global') || $can('circulation', vlink)"
          text
          :disabled="allowed('circulation')"
          @click="initiateChangeStatus('circulation')"
        >circulation</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('productive', vlink)"
          text
          :disabled="allowed('approve')"
          @click="initiateChangeStatus('productive')"
        >approve</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('reject', vlink)"
          text
          :disabled="allowed('reject')"
          @click="initiateChangeStatus('draft')"
        >reject</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('block', vlink)"
          text
          :disabled="allowed('block')"
          @click="initiateChangeStatus('blocked')"
        >block</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('inactivate', vlink)"
          text
          :disabled="allowed('inactivate')"
          @click="initiateChangeStatus('inactive')"
        >inactivate</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('archive', vlink)"
          text
          :disabled="allowed('archive')"
          @click="initiateChangeStatus('archived')"
        >archive</v-btn>
      </template>

      <!-- Run Time Data -->
      <template v-if="config['status'] === 'rtd'">
        <v-btn
          v-if="$can('all', 'global') || $can('start', vlink)"
          text
          :disabled="allowedRtd('started')"
          @click="initiateChangeStatus('started')"
        >start</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('complete', vlink)"
          text
          :disabled="allowedRtd('complete')"
          @click="initiateChangeStatus('complete')"
        >complete</v-btn>
        <v-btn
          v-if="$can('all', 'global') || $can('cancel', vlink)"
          text
          :disabled="allowedRtd('canceled')"
          @click="initiateChangeStatus('canceled')"
        >cancel</v-btn>
      </template>

      <!-- inbox-->
      <template v-if="vlink === 'inbox'">
        <v-btn
          text
          :disabled="!activeSelection"
          @click="changeStatus({}, 'productive')"
        >
          <v-icon left>done</v-icon>approve
        </v-btn>
        <v-btn
          text
          :disabled="!activeSelection"
          @click="changeStatus({}, 'draft')"
        >
          <v-icon left>clear</v-icon>reject
        </v-btn>
      </template>
    </v-toolbar>

    <app-filter
      :dialog="filterDialog"
      :fields="headers"
      @filterurl="newurl = $event"
      @close-dialog="filterDialog = $event"
      @active-flag="activeFilter = $event"
    />

    <!-- columns -->
    <v-dialog
      v-model="columnSelect"
      max-width="400"
    >
      <v-card class="mx-auto">
        <v-card-title class="headline">Visible Columns</v-card-title>
        <v-list
          subheader
          two-line
          flat
        >
          <v-list-item-group
            v-model="binaryArrayHeaders"
            multiple
          >
            <!-- 1 -->
            <v-list-item
              v-for="(header, index) in headers"
              :key="index"
            >
              <template v-slot:default="{ active, toggle }">
                <v-list-item-action>
                  <v-checkbox
                    v-model="active"
                    color="primary"
                    @click="toggle"
                  />
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>{{ header.text }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-dialog>

    <!-- data table wrapper -->
    <template v-if="loaded">
      <v-card>
        <v-card-title>
          {{ config.title }}
          <v-spacer />
          <!---
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
          --->
          <template v-if="headers.length">
            <v-checkbox
              class="mx-2"
              label="Dense"
              :input-value="dense"
              @change="dense = !dense"
            />
            <v-btn
              class="mx-2"
              tile
              text
              @click="filterDialog = true"
            >
              <v-icon
                left
                :color="activeFilter ? 'primary' : 'default'"
              >tune</v-icon> Filter
            </v-btn>
            <v-btn
              tile
              text
              @click="columnSelect = true"
              :color="binaryArrayHeaders.length !== headers.length ? 'primary' : 'white'"
            >
              <v-icon
                left
                :color="binaryArrayHeaders.length !== headers.length ? 'primary' : 'white'"
              >expand_more</v-icon>{{`${binaryArrayHeaders.length} of ${headers.length}`}} Columns
            </v-btn>
          </template>
        </v-card-title>

        <!-- data table -->
        <v-data-table
          v-model="selected"
          :headers="selectedHeaders"
          hide-default-header
          :items="items"
          :search="search"
          :dense="dense"
          item-key="unique"
          :show-select="tableSelect"
          :single-select="false"
          :multi-sort="false"
          class="elevation-1 tbl"
          :options.sync="options"
          :loading="isLoading"
          loading-text="Loading... Please wait"
          :server-items-length="recordCount"
          :footer-props="{
            itemsPerPageOptions: [5, 10, 15, 25, 50, 100],
            showFirstLastPage: true,
            firstIcon: 'first_page',
            lastIcon: 'last_page',
            prevIcon: 'chevron_left',
            nextIcon: 'chevron_right'
          }"
          @click:row="rowSelect"
        >
          <!-- @click:row="config.status ? rowSelect : rowSingleSelect" -->

          <!--<template
            v-slot:header="{ props: {headers} }"
            v-if="!activeFilter"
          >
            <thead>
              <tr>
                <th
                  v-for="header in headers"
                  :key="header.value"
                >
                  <div class="text-center">
                    <div v-if="!header.text"></div>
                    <v-text-field
                      v-model="header.quickFilter"
                      v-else
                      :append-icon="header.quickFilter != '' ? 'clear' : ''"
                      :label="header.text"
                      @blur="header.quickFilter ? header.active = true : header.active = false"
                      @keydown.enter="header.active = true"
                      @click:append="header.quickFilter = ''; header.active = false"
                    ></v-text-field>
                  </div>
                </th>
              </tr>
            </thead>
          </template>-->

          <template v-slot:header="{ props: { headers, options }, on: { sort } }">
            <thead>
              <tr>
                <th
                  v-for="(header, index) in headers"
                  :key="header.text"
                  :class="['column sortable', options.sortDesc ? 'desc' : 'asc', header.value === options.sortBy[0] ? 'active' : '']"
                  @click="sort(header.value)"
                >
                  <v-row v-if="!index && tableSelect"></v-row>
                  <v-row
                    v-else
                    align="center"
                    justify="center"
                  >
                    <v-col>
                      <v-icon
                        v-if="options.sortBy.includes(header.value)"
                        small
                        color="primary"
                      >{{ options.sortDesc[0] ? 'arrow_downward' : 'arrow_upward' }}</v-icon>
                      <span class="subtitle-2 white--text">{{ header.text }}</span>
                      <v-spacer />
                    </v-col>
                    <v-col>
                      <quick-filter
                        v-if="!activeFilter"
                        v-model="header.quickFilter"
                        @change-val="header.active = $event"
                      ></quick-filter>
                      <!--
                      <quick-filter
                        v-if="!activeFilter && postConfig.keys.includes(header.value)"
                        v-model="header.quickFilter"
                        :options="postConfig[header.value].lookup ? postConfig[header.value].lookup.data : []"
                        @change-val="header.active = $event"
                      ></quick-filter>
                      <quick-filter
                        v-else-if="!activeFilter"
                        v-model="header.quickFilter"
                        @change-val="header.active = $event"
                      ></quick-filter>
                      -->
                    </v-col>
                  </v-row>

                </th>
              </tr>
            </thead>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getColor(item.status)">{{ item.status }}</v-chip>
          </template>

          <template v-slot:item.initial_password="{ item }">
            <v-icon
              :color="item.initial_password ? 'green' : 'red'"
              v-text="item.initial_password ? 'done' : 'clear'"
            />
          </template>

          <template v-slot:item.ldap="{ item }">
            <v-icon
              :color="item.ldap ? 'green' : 'red'"
              v-text="item.ldap ? 'done' : 'clear'"
            />
          </template>

          <template v-slot:item.external="{ item }">
            <v-icon
              :color="item.ldap ? 'green' : 'red'"
              v-text="item.ldap ? 'done' : 'clear'"
            />
          </template>

          <template v-slot:no-results>
            <v-alert
              color="error"
              icon="warning"
            >No results for "{{ search }}" were found.</v-alert>
          </template>

          <template v-slot:no-data>
            <v-alert
              color="error"
              icon="warning"
            >No data available</v-alert>
          </template>
        </v-data-table>

        <!-- signature dialog -->
        <app-signature
          :dialog="sigDialog.dialog"
          :sig="sig.sig"
          :com="sig.com"
          :error="errorMsgs"
          @close-dialog="sigDialog.dialog = $event"
          @get-signature="addSignature($event)"
        />

        <!-- dialog -->
        <v-dialog
          v-model="dialog"
          max-width="800px"
          persistent
          scrollable
        >
          <!-- header -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
              <v-spacer />
              <v-btn
                icon
                @click="dialog = false"
              >
                <v-icon>cancel</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider />
            <!-- body -->
            <v-card-text style="max-height: 800px;">
              <v-container grid-list-md>
                <v-layout wrap>
                  <!-- Fields -->
                  <v-flex
                    v-for="(field, index) in postFields"
                    :key="field.name"
                    xs12
                    sm12
                    md12
                  >
                    <!-- bool -->
                    <v-switch
                      v-if="field.data_type === 'BooleanField'"
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :disabled="view"
                      :error="errorMsgs[field.name] ? true : false"
                      :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
                      error-count="10"
                    />
                    <!-- DateTime -->
                    <app-date-time-picker
                      v-else-if="field.data_type === 'DateTimeField'"
                      :date-time-prop="editedItem[field.name]"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      :label="field.verbose_name"
                      @change-val="editedItem[field.name]=$event"
                    />
                    <!-- Permissions -->
                    <permission-allocation
                      v-else-if="field.verbose_name === 'Permissions'"
                      :value="editedItem[field.name]"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      @input="editedItem[field.name] = $event"
                    />
                    <!-- Workflows -->
                    <app-workflow-designer
                      v-else-if="field.name === 'steps'"
                      :meta="field"
                      :data="editedItem[field.name]"
                      :editable="!view"
                      :error="errorMsgs[field.name] ? true : false"
                      :error-msgs="errorMsgs[field.name] ? errorMsgs[field.name] : {}"
                      :active="dialog"
                      @input="editedItem[field.name] = $event"
                    />
                    <!-- Form designer -->
                    <!-- TODO: watcher for return value and meta-->
                    <app-sections
                      v-else-if="field.name === 'sections'"
                      :xx="editSection"
                      :error="errorMsgs[field.name] ? true : false"
                      :error-msgs="errorSection ? errorSection : {}"
                      @save="newSection($event)"
                    />
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
                        :success="successMsgs.includes(field.name) && editedItem[field.name] !== ''"
                      />
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
                        :success="successMsgs.includes(field.name) && editedItem[field.name] !== ''"
                      />
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
                      :counter="field.max_length"
                      :maxlength="field.max_length"
                      :error="errorMsgs[field.name] ? true : false"
                      :success="successMsgs.includes(field.name) && editedItem[field.name] !== ''"
                      :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
                    />
                    <!-- text -->
                    <app-text-field
                      v-else
                      v-model="editedItem[field.name]"
                      :label="field.verbose_name"
                      :hint="field.help_text"
                      :required="field.required"
                      :editable="view ? false : editedIndex !== -1 ? field.editable : true"
                      :autofocus="index === 0"
                      :counter="field.max_length"
                      :maxlength="field.max_length"
                      :error="errorMsgs[field.name] ? true : false"
                      :errormsgs="errorMsgs[field.name] ? errorMsgs[field.name] : []"
                      :success="successMsgs.includes(field.name) && editedItem[field.name] !== ''"
                      @enter-event="initiateSave()"
                    />
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-divider />
            <!-- footer -->
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >Cancel</v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="view"
                @click="initiateSave()"
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
import _ from 'lodash'
import AppDateTimePicker from '@/components/inputs/AppDateTimePicker'
import AppComboBox from '@/components/inputs/AppComboBox'
import AppTextField from '@/components/inputs/AppTextField'
import AppSelect from '@/components/inputs/AppSelect'
import AppPasswordField from '@/components/inputs/AppPasswordField'
import AppSections from '@/components/SectionWrapper'
import { mapActions } from 'vuex'

import PermissionAllocation from '@/components/inputs/PermissionAllocation'
import AppWorkflowDesigner from '@/components/inputs/AppWorkflowDesigner'

import AppFilter from '@/components/FilterDialog'
import AppSignature from '@/components/TheSignature'
import quickFilter from '@/components/AppQuickfilter'

export default {
  name: 'BaseDataTable',

  components: {
    appDateTimePicker: AppDateTimePicker,
    appComboBox: AppComboBox,
    appSelect: AppSelect,
    appTextField: AppTextField,
    appPasswordField: AppPasswordField,
    permissionAllocation: PermissionAllocation,
    appWorkflowDesigner: AppWorkflowDesigner,
    appFilter: AppFilter,
    appSignature: AppSignature,
    appSections: AppSections,
    quickFilter
  },

  props: {
    vlink: {
      type: String
    },
    config: {
      type: Object
    }
  },

  data () {
    return {
      sigErrors: {},
      search: null,
      dense: false,
      activeFilter: false,
      sigDialog: {
        dialog: false,
        payload: {}
      },
      newurl: '',
      view: false,
      mode: null,
      isLoading: false,
      loaded: false,
      headers: [],
      items: [],
      selected: [],
      sig: {
        sig: 'logging',
        com: 'none'
      },
      filterDialog: false,
      misc: {},
      filter: '',
      dialog: false,
      columnSelect: false,
      editedIndex: -1,
      formFields: [],
      editedItem: {},
      defaultItem: {},
      meta: {},
      entityLevel: {},
      postConfig: {},
      errorMsgs: {},
      successMsgs: [],
      allowedTransistions: {
        draft: ['circulation'],
        circulation: ['reject', 'approve'],
        productive: ['block', 'inactivate', 'archive'],
        blocked: ['approve'],
        inactive: ['blocked'],
        archived: []
      },
      allowedRtdTransistions: {
        created: ['started'],
        started: ['complete', 'canceled'],
        complete: [],
        canceled: []
      },
      recordCount: 0,
      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: []
      },
      modus: '',
      binaryArrayHeaders: []
    }
  },

  computed: {
    editSection () {
      return Object.keys(this.editedItem)
        .filter(key => ['sections', 'fields_text', 'fields_bool'].includes(key))
        .reduce((obj, key) => {
          obj[key] = this.editedItem[key]
          return obj
        }, {})
    },
    errorSection () {
      return Object.keys(this.errorMsgs)
        .filter(key => ['sections', 'fields_text', 'fields_bool'].includes(key))
        .reduce((obj, key) => {
          obj[key] = this.errorMsgs[key]
          return obj
        }, {})
    },
    quickFilterString () {
      const quickFilters = this.headers.filter(
        filter => filter.active === true
      )
      if (quickFilters.length >= 1) {
        let filterString = ''
        for (let filter of quickFilters) {
          if (filterString) {
            filterString = `${filterString}&${filter.value}=contains.${filter.quickFilter}`
          } else {
            filterString = `${filter.value}=contains.${filter.quickFilter}`
          }
        }
        return `${filterString}&and_or=and`
      }
      return ''
    },
    selectedHeaders () {
      return this.headers.filter((header, index) =>
        this.binaryArrayHeaders.includes(index)
      )
    },
    tableSelect () {
      return this.$route.params.category !== 'logs'
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    activeSelection () {
      if (this.selected.length >= 1) {
        return true
      } else {
        return false
      }
    },
    allowedSelection () {
      // returns true if slected item is not version managed OR in status draft
      if (!this.config['version'] && this.config['status'] !== 'rtd') return true
      if (this.selected.length) if (!this.selected.filter(item => item.status !== 'draft').length) return true
      if (this.selected.length) if (!this.selected.filter(item => item.status !== 'created').length) return true
      return false
    },
    allowedNewVersion () {
      if (!this.config['version']) return false
      if (this.selected.length) if (this.selected.filter(item => item.status === 'draft').length) return false
      return true
    },
    keymap () {
      // on keyup to prevent typing c in case of autofocus
      return {
        'c': {
          keyup: this.newItem
        },
        'd': {
          keyup: this.initiateDelete
        },
        'e': {
          keyup: this.editItem
        },
        'v': {
          keyup: this.viewItem
        }
      }
    },
    dialogKeymap () {
      // TODO: make this work
      return {
        'ctrl+s': this.initiateSave()
      }
    },
    sameStatus () {
      if (this.selected.length && this.config.status) {
        let filtered = this.selected.filter(x => x.status !== this.selected[0].status)
        if (filtered.length) return false
        return true
      }
      return false
    },
    postFields () {
      if (this.selected.length) {
        const lookup = this.selected[0].lookup
        if (Object.keys(this.entityLevel).includes(lookup)) {
          const fields = _.cloneDeep(this.formFields)
          for (let field of fields) {
            if (field.name === 'value') {
              field.lookup = {
                data: this.entityLevel[lookup].data,
                method: this.entityLevel[lookup].method,
                multi: this.entityLevel[lookup].multi
              }
            }
          }
          return fields
        }
        return this.formFields
      }
      return this.formFields
    },
    isPossible (action) {
      // returns user permision and
      return this.config['patch'] && (this.$can('all', 'global') || this.$can('edit', this.vlink))
    }
  },

  watch: {
    activeFilter: {
      handler (val) {
        if (val) {
          this.headers.map(header => {
            header.active = false
            return header
          })
        }
      }
    },
    dialog (val) {
      val || this.close()
      if (!val) {
        this.errorMsgs = {}
        this.successMsgs = []
        this.view = false
        // this.$refs.main.focus()
      }
    },
    options: {
      handler (newVal, oldVal) {
        if (
          newVal.page !== oldVal.page ||
          newVal.itemsPerPage !== oldVal.itemsPerPage ||
          newVal.sortBy !== oldVal.sortBy ||
          newVal.sortDesc !== oldVal.sortDesc
        ) {
          this.loadData()
        }
      },
      deep: true
    },
    newurl (val) {
      this.loadData(true)
    },
    quickFilterString (val) {
      this.loadData(true)
    }
  },

  methods: {
    ...mapActions({
      // snackbar
      activate: 'global/snackbar/activate',
      // table session settings
      tableSettings: 'session/setTable'
    }),
    newSection (payload) {
      for (let key of Object.keys(payload)) {
        this.editedItem[key] = payload[key]
      }
      this.initiateSave()
    },
    // signature start
    isSignatureNeeded (action) {
      if (this.misc[action].sig === 'logging' & this.misc[action].com === 'none') return false
      return true
    },
    getSignature (action, transition = false) {
      !transition ? this.sig = _.cloneDeep(this.misc[action]) : this.sig = _.cloneDeep(this.misc[this.mapping(action)])
      this.modus = action
      if (action === 'add' || action === 'edit') {
        this.save({}, true)
      } else {
        this.sigDialog.dialog = true
      }
    },
    // signature end
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
      if (this.selected.includes(e)) { this.selected = this.selected.filter(x => x !== e) } else this.selected.push(e)
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
    syncLdapGroups () {
      this.isLoading = true
      this.$http.get('/admin/roles/ldap')
        .then(resp => {
          this.activate({ color: 'success', message: ['Sync was successful'] })
          this.loadData()
        })
        .catch(err => {
          this.activate({ color: 'error', message: err.response.data })
        })
        .finally(this.isLoading = false)
    },
    loadMeta () {
      // TODO:
      // workaround for meta of logs
      // adds 'log' to meta endpoint
      let getMeta = ''
      if (this.inpt.indexOf('logs') !== -1) getMeta = 'log'
      axios.get(`/meta/${this.vlink}${getMeta}`).then(resp => {
        // assign meta
        this.meta = resp.data.get
        this.misc = resp.data.misc

        // assign fields to render dialoge
        // assigns according data type to fields
        this.postConfig = resp.data.post
        const postFields = resp.data.post
        const formFields = []
        const initItem = {}
        const sections = []
        for (let keyField of Object.keys(postFields)) {
          let field = postFields[keyField]
          field.name = keyField
          if (field.name !== 'fields_text' && field.name !== 'fields_bool' && field.name !== 'sections') formFields.push(field)
          // push sections, text_fields, bool_fields as single object
          if (field.name === 'fields_text' || field.name === 'fields_bool' || field.name === 'sections') sections.push(field)
          if (postFields[keyField]['data_type'] === 'BooleanField') {
            initItem[keyField] = false
          } else if (!('data_type' in postFields[keyField])) {
            initItem[keyField] = []
          } else if (
            postFields[keyField]['data_type'] === 'CharField' &&
            postFields[keyField]['lookup'] !== null
          ) {
            if (postFields[keyField]['lookup']['multi'] === true) {
              initItem[keyField] = []
            } else {
              initItem[keyField] = ''
            }
          } else {
            initItem[keyField] = ''
          }
        }
        if (sections.length) formFields.push({ name: 'sections', data: sections })
        this.formFields = formFields
        this.editedItem = initItem
        this.defaultItem = initItem
        // entit
        if ('data' in resp.data) this.entityLevel = resp.data.data
        // load actual data
        this.loadData()
      })
    },
    loadData (newFilter = false) {
      this.isLoading = true
      // variable for ajax call
      let path = ''
      // assign parameters for sorting & pagination
      const { page, itemsPerPage, sortBy, sortDesc } = this.options
      // pagination
      let offset = 0
      if (page > 1) {
        offset = (page - 1) * itemsPerPage
      }
      if (newFilter) {
        offset = 0
        this.options.page = 1
      }
      // sorting
      // case: sorting active
      if (sortBy.length > 0) {
        // case: asc
        if (sortDesc[0]) {
          path = `/${
            this.inpt
          }?limit=${itemsPerPage}&offset=${offset}&order_by=${sortBy[0]}.asc`
          // case: desc
        } else {
          path = `/${
            this.inpt
          }?limit=${itemsPerPage}&offset=${offset}&order_by=${sortBy[0]}.desc`
        }
      } else {
        path = `/${this.inpt}?limit=${itemsPerPage}&offset=${offset}`
      }
      // filtering
      if (this.newurl !== '' && this.activeFilter) {
        path = `${path}&${this.newurl}`
      } else if (this.quickFilterString !== '' && !this.activeFilter) {
        path = `${path}&${this.quickFilterString}`
      }
      // ajax call
      axios
        .get(path)
        .then(resp => {
          // bind items and add index for select
          this.recordCount = resp.data.count
          this.items = resp.data.results
          // test if resp is empty
          const _headers = []
          if (resp.data.results[0]) {
            for (let key of Object.keys(resp.data.results[0])) {
              if (this.meta.hasOwnProperty(key)) {
                if (this.meta[key]['render']) {
                  _headers.push({
                    value: key,
                    text: this.meta[key]['verbose_name'],
                    quickFilter: '',
                    active: false
                  })
                }
              }
            }
          }
          if (this.headers.length === 0 && _headers) {
            let Filters = []
            for (let header of _headers) {
              Filters.push(
                Object.assign({ quickFilter: '', active: false }, header)
              )
            }
            this.headers = Filters
          }
          if (!this.binaryArrayHeaders.length) {
            this.binaryArrayHeaders = Array.from(
              Array(this.headers.length <= 7 ? this.headers.length : 7).keys()
            )
          }
          // set laoding state
          this.loaded = true
        })
        .finally(this.isLoading = false)
    },
    editItem () {
      if (this.config['patch'] && (this.$can('all', 'global') || this.$can('edit', this.vlink)) && (this.activeSelection && this.allowedSelection)) {
        let item = this.convert(this.selected[0], this.postConfig)
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      }
    },
    viewItem () {
      if ((this.$can('all', 'global') || this.$can('read', this.vlink)) && this.activeSelection) {
        this.view = true
        let item = this.convert(this.selected[0], this.postConfig)
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      }
    },
    newItem () {
      if (this.config['post'] && (this.$can('all', 'global') || this.$can('add', this.vlink))) {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.dialog = true
      }
    },
    copyItem () {
      if (this.config['post'] && (this.$can('all', 'global') || this.$can('add', this.vlink))) {
        // tmporary object to avoid copying lifecycle id etc. of existing selected record
        const tmp = {}
        for (let key of Object.keys(this.editedItem)) {
          if (this.postConfig[key].lookup) {
            tmp[key] = this.selected[0][key].split(',')
          } else {
            tmp[key] = this.selected[0][key]
          }
        }
        this.editedItem = Object.assign({}, tmp)
        this.dialog = true
        this.save({}, true)
      }
    },
    openLog () {
      // if no object is selected move to according log overview
      if (!this.selected.length) { this.$router.push({ path: `/api/${this.config.log.rel}` }) }
      // TODO: else show log entries of selected object
    },
    initiateSave () {
      if (this.editedIndex > -1) {
        // case edit item
        if (this.config['patch'] && (this.$can('all', 'global') || this.$can('edit', this.vlink)) && (this.activeSelection && this.allowedSelection)) {
          if (this.isSignatureNeeded('edit')) {
            this.getSignature('edit')
          } else {
            this.save()
          }
        }
      } else {
        // case add new item
        if (this.config['post'] && (this.$can('all', 'global') || this.$can('edit', this.vlink))) {
          if (this.isSignatureNeeded('add')) {
            this.getSignature('add')
          } else {
            this.save()
          }
        }
      }
    },
    initiateDelete () {
      // check if delete is allowed
      // TODO: Prüfung dass alle selected items gleichen status haben und slected != 0 ist fehlt noch
      if (this.config['delete'] && (this.$can('all', 'global') || this.$can('delete', this.vlink)) && (this.activeSelection && this.allowedSelection)) {
        // check if signature for action "delete" is needed
        if (this.isSignatureNeeded('delete')) {
          // case either signature or comment is needed
          this.getSignature('delete')
        } else {
          // case neither signature nor comment is needed
          this.delete()
        }
      }
    },
    initiateNewVersion () {
      // check if delete is allowed
      // TODO: Prüfung dass alle selected items gleichen status haben und slected != 0 ist fehlt noch
      if (this.config['version'] && (this.$can('all', 'global') || this.$can('version', this.vlink))) {
        // check if signature for action "delete" is needed
        if (this.isSignatureNeeded('version')) {
          // case either signature or comment is needed
          this.getSignature('version')
        } else {
          // case neither signature nor comment is needed
          this.newVersion()
        }
      }
    },
    initiateChangeStatus (target) {
      if (this.isSignatureNeeded(this.mapping(target))) {
        this.getSignature(target, true)
      } else {
        this.modus = target
        this.changeStatus()
      }
    },
    delete (sig = {}) {
      let payload = {}
      if (sig) Object.assign(payload, sig)
      for (let item of this.selected) {
        axios({
          method: 'delete',
          url: !this.config['version'] ? `/${this.inpt}/${item.unique}` : `/${this.inpt}/${item.lifecycle_id}/${item.version}`,
          data: payload,
          withCredentials: true
        })
          .then(resp => {
            this.activate({
              color: 'success',
              message: ['Object was successfully deleted']
            })
            this.loadData()
            this.sigDialog.dialog = false
          })
          .catch(err => {
            this.handleErrors(err.response.data)
            this.sigErrors = err.response.data
          })
      }
      this.selected = []
    },
    newVersion (sig = {}) {
      let payload = {}
      if (sig) Object.assign(payload, sig)
      for (let item of this.selected) {
        this.$http.post(`/${this.inpt}/${item.lifecycle_id}/${item.version}`)
          .then(resp => {
            this.loadData()
            this.sigDialog.dialog = false
          })
          .catch(err => {
            this.handleErrors(err.response.data)
          })
      }
    },
    changeStatus (sig = {}, secondary = null) {
      // scondary fo special case inbox
      for (let item of this.selected) {
        axios
          .patch(
            !secondary ? this.config.version ? `${this.inpt}/${item.lifecycle_id}/${item.version}/${this.modus}` : `${this.inpt}/${item.unique}/${this.modus}` : `/md/forms/${item.lifecycle_id}/${item.version}/${secondary}`,
            sig
          )
          .then(resp => {
            // snackbar
            this.activate({
              color: 'success',
              message: [`Object was successfully set to status ${this.modus}`]
            })
            this.loadData()
            this.selected = []
            this.sigDialog.dialog = false
          })
          .catch(err => {
            this.handleErrors(err.response.data)
          })
      }
      this.selected = []
    },
    save (sig = {}, validate = false) {
      // validate
      const context = validate ? `${this.inpt}_validate` : this.inpt
      let item = this.selected[0]
      let payload = Object.assign({}, this.editedItem)
      // if payload of signature != empty, assign sig to payload of api call
      if (sig) Object.assign(payload, sig)
      // strip empty fields from payload
      for (let propName in payload) {
        if (
          payload[propName] === null ||
          payload[propName] === undefined ||
          payload[propName] === ''
        ) {
          delete payload[propName]
        }
      }
      if (this.editedIndex > -1) {
        // edit
        // edit item

        axios({
          method: 'patch',
          url: !this.config['version'] ? `/${context}/${item.unique}` : `/${context}/${item.lifecycle_id}/${item.version}`,
          data: payload,
          withCredentials: true
        })
          .then(resp => {
            if (validate) {
              // to do show success messages
              this.sigDialog.dialog = true
            } else {
              this.close()
              this.loadData()
              this.sigDialog.dialog = false
            }
          })
          .catch(err => {
            this.handleErrors(err.response.data, ['Missing and / or wrong data'])
            this.successMsgs = Object.keys(this.editedItem).filter(key => this.editedItem[key]).filter(x => !Object.keys(err.response.data).includes(x))
          })
      } else {
        // new item
        axios({
          method: 'post',
          url: `/${context}`,
          data: payload,
          withCredentials: true
        })
          .then(resp => {
            if (validate) {
              // to do show success messages
              this.sigDialog.dialog = true
            } else {
              this.close()
              this.loadData()
              this.sigDialog.dialog = false
            }
          })
          .catch(err => {
            this.handleErrors(err.response.data, ['Missing and / or wrong data'])
            this.successMsgs = Object.keys(this.editedItem).filter(key => this.editedItem[key]).filter(x => !Object.keys(err.response.data).includes(x))
          })
      }
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
    addSignature (sig) {
      // missing version, ldap, version_archived
      switch (this.modus) {
        case 'delete':
          this.delete(sig)
          break
        case 'add':
          this.save(sig)
          break
        case 'edit':
          this.save(sig)
          break
        case 'version':
          this.newVersion(sig)
          break
        default:
          this.changeStatus(sig)
          break
      }
    },
    mapping (permission) {
      // mapping of permission to transition target
      switch (permission) {
        case 'archived':
          return 'archive'
        case 'blocked':
          return 'block'
        case 'circulation':
          return 'circulation'
        case 'inactive':
          return 'inactivate'
        case 'productive':
          return 'productive'
        case 'draft':
          return 'reject'
        case 'canceled':
          return 'cancel'
        case 'complete':
          return 'complete'
        case 'started':
          return 'start'
      }
    },
    getColor (status) {
      if (status === 'productive' || status === 'complete') {
        return '#36B37E'
      } else if (status === 'blocked' || status === 'archived' || status === 'canceled') {
        return '#FF5630'
      } else {
        return '#FFAB00'
      }
    },
    allowed (transition) {
      // this.selected.length !== 1)
      if (!this.sameStatus) {
        return true
      } else {
        const currentStatus = this.selected[0]['status']
        if (this.allowedTransistions[currentStatus].indexOf(transition) > -1) { return false }
        return true
      }
    },
    allowedRtd (transition) {
      // this.selected.length !== 1)
      if (!this.sameStatus) {
        return true
      } else {
        const currentStatus = this.selected[0]['status']
        if (this.allowedRtdTransistions[currentStatus].indexOf(transition) > -1) { return false }
        return true
      }
    },
    handleErrors (payloadErrors, msgs = []) {
      if ('validation_errors' in payloadErrors || msgs.length) {
        this.activate({
          color: 'error',
          message: !msgs.length ? payloadErrors['validation_errors'] : msgs
        })
      }
      this.errorMsgs = _.cloneDeep(payloadErrors)
    }
  },

  mounted () {
    // set default num of items for pagination
    this.options.itemsPerPage = parseInt(this.$store.getters['user2/profile']['gui.pagination'])
    // set default for dense prop of table
    this.dense = this.$store.getters['user2/profile']['gui.dense'] === 'Yes'

    this.inpt = this.config['url']['rel']
    this.load()
    // focus main div
    // this.$refs.main.focus()
  }
}
</script>

<style>
tbody.tbl tr:nth-of-type(odd) {
  background-color: rgba(48, 48, 48);
}
</style>
