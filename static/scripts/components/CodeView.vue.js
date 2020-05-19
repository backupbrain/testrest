
export default {
	name: "CodeView",
	props: {
		editable: {
			type: Boolean,
			required: true
		},
		placeholder: {
			type: String,
			default: null
		},
		initialValue: {
			type: String,
			default: null
		},
		classNames: {
			type: String,
			default: null,
		}
	},
	created() {
		this._value = this.initialValue
	},
	mounted() {
	},
	data() {
		return {
			emissions: {
				INPUT: 'input',
				CHANGE: 'change'
			},
			_value: null,
		}
	},
	methods: {
		input(event) {
			this.$emit(this.emissions.INPUT, event);
		},
		change() {
			this.$emit(this.emissions.CHANGE, event);
		},
		value(input) {
			console.log("input: " + input);
			if (input != null) {
				console.log("setting input");
				this._value = input;
				this.$forceUpdate();
			}
			return this._value;
		},

		keydown(event) {
			const textarea = event.target;
			console.log(event);
		    //support tab on textarea
		    if (event.keyCode == 9) { //tab was pressed
		        let newCaretPosition;
		        newCaretPosition = textarea.getCaretPosition() + "    ".length;
		        textarea.value = textarea.value.substring(0, textarea.getCaretPosition()) + "    " + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
		        textarea.setCaretPosition(newCaretPosition);
		        //return false;
		        event.stopPropagation();
		        event.preventDefault();
		    }
		    else if(event.keyCode == 8){ //backspace
		        if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            let newCaretPosition;
		            newCaretPosition = textarea.getCaretPosition() - 3;
		            textarea.value = textarea.value.substring(0, textarea.getCaretPosition() - 3) + textarea.value.substring(textarea.getCaretPosition(), textarea.value.length);
		            textarea.setCaretPosition(newCaretPosition);
		        }
		    }
		    else if(event.keyCode == 37){ //left arrow
		        let newCaretPosition;
		        if (textarea.value.substring(textarea.getCaretPosition() - 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            newCaretPosition = textarea.getCaretPosition() - 3;
		            textarea.setCaretPosition(newCaretPosition);
		        }    
		    }
		    else if(event.keyCode == 39){ //right arrow
		        let newCaretPosition;
		        if (textarea.value.substring(textarea.getCaretPosition() + 4, textarea.getCaretPosition()) == "    ") { //it's a tab space
		            newCaretPosition = textarea.getCaretPosition() + 3;
		            textarea.setCaretPosition(newCaretPosition);
		        }
		    }
		}
	},
	template: `
		<textarea
			class="code-editor code rounded"
			:class="classNames"
			:contenteditable="editable"
			@input="input($event)"
			@change="change($event)"
			@keydown="keydown($event)"
			v-model="_value"
		>
		</textarea>
	`
}