<template>
    <v-text-field
        v-model="inputVal"
        clearable
        :append-icon="show ? 'visibility' : 'visibility_off'"
        :type="show ? 'text' : 'password'"
        name="input-10-1"
        :label="label"
        :hint="hint"
        @click:append="show = !show"
    ></v-text-field>
</template>

<script>
import { Stream } from 'stream';
export default {
    name: 'AppPasswordField',

    props: {
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: 'Password*'
        },
        hint: {
            type: String,
            default: ''
        }
    },

    data () {
        return {
            inputVal: this.value,
            show: false
        }
    },

    watch: {
        inputVal(val) {
            this.$emit('input', val)
        }
    }
}


/*
:append-icon="show1 ? 'visibility' : 'visibility_off'"
        :rules="[rules.required, rules.min]"
        :type="show1 ? 'text' : 'password'"
        name="input-10-1"
        label="Normal with hint text"
        hint="At least 8 characters"
        counter
        @click:append="show1 = !show1"
*/
</script>

<style>

</style>
