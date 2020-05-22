
export default {
	name: "DropdownSelect",
	props: {
		required: {
			type: Boolean,
			required: true
		},
		options: {
			type: Array, // [{value: String, text: String}, ...]
			required: true
		},
		initialOption: {
			type: Object, // {value, String, text: String}
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
				toggleDropdown: 'Toggle Dropdown'
			},
		}
	},
	created() {
		if (this.initialOption == null) {
			this.selectedOption = this.options[0];
		} else {
			this.selectedOption = initialOption;
		}
	},
	computed: {
	},
	data() {
		return {
			emissions: {
				CLICK: 'click',
				SELECT: 'select',
			},
			state: {
				isOpen: false
			},
			selectedOption: null,
		}
	},
	methods: {
		click(event) {
			this.$emit(this.emissions.CLICK, event);
		},
		open() {
			this.state.isOpen = true;
		},
		close() {
			this.state.isOpen = false;
		},
		toggle() {
			this.state.isOpen = !this.state.isOpen;
		},
		select(option) {
			this.selectedOption = option;
			this.close();
			this.$emit(this.emissions.SELECT, event);
		},
		value(data) {
			if (data) {
				for (let i=0; i<this.options.length; i++) {
					const option = this.options[i];
					if (option.value == data) {
						this.selectedOption = option;
						break;
					}
				}
			}
			if (this.selectedOption != null) {
				return this.selectedOption.value;
			}
			return null;
		}
	},
	template: `
		<div
			:class="classNames"
		>
			<div
				class="modal-background input-group-append"
				:class="[{ show: state.isOpen }, classNames]"
				@click="close()"
			></div>
			<div class="btn-group">
				<button
					class="btn btn-primary code rounded-0"
					type="button"
					@click="click($event)"
				>
					{{ selectedOption.text }}
				</button>
				<button
					class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
					type="button"
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
					@click="toggle()"
				>
					<span class="sr-only">{{ $t('toggleDropdown') }}</span>
				</button>
				<div
					class="dropdown-menu dropdown-menu-right"
					:class="{ show: state.isOpen }"
					aria-labelledby="dropdownMenuButton"
				>
					<a
						class="dropdown-item code"
						:class="{ active: selectedOption == option }"
						href="#"
						@click="select(option)"
						v-for="(option, index) in options"
						:key="'option_' + index"
					>{{ option.text }}</a>
				</div>
			</div>
		</div>
	`
}
