import MainTemplate from './components/MainTemplate.vue.js';

document.addEventListener("DOMContentLoaded", () => {

	const i18n = new VueI18n({
		locale: 'en',
		messages: {},
	});

	application = new Vue({
		el: '#app',
		i18n,
		components: {
			'main-template': MainTemplate,
		},
		data: {
		},
		mounted() {
			// grab URL parameters
		},
		methods: {
		},
		render: h => h(MainTemplate),
	});
});

