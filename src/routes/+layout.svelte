<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';

	let { children } = $props();

	let routeFlashActive = $state(false);

	function prefersReducedMotion(): boolean {
		if (typeof window === 'undefined') return false;
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function waitMs(ms: number): Promise<void> {
		return new Promise((r) => setTimeout(r, ms));
	}

	onNavigate((navigation) => {
		if (typeof document === 'undefined') return;

		if (prefersReducedMotion()) return;

		if (document.startViewTransition) {
			return new Promise((resolve) => {
				document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
				});
			});
		}

		return (async () => {
			const fadeIn = 180;
			const hold = 120;
			const fadeOut = 260;
			routeFlashActive = true;
			await waitMs(fadeIn);
			await navigation.complete;
			await waitMs(hold);
			routeFlashActive = false;
			await waitMs(fadeOut);
		})();
	});
</script>

<div
	class="route-flash-overlay"
	class:active={routeFlashActive}
	aria-hidden="true"
></div>

{#key page.url.pathname}
	<div class="route-shell">
		{@render children()}
	</div>
{/key}

<style>
	.route-flash-overlay {
		position: fixed;
		inset: 0;
		z-index: 2147483646;
		background: #fff;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.18s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.route-flash-overlay.active {
		opacity: 1;
		pointer-events: auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.route-flash-overlay {
			transition: none;
		}
	}

	:global(::view-transition-group(root)) {
		animation-duration: 460ms;
		animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		background: #fff;
	}

	:global(::view-transition-old(root)) {
		animation: route-old-out 220ms cubic-bezier(0.4, 0, 0.2, 1) both;
	}

	:global(::view-transition-new(root)) {
		animation: route-new-in 300ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
	}

	@keyframes route-old-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes route-new-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(::view-transition-group(root)),
		:global(::view-transition-old(root)),
		:global(::view-transition-new(root)) {
			animation: none !important;
		}
	}
</style>
