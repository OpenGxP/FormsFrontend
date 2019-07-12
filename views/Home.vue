<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <div class="display-3" style="padding-top: 50px;">{{msg}}</div>
      </v-flex>
    </v-layout>
  </v-container>
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
