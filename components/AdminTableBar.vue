<template>
<!-- toolbar -->
<v-toolbar dark color="grey">

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click="reload()"><v-icon>update</v-icon></v-btn>
    </template>
    <span>Reload</span>
  </v-tooltip>

  <v-divider class="mx-2" inset vertical></v-divider>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click="add()"><v-icon>add</v-icon></v-btn>
    </template>
    <span>Add</span>
  </v-tooltip>

  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on"
        @click="edit()"
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
        @click="test()"
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
  <template v-for="(btn, index) in buttons">
    <v-btn
      :key="index"
      flat 
      :disabled="activeSelection" 
      @click="changeState(btn.state)"
    >{{btn.label}}
    </v-btn>
  </template>

</v-toolbar>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AdminTableBar',
  data () {
    return {
      buttons: [
        {label: 'Cirrculation', state: 'circulation'},
        {label: 'Approve', state: 'productive'},
        {label: 'Reject', state: 'draft'},
        {label: 'Block', state: 'blocked'},
        {label: 'Inactivate', state: 'inactive'},
        {label: 'Archive', state: 'archived'},
      ],
      activeSelection: false,
      baseURL: 'admin'
    }
  },

  props: {
    item: {
      type: Object,
      default: ''
    }
  },

  computed: {
    activeItem () {
      return this.item
    }
  },

  methods: {
    ...mapActions({
      _changeState: 'STATE_CHANGE_MASTERDATA',
      _add: 'NEW_MASTERDATA',
      _edit: 'EDIT_MASTERDATA',
      _newVersion: 'NEWV_VERSION_MASTERDATA',
      _delete: 'DELETE_MASTERDATA',
      _reload: 'RELOAD_MASTERDATA'
    }),
    test () {
      console.log(this.item)
    },
    changeState (status) {
      this._changeState(`/${this.baseURL}/roles/${this.item.lifecycle_id}/${this.item.version}/${status}`)
    },
    add () {
      this._add(`/${this.baseURL}/roles`, this.item)
    },
    edit () {
      this._edit(`/${this.baseURL}/roles/${this.item.lifecycle_id}/${this.item.version}`, this.item)
    },
    newVersion () {
      this._newVersion(`/${this.baseURL}/roles/${this.item.lifecycle_id}/${this.item.version}`)
    },
    deleteItem () {
      this._delete({
        'endpoint': `/${this.baseURL}/roles/${this.item.lifecycle_id}/${this.item.version}`, 
        'data': this.item
      })
    },
    reload () {
      this._reload(`/${this.baseURL}/roles`)
    }
  }

}
</script>

<style>

</style>
