/**
 * mixin wrapper for inputs
**/
export default {
    props: {
        label: {
            default: '',
            required: false,
            type: String
        },
        hint: {
            default: '',
            required: false,
            type: [Array, String]
        },
        required: {
            default: false,
            required: false,
            type: Boolean
        },
        editable: {
            default: true,
            required: false,
            type: Boolean
        },
        autofocus: {
            default: false,
            required: false,
            type: Boolean
        },
        error: {
            default: false,
            required: false,
            type: Boolean
        },
        errormsgs: {
            required: false,
            type: [Array, String]
        },
        value: {
            required: false,
        }
    },

    computed: {
        cHint () {
            if (Array.isArray(this.hint)) {
                return this.hint.toString()
            } else if (this.hint.startsWith('[')) {
                return this.hint.replace(/['",]/g, '').replace('[', '').replace(']', '')
            } else {
                return this.hint
            }
        }
      }
}