
export default {
	name: "UrlInput",
	props: {
		placeholder: {
			type: String,
			required: true
		},
		initialValue: {
			type: String,
			default: null
		},
		classNames: {
			type: String,
			default: null
		},
		placeholder: {
			type: String,
			default: 'http://example.com'
		},
		label: {
			type: String,
			default: null,
		}
	},
	created() {
		this._value = this.initialValue
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
		id() {
			return 'url';
		}
	},
	data() {
		return {
			emissions: {
				INPUT: 'input',
				CHANGE: 'change'
			},
			state: {
				isFirstRun: true
			},
			_value: null,
		}
	},
	methods: {
		isUrlValid() {

		},
		input(event) {
			//this._value = event.target.value;
			this.$emit(this.emissions.INPUT, event);
		},
		change(event) {
			this.isFirstRun = false;
			//this._value = event.target.value;
			this.$emit(this.emissions.CHANGE, event);
		},
		setFirstRun(isFirstRun) {
			this.isFirstRun = isFirstRun;
		},
		value(data) {
			if (data != undefined) {
				this._value = data;
				this.$forceUpdate();
			}
			return this._value;
		},
	},
	template: `
		<input
			class="code"
			:id="id"
			:class="[{ 'is-valid': this.isValid, 'is-invalid': isInvalid }, classNames]"
			v-model="_value"
			:placeholder="placeholder"
			@input="input($event)"
			@change="change($event)"
		/>
	`
}