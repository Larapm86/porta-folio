<script lang="ts">
	import MainPage from '../../+page.svelte';
	let { data } = $props();
</script>

<MainPage initialActivePage="work" initialProject={data.projectName} />
