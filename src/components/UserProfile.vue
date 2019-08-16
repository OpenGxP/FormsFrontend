<template>
  <div>
    <v-tabs
      v-model="active"
      dark
      background-color="primary"
      color="scondary"
      slider-color="secondary"
    >
      <v-tab
        v-for="(tab, index) in tabs"
        :key="index"
        ripple
      >
        {{ tab.name }}

      </v-tab>
      <v-tab-item
        v-for="(tab, index) in tabs"
        :key="index"
      >
        <v-card flat>
          <v-card-text>{{ tab.content }}</v-card-text>
          <component :is="tab.component"></component>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <div class="text-center mt-3">
      <v-btn @click="next">next tab</v-btn>
    </div>
  </div>
</template>

<script>
import ProfilePasswordQuestions from '@/components/UserProfileQuestions'
import ProfileGeneral from '@/components/UserProfileGeneral'

export default {
  name: 'ProfileWrapper',

  data () {
    return {
      active: null,
      tabs: [
        { name: 'Settings', content: 'General information regarding the user', component: 'profileGeneral' },
        { name: 'Questions', content: 'Reset password and manage questions', component: 'profilePasswordQuestions' }
      ],
      currentTabComponent: 'profilePasswordQuestions',
      ldap: true
    }
  },

  methods: {
    next () {
      const active = parseInt(this.active)
      this.active = (active < 2 ? active + 1 : 0)
    }
  },

  components: {
    profileGeneral: ProfileGeneral,
    profilePasswordQuestions: ProfilePasswordQuestions
  },

  mounted () {
    this.$http.get('meta/profile')
      .then(resp => {
        this.ldap = resp.data.get.ldap
      })
  }
}
</script>

<style>
</style>
