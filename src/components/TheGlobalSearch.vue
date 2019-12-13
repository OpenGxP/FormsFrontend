<template>
  <div>
    <div v-hotkey="keymap"></div>
    <v-autocomplete
      v-model="selected"
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="search"
      label="search"
      class="hidden-sm-and-down"
      :items="baseData"
      item-text="title"
      item-value="url"
      menu-props="{closeOnClick: true, closeOnContentClick: true}"
      @change="navigate()"
      ref="globalSearch"
    >
      <template v-slot:item="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-item-content v-text="data.item"></v-list-item-content>
        </template>
        <template v-else>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="data.item.parent"></v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      selected: []
    }
  },

  computed: {
    keymap () {
      return {
        // 'esc+ctrl' is OK.
        'shift+enter': this.focus
      }
    },
    baseData () {
      if (typeof this.$store.getters.data !== 'object') return []
      const flatList = []
      for (let [key, value] of Object.entries(this.$store.getters.data)) {
        // 1
        for (let [key2, value2] of Object.entries(value.subjects)) {
          // 2
          flatList.push({
            title: value2.title,
            url: `/api/${key}/${key2}`,
            parent: value.title
          })
        }
      }
      return flatList
    },
    filteredList () {
      return this.baseData.filter(post => {
        return post.title.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },

  methods: {
    navigate () {
      // navigate to selected dialog and reset search value
      this.$router.push({ path: this.selected })
      this.selected = []
      // lose focus
      this.$refs.globalSearch.blur()
    },
    focus () {
      // focus global search field
      this.$refs.globalSearch.focus()
    }
  }
}
</script>

<style scoped>
</style>
