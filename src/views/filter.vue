<template>
  <v-card>

    <!-- toolbar -->
    <v-toolbar flat>
      <v-toolbar-title>Filter Dialog</v-toolbar-title>
    </v-toolbar>

    <v-row>
      <v-col>
        <v-btn>test</v-btn>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" vertical>

      <!-- tabs: header -->
      <v-tab v-for="field in fields" :key="field" :href="`#tab-${field}`">{{field}}</v-tab>

      <!-- tabs: body -->
      <v-tab-item v-for="field in fields" :key="field" :value="'tab-' + field">
        <v-container>
          <v-card outlined>
            <v-row>
              <v-col>
                <v-text-field></v-text-field>
              </v-col>
              <v-col>
                <v-text-field></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
      </v-tab-item>

    </v-tabs>
  </v-card>
</template>

<script>
export default {
  props: {
    fields: {
      type: Array,
      default: function () {
        return ['one', 'two', 'three', 'four', 'Lastname']
      }
    },
    dialog: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      tab: null,
      operators: ['contains', 'exact', 'startswith', 'endswith']
    }
  }
}
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
