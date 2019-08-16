<template>
  <div>
    <v-container
      fluid
      grid-list-xl
    >
      <v-layout
        row
        wrap
        text-center
      >
        <v-flex xs12>
          <div
            class="display-3"
            style="padding-top: 30px;"
          >{{msg}}
          </div>
        </v-flex>
        <v-flex xs12>
          <div style="height: 50px;"></div>
        </v-flex>
      </v-layout>

      <v-layout
        align-center
        justify-center
        wrap
      >
        <v-flex
          lg3
          xs12
        >

          <v-hover v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 16 : 2"
              class="white--text"
              :color="hover ? 'indigo lighten-1' : 'primary'"
            >
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon
                    class="grey lighten-1 white--text"
                    v-text="'settings'"
                  ></v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">Administration</v-list-item-title>
                  <v-list-item-subtitle>Global Master Data</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-hover>

        </v-flex>

        <v-flex
          lg3
          xs12
        >

          <v-hover v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 16 : 2"
              class="white--text"
              :color="hover ? 'indigo lighten-1' : 'primary'"
            >
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon
                    class="grey lighten-1 white--text"
                    v-text="'list_alt'"
                  ></v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline">Logs</v-list-item-title>
                  <v-list-item-subtitle>Global Logs</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-hover>

        </v-flex>

      </v-layout>

    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Home',

  data: function () {
    return {
      msg: 'Welcome to OpenGxP'
    }
  }
}
</script>
