
export default {
	name: "CodeViewResponse",
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
	i18n: {
		messages: {
			en: {
				text: 'Text',
				html: 'HTML',
			}
		}
	},
	created() {
		this._value = this.initialValue
	},
	mounted() {
	},
	data() {
		return {
			DISPLAY_MODE_TEXT: 'text',
			DISPLAY_MODE_HTML: 'html',
			DISPLAY_MODE_TABLE: 'table',
			emissions: {
				INPUT: 'input',
				CHANGE: 'change'
			},
			state: {
				displayMode: 'text',
			},
			_value: null,
		}
	},
	methods: {
		getHTML() {
			//let response =  this._value.replace("\\'", "\'").replace('\"','"').replace("\\n", "\n").replace("\\t", "	");
			//let response = this._value.replace("n","HAH");
			let response = this._value;
			response = response.substring(1, response.length - 1);
			response = response.split("\\n").join("\n");
			response = response.split("\\t").join("\t");
			response = response.split("\\'").join("'");
			response = response.split('\\"').join('"');
			console.log(response);
			return response;
		},
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
		<div>
			<ul class="nav nav-tabs">
				<li class="nav-item">
					<a
						class="nav-link"
						href="#"
						:class="{ active: state.displayMode == DISPLAY_MODE_TEXT }"
						@click="state.displayMode=DISPLAY_MODE_TEXT"
					>{{ $t('text') }} </a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link"
						href="#"
						:class="{ active: state.displayMode == DISPLAY_MODE_HTML }"
						@click="state.displayMode=DISPLAY_MODE_HTML"
					>{{ $t('html') }}</a>
				</li>
			</ul>
			<textarea
				class="code-editor code rounded"
				:class="classNames"
				:contenteditable="editable"
				@input="input($event)"
				@change="change($event)"
				@keydown="keydown($event)"
				v-model="_value"
				v-if="state.displayMode==DISPLAY_MODE_TEXT"
			>
			</textarea>
			<div
				class="code-editor code rounded"
				:class="classNames"
				:contenteditable="editable"
				@input="input($event)"
				@change="change($event)"
				@keydown="keydown($event)"
				v-html="getHTML()"
				v-if="state.displayMode==DISPLAY_MODE_HTML"
			>
			</div>
		</div>
	`
}