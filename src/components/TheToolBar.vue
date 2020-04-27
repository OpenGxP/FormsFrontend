<template>
  <div>
    <!-- main drawer -->
    <app-navigation-drawer
      v-model="drawer"
      :user="user"
    />

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
          <v-btn
            block
            @click="logout()"
          >Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      color="primary"
      fixed
      :collapse="!collapse"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title
        class="ml-0 pl-4"
        style="width: 300px"
      >
        <span class="hidden-sm-and-down">
          <router-link
            to="/"
            style="text-decoration: none; color: white;"
          ><span class="font-weight-light">Open</span><span>GxP</span></router-link>
        </span>
      </v-toolbar-title>

      <v-spacer />

      <app-search />

      <v-tooltip
        v-if="collapse"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="hidden-sm-and-down"
            icon
            v-on="on"
            @click="toInbox()"
          >
            <v-badge
              v-if="numInbox"
              overlap
              color="warning"
            >
              <template v-slot:badge>{{ numInbox }}</template>
              <v-icon>mail</v-icon>
            </v-badge>
            <v-icon v-else>mail</v-icon>
          </v-btn>
        </template>
        <span>Inbox</span>
      </v-tooltip>

      <v-menu
        v-if="collapse"
        offset-y
      >
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                class="hidden-sm-and-down"
                icon
                v-on="{ ...tooltip, ...menu }"
              >
                <v-icon>settings</v-icon>
              </v-btn>
            </template>
            <span>Settings</span>
          </v-tooltip>
        </template>
        <v-card min-width="200px">
          <v-list dense>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="navigate(item.url)"
            >
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="test()">
              <v-list-item-icon>
                <v-icon>help_outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Show Hotkeys'" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <v-menu
        v-if="user && collapse"
        offset-y
      >
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn
                class="hidden-sm-and-down"
                icon
                v-on="{ ...tooltip, ...menu }"
              >
                <v-icon>person</v-icon>
              </v-btn>
            </template>
            <span>Profil & Account</span>
          </v-tooltip>
        </template>
        <v-card min-width="200px">
          <v-list dense>
            <v-subheader>Profile</v-subheader>
            <v-list-item
              v-for="(item, index) in profileItems"
              :key="index"
              @click="navigate(item.url)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout()">
              <v-list-item-content>
                <v-list-item-title>Log out</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

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
import TheGlobalSearch from '@/components/TheGlobalSearch'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    appNavigationDrawer: TheNavigationDrawer,
    appSearch: TheGlobalSearch
  },

  props: {
    source: String
  },
  data: () => ({
    drawer: false,
    mini: false,
    uuser: '',
    text: '',
    collapse: true,
    drawer2: false,
    profileItems: [
      { title: 'Profile', icon: 'calendar_today', url: '/profile' }
    ],
    items: [
      { title: 'Upcoming Tasks', icon: 'calendar_today', url: '/filter' },
      { title: 'Assignements', icon: 'assignment_ind', url: '/filter' }
    ]
  }),

  computed: {
    ...mapGetters({
      // session settings
      numInbox: 'inbox/inboxItems'
    }),
    isAuth () {
      return this.$store.getters.isAuthenticated
    },
    user () {
      const name = this.uuser
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    }
  },

  methods: {
    ...mapActions({
      // overlay
      // TODO: richtigen Pfad zu vuex action hinterlegen
      activate: 'global/overlay/show'
    }),
    test () {
      this.activate()
    },
    logout () {
      this.$store.dispatch('authentication/logout')
    },
    toProfile () {
      this.$router.push({ path: '/profile' })
    },
    toInbox () {
      this.$router.push({ path: '/inbox' })
    },
    navigate (path) {
      this.$router.push({ path: path })
    }
  },

  created () {
    this.uuser = this.$store.getters['user2/username']
    this.text = this.uuser
  }
}
</script>
