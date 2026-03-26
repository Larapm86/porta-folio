<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { PROJECTS, projectToSlug } from '$lib/data/projects';

	type PageKey = 'home' | 'work' | 'about';
	type PageProps = {
		initialActivePage?: PageKey;
		initialProject?: string;
	};
	let { initialActivePage = 'home', initialProject = 'UX Maturity' }: PageProps = $props();

	const activePage = $derived.by<PageKey>(() =>
		initialActivePage === 'work' || initialActivePage === 'about' ? initialActivePage : 'home'
	);
	const currentProject = $derived.by<string>(() =>
		Object.prototype.hasOwnProperty.call(PROJECTS, initialProject) ? initialProject : 'UX Maturity'
	);
	let mobileOpen = $state(false);
	let soberoPanelEl: HTMLDivElement | null = null;
	let soberoAnimEl: HTMLDivElement | null = null;
	let soberoAnimVisible = $state(false);
	let soberoAnimation: import('lottie-web').AnimationItem | null = null;
	let soberoMobileInView = false;
	let kwitPanelEl: HTMLDivElement | null = null;
	let kwitAnimEl: HTMLDivElement | null = null;
	let kwitAnimVisible = $state(false);
	let kwitAnimation: import('lottie-web').AnimationItem | null = null;
	let kwitMobileInView = false;
	let yazio01PanelEl: HTMLDivElement | null = null;
	let yazio01AnimEl: HTMLDivElement | null = null;
	let yazio01AnimVisible = $state(false);
	let yazio01Animation: import('lottie-web').AnimationItem | null = null;
	let yazio01MobileInView = false;
	let yazio02PanelEl: HTMLDivElement | null = null;
	let yazio02AnimEl: HTMLDivElement | null = null;
	let yazio02AnimVisible = $state(false);
	let yazio02Animation: import('lottie-web').AnimationItem | null = null;
	let yazio02MobileInView = false;
	let welltechPanelEl: HTMLDivElement | null = null;
	let welltechAnimEl: HTMLDivElement | null = null;
	let welltechAnimVisible = $state(false);
	let welltechAnimation: import('lottie-web').AnimationItem | null = null;
	let welltechMobileInView = false;

	function closeMob() {
		mobileOpen = false;
	}

	function openProjectRoute(project: string) {
		void goto(`/work/${projectToSlug(project)}`);
	}

	function openAboutRoute() {
		void goto('/about');
	}

	function openHomeRoute() {
		void goto('/');
	}

	function mobNavAbout() {
		closeMob();
		openAboutRoute();
	}

	function chipOpenProject(e: KeyboardEvent, project: string) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			openProjectRoute(project);
		}
	}

	function isCoarsePointerDevice(): boolean {
		return typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
	}

	async function ensureKwitAnimation() {
		if (!kwitAnimEl || kwitAnimation) return;
		const lottieModule = await import('lottie-web');
		const lottie = lottieModule.default;
		kwitAnimation = lottie.loadAnimation({
			container: kwitAnimEl,
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: '/assets/kwit-cover-hover.json',
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice'
			}
		});
		kwitAnimation.goToAndStop(0, true);
	}

	async function playKwitAnimation() {
		await ensureKwitAnimation();
		kwitAnimVisible = true;
		kwitAnimation?.setLoop(true);
		kwitAnimation?.goToAndPlay(0, true);
	}

	async function playKwitAnimationOnce() {
		await ensureKwitAnimation();
		kwitAnimVisible = true;
		kwitAnimation?.setLoop(false);
		kwitAnimation?.goToAndPlay(0, true);
	}

	function stopKwitAnimation() {
		kwitAnimation?.stop();
		kwitAnimation?.goToAndStop(0, true);
		kwitAnimVisible = false;
	}

	function onKwitHoverStart() {
		if (isCoarsePointerDevice()) return;
		void playKwitAnimation();
	}

	function onKwitHoverEnd() {
		if (isCoarsePointerDevice()) return;
		stopKwitAnimation();
	}

	async function ensureSoberoAnimation() {
		if (!soberoAnimEl || soberoAnimation) return;
		const lottieModule = await import('lottie-web');
		const lottie = lottieModule.default;
		soberoAnimation = lottie.loadAnimation({
			container: soberoAnimEl,
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: '/assets/sobero-cover-hover.json',
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice'
			}
		});
		soberoAnimation.goToAndStop(0, true);
	}

	async function playSoberoAnimation() {
		await ensureSoberoAnimation();
		soberoAnimVisible = true;
		soberoAnimation?.setLoop(true);
		soberoAnimation?.goToAndPlay(0, true);
	}

	async function playSoberoAnimationOnce() {
		await ensureSoberoAnimation();
		soberoAnimVisible = true;
		soberoAnimation?.setLoop(false);
		soberoAnimation?.goToAndPlay(0, true);
	}

	function stopSoberoAnimation() {
		soberoAnimation?.stop();
		soberoAnimation?.goToAndStop(0, true);
		soberoAnimVisible = false;
	}

	function onSoberoHoverStart() {
		if (isCoarsePointerDevice()) return;
		void playSoberoAnimation();
	}

	function onSoberoHoverEnd() {
		if (isCoarsePointerDevice()) return;
		stopSoberoAnimation();
	}

	async function ensureYazio01Animation() {
		if (!yazio01AnimEl || yazio01Animation) return;
		const lottieModule = await import('lottie-web');
		const lottie = lottieModule.default;
		yazio01Animation = lottie.loadAnimation({
			container: yazio01AnimEl,
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: '/assets/yazio-cover-01-hover.json',
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice'
			}
		});
		yazio01Animation.goToAndStop(0, true);
	}

	async function playYazio01Animation() {
		await ensureYazio01Animation();
		yazio01AnimVisible = true;
		yazio01Animation?.setLoop(true);
		yazio01Animation?.goToAndPlay(0, true);
	}

	async function playYazio01AnimationOnce() {
		await ensureYazio01Animation();
		yazio01AnimVisible = true;
		yazio01Animation?.setLoop(false);
		yazio01Animation?.goToAndPlay(0, true);
	}

	function stopYazio01Animation() {
		yazio01Animation?.stop();
		yazio01Animation?.goToAndStop(0, true);
		yazio01AnimVisible = false;
	}

	function onYazio01HoverStart() {
		if (isCoarsePointerDevice()) return;
		void playYazio01Animation();
	}

	function onYazio01HoverEnd() {
		if (isCoarsePointerDevice()) return;
		stopYazio01Animation();
	}

	async function ensureYazio02Animation() {
		if (!yazio02AnimEl || yazio02Animation) return;
		const lottieModule = await import('lottie-web');
		const lottie = lottieModule.default;
		yazio02Animation = lottie.loadAnimation({
			container: yazio02AnimEl,
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: '/assets/yazio-cover-02-hover.json',
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice'
			}
		});
		yazio02Animation.goToAndStop(0, true);
	}

	async function playYazio02Animation() {
		await ensureYazio02Animation();
		yazio02AnimVisible = true;
		yazio02Animation?.setLoop(true);
		yazio02Animation?.goToAndPlay(0, true);
	}

	async function playYazio02AnimationOnce() {
		await ensureYazio02Animation();
		yazio02AnimVisible = true;
		yazio02Animation?.setLoop(false);
		yazio02Animation?.goToAndPlay(0, true);
	}

	function stopYazio02Animation() {
		yazio02Animation?.stop();
		yazio02Animation?.goToAndStop(0, true);
		yazio02AnimVisible = false;
	}

	function onYazio02HoverStart() {
		if (isCoarsePointerDevice()) return;
		void playYazio02Animation();
	}

	function onYazio02HoverEnd() {
		if (isCoarsePointerDevice()) return;
		stopYazio02Animation();
	}

	async function ensureWelltechAnimation() {
		if (!welltechAnimEl || welltechAnimation) return;
		const lottieModule = await import('lottie-web');
		const lottie = lottieModule.default;
		welltechAnimation = lottie.loadAnimation({
			container: welltechAnimEl,
			renderer: 'svg',
			loop: true,
			autoplay: false,
			path: '/assets/welltech-cover-hover.json',
			rendererSettings: {
				preserveAspectRatio: 'xMidYMid slice'
			}
		});
		welltechAnimation.goToAndStop(0, true);
	}

	async function playWelltechAnimation() {
		await ensureWelltechAnimation();
		welltechAnimVisible = true;
		welltechAnimation?.setLoop(true);
		welltechAnimation?.goToAndPlay(0, true);
	}

	async function playWelltechAnimationOnce() {
		await ensureWelltechAnimation();
		welltechAnimVisible = true;
		welltechAnimation?.setLoop(false);
		welltechAnimation?.goToAndPlay(0, true);
	}

	function stopWelltechAnimation() {
		welltechAnimation?.stop();
		welltechAnimation?.goToAndStop(0, true);
		welltechAnimVisible = false;
	}

	function onWelltechHoverStart() {
		if (isCoarsePointerDevice()) return;
		void playWelltechAnimation();
	}

	function onWelltechHoverEnd() {
		if (isCoarsePointerDevice()) return;
		stopWelltechAnimation();
	}

	function carouselStepPx(track: HTMLElement): number {
		// Slides are full-width (`flex: 0 0 100%` / `width: 100%`), so using the track width
		// avoids off-by-a-few-pixels rounding that can cause the snap to pick the same slide.
		return track.clientWidth || 0;
	}

	function carouselSlideCount(track: HTMLElement): number {
		return track.querySelectorAll('.w-panel-carousel-img').length;
	}

	function startVideoOnDominoReveal(node: HTMLVideoElement) {
		const panel = node.closest('.w-panel');
		let shouldStart = false;
		let hasStarted = false;
		let revealTimer: number | null = null;
		let isVideoReady = false;
		const attemptPlayFromStart = () => {
			if (!shouldStart || hasStarted || !isVideoReady) return;
			node.muted = true;
			node.playsInline = true;
			try {
				node.currentTime = 0;
			} catch {
				// Some browsers may block currentTime until metadata is ready.
			}
			void node
				.play()
				.then(() => {
					hasStarted = true;
				})
				.catch(() => {
					// Autoplay can fail transiently; ready events below will retry.
				});
		};
		const holdAtStartFrame = () => {
			if (shouldStart) return;
			try {
				node.pause();
				node.currentTime = 0;
			} catch {
				// Ignore while metadata is not yet available.
			}
		};
		const revealWhenReady = () => {
			isVideoReady = true;
			node.style.visibility = 'visible';
			node.style.opacity = '1';
			attemptPlayFromStart();
		};

		node.muted = true;
		node.playsInline = true;
		node.style.visibility = 'hidden';
		node.style.opacity = '0';
		holdAtStartFrame();
		node.load();
		node.addEventListener('loadeddata', holdAtStartFrame);
		node.addEventListener('canplay', holdAtStartFrame);
		node.addEventListener('loadeddata', revealWhenReady);
		node.addEventListener('canplay', revealWhenReady);
		node.addEventListener('error', revealWhenReady);
		node.addEventListener('loadeddata', attemptPlayFromStart);
		node.addEventListener('canplay', attemptPlayFromStart);

		// Start based on the same domino schedule as CSS so video playback is deterministic.
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!panel || prefersReduced) {
			shouldStart = true;
			void Promise.resolve().then(attemptPlayFromStart);
		} else {
			const rawIndex = getComputedStyle(panel).getPropertyValue('--panel-index').trim();
			const panelIndex = Number.isFinite(Number(rawIndex)) ? Number(rawIndex) : 0;
			// Match CSS domino schedule: start playback when panel entrance finishes.
			const revealDelayMs = 800 + panelIndex * 105 + 820;
			revealTimer = window.setTimeout(() => {
				shouldStart = true;
				attemptPlayFromStart();
			}, revealDelayMs);
		}

		return {
			destroy() {
				node.removeEventListener('loadeddata', holdAtStartFrame);
				node.removeEventListener('canplay', holdAtStartFrame);
				node.removeEventListener('loadeddata', revealWhenReady);
				node.removeEventListener('canplay', revealWhenReady);
				node.removeEventListener('error', revealWhenReady);
				node.removeEventListener('loadeddata', attemptPlayFromStart);
				node.removeEventListener('canplay', attemptPlayFromStart);
				if (revealTimer !== null) window.clearTimeout(revealTimer);
			}
		};
	}

	function syncCarouselArrows(track: HTMLElement) {
		const wrap = track.closest('.w-panel-carousel');
		if (!wrap) return;
		const prev = wrap.querySelector('.w-panel-carousel-btn--prev') as HTMLButtonElement | null;
		const next = wrap.querySelector('.w-panel-carousel-btn--next') as HTMLButtonElement | null;
		if (!prev || !next) return;
		const max = Math.max(0, track.scrollWidth - track.clientWidth);
		const sl = track.scrollLeft;
		prev.disabled = sl <= 1;
		next.disabled = sl >= max - 1;
	}

	function carouselStep(e: MouseEvent, dir: -1 | 1) {
		e.preventDefault();
		e.stopPropagation();
		const btn = e.currentTarget as HTMLElement;
		const wrap = btn.closest('.w-panel-carousel');
		const track = wrap?.querySelector('.w-panel-images') as HTMLElement | null;
		if (!track) return;
		const smooth =
			typeof window !== 'undefined' &&
			!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const step = carouselStepPx(track);
		const count = carouselSlideCount(track);
		if (step <= 0 || count <= 0) return;
		track.scrollBy({ left: dir * step, behavior: smooth ? 'smooth' : 'auto' });
		const sync = () => syncCarouselArrows(track);
		sync();
		track.addEventListener('scrollend', sync, { once: true });
		window.setTimeout(sync, 450);
	}

	$effect(() => {
		void activePage;
		void currentProject;
		if (activePage !== 'work') return;
		tick().then(() => {
			document.querySelectorAll('.w-panel-images').forEach((node) => {
				// Ensure each carousel starts from the first slide when opening/changing projects.
				// Otherwise, leftover `scrollLeft` can make "placeholder positions" appear incorrect.
				(node as HTMLElement).scrollLeft = 0;
				syncCarouselArrows(node as HTMLElement);
			});
		});
	});

	function dragScroll(el: HTMLElement) {
		let down = false;
		let moved = false;
		let sx = 0;
		let sl = 0;
		let tx = 0;
		let ts = 0;
		let activeScroller: HTMLElement | null = null;

		const onDown = (e: MouseEvent) => {
			if ((e.target as HTMLElement).closest('.w-panel-carousel-btn')) return;
			activeScroller = el;
			down = true;
			moved = false;
			sx = e.pageX;
			sl = el.scrollLeft;
			el.classList.add('grabbing');
			e.preventDefault();
		};
		const onMove = (e: MouseEvent) => {
			if (!down || !activeScroller) return;
			const dx = e.pageX - sx;
			if (Math.abs(dx) > 3) moved = true;
			activeScroller.scrollLeft = sl - dx * 1.4;
		};
		const onUp = () => {
			down = false;
			activeScroller = null;
			el.classList.remove('grabbing');
		};
		const onClick = (e: MouseEvent) => {
			if (moved) {
				e.stopPropagation();
				moved = false;
			}
		};
		const onWheel = (e: WheelEvent) => {
			e.preventDefault();
			el.scrollLeft +=
				(Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 1.5;
		};
		const onTouchStart = (e: TouchEvent) => {
			if ((e.target as HTMLElement).closest('.w-panel-carousel-btn')) {
				activeScroller = null;
				return;
			}
			activeScroller = el;
			tx = e.touches[0].pageX;
			ts = el.scrollLeft;
		};
		const onTouchMove = (e: TouchEvent) => {
			if (!activeScroller) return;
			activeScroller.scrollLeft = ts - (e.touches[0].pageX - tx) * 1.2;
		};

		el.addEventListener('mousedown', onDown);
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		el.addEventListener('click', onClick, true);
		el.addEventListener('wheel', onWheel, { passive: false });
		el.addEventListener('touchstart', onTouchStart, { passive: true });
		el.addEventListener('touchmove', onTouchMove, { passive: true });

		return () => {
			el.removeEventListener('mousedown', onDown);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			el.removeEventListener('click', onClick, true);
			el.removeEventListener('wheel', onWheel);
			el.removeEventListener('touchstart', onTouchStart);
			el.removeEventListener('touchmove', onTouchMove);
		};
	}

	onMount(() => {
		const home = document.getElementById('strip-home');
		const work = document.getElementById('strip-work');
		let destroyHome: (() => void) | undefined;
		let destroyWork: (() => void) | undefined;
		let soberoObserver: IntersectionObserver | null = null;
		let kwitObserver: IntersectionObserver | null = null;
		let yazio01Observer: IntersectionObserver | null = null;
		let yazio02Observer: IntersectionObserver | null = null;
		let welltechObserver: IntersectionObserver | null = null;
		let removeSoberoHoverListeners: (() => void) | undefined;
		let removeKwitHoverListeners: (() => void) | undefined;
		let removeYazio01HoverListeners: (() => void) | undefined;
		let removeYazio02HoverListeners: (() => void) | undefined;
		let removeWelltechHoverListeners: (() => void) | undefined;
		if (home) destroyHome = dragScroll(home);
		if (work) destroyWork = dragScroll(work);
		if (soberoPanelEl) {
			const onEnter = () => onSoberoHoverStart();
			const onLeave = () => onSoberoHoverEnd();
			soberoPanelEl.addEventListener('mouseenter', onEnter);
			soberoPanelEl.addEventListener('mouseleave', onLeave);
			removeSoberoHoverListeners = () => {
				soberoPanelEl?.removeEventListener('mouseenter', onEnter);
				soberoPanelEl?.removeEventListener('mouseleave', onLeave);
			};
		}
		if (kwitPanelEl) {
			const onEnter = () => onKwitHoverStart();
			const onLeave = () => onKwitHoverEnd();
			kwitPanelEl.addEventListener('mouseenter', onEnter);
			kwitPanelEl.addEventListener('mouseleave', onLeave);
			removeKwitHoverListeners = () => {
				kwitPanelEl?.removeEventListener('mouseenter', onEnter);
				kwitPanelEl?.removeEventListener('mouseleave', onLeave);
			};
		}
		if (yazio01PanelEl) {
			const onEnter = () => onYazio01HoverStart();
			const onLeave = () => onYazio01HoverEnd();
			yazio01PanelEl.addEventListener('mouseenter', onEnter);
			yazio01PanelEl.addEventListener('mouseleave', onLeave);
			removeYazio01HoverListeners = () => {
				yazio01PanelEl?.removeEventListener('mouseenter', onEnter);
				yazio01PanelEl?.removeEventListener('mouseleave', onLeave);
			};
		}
		if (yazio02PanelEl) {
			const onEnter = () => onYazio02HoverStart();
			const onLeave = () => onYazio02HoverEnd();
			yazio02PanelEl.addEventListener('mouseenter', onEnter);
			yazio02PanelEl.addEventListener('mouseleave', onLeave);
			removeYazio02HoverListeners = () => {
				yazio02PanelEl?.removeEventListener('mouseenter', onEnter);
				yazio02PanelEl?.removeEventListener('mouseleave', onLeave);
			};
		}
		if (welltechPanelEl) {
			const onEnter = () => onWelltechHoverStart();
			const onLeave = () => onWelltechHoverEnd();
			welltechPanelEl.addEventListener('mouseenter', onEnter);
			welltechPanelEl.addEventListener('mouseleave', onLeave);
			removeWelltechHoverListeners = () => {
				welltechPanelEl?.removeEventListener('mouseenter', onEnter);
				welltechPanelEl?.removeEventListener('mouseleave', onLeave);
			};
		}
		if (kwitPanelEl) {
			kwitObserver = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= 0.98) {
						if (kwitMobileInView) return;
						kwitMobileInView = true;
						void playKwitAnimationOnce();
						return;
					}
					kwitMobileInView = false;
					stopKwitAnimation();
				},
				{ threshold: [0, 0.98, 1] }
			);
			kwitObserver.observe(kwitPanelEl);
		}
		if (soberoPanelEl) {
			soberoObserver = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= 0.98) {
						if (soberoMobileInView) return;
						soberoMobileInView = true;
						void playSoberoAnimationOnce();
						return;
					}
					soberoMobileInView = false;
					stopSoberoAnimation();
				},
				{ threshold: [0, 0.98, 1] }
			);
			soberoObserver.observe(soberoPanelEl);
		}
		if (yazio01PanelEl) {
			yazio01Observer = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= 0.98) {
						if (yazio01MobileInView) return;
						yazio01MobileInView = true;
						void playYazio01AnimationOnce();
						return;
					}
					yazio01MobileInView = false;
					stopYazio01Animation();
				},
				{ threshold: [0, 0.98, 1] }
			);
			yazio01Observer.observe(yazio01PanelEl);
		}
		if (yazio02PanelEl) {
			yazio02Observer = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= 0.98) {
						if (yazio02MobileInView) return;
						yazio02MobileInView = true;
						void playYazio02AnimationOnce();
						return;
					}
					yazio02MobileInView = false;
					stopYazio02Animation();
				},
				{ threshold: [0, 0.98, 1] }
			);
			yazio02Observer.observe(yazio02PanelEl);
		}
		if (welltechPanelEl) {
			welltechObserver = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					// Last panel rarely reaches ~100% visibility on mobile due viewport and strip padding.
					// Trigger once when it's mostly visible.
					if (entry.intersectionRatio >= 0.85) {
						if (welltechMobileInView) return;
						welltechMobileInView = true;
						void playWelltechAnimationOnce();
						return;
					}
					welltechMobileInView = false;
					stopWelltechAnimation();
				},
				{ threshold: [0, 0.85, 1] }
			);
			welltechObserver.observe(welltechPanelEl);
		}
		// Preload animated home-cover assets so first hover starts immediately.
		void ensureKwitAnimation();
		void ensureSoberoAnimation();
		void ensureYazio01Animation();
		void ensureYazio02Animation();
		void ensureWelltechAnimation();

		return () => {
			removeSoberoHoverListeners?.();
			removeKwitHoverListeners?.();
			removeYazio01HoverListeners?.();
			removeYazio02HoverListeners?.();
			removeWelltechHoverListeners?.();
			soberoObserver?.disconnect();
			kwitObserver?.disconnect();
			yazio01Observer?.disconnect();
			yazio02Observer?.disconnect();
			welltechObserver?.disconnect();
			stopSoberoAnimation();
			soberoAnimation?.destroy();
			soberoAnimation = null;
			stopKwitAnimation();
			kwitAnimation?.destroy();
			kwitAnimation = null;
			stopYazio01Animation();
			yazio01Animation?.destroy();
			yazio01Animation = null;
			stopYazio02Animation();
			yazio02Animation?.destroy();
			yazio02Animation = null;
			stopWelltechAnimation();
			welltechAnimation?.destroy();
			welltechAnimation = null;
			destroyHome?.();
			destroyWork?.();
		};
	});
</script>

<svelte:head>
	<title>Lara Perez</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap"
		rel="stylesheet"
	/>
	<link
		rel="preload"
		href="/fonts/quadrant-text-mono-regular.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && mobileOpen) closeMob();
	}}
/>

{#snippet chipLetters(t: string)}
	{#each t.split('') as ch, i}
		<span class="chip__letter" style="--i: {i}">{ch === ' ' ? '\u00a0' : ch}</span>
	{/each}
{/snippet}

<header class:menu-open={mobileOpen}>
	<div class="nav-row">
		<div class="nav-brand">
				<button type="button" onclick={openHomeRoute}>Lara Perez</button>
		</div>

		<div class="nav-work" class:sub-visible={activePage === 'work'}>
				<button
					type="button"
					class="nav-work-label"
					class:active={activePage === 'work'}
					onclick={openHomeRoute}
				>
					Work
				</button>
			<div class="nav-sub-links">
				{#each Object.keys(PROJECTS) as proj}
						<button
							type="button"
						class:current={activePage === 'work' && currentProject === proj}
							onclick={() => openProjectRoute(proj)}
						>
						{proj}
						</button>
				{/each}
			</div>
		</div>

		<nav class="nav-right">
				<button type="button" class:current={activePage === 'about'} onclick={openAboutRoute}>
					About
				</button>
			<a class="nav-say-hola" href="mailto:lperezmolines@gmail.com">Say Hola</a>
		</nav>

		<button
			type="button"
			class="nav-index"
			aria-expanded={mobileOpen}
			aria-controls="site-mob-menu"
			onclick={() => (mobileOpen = !mobileOpen)}
		>
			{mobileOpen ? 'Close' : 'Index'}
		</button>
	</div>

	<!-- Arnold-style full-screen sheet: primary case links (24px), secondary nav (15px), footer -->
	<div
		id="site-mob-menu"
		class="mob-menu"
		class:open={mobileOpen}
		role="dialog"
		aria-modal="true"
		aria-label="Site menu"
	>
		<div class="mob-menu-inner">
			<!-- Arnold: pt-12 text-24 primary stack -->
			<nav class="mob-primary" aria-label="Case studies">
				{#each Object.keys(PROJECTS) as proj}
					<div class="mob-primary-row">
						<button
							type="button"
							class="mob-primary-link"
							class:current={currentProject === proj && activePage === 'work'}
							onclick={() => {
								openProjectRoute(proj);
								closeMob();
							}}
						>
							{proj}
						</button>
					</div>
				{/each}
			</nav>
			<!-- Flexible gap between primary and secondary (Arnold menu layout) -->
			<div class="mob-menu-spacer" aria-hidden="true"></div>
			<!-- Arnold-style secondary block — About + contact (case studies are primary above) -->
			<div class="mob-secondary">
				<div class="mob-secondary-row">
					<button
						type="button"
						class="mob-secondary-link"
						class:current={activePage === 'about'}
						onclick={mobNavAbout}
					>
						About
					</button>
				</div>
				<div class="mob-secondary-row">
					<a
						class="mob-secondary-link"
						href="mailto:lperezmolines@gmail.com"
						onclick={() => closeMob()}
					>
						Say Hola
					</a>
				</div>
			</div>
			<div class="mob-foot">Barcelona, Spain<br />Available for projects</div>
		</div>
	</div>
</header>

<div id="page-home" class="page" class:active={activePage === 'home'}>
	<div class="home-intro">
		<p>
			Product and system designer with a business background. Previously, I helped
			design
			<span
				role="button"
				tabindex="0"
				class="chip"
				onclick={() => openProjectRoute('UX Maturity')}
				onkeydown={(e) => chipOpenProject(e, 'UX Maturity')}
			>
				{@render chipLetters('UX-matured environments')}
			</span>,
			<span
				role="button"
				tabindex="0"
				class="chip"
				onclick={() => openProjectRoute('Premium Retention')}
				onkeydown={(e) => chipOpenProject(e, 'Premium Retention')}
			>
				{@render chipLetters('premium retention')}
			</span>
			journeys,
			<span
				role="button"
				tabindex="0"
				class="chip"
				onclick={() => openProjectRoute('0-to-1 Product')}
				onkeydown={(e) => chipOpenProject(e, '0-to-1 Product')}
			>
				{@render chipLetters('0-to-1 products')}
			</span>, accelerated
			<span
				role="button"
				tabindex="0"
				class="chip"
				onclick={() => openProjectRoute('Time-to-Value')}
				onkeydown={(e) => chipOpenProject(e, 'Time-to-Value')}
			>
				{@render chipLetters('time-to-value')}
			</span>, and crafted meaningful
			<span
				role="button"
				tabindex="0"
				class="chip"
				onclick={() => openProjectRoute('Habit Loops')}
				onkeydown={(e) => chipOpenProject(e, 'Habit Loops')}
			>
				{@render chipLetters('habit loops')}
			</span>. Recently, I've been focusing on improving
			<span
				role="button"
				tabindex="0"
				class="chip"
				onclick={() => openProjectRoute('Growth Systems')}
				onkeydown={(e) => chipOpenProject(e, 'Growth Systems')}
			>
				{@render chipLetters('growth systems')}
			</span>.
		</p>
	</div>

	<div class="home-strip" id="strip-home">
		<div class="h-panel" style="--panel-index: 0;">
			<div class="h-panel-bg h-panel-bg--sobero" bind:this={soberoPanelEl}>
				<img src="/assets/sobero-cover.png" alt="Sobero" />
				<div
					class="h-panel-lottie"
					class:is-active={soberoAnimVisible}
					bind:this={soberoAnimEl}
				></div>
			</div>
		</div>
		<div class="h-panel" style="--panel-index: 1;">
			<div class="h-panel-bg h-panel-bg--kwit" bind:this={kwitPanelEl}>
				<img
					src="/assets/kwit-cover.png"
					alt="Kwit app with World Health Organization validation"
				/>
				<div class="h-panel-lottie" class:is-active={kwitAnimVisible} bind:this={kwitAnimEl}></div>
			</div>
		</div>
		<div class="h-panel" style="--panel-index: 2;">
			<div class="h-panel-bg h-panel-bg--yazio01" bind:this={yazio01PanelEl}>
				<img
					src="/assets/yazio-cover.png"
					alt="Yazio UX case study: microcopy optimization and Apple and Google Health onboarding variants"
				/>
				<div
					class="h-panel-lottie"
					class:is-active={yazio01AnimVisible}
					bind:this={yazio01AnimEl}
				></div>
			</div>
		</div>
		<div class="h-panel" style="--panel-index: 3;">
			<div class="h-panel-bg h-panel-bg--yazio02" bind:this={yazio02PanelEl}>
				<img
					src="/assets/yazio-cover-02.png"
					alt="Habit loop illustration with mascot: reward, investment, trigger, and routine"
				/>
				<div
					class="h-panel-lottie"
					class:is-active={yazio02AnimVisible}
					bind:this={yazio02AnimEl}
				></div>
			</div>
		</div>
		<div class="h-panel" style="--panel-index: 4;">
			<div class="h-panel-bg h-panel-bg--welltech" bind:this={welltechPanelEl}>
				<img
					src="/assets/welltech-cover.png"
					alt="Product workflow board: hypothesis, specification, design phases with roles and pain points"
				/>
				<div
					class="h-panel-lottie"
					class:is-active={welltechAnimVisible}
					bind:this={welltechAnimEl}
				></div>
			</div>
		</div>
	</div>
</div>

<div id="page-work" class="page" class:active={activePage === 'work'}>
	<div class="work-top">
		<div class="work-top-spacer"></div>
		<p class="work-desc">{PROJECTS[currentProject].desc}</p>
		<div class="work-meta">{@html PROJECTS[currentProject].meta}</div>
	</div>

	<div class="work-strip-wrap">
		<div class="work-strip" id="strip-work">
			{#key currentProject}
				{#each PROJECTS[currentProject].panels as panel, i}
					<div class="w-panel" style={`--panel-index: ${i};`}>
						<div
							class="w-panel-bg"
							class:w-panel-bg--video={panel.video ||
								panel.image ||
								(panel.images && panel.images.length > 0)}
							class:w-panel-bg--force-dark-label={panel.label === 'Modular product architecture'}
							class:w-panel-bg--placeholder={!panel.video &&
								!panel.image &&
								!(panel.images && panel.images.length > 0)}
						>
							{#if panel.images && panel.images.length > 0}
								<div class="w-panel-carousel">
									<button
										type="button"
										class="w-panel-carousel-btn w-panel-carousel-btn--prev"
										aria-label="Previous image"
										onclick={(e) => carouselStep(e, -1)}
									>
										<svg class="w-panel-carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
											<path
												d="M14.5 17.5 8 12l6.5-5.5"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
												vector-effect="non-scaling-stroke"
											/>
										</svg>
									</button>
									<div
										class="w-panel-images"
										role="group"
										aria-roledescription="carousel"
										aria-label={`${panel.label} — use the arrows to move between images`}
										title="Use the side arrows to change image"
										onscroll={(e) => syncCarouselArrows(e.currentTarget as HTMLElement)}
									>
										{#each panel.images as src, i}
											<img
												class="w-panel-carousel-img"
												{src}
												alt="{panel.label} {i + 1}"
												loading={i === 0 ? 'eager' : 'lazy'}
												draggable="false"
											/>
										{/each}
									</div>
									<button
										type="button"
										class="w-panel-carousel-btn w-panel-carousel-btn--next"
										aria-label="Next image"
										onclick={(e) => carouselStep(e, 1)}
									>
										<svg class="w-panel-carousel-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
											<path
												d="M9.5 17.5 16 12l-6.5-5.5"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
												vector-effect="non-scaling-stroke"
											/>
										</svg>
									</button>
								</div>
							{:else if panel.image}
								<img
									class="w-panel-media w-panel-media--image"
									src={panel.image}
									alt={panel.label}
									loading="lazy"
								/>
							{:else if panel.video?.type === 'youtube'}
								<iframe
									class="w-panel-media"
									title={panel.label}
									src="https://www.youtube-nocookie.com/embed/{panel.video.id}?rel=0&modestbranding=1"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowfullscreen
									referrerpolicy="strict-origin-when-cross-origin"
									loading="lazy"
								></iframe>
							{:else if panel.video?.type === 'vimeo'}
								<iframe
									class="w-panel-media"
									title={panel.label}
									src="https://player.vimeo.com/video/{panel.video.id}?dnt=1"
									allow="autoplay; fullscreen; picture-in-picture"
									allowfullscreen
									referrerpolicy="strict-origin-when-cross-origin"
									loading="lazy"
								></iframe>
							{:else if panel.video?.type === 'file'}
								{#key `${currentProject}-${panel.label}-${panel.video.src}`}
									<video
										class="w-panel-media w-panel-media--file"
										use:startVideoOnDominoReveal
										playsinline
										preload="auto"
										autoplay
										muted
										loop
										poster={panel.video.poster ?? undefined}
									>
										<source
											src={panel.video.src}
											type={panel.video.src.split('?')[0].toLowerCase().endsWith('.mov')
												? 'video/quicktime'
												: undefined}
										/>
									</video>
								{/key}
							{/if}
							<span
								class="w-panel-label"
								class:w-panel-label--dark={panel.label === 'Modular product architecture' ||
									panel.label === 'Foundational research'}
							>
								{panel.label}
							</span>
						</div>
					</div>
				{/each}
			{/key}
		</div>
	</div>
</div>

<div id="page-about" class="page" class:active={activePage === 'about'}>
	<div class="about-body">
		<div class="about-portrait"><span class="about-ph">YN</span></div>
		<div class="about-bio">
			<p>
				I'm a graphic and brand designer with over 8 years of experience working with studios,
				startups, and cultural institutions across Europe.
			</p>
			<p>
				My practice is rooted in a deep love for typography, systems thinking, and the quiet power of
				restraint.
			</p>
			<p>
				I believe good design lives at the edge between what is said and what is felt - and that the
				best work never shouts.
			</p>
			<p>Based in Barcelona. Currently open to new projects.</p>
		</div>
		<div class="about-skills">
			<div class="about-info-block">
				<div class="about-info-title">Brand Strategy</div>
				<div class="about-info-detail">Visual Identity<br />Naming &amp; Positioning<br />Brand Guidelines</div>
			</div>
			<div class="about-info-block">
				<div class="about-info-title">Design</div>
				<div class="about-info-detail">Typography<br />Print and Packaging<br />Art Direction</div>
			</div>
			<div class="about-info-block">
				<div class="about-info-title">Digital</div>
				<div class="about-info-detail">Web Design<br />UI / UX<br />Motion</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Matches arnoldcircusstool.com .font-serif / quadrant-text-mono. Replace woff2 with your licensed file from Matter of Sorts if publishing. */
	@font-face {
		font-family: 'Quadrant Text Mono';
		src: url('/fonts/quadrant-text-mono-regular.woff2') format('woff2');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(:root) {
		--white: #ffffff;
		--cream: #f6f6f6;
		--black: #0f0e0c;
		/* Arnold arnoldcircusstool.com text-gray */
		--gray: #aaaaaa;
		--px: 18px;
		--section-spacing: 18px;
		--nav-h: 38px;
		--top-gap: 56px;
		/* quadrant-text-mono, serif (Arnold product-page / editorial stack) */
		--font-body: 'Quadrant Text Mono', ui-serif, Georgia, 'Times New Roman', serif;
		/* Nav: neo-grotesk (Arnold uses die-grotesk-b; Inter is a consistent web substitute) */
		--font-nav: 'Inter', 'Helvetica Neue', Helvetica, Arial, system-ui, sans-serif;
	}

	:global(html) {
		-webkit-tap-highlight-color: transparent;
	}

	:global(html),
	:global(body) {
		height: 100%;
		overflow: hidden;
		background: var(--white);
		color: var(--black);
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 1.3;
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
		padding: 0;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
	}

	/*
	 * Only the top bar row — not buttons inside .mob-menu (also under <header>).
	 * Limit to .nav-row so sheet buttons under <header> keep Quadrant Text Mono.
	 */
	.nav-row :is(button, a) {
		font-family: var(--font-nav) !important;
		font-size: 13px !important;
		font-weight: 600 !important;
		line-height: 1.3 !important;
		letter-spacing: 0 !important;
		font-synthesis: none;
		font-feature-settings:
			'liga' 1,
			'kern' 1;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: var(--nav-h);
		background: var(--white);
		z-index: 400;
		padding: 0 var(--px);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		pointer-events: auto;
		isolation: isolate;
		touch-action: manipulation;
	}

	header.menu-open {
		z-index: 501;
	}

	.nav-row {
		width: 100%;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		min-height: var(--nav-h);
	}
	/* Keep Index / brand above full-screen menu (fixed child stacks inside header). */
	header.menu-open .nav-row {
		position: relative;
		z-index: 2;
		background: var(--white);
	}
	.nav-brand {
		flex: 0 0 16%;
	}
	.nav-brand button:hover,
	.nav-right button:hover,
	.nav-right a.nav-say-hola:hover,
	.nav-sub-links button:hover,
	.nav-work-label:hover {
		opacity: 0.5;
	}

	.nav-work {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
	}
	.nav-work-label.active {
		color: var(--black);
	}
	/* Touch / coarse pointer: project links stay visible when the work nav is shown. */
	.nav-sub-links {
		display: flex;
		gap: 20px;
		margin-left: 20px;
		opacity: 1;
		pointer-events: auto;
		transition: opacity 0.15s;
		white-space: nowrap;
	}
	/* Desktop + mouse: hide case-study links until Work row hover, work page, or focus inside. */
	@media (min-width: 801px) and (hover: hover) and (pointer: fine) {
		.nav-sub-links {
			opacity: 0;
			pointer-events: none;
		}
		.nav-work:hover .nav-sub-links,
		.nav-work.sub-visible .nav-sub-links,
		.nav-work:focus-within .nav-sub-links {
			opacity: 1;
			pointer-events: auto;
		}
	}
	.nav-sub-links button {
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
	}
	.nav-sub-links button.current {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.nav-right button.current {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.nav-right {
		display: flex;
		gap: 22px;
		margin-left: auto;
	}
	.nav-index {
		display: none;
	}

	.page {
		position: fixed;
		top: var(--nav-h);
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition: opacity 0.25s, visibility 0.25s;
	}
	.page.active {
		z-index: 100;
		opacity: 1;
		visibility: visible;
		pointer-events: auto;
	}

	#page-home {
		display: flex;
		flex-direction: column;
	}
	.home-intro {
		padding: var(--top-gap) var(--px) 24px;
	}
	.home-intro p {
		font-family: var(--font-body);
		font-size: clamp(1.0625rem, 1.52vw, 1.25rem);
		line-height: 30px;
		max-width: 72%;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	@media (min-width: 1024px) {
		.home-intro p {
			letter-spacing: -0.04em;
		}
	}
	.chip {
		display: inline-block;
		vertical-align: baseline;
		padding: 1px 10px;
		line-height: 1.28;
		background: rgba(0, 0, 0, 0.07);
		border-radius: 6px;
		white-space: nowrap;
		cursor: pointer;
		touch-action: manipulation;
		-webkit-tap-highlight-color: transparent;
		transition: background 0.22s ease;
	}
	.chip__letter {
		display: inline-block;
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
		transition-delay: 0s;
	}
	.chip:hover .chip__letter,
	.chip:focus-visible .chip__letter {
		transform: translateY(-0.11em);
		transition-delay: calc(var(--i) * 0.022s);
	}
	@media (prefers-reduced-motion: reduce) {
		.chip__letter {
			transition: none;
		}
		.chip:hover .chip__letter,
		.chip:focus-visible .chip__letter {
			transform: none;
		}
	}
	.chip:hover {
		background: rgba(0, 0, 0, 0.16);
	}
	.chip:focus-visible {
		outline: 2px solid var(--black);
		outline-offset: 2px;
	}

	.home-strip {
		flex: 1;
		min-height: 0;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		display: flex;
		padding-left: var(--px);
		cursor: grab;
	}
	.work-strip {
		display: flex;
		height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		padding-left: var(--px);
		padding-bottom: var(--px);
		cursor: grab;
	}
	.home-strip::-webkit-scrollbar,
	.work-strip::-webkit-scrollbar {
		display: none;
	}
	.h-panel,
	.w-panel {
		flex: 0 0 auto;
		width: 43vw;
		height: 100%;
		padding-right: var(--px);
		padding-bottom: var(--px);
	}
	#page-work.active .w-panel {
		opacity: 0;
		transform: translateY(14px);
		animation: work-panel-domino-in 0.82s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
		animation-delay: calc(var(--panel-index, 0) * 105ms + 800ms);
	}
	#page-home.active .h-panel {
		opacity: 0;
		transform: translateY(14px);
		animation: home-panel-domino-in 0.82s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
		animation-delay: calc(var(--panel-index, 0) * 105ms + 800ms);
	}
	@keyframes home-panel-domino-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		1% {
			opacity: 1;
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes work-panel-domino-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
		1% {
			opacity: 1;
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		#page-work.active .w-panel {
			transform: none;
			animation: none;
		}
		#page-home.active .h-panel {
			transform: none;
			animation: none;
		}
	}
	.h-panel-bg,
	.w-panel-bg {
		width: 100%;
		height: 100%;
		background: var(--cream);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}
	.h-panel-bg img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		pointer-events: none;
		transform: scale(1);
		transition: transform 0.7s cubic-bezier(0.33, 0, 0.25, 1);
	}
	.h-panel-bg--sobero .h-panel-lottie,
	.h-panel-bg--yazio01 .h-panel-lottie,
	.h-panel-bg--yazio02 .h-panel-lottie,
	.h-panel-bg--welltech .h-panel-lottie,
	.h-panel-bg--kwit .h-panel-lottie {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.28s ease;
	}
	.h-panel-bg--sobero .h-panel-lottie.is-active,
	.h-panel-bg--yazio01 .h-panel-lottie.is-active,
	.h-panel-bg--yazio02 .h-panel-lottie.is-active,
	.h-panel-bg--welltech .h-panel-lottie.is-active,
	.h-panel-bg--kwit .h-panel-lottie.is-active {
		opacity: 1;
	}
	.h-panel-bg--sobero .h-panel-lottie :global(svg),
	.h-panel-bg--yazio01 .h-panel-lottie :global(svg),
	.h-panel-bg--yazio02 .h-panel-lottie :global(svg),
	.h-panel-bg--welltech .h-panel-lottie :global(svg),
	.h-panel-bg--kwit .h-panel-lottie :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
	.w-panel-bg--placeholder {
		background: var(--cream);
	}
	.w-panel-bg--video {
		background: #f6f6f6;
	}
	.w-panel-bg--video:has(> iframe.w-panel-media),
	.w-panel-bg--video:has(> video.w-panel-media) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.w-panel-media {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		display: block;
		transform: scale(1);
		transition: transform 0.7s cubic-bezier(0.33, 0, 0.25, 1);
	}
	.w-panel-bg--video video.w-panel-media--file {
		position: relative;
		inset: auto;
		width: auto;
		height: auto;
		max-width: min(92%, calc(100% - 24px));
		max-height: min(72%, calc(100% - 80px));
		object-fit: contain;
		box-sizing: border-box;
		border: 8px solid #000;
		border-radius: 32px;
		overflow: hidden;
	}
	.w-panel-bg--video img.w-panel-media--image {
		object-fit: cover;
		pointer-events: none;
	}
	.w-panel-carousel {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}
	/* Icon-only control: chevron only, no circular chrome */
	.w-panel-carousel-btn {
		position: absolute;
		top: 50%;
		z-index: 4;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 44px;
		min-height: 44px;
		padding: 10px;
		border: none;
		border-radius: 4px;
		background: transparent;
		color: var(--black);
		cursor: pointer;
		pointer-events: auto;
		transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.33, 0, 0.25, 1);
		-webkit-tap-highlight-color: transparent;
	}
	.w-panel-carousel-btn:focus-visible {
		outline: 2px solid var(--black);
		outline-offset: 3px;
	}
	.w-panel-carousel-btn__icon {
		width: 26px;
		height: 26px;
		display: block;
		opacity: 0.92;
		/* Thin light halo so portfolio black stays legible on dark slides */
		filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.95))
			drop-shadow(0 0 2px rgba(255, 255, 255, 0.45));
		transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.33, 0, 0.25, 1);
	}
	.w-panel-carousel-btn:disabled {
		cursor: default;
		pointer-events: none;
	}
	.w-panel-carousel-btn:disabled .w-panel-carousel-btn__icon {
		opacity: 0.22;
		filter: none;
	}
	.w-panel-carousel-btn--prev {
		left: 6px;
	}
	.w-panel-carousel-btn--next {
		right: 6px;
	}
	@media (hover: hover) and (pointer: fine) {
		.w-panel-carousel-btn:hover:not(:disabled) .w-panel-carousel-btn__icon {
			opacity: 1;
			transform: scale(1.08);
		}
		.w-panel-carousel-btn:active:not(:disabled) .w-panel-carousel-btn__icon {
			transform: scale(1.02);
		}
	}
	.w-panel-images {
		position: absolute;
		inset: 0;
		display: flex;
		flex-flow: row nowrap;
		gap: 0;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
		overscroll-behavior-x: none;
		touch-action: none;
		pointer-events: none;
	}
	.w-panel-images::-webkit-scrollbar {
		display: none;
	}
	.w-panel-carousel-img {
		flex: 0 0 100%;
		width: 100%;
		min-width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		pointer-events: none;
		user-select: none;
		display: block;
		transform: scale(1);
		transition: transform 0.7s cubic-bezier(0.33, 0, 0.25, 1);
	}
	.w-panel-bg--video:has(> img.w-panel-media--image) .w-panel-label,
	.w-panel-bg--video:has(.w-panel-images) .w-panel-label {
		color: var(--black);
		text-shadow: none;
	}
	.w-panel-bg--force-dark-label .w-panel-label {
		color: var(--black);
		text-shadow: none;
	}
	@media (hover: hover) and (pointer: fine) {
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg img {
			transform: scale(1.06);
		}
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg--sobero img {
			transform: scale(1);
		}
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg--yazio01 img {
			transform: scale(1);
		}
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg--yazio02 img {
			transform: scale(1);
		}
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg--welltech img {
			transform: scale(1);
		}
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg--kwit img {
			transform: scale(1);
		}
		.work-strip:not(.grabbing) .w-panel:hover .w-panel-bg .w-panel-media {
			transform: scale(1.06);
		}
		.work-strip:not(.grabbing) .w-panel:hover .w-panel-bg .w-panel-carousel-img {
			transform: scale(1.06);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.h-panel-bg img,
		.w-panel-bg .w-panel-media,
		.w-panel-bg .w-panel-carousel-img {
			transition: none;
		}
		.home-strip:not(.grabbing) .h-panel:hover .h-panel-bg img,
		.work-strip:not(.grabbing) .w-panel:hover .w-panel-bg .w-panel-media,
		.work-strip:not(.grabbing) .w-panel:hover .w-panel-bg .w-panel-carousel-img {
			transform: none;
		}
	}

	#page-work {
		display: flex;
		flex-direction: column;
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 1.3;
	}
	.work-top {
		flex-shrink: 0;
		display: grid;
		grid-template-columns: 1fr auto;
		padding: var(--top-gap) var(--px) 18px calc(16% + var(--px));
		gap: 0 20px;
		align-items: start;
	}
	.work-top-spacer {
		display: none;
	}
	.work-desc {
		grid-column: 1;
		font-size: 14px;
		line-height: 29px;
		font-weight: 400;
		max-width: 480px;
	}
	.work-meta {
		grid-column: 2;
		font-size: 14px;
		line-height: 29px;
		font-weight: 400;
		text-align: right;
		white-space: nowrap;
	}
	.work-strip-wrap {
		flex: 1;
		min-height: 0;
		position: relative;
		overflow: hidden;
	}
	.w-panel {
		position: relative;
	}
	.w-panel-label {
		position: absolute;
		bottom: 12px;
		left: 14px;
		z-index: 2;
		font-size: 14px;
		pointer-events: none;
	}
	.w-panel-bg--video .w-panel-label {
		color: var(--black);
		text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
	}
	.w-panel-bg .w-panel-label.w-panel-label--dark {
		color: var(--black) !important;
		text-shadow: none !important;
	}

	#page-about {
		overflow-y: auto;
		padding: var(--top-gap) var(--px) var(--px);
	}
	.about-body {
		display: grid;
		grid-template-columns: 40vw 1fr 1fr;
		gap: 40px;
		align-items: start;
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 1.3;
	}
	.about-skills {
		margin-top: 4px;
	}
	.about-portrait {
		background: var(--cream);
		aspect-ratio: 3 / 4;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.about-ph {
		font-size: clamp(5rem, 14vw, 14rem);
		color: rgba(0, 0, 0, 0.06);
		letter-spacing: -0.05em;
		user-select: none;
	}
	.about-bio p {
		font-size: clamp(0.8125rem, 1.04vw, 0.9375rem);
		line-height: 1.85;
		margin-bottom: 1.2em;
	}
	.about-info-block {
		margin-bottom: 20px;
	}
	.about-info-title {
		font-size: clamp(0.9375rem, 1.28vw, 1.1875rem);
		font-weight: 400;
		margin-bottom: 3px;
	}
	.about-info-detail {
		font-size: 13px;
		color: var(--gray);
		line-height: 1.75;
	}
	.nav-right a.nav-say-hola {
		text-decoration: none;
		color: inherit;
	}

	/* Arnold-style mobile sheet: full viewport, opacity transition, text-24 primary / body secondary */
	.mob-menu {
		position: fixed;
		inset: 0;
		z-index: 1;
		background: var(--white);
		visibility: hidden;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 0.4s ease,
			visibility 0s linear 0.4s;
		-webkit-overflow-scrolling: touch;
		overflow-y: auto;
	}
	.mob-menu.open {
		visibility: visible;
		opacity: 1;
		pointer-events: auto;
		transition: opacity 0.4s ease;
	}
	.mob-menu-inner {
		min-height: 100dvh;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 0 max(var(--section-spacing), env(safe-area-inset-left, 0px))
			max(1.5rem, env(safe-area-inset-bottom, 0px))
			max(var(--section-spacing), env(safe-area-inset-right, 0px));
		padding-top: calc(var(--nav-h) + 3rem);
		box-sizing: border-box;
	}
	.mob-menu-spacer {
		flex: 1 1 auto;
		min-height: 2.5rem;
	}
	.mob-primary {
		display: block;
		flex-shrink: 0;
	}
	.mob-primary-row {
		padding-bottom: 0.5rem;
	}
	.mob-primary-link {
		display: inline-block;
		text-align: left;
		font-family: var(--font-nav) !important;
		font-size: 24px;
		line-height: 1.2;
		font-weight: 600 !important;
		letter-spacing: 0;
		font-synthesis: none;
		font-feature-settings:
			'liga' 1,
			'kern' 1;
		color: var(--black);
		touch-action: manipulation;
		min-height: 44px;
		padding: 2px 0;
		-webkit-tap-highlight-color: transparent;
	}
	.mob-primary-link.current {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.mob-secondary {
		flex-shrink: 0;
		padding-bottom: 4rem;
	}
	.mob-secondary-row {
		padding-bottom: 0.5rem;
	}
	.mob-secondary-link {
		display: inline-block;
		text-align: left;
		font-family: var(--font-nav) !important;
		font-size: 15px;
		line-height: 1.3;
		font-weight: 400 !important;
		letter-spacing: 0;
		font-synthesis: none;
		font-feature-settings:
			'liga' 1,
			'kern' 1;
		color: var(--black);
		text-decoration: none;
		cursor: pointer;
		touch-action: manipulation;
		min-height: 40px;
		padding: 2px 0;
		-webkit-tap-highlight-color: transparent;
	}
	.mob-secondary-link.current {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}
	.mob-foot {
		flex-shrink: 0;
		font-size: 11px;
		line-height: 1.35;
		color: var(--gray);
		text-transform: uppercase;
		letter-spacing: 0.02em;
		padding-bottom: 0.5rem;
	}

	@media (max-width: 800px) {
		.nav-work,
		.nav-right {
			display: none;
		}
		.nav-brand {
			flex: 1;
		}
		.nav-index {
			display: block;
			touch-action: manipulation;
			min-height: 44px;
			min-width: 44px;
			padding: 8px;
			margin: -8px -8px -8px 0;
		}
		/* Home: intro uses full width below nav (no 72% column) */
		.home-intro {
			padding-left: max(var(--px), env(safe-area-inset-left, 0px));
			padding-right: max(var(--px), env(safe-area-inset-right, 0px));
		}
		.home-intro p {
			max-width: none;
			width: 100%;
		}
		.h-panel,
		.w-panel {
			width: 80vw;
		}
		/* Case study: drop desktop left gutter (16% + px); full-width copy */
		.work-top {
			grid-template-columns: 1fr;
			padding: 24px max(var(--px), env(safe-area-inset-right, 0px)) 18px
				max(var(--px), env(safe-area-inset-left, 0px));
			gap: 14px 0;
		}
		.work-desc,
		.work-meta {
			grid-column: 1;
		}
		.work-desc {
			max-width: none;
		}
		.work-meta {
			text-align: left;
			white-space: normal;
		}
		.w-panel-bg--video video.w-panel-media--file {
			border-width: 6px;
		}
		.about-body {
			grid-template-columns: 1fr;
		}
	}
</style>
