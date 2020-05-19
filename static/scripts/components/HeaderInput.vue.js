
export default {
	name: "HeaderInput",
	props: {
		initialKey: {
			type: String,
			default: null
		},
		initialValue: {
			type: String,
			default: null
		},
		classNames: {
			type: String,
			default: null
		},
		headerPlaceholder: {
			type: String,
			default: null,
		},
		valuePlaceholder: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		deleteText: {
			type: String,
			default: null
		},
		editable: {
			type: Boolean,
			default: true
		}
	},
	created() {
		this.keyValue = this.initialKey;
		this.valueValue = this.initialValue;
	},
	computed: {
		isValid() {
			if (this.isFirstRun) {
				return null;
			}
			return true;
		},
		isInvalid() {
			if (this.isFirstRun) {
				return null;
			}
			return false;
		},
	},
	data() {
		return {
			emissions: {
				INPUT: 'input',
				CHANGE: 'change',
				REMOVE: 'remove',
			},
			state: {
				isFirstRun: true
			},
			keyValue: null,
			valueValue: null,
		}
	},
	methods: {
		input(event) {
			this.$emit(this.emissions.INPUT, event);
		},
		change(event) {
			this.isFirstRun = false;
			this.$emit(this.emissions.CHANGE, event);
		},
		remove() {
			this.$emit(this.emissions.REMOVE, this.keyValue);
		}
	},
	template: `
		<div class="d-flex">
			<input
				class="code pt-2 pb-2"
				spellcheck="false"
				:class="[{ 'is-valid': this.isValid, 'is-invalid': isInvalid }, classNames]"
				v-model="keyValue"
				:placeholder="headerPlaceholder"
				:disabled="!editable"
				@input="input($event)"
				@change="change($event)"
			/>
			<input
				class="code pt-2 pb-2"
				spellcheck="false"
				:class="[{ 'is-valid': this.isValid, 'is-invalid': isInvalid }, classNames]"
				v-model="valueValue"
				:placeholder="valuePlaceholder"
				:disabled="!editable"
				@input="input($event)"
				@change="change($event)"
			/>
			<button
				class="btn btn-primary flex-shrink-1"
				@click="remove()"
				v-if="editable"
			>
				<i class="fas fa-minus"></i>
				{{ deleteText }}
			</button>
		</div>
	`
}