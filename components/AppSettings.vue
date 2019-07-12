<template>
<v-container>
	<ul>
		<li v-for="item in items"><div>{{item.key}} / {{item.value}}<v-btn>Click</v-btn></div></li>
	</ul>
</v-container>


</template>


<script>
export default {
	name: 'AppSettings',
	props: {
		items: {
			type: Array,
			default: []
		}
	}
}	
</script>
