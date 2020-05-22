import Alert from './Alert.vue.js';
import CodeView from './CodeView.vue.js';
import DropdownSelect from './DropdownSelect.vue.js';
import UrlInput from './UrlInput.vue.js';
import Sidebar from './Sidebar.vue.js';
import SaveModal from './SaveModal.vue.js';
import HeaderInput from './HeaderInput.vue.js';

export default {
	name: 'MainTemplate',
	props: {

	},
	i18n: {
		messages: {
			en: {
				brandName: 'Thimiama',
				endpoint: 'Endpoint:',
				makeRequest: 'Make Request',
				request: 'Request',
				addHeader: 'Add Header',
				response: 'Response',
				copy: 'Copy',
				paste: 'Paste',
				permalink: 'Permalink',
				save: 'Save',
				open: 'Open',
				download: 'Download',
				corsClientDisallowed: "Server's CORS policy disallows AJAX access from this client",
				networkError: "Could not access this server. Endpoint doesn't exist or CORS policy disallows access.",
				invalidInput: "Invalid input.",
				saveEndpoint: 'Save',
			}
		}
	},
	components: {
		'alert': Alert,
		'dropdown-select': DropdownSelect,
		'url-input': UrlInput,
		'code-view': CodeView,
		'sidebar': Sidebar,
		'save-modal': SaveModal,
		'header-input': HeaderInput,
	},
	computed: {
		methodOptions() {
			var options = [];
			this.methods.forEach((method, index) => {
				options.push({
					value: method,
					text: method.toUpperCase()
				});
			});
			return options;
		}
	},
	created() {
		HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
			return this.selectionStart;
		};
		HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
			this.selectionStart = position;
			this.selectionEnd = position;
			this.focus();
		};
		HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
			if (this.selectionStart == this.selectionEnd) {
			    return false;
			} else {
			    return true;
			}
		};
		HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
			return this.value.substring(this.selectionStart, this.selectionEnd);
		};
		HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
			this.selectionStart = start;
			this.selectionEnd = end;
			this.focus();
		};
	},
	mounted() {
		//console.log(this.$refs['sidebar']);
	},
	data() {
		return {
			alerts: [
				{ type: 'danger', key: 'corsClientDisallowed', message: this.$t('corsClientDisallowed') },
				{ type: 'danger', key: 'networkError', message: this.$t('networkError') },
				{ type: 'danger', key: 'invalidInput', message: this.$t('invalidInput') },
			],
			state: {
				isWorking: false,
			},
			methods: ['get', 'put', 'post', 'patch', 'delete', 'head', 'options'],
			workspace: {
				projectName: null,
				endpointName: null,
			},
			request: {
				headers: [],
				body: null,
			},
			response: {
				status: {
					code: null,
					text: null,
				},
				headers: {},
				body: null,
			}
		}
	},
	methods: {
		urlChanged(event) {

		},
		urlVerified(event) {
			// TODO: 
		},
		isValid() {
			return true;
		},
		getHeaders() {
			let headers = {};
			this.request.headers.forEach((header, index) => {
				console.log(this.$refs);
				for (const refKey of Object.keys(this.$refs)) {
					console.log(refKey);
					if (refKey.startsWith('requestHeader_')) {
						const ref = this.$refs[refKey][0];
						console.log(ref);
						console.log(ref.keyValue);
						headers[ref.keyValue] = ref.valueValue;
					}
				}
			});
			console.log("headers:");
			console.log(headers);
			return headers;
		},
		submitForm(event) {
			if (this.isValid()) {
				this.state.isWorking = true;
				var url = this.$refs['urlInput'].value();
				var method = this.$refs['submitMethod'].value();
				console.log(`${method} ${url}`);
				const headers = this.getHeaders();
				let data = this.$refs['requestEditor'].value();
				if (data == "") {
					data = null;
				} else {
					try {
						data = JSON.parse(data);
						console.log(data);
					} catch (err) {
						this.$refs['invalidInput'][0].show();
						return;
					}
				}
				console.log("data: ");
				console.log(data);
				axios({
					method: method,
					url: url,
					config: { headers: headers },
					data: data,
				}).then(response => {
					console.log(response);
					//var output = `HTTP/1.1 ${response.status} ${response.statusText}\n`;
					this.response.status.code = response.status;
					this.response.status.text = response.statusText;
					this.response.headers = response.headers;
					this.response.body = JSON.stringify(response.data, null, 4);
					console.log(this.response);
					let output = this.response.body;
					console.log(output);
					this.$refs["responseViewer"].value(output);
					this.state.isWorking = false;
					this.$forceUpdate();
				}).catch(error => {
					console.log('error');
					console.log(error);
					if (error.response) {
						console.log(error.statusCode);
						console.log(error.code);
						console.log(error.errno);
						console.log(error);
						console.error(error.response);
						var response = error.response;
						//console.error(error.response.headers);
						//var output = `HTTP/1.1 ${response.status} ${response.statusText}\n`;
						
						this.response.status.code = response.status;
						this.response.status.text = response.statusText;
						if (response.headers) {
							this.response.headers = response.headers;
						} else {
							this.response.headers = {};
						}
						this.response.body = JSON.stringify(response.data, null, 4);
						/*
						for (let key in response.headers) {
							var value = response.headers[key];
							output += `${key}: ${value}\n`;
						}
						*/
						let output = this.response.body;
						console.log(output);
						this.$refs["responseViewer"].value(output);
						this.state.isWorking = false;
						this.$forceUpdate();
					} else {
						this.response.status.code = null;
						this.response.status.text = null;
						this.response.headers = {};
						this.response.body = null;
						console.log(this.$refs);
						this.$refs['networkError'][0].show();
					}
				});
			}
		},
		copy(ref) {

		},
		paste(ref) {

		},
		copyPermalink() {

		},
		download() {

		},
		openSaveDialog() {
			this.$refs['saveModal'].open();
			console.log("save this configuration");
		},
		saveEndpoint(names) {
			console.log(names);
			const projectName = names.projectName;
			const endpointData = {
				name: names.endpointName,
				url: this.$refs['urlInput'].value(),
				method:  this.$refs['submitMethod'].value(),
				inputs: {
					headers: this.getHeaders(),
					body: this.$refs['requestEditor'].value()
				},
				outputs: {
					version: null,
					status: this.response.status,
					headers: this.response.headers,
					body: this.$refs['responseViewer'].value()
				},
			}
			console.log(endpointData);
			this.$refs['sidebar'].saveNewEndpoint(projectName, endpointData);
		},
		openEndpoint(endpointData) {
			console.log("opening endpoint");
			console.log(endpointData);
			this.workspace.projectName = endpointData.projectName;
			this.workspace.endpointName = endpointData.name;
			this.request.body = endpointData.inputs.body;
			this.request.headers = []
			for (const key of Object.keys(endpointData.inputs.headers)) {
				this.request.headers.push({key: key, value: endpointData.inputs.headers[key]});
			};
			this.response.status = endpointData.outputs.status;
			this.response.headers = endpointData.outputs.headers;
			this.$refs['saveModal'].values.projectName = endpointData.projectName;
			this.$refs['saveModal'].values.endpointName = endpointData.name;
			this.$refs['urlInput'].value(endpointData.url);
			this.$refs['submitMethod'].value(endpointData.method);
			this.$refs['requestEditor'].value(endpointData.inputs.body);
			this.$refs['responseViewer'].value(endpointData.outputs.body);
		},
		isSuccessStatus() {
			if (this.response.status.code) {
				return this.response.status.code >= 200 && this.response.status.code < 300;
			}
			return false;
		},
		isInfoStatus() {
			if (this.response.status.code) {
				return this.response.status.code < 200 || (this.response.status.code >= 300 && this.response.status.code < 400);
			}
			return false;

		},
		isFailureStatus() {
			if (this.response.status.code) {
				return this.response.status.code >= 400;
			}
			return false;
		},
		addHeader()  {
			this.request.headers.push({key: null, value: null});
		},
		removeHeader(keyValue) {
			console.log("removing header:");
			console.log(keyValue);
			this.request.headers = this.request.headers.filter(header => header.key != keyValue);
		}
	},
	template: `
		<div>
			<div class="alerts">
				<alert
					class="alert"
					:class="'alert-' + alert.type"
					v-for="(alert, index) in alerts"
					:key="alert.key"
					:ref="alert.key"
					:type="alert.type"
					:message="alert.message"
					:userCanClose="true"
				>{{ $t(alert.message) }}</alert>
			</div>
			<div class="wrapper">
				<sidebar
					@open-endpoint="openEndpoint($event)"
					ref="sidebar"
				></sidebar>
				<div id="content">
					<nav class="navbar navbar-dark">
						<button
							class="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Toggle navigation"
							@click="$refs['sidebar'].toggleOpen()"

						>
							<span
								class="navbar-toggler-icon"
							></span>
						</button>
						<a class="navbar-brand" href="#">
							<img src="/docs/4.4/assets/brand/bootstrap-solid.svg" width="30" height="30" class="d-inline-block align-top" alt="">
							{{ $t('brandName') }}
						</a>
					</nav>
					<article id="panel">
						<section id="inputs" class="d-flex">
							<form
								class="flex-grow-1"
								action=""
								method=""
								@submit.prevent="submitForm($event)"
							>
								<div class="input-group">
									<!--div class="input-group-prepend align-bottom pt-2 pr-3">
										<label for="url">{{ $t('endpoint') }}</label>
									</div-->
									<url-input
										classNames="flex-grow-1 rounded-left"
										type="url"
										placeholder="http://example.com"
										@change="urlChanged($event)"
										@input="urlChanged($event)"
										@verified="urlVerified($event)"
										ref="urlInput"
									></url-input>
		        					<div class="input-group-prepend">
										<dropdown-select
											classNames="input-group-append rounded-0"
											:options="methodOptions"
											:required="true"
											@click="submitForm($event)"
											ref="submitMethod"
										>
										</dropdown-select>
									</div>
								</div>
							</form>
							<button
								class="btn btn-primary ml-3"
								@click="openSaveDialog()"
							>
								<i class="fas fa-save"></i>
								<span class="">{{ $t('saveEndpoint') }}</span>
							</button>

							<!--button
								class="btn btn-primary ml-2"
								@click="copyPermalink()"
							>
								<i class="fas fa-link"></i>
								<span class="">{{ $t('permalink') }}</span>
							</button-->
						</section>
						<section id="outputs">
							<div class="row">
								<div class="col-md-6">
									<h2 class="d-flex mb-2">
										<span class="flex-grow-1 pt-2">
											{{ $t('request') }}
										</span>
										<button
											class="btn btn-primary"
											@click.prevent="addHeader()"
										>
											<i class="fas fa-plus"></i>
											<span class="">
												{{ $t('addHeader') }}
											</span>
										</button>
									</h2>
									<!--div>
										<button
											class="btn btn-primary"
											@click="copy('requestEditor')"
										>
											<i class="fas fa-copy"></i>
											{{ $t('copy') }}
										</button>
										<button
											class="btn btn-primary"
											@click="paste('requestEditor')"
										>
											<i class="fas fa-paste"></i>
											{{ $t('paste') }}
										</button>
									</div-->
									<div class="headers__container">
										<header-input
											v-for="(header, index) in request.headers"
											:key="'requestHeader_' + index"
											:ref="'requestHeader_' + index"
											:initial-key="header.key"
											:initial-value="header.value"
											:editable="true"
											@remove="removeHeader($event)"
										></header-input>
									</div>
									<code-view
										classNames="mt-2"
										:editable="true"
										:placeholder="''"
										:initialValue="''"
										ref="requestEditor"
									></code-view>
								</div>
								<div class="col-md-6">
									<div class="d-flex mb-2">
										<h2 class="pt-2 pr-2">
											{{ $t('response') }}:
										</h2>
										<div
											class="alert response-status__container flex-grow-1"
											:class="{ 'alert-danger': isFailureStatus(), 'alert-success': isSuccessStatus(), 'alert-info': isInfoStatus() }"
										>
											{{ response.status.code }} {{ response.status.text }}
										</div>
									</div>
									<!--div>
										<button
											class="btn btn-primary"
											@click="copy('responseViewer')"
										>
											<i class="fas fa-copy"></i>
											{{ $t('copy') }}
										</button>
										<button
											class="btn btn-primary"
											@click="download()"
										>
											<i class="fas fa-file-download"></i>
											{{ $t('download') }}
										</button>
									</div-->
									<div class="headers__container">
										<header-input
											v-for="(value, key) in response.headers"
											:key="'header_' + key"
											:initial-key="key"
											:initial-value="value"
											:editable="false"
										></header-input>
									</div>
									<code-view
										classNames="mt-2"
										:editable="false"
										:placeholder="''"
										:initialValue="''"
										ref="responseViewer"
									></code-view>
								</div>
							</div>
						</section>
					</article>
				</div>
			</div>
			<save-modal
				:project-name="workspace.projectName"
				:endpoint-name="workspace.endpointName"
				@save="saveEndpoint($event)"
				ref="saveModal"
			></save-modal>
		</div>
	`
}