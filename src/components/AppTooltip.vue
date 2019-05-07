<template>
<v-tooltip 
	bottom
	debounce="2000"
>
    <template v-slot:activator="{ on }">
        <slot></slot>	
    </template>
    <span>{{text}}</span>
</v-tooltip>
</template>


<script>
export default {
  name: 'AppTooltip',
  props: {
  	text: {
  		type: String,
  		default: 'I am a Tooltip'
	  },
	direction: {
		type: String,
		default: 'bottom'
	}
  }
}
</script>