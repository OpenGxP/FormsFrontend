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
