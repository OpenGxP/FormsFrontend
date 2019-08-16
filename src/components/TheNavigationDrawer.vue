<template>
  <v-navigation-drawer
    v-model="data"
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
      <template v-for="(data, key, index) in baseData">

        <v-list-group
          :key="index"
          :prepend-icon="mini ? storage : null"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{data.title}}</v-list-item-title>
            </v-list-item-content>
          </template>

          <!-- TODO: replace v-if with computed property -->
          <v-list-item
            v-for="(v, k, i) in data.subjects"
            :key="i"
            v-if="$can('all', 'global') || $can('read', `${k}`)"
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
  props: ['value'],

  data () {
    return {
      data: this.value,
      mini: false,
      storage: 'storage'
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
      this.$emit('input', this.data)
    }
  },

  // sync changes from parent
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.data = newVal
      }
    }
  }
}
</script>

<style>
</style>
