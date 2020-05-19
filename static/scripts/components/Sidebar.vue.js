export default {
	name: "Sidebar",
	props: {
	},
	i18n: {
		messages: {
			en: {
				allRightsReserved: 'All rights reserved',
				apacheLicense: 'Apache License',
			}
		}
	},
	created() {
		this.loadProjects();
		const startIsOpen = JSON.parse(localStorage.getItem(this.localStorage.START_OPEN));
		if (startIsOpen) {
			this.isOpen = startIsOpen;
		} else {
			this.startIsOpen = this.defaultStartIsOpen;
		}
	},
	data() {
		return {
			emissions: {
				OPEN_ENDPOINT: 'open-endpoint',
				CLOSE: 'close',
				OPEN: 'open',
			},
			localStorage: {
				PROJECTS_KEY: 'projects',
				START_OPEN: 'sidebarOpen',
			},
			projects: [],
			isOpen: false,
			defaultStartIsOpen: true,
		}
	},
	methods: {
		toggleOpen() {
			this.isOpen = !this.isOpen;
			localStorage.setItem(this.localStorage.START_OPEN, JSON.stringify(this.isOpen));
		},
		open() {
			this.isOpen = true;
			localStorage.setItem(this.localStorage.START_OPEN, JSON.stringify(this.isOpen));
		},
		close() {
			this.isOpen = false;
			localStorage.setItem(this.localStorage.START_OPEN, JSON.stringify(this.isOpen));
		},
		loadProjects() {
			const projects = JSON.parse(localStorage.getItem(this.localStorage.PROJECTS_KEY));
			console.log(projects);
			if (projects == null) {
				this.projects = [];
				this.saveProjects();
			} else {
				this.projects = projects;
			}
		},
		createNewProject(projectName) {
			let project = {
				name: projectName,
				endpoints: []
			}
			this.projects.push(project);
			this.saveProjects();
			return project;
		},
		saveNewEndpoint(projectName, endpointData) {
			let project = this.getProject(projectName);
			if (!project) {
				project = this.createNewProject(projectName);
			} else {
				this.deleteEndpoint(projectName, endpointData);
			}
			project.endpoints.push(endpointData);
			this.saveProjects();
		},
		saveProjects() {
			localStorage.setItem(this.localStorage.PROJECTS_KEY, JSON.stringify(this.projects));
		},
		getProject(projectName) {
			for (let i=0; i<this.projects.length; i++) {
				let project = this.projects[i];
				if (project.name == projectName) {
					return project;
				}
			}
		},
		deleteProject(project) {
			this.projects = this.projects.filter(p => p.name != project.name);
			this.saveProjects()
		},
		deleteEndpoint(projectName, endpoint) {
			console.log("deleting endpoint " + (endpoint.name));
			let project = this.getProject(projectName);
			if (project) {
				console.log(project);
				project.endpoints = project.endpoints.filter(ep => ep.name != endpoint.name);
				this.saveProjects();
			}
		},
		openEndpoint(projectName, endpointData) {
			endpointData['projectName'] = projectName;
			console.log(endpointData);
			this.$emit(this.emissions.OPEN_ENDPOINT, endpointData);
		}
	},
	template: `
	<nav
		id="sidebar"
		:class="{ active: isOpen }"
	>

		<nav class="navbar navbar-dark bg-dark">
			<div class="navbar-brand">
				Saved Endpoints
			</div>
		</nav>

		<ul
			class="projects"
			v-if="projects.length > 0"
		>
			<li
				class="project"
				v-for="(project, index) in projects"
				:key="'project_' + project.name"
			>
				<div class="d-flex">
					<span class="project__name flex-grow-1 align-bottom">
						{{ project.name }}
					</span>
					<button class="endpoint__delete align-top" @click.prevent="deleteProject(project)">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<ul class="project--endpoints">
					<li
						class="endpoint d-flex"
						v-for="(endpoint, jndex) in project.endpoints"
						:key="'endpoint_' + project.name + '_' + endpoint.name + '_' + jndex"
						@click="openEndpoint(project.name, endpoint)"
					>
						<span class="endpoint__name flex-grow-1 align-bottom">
							{{ endpoint.name }}
						</span>
						<button class="endpoint__delete align-top" @click.prevent="deleteEndpoint(project.name, endpoint)">
							<i class="fas fa-times"></i>
						</button>
					</li>
				</ul>

			</li>
		</ul>
		<div
			class="pl-4 pr-4 pt-4"
			v-else
		><i>You do not have any saved projects.</i>
		</div>

		<footer>
			<div class="sosumi">
				&copy; 2020 <a href="http://github.com/backupbrain/" target="_new">Tony Gaitatzis</a>
				{{ $t('allRightsReserved') }}.
				<a href="http://www.apache.org/licenses/" target="_new">{{ $t('apacheLicense') }}</a>
			</div>
		</footer>
    </nav>
	`
}