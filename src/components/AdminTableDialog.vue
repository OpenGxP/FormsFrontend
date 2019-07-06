<template>
  <!-- dialog -->
  <v-dialog v-model="dialog" max-width="800px">
    <v-card>

      <!-- header -->
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      
      <!-- body -->
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>

            <!-- Fields -->
            <v-flex xs12 sm12 md12 v-for="field in formFields" :key="field.name">

              <!-- bool -->
              <v-switch v-if="field.data_type === 'BooleanField'"
                :label="field.verbose_name"
                v-model="editedItem[field.name]"
              ></v-switch>

              <!-- DateTime
              <app-date-time-picker v-else-if="field.data_type === 'DateTimeField'"
                @sync-date="editedItem[field.name]=$event"
                :date="editedItem[field.name]"
                :label="field.verbose_name"
                :hint="field.help_text"></app-date-time-picker>
                -->

              <!-- select -->
              <app-multi-select v-else-if="field.verbose_name === 'Roles'"
                :items="roles"
                label="Roles"
                @string-value="editedItem[field.name]=$event"></app-multi-select>

              <!-- text -->
              <v-text-field v-else
                :label="field.verbose_name"
                :hint="field.help_text"
                v-model="editedItem[field.name]"
                clearable
              ></v-text-field>

            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>

      <!-- footer -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
      </v-card-actions>

    </v-card>

      </v-dialog>
</template>

<script>
export default {
  name: 'AdminTableDialog',

  data () {
    return {
      //
    }
  },

  props: {
    //
  }

}
</script>

<style>

</style>
