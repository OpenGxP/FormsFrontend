<template>
  <div>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      fixed
      app
    >

      <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ user }}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>

      <v-list dense>

       <!-- Administration / Master Data -->
      <v-list-group
        prepend-icon="storage"
        value="true"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Admin</v-list-tile-title>
          </v-list-tile>
        </template>

        <v-list-tile
          v-for="(item, i) in masterData"
          :key="i"
          router
          :to="item.link"
        >

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-tile-action>
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </v-list-tile-action>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      
      </v-list-group>

      <!-- Logs -->
      <v-list-group
        prepend-icon="storage"
        value="true"
      >
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Logs</v-list-tile-title>
          </v-list-tile>
        </template>

        <v-list-tile
          v-for="(item, i) in logs"
          :key="i"
          router
          :to="item.link"
        >

          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-list-tile-action>
                <v-icon v-on="on">{{ item.icon }}</v-icon>
              </v-list-tile-action>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      
      </v-list-group>

      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" style="text-decoration: none; color: white;">OpenGxP</router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn 
        flat 
        v-if="user" 
        style="margin: 0px; patting: 0px;"
        @mouseover="text = 'logout'"
        @mouseleave="text = user">
        <v-icon>person</v-icon>&nbsp;&nbsp;&nbsp;{{text}}
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on"><v-icon>settings</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-tile v-for="(item, index) in items" :key="index" :to="item.navigateTo">
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="logout()"><v-icon>input</v-icon></v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    mini: false,
    items: [
      {title: 'Profile', navigateTo: '/profile'},
      {title: 'Test', navigateTo: '/test'}
    ],
    administration: [
      { title: 'Users', icon: 'person', link: '/users' },
      { title: 'Roles', icon: 'person', link: '/roles' },
      { title: 'LDAP', icon: 'person', link: '/ldap' }
    ],
    llogs: [],
    uuser: '',
    text: ''
  }),
  props: {
    source: String
  },
  computed: {
    isAuth () {
      return this.$store.getters.isAuthenticated
    },
    user () {
      const name = this.uuser
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    logs () {
      return this.$store.getters.logs.map(obj => {
        return {
          title: obj,
          icon: 'description',
          link: { name: 'logInstance', params: { instance: `${obj}` } }
        }
      })
    },
    masterData () {
      return this.$store.getters.masterData.map(obj => {
        return {
          title: obj,
          icon: 'description',
          link: { name: 'mdInstance', params: { instance: `${obj}` } }
        }
      })
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  },
  created () {
    this.uuser = this.$store.getters.currentUser
    this.text = this.uuser
  }
}
</script>
