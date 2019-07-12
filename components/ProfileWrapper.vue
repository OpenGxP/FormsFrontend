<template>
	<div>
    <v-tabs
      v-model="active"
      color="indigo"
      dark
      slider-color="yellow"
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
    <div class="text-xs-center mt-3">
      <v-btn @click="next">next tab</v-btn>
    </div>
  </div>
</template>

<script>
import ProfilePasswordQuestions from '@/components/ProfilePasswordQuestions'
import ProfileGeneral from '@/components/ProfileGeneral'
import ProfilePermissions from '@/components/ProfilePermissions'

export default {
	name: 'ProfileWrapper',

	data () {
    return {
      active: null,
      tabs: [
        {name: 'General', content: 'General information regarding the user', component: 'profileGeneral'},
        {name: 'Password', content: 'Reset password and manage questions', component: 'profilePasswordQuestions'},
        {name: 'Permissions', content: 'Permissions of the logged in user', component: 'profilePermissions'}
			],
			currentTabComponent: 'profilePasswordQuestions'
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
    profilePasswordQuestions: ProfilePasswordQuestions,
    profilePermissions: ProfilePermissions
	}
}
</script>

<style>

</style>
