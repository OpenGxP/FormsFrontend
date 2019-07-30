<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    fixed
    :mini-variant="mini"
    @input="eventHandler"
  >

    <v-list-item>

      <v-btn
        v-if="mini"
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>chevron_right</v-icon>
      </v-btn>

      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>{{ user }}</v-list-item-title>

      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>chevron_left</v-icon>
      </v-btn>

    </v-list-item>

    <v-list
      nav
      dense
    >

      <!-- Drawer content -->
      <template v-for="(value, key, index) in baseData">

        <v-list-group
          :key="index"
          prepend-icon="storage"
          value="true"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{value.title}}</v-list-item-title>
            </v-list-item-content>
          </template>

          <!-- v-if="$can('all', 'global') || $can('read', `${item.title}log`)" -->
          <v-list-item
            v-for="(v, k, i) in value.subjects"
            :key="i"
            router
            :to="`/api/${key}/${k}`"
          >

            <v-list-item-content>
              <v-list-item-title v-text="v.title"></v-list-item-title>
            </v-list-item-content>

          </v-list-item>

        </v-list-group>

      </template>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: ['drawer'],

  data () {
    return {
      mini: false
    }
  },

  computed: {
    isAuth () {
      return this.$store.getters.isAuthenticated
    },
    user () {
      return this.$store.getters.currentUser
    },
    baseData () {
      return this.$store.getters.data
    }
  },

  methods: {
    eventHandler (e) {
      this.$emit('change', e)
    }
  }
}
</script>

<style>
</style>
