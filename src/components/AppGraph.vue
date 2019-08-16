<template>
  <div
    id="cytoscape"
    ref="cytoscape"
  ></div>
</template>

<script>
export default {
  data () {
    return {
      cy: null
    }
  },

  mounted () {
    this.cy = cytoscape({
      container: this.$refs.cyto,
      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: 'a' }
        },
        {
          // node b
          data: { id: 'b' }
        },
        {
          // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],

      style: [
        // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            label: 'data(id)'
          }
        },

        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],

      layout: {
        name: 'grid',
        rows: 1
      }
    })
  }
}
</script>

<style scoped>
#cytoscape {
  width: 100%;
  height: 100%;
}
</style>
