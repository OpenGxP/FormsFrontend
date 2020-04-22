<template>
  <v-container>
    <v-card color="pink">
      <v-layout
        wrap
        align-center
        class="pa-2"
      >
        <v-flex
          xs12
          class="pa-2"
        >
          <v-text-field v-model="endpoint" />
        </v-flex>

        <v-flex
          xs12
          sm6
          md4
          class="pa-2"
        >
          <v-btn @click="request()">
            Ajax request
          </v-btn>

          <v-combobox
            v-model="mode"
            :items="possibilities"
          />
        </v-flex>

        <v-flex
          xs12
          sm6
          md4
          class="pa-2"
        >
          <v-textarea v-model="payload"
            background-color="black">
          </v-textarea>
        </v-flex>

        <v-flex
          xs12
          sm6
          md4
          class="pa-2"
        >
          <v-btn @click="test()">test</v-btn>
        </v-flex>

        <v-flex
          xs12
          class="pa-2"
        >
          <p style="padding-top: 50px;">
            {{ response }}
          </p>
        </v-flex>
      </v-layout>
    </v-card>

    <v-card color="green">
      <v-layout
        wrap
        align-center
        class="pa-2"
      >
        <v-flex
          xs4
          class="pa-2"
        >
          <v-combobox
            v-model="ist"
            :items="kann"
          />
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      payload: '',
      p:
        {
          'workflow': 'wd',
          'steps': [
            {
              'step': 'wdw',
              'role': 'all',
              'text': 'awdawd',
              'sequence': 0
            }
          ]
        },
      response: 'get',
      endpoint: '/admin/roles',
      mode: '',
      possibilities: ['get', 'patch', 'post'],
      ist: '',
      kann: ['contains', 'smaller', 'greater']
    }
  },

  methods: {
    request () {
      this.$http({
        method: this.mode,
        url: `${this.endpoint}`
      })
        .then(resp => {
          this.response = resp.data
        })
    },
    test () {
      this.$http({
        method: 'post',
        url: '/md/workflows',
        data: this.p
      })
        .then(resp => {
          this.response = resp.data
        })
    },
    initialize () {
      this.$http.get('/')
        .then(resp => {
          this.response = resp.data
        })
    }
  }
}
</script>

<style>
</style>
