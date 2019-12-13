<template>
  <v-footer
    app
    padless
    inset
    color="transparent"
  >
    <v-layout>

      <v-flex
        xs8
        offset-xs2
        class="text-center"
      >
        <v-bottom-sheet v-model="sheet">
          <template v-slot:activator="{ on }">
            <v-btn
              color="indigo"
              icon
              v-on="on"
            >
              <v-icon>expand_less</v-icon>
            </v-btn>
          </template>

          <v-sheet
            class="text-center"
            height="200px"
          >
            <v-layout row>
              <v-flex xs12>
                <v-btn
                  color="purple"
                  icon
                  @click="sheet = !sheet"
                >
                  <v-icon>expand_more</v-icon>
                </v-btn>
              </v-flex>
              <v-flex
                lg2
                xs4
                offset-lg2
                offset-xs1
              >
                <v-hover v-slot:default="{ hover }">
                  <v-card
                    href="https://opengxp.atlassian.net/browse/FO"
                    target="_blank"
                    :elevation="hover ? 16 : 2"
                    class="white--text"
                    :color="hover ? 'indigo lighten-1' : 'indigo'"
                  >
                    <v-card-text v-text="hover ? 'Report it now!' : 'Found a bug?'" :class="hover ? ['orange--text'] : null"></v-card-text>
                  </v-card>
                </v-hover>
              </v-flex>
              <v-flex
                lg2
                xs4
                offset-xs1
              >
                <p>OpenGxP<br>Current Version: V0.1.0</p>
              </v-flex>
            </v-layout>

          </v-sheet>

        </v-bottom-sheet>
      </v-flex>

      <v-flex
        lg2
        md2
        xs2
        class="text-center hidden-sm-and-down"
      >
        <div>&copy; {{ new Date().getFullYear() }} - OpenGxP&nbsp;&nbsp;</div>
      </v-flex>

    </v-layout>
  </v-footer>
</template>

<script>
export default {
  data () {
    return {
      sheet: false
    }
  }
}
</script>

<style>
</style>
