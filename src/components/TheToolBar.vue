<template>
  <div>

    <app-navigation-drawer
      :drawer="drawer"
      :user="user"
      @input="drawer = $event"
    ></app-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      color="indigo"
      dark
      fixed
      :collapse="!collapse"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn
        text
        icon
        exact
        @click="collapse = !collapse"
      >
        <v-icon v-if="collapse">chevron_left</v-icon>
        <v-icon v-else>chevron_right</v-icon>
      </v-btn>
      <v-toolbar-title>
        <router-link
          to="/"
          style="text-decoration: none; color: white;"
        >OpenGxP</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn
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
            icon
            v-on="on"
            @click="logout()"
          >
            <v-icon>input</v-icon>
          </v-btn>
        </template>
        <span>Logout</span>
      </v-tooltip>
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
    collapse: true
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
