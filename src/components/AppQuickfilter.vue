<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :color="active ? 'primary' : 'white'"
          icon
          v-on="on"
        >
          <v-icon>filter_list</v-icon>
        </v-btn>
      </template>

      <v-card raised>
        <v-card-text>
          <v-row>
            <v-col class="mx-4">
              <v-text-field
                v-model="quickfilter"
                append-outer-icon="check"
                autofocus
                dense
                :clearable="!!currentValue"
                @click:append-outer="test()"
                @click:clear="test(true)"
                @keydown.enter="test()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: false
    }
  },

  data: () => ({
    menu: false,
    quickfilter: '',
    currentValue: ''
  }),

  computed: {
    active () {
      return !!this.currentValue
    }
  },

  methods: {
    test (clear = false) {
      this.currentValue = clear ? '' : this.quickfilter
      this.$emit('input', this.currentValue)
      this.$emit('change-val', !clear)
      this.menu = false
    }
  },

  watch: {
    menu: {
      handler (val) {
        if (!val) {
          if (this.quickfilter !== this.currentValue) this.quickfilter = this.currentValue
        }
      }
    },
    value: {
      handler (val) {
        if (!val) this.currentValue = this.quickfilter = ''
      }
    }
  }
}
</script>
