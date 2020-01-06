<template>
  <v-banner
    v-model="active"
    single-line
    sticky
    :color="config.color"
    :icon="config.icon"
    :icon-color="config.iconColor"
  >
    <div :class="`${config.color}--text`">
      {{ text }}
    </div>

    <template v-slot:actions>
      <v-btn
        icon
        @click="hide()"
      >
        <v-icon>cancel</v-icon>
      </v-btn>
    </template>
  </v-banner>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TheBanner',

  computed: {
    ...mapGetters({
      active: 'global/banner/active',
      config: 'global/banner/mode',
      text: 'global/banner/text'
    })
  },

  methods: {
    ...mapActions({
      show: 'global/banner/show',
      hide: 'global/banner/hide',
      activate: 'global/banner/activate'
    })
  }
}
</script>
