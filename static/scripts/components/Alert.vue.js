
export default {
	name: "Alert",
	props: {
		type: {
			type: String,
			required: true
		},
		message: {
			type: String,
			required: true
		},
		userCanClose: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			emissions: {
				CLOSE: 'close',
			},
			timeout_ms: 3000,
			timerId: null,
			isVisible: false,
		}
	},
	methods: {
		show() {
			this.isVisible = true;
			this.timerId = setTimeout(() => {
				this.hide();
			}, this.timeout_ms);
		},
		hide() {
			console.log("hiding this alert");
			this.isVisible = false;
			this.timerId = null;
		},
		userClosed() {
			this.hide();
			this.$emit(this.emissions.CLOSE);
		}
	},
	template: `
		<div
			class="alert collapsable"
			:class="[{ 'collapse-vertical': !isVisible }, 'alert-' + type]"
			role="alert"
		>
			<slot></slot>
			<button
				type="button"
				class="close"
				data-dismiss="alert"
				aria-label="Close"
				@click="hide()"
			>
				<span
					aria-hidden="true"
					v-if="userCanClose"
				>&times;</span>
			</button>
		</div>
	`
}