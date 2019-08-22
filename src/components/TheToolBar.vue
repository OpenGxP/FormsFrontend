<template>
  <div>

    <!-- main drawer -->
    <app-navigation-drawer
      v-model="drawer"
      :user="user"
    ></app-navigation-drawer>

    <!-- temp mobile drawer -->
    <v-navigation-drawer
      v-model="drawer2"
      absolute
      right
    >
      <v-list dense>
        <v-list-item to="/profile">
          <v-list-item-action>
            <v-icon>person</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

       <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout()">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      color="primary"
      dark
      fixed
      :collapse="!collapse"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link
          to="/"
          style="text-decoration: none; color: white;"
        >OpenGxP</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        class="hidden-sm-and-down"
        text
        to="/profile"
        v-if="user && collapse"
        @mouseover="text = 'my profile'"
        @mouseleave="text = user"
      >
        <v-icon>person</v-icon>&nbsp;&nbsp;&nbsp;{{text}}
      </v-btn>

      <v-tooltip
        bottom
        v-if="collapse"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="hidden-sm-and-down"
            icon
            v-on="on"
            @click="logout()"
          >
            <v-icon>input</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>

      <v-btn
        class="hidden-md-and-up"
        icon
        @click.stop="drawer2 = !drawer2"
      >
        <v-icon>more_vert</v-icon>
      </v-btn>

    </v-app-bar>
  </div>
</template>

<script>
import TheNavigationDrawer from '@/components/TheNavigationDrawer'

export default {
  data: () => ({
    drawer: false,
    mini: false,
    uuser: '',
    text: '',
    collapse: true,
    drawer2: false
  }),

  props: {
    source: String
  },

  components: {
    appNavigationDrawer: TheNavigationDrawer
  },

  computed: {
    isAuth () {
      return this.$store.getters.isAuthenticated
    },

    user () {
      const name = this.uuser
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
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
