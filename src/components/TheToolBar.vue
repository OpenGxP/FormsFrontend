<template>
  <div>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="mini"
      fixed
      app
    >
      <v-list dense>
      
      <v-list-tile>
        <v-list-tile-title class="text-md-center">Navigation</v-list-tile-title>
      </v-list-tile>

      <!-- Administration / Master Data -->
      <v-list-group
        prepend-icon="account_circle"
        value="true"
      >

      <template v-slot:activator>
        <v-list-tile>
          <v-list-tile-title>Administration</v-list-tile-title>
        </v-list-tile>
      </template>

        <v-list-tile
          v-for="(item, i) in administration"
          :key="i"
          router
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

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

          <v-list-tile-action>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>

        </v-list-tile>
      
      </v-list-group>


 
       <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-tile v-if="!mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_left</v-icon>
          </v-list-tile-action>
        </v-list-tile>
            
      </v-list>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title><router-link to="/" style="text-decoration: none; color: white;">OpenGxP</router-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat v-if="user" style="margin: 0px; patting: 0px;"><v-icon>person</v-icon>&nbsp;&nbsp;&nbsp;{{user}}</v-btn>
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
      {title: 'Settings', navigateTo: '/settings'}
    ],
    administration: [
      { title: 'Users', icon: 'person', link: '/users' },
      { title: 'Roles', icon: 'person', link: '/roles' },
      // { title: 'Permissions', icon: 'person', link: '/permissions' },
      { title: 'LDAP', icon: 'person', link: '/ldap' }
    ],
    logs: [
      { title: 'Access Log', icon: 'description', link: '/logs/access' },
      { title: 'Central Log', icon: 'description', link: '/logs/central' },
      // { title: 'Permission Log', icon: 'description', link: '/logs/permissions' },
      { title: 'Role Log', icon: 'description', link: '/logs/roles' },
      { title: 'User Log', icon: 'description', link: '/logs/users' }
    ],
    user: ''
  }),
  props: {
    source: String
  },
  computed: {
    isAuth () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  },
  mounted () {
    this.user = this.$store.getters.currentUser
  }
}
</script>
