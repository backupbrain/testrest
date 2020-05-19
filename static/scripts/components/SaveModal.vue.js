

export default {
	name: "SaveModal",
	props: {
		projectName: {
			type: String,
			default: null,
		},
		endpointName: {
			type: String,
			default: null,
		}
	},
	i18n: {
		messages: {
			en: {
				modalTitle: 'Save Endpoint',
				projectName: 'Project Name',
				endpointName: 'Endpoint Name',
				save: 'Save',
				cancel: 'Cancel',
				labels: {
					projectName: "Project Name",
					endpointName: "Endpoint Name"
				},
				placeholders: {
					projectName: "Project Name",
					endpointName: "Endpoint Name"
				},
			}
		},
	},
	created() {
		if (this.projectName) {
			this.values.projectName = this.projectName;
		}
		if (this.endpointName) {
			this.values.endpointName = this.endpointName;
		}
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
				SAVE: 'save',
				CANCEL: 'cancel',
			},
			isOpen: false,
			valueValue: null,
			values: {
				projectName: null,
				endpointName: null
			},
		}
	},
	methods: {
		save() {
			const emission = {
				projectName: this.values.projectName,
				endpointName: this.values.endpointName
			};
			this.$emit(this.emissions.SAVE, emission);
		},
		cancel() {
			this.close();
			this.$emit(this.emissions.CANCEL);
		},
		open() {
			this.isOpen = true;
		},
		close() {
			console.log("closing");
			this.isOpen = false;
		},
		submitForm() {
			console.log("submititng form");
			this.save();
			this.close();
		},
		doNothing(event) {
			console.log(event);
			console.log("doing nothing");
			event.preventDefault();
		},
	},
	template: `
		<div>
			<div
				class="modal-backdrop fade"
				:class="{ show: isOpen }"
				@click="close()"
				v-if="isOpen"
			></div>
			<div
				class="modal fade"
				tabindex="-1"
				role="dialog"
				:class="{ show: isOpen }"
			>
				<div
					class="modal-dialog modal-dialog-centered"
					role="document"
				>
					<div
						class="modal-content"
					>
						<form
							action="get"
							method=""
							@submit.prevent="submitForm($event)"
						>
							<div class="modal-header">
								<h5 class="modal-title">{{ $t('modalTitle') }}</h5>
								<button
									type="button"
									class="close"
									data-dismiss="modal" aria-label="Close"
									@click="close()"
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body">
								<div class="form-group">
									<label for="id_project_name">{{ $t('labels.projectName') }}</label>
									<input
										type="text"
										id="id_project_name"
										autocomplete="off"
										class="form-control"
										:placeholder="$t('placeholders.projectName')"
										v-model="values.projectName"
										required="true"
										ref="projectName"
									/>
								</div>
								<div class="form-group">
									<label for="id_endpoint_name">{{ $t('labels.endpointName') }}</label>
									<input
										type="text"
										id="id_endpoint_name"
										autocomplete="off"
										class="form-control"
										:placeholder="$t('placeholders.endpointName')"
										v-model="values.endpointName"
										required="true"
										ref="endpointName"
									/>
								</div>
							</div>
							<div class="modal-footer">
								<input
									type="submit"
									class="btn btn-primary"
									:value="$t('save')"
								/>
								<button
									type="cancel"
									class="btn btn-secondary"
									data-dismiss="modal"
									@click="cancel()"
								>{{ $t('cancel') }}</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	`
}

