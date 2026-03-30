<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import { PROJECTS, projectToSlug, type WorkPanel } from '$lib/data/projects';

	function workPanelCarouselSlideCount(panel: WorkPanel): number {
		let n = 0;
		if (panel.carouselLeadingLottie) n += 1;
		n += panel.images?.length ?? 0;
		n += panel.carouselLotties?.length ?? 0;
		if (panel.carouselTrailingLottie) n += 1;
		return n;
	}

	function singleCarouselSlide(
		panel: WorkPanel
	): { type: 'lottie'; path: string } | { type: 'image'; src: string } | null {
		if (workPanelCarouselSlideCount(panel) !== 1) return null;
		if (panel.carouselLeadingLottie) return { type: 'lottie', path: panel.carouselLeadingLottie };
		const imgs = panel.images;
		if (imgs?.length === 1) return { type: 'image', src: imgs[0] };
		const mids = panel.carouselLotties;
		if (mids?.length === 1) return { type: 'lottie', path: mids[0] };
		if (panel.carouselTrailingLottie) return { type: 'lottie', path: panel.carouselTrailingLottie };
		return null;
	}

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
	let alicaneTime = $state('--:--');
	const preloadedCarouselSrcs = new Set<string>();
	let sayWord = $state('Hola');
	let sayWordTimer: number | null = null;
	let sayWordSwapTimer: number | null = null;
	let sayWordVisible = $state(true);

	let caseStudyFabOpen = $state(false);
	let caseStudyAccordionIndex = $state<number | null>(null);

	const caseStudyAccordion = $derived(PROJECTS[currentProject].caseStudyAccordion);
	/** URL-based so the FAB always mounts on `/work/...` even if props ever desync. */
	const caseStudyWidgetVisible = $derived(
		page.url.pathname.startsWith('/work/') &&
			!!caseStudyAccordion &&
			caseStudyAccordion.sections.length > 0
	);

	function closeCaseStudyPanel() {
		caseStudyFabOpen = false;
	}

	function toggleCaseStudyPanel() {
		const nextOpen = !caseStudyFabOpen;
		caseStudyFabOpen = nextOpen;
		if (nextOpen) caseStudyAccordionIndex = 0;
	}

	function toggleCaseStudyAccordion(index: number) {
		caseStudyAccordionIndex = caseStudyAccordionIndex === index ? null : index;
	}

	function caseStudyAccordionHeaderKeydown(e: KeyboardEvent, index: number, len: number) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			const next = document.querySelector<HTMLButtonElement>(
				`.case-study-accordion-header[data-acc-idx="${Math.min(index + 1, len - 1)}"]`
			);
			next?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			const prev = document.querySelector<HTMLButtonElement>(
				`.case-study-accordion-header[data-acc-idx="${Math.max(index - 1, 0)}"]`
			);
			prev?.focus();
		}
	}

	$effect(() => {
		void currentProject;
		caseStudyFabOpen = false;
		caseStudyAccordionIndex = null;
	});

	$effect(() => {
		if (mobileOpen) caseStudyFabOpen = false;
	});

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

	function startSayWordCycle() {
		const words = ['Hello', 'Hej', 'Ola', 'Coucou', 'Hola'];
		let index = 0;
		stopSayWordCycle();
		sayWord = words[index];
		sayWordVisible = true;
		sayWordTimer = window.setInterval(() => {
			sayWordVisible = false;
			sayWordSwapTimer = window.setTimeout(() => {
				index = (index + 1) % words.length;
				sayWord = words[index];
				sayWordVisible = true;
			}, 180);
		}, 980);
	}

	function stopSayWordCycle() {
		if (sayWordTimer !== null) {
			window.clearInterval(sayWordTimer);
			sayWordTimer = null;
		}
		if (sayWordSwapTimer !== null) {
			window.clearTimeout(sayWordSwapTimer);
			sayWordSwapTimer = null;
		}
		sayWord = 'Hola';
		sayWordVisible = true;
	}

	function isCoarsePointerDevice(): boolean {
		return typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
	}

	/** Desktop: fill panel (slice). Mobile (≤800px): fit width, no side crop (meet). */
	function lottiePanelPreserveAspectRatio(): string {
		if (typeof window === 'undefined') return 'xMidYMid slice';
		return window.matchMedia('(max-width: 800px)').matches ? 'xMidYMid meet' : 'xMidYMid slice';
	}

	function updateAlicaneTime() {
		alicaneTime = new Intl.DateTimeFormat('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'Europe/Madrid'
		}).format(new Date());
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
				preserveAspectRatio: lottiePanelPreserveAspectRatio()
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
				preserveAspectRatio: lottiePanelPreserveAspectRatio()
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
				preserveAspectRatio: lottiePanelPreserveAspectRatio()
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
				preserveAspectRatio: lottiePanelPreserveAspectRatio()
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
				preserveAspectRatio: lottiePanelPreserveAspectRatio()
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

	/** Many thresholds so IO fires while scrolling (viewport root — reliable across browsers). */
	const LOTTIE_IO_THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

	/** Home cover cards use ~80vw; 0.98 visible area is rare on phones — Lotties never played. */
	const MOBILE_HOME_COVER_IO_RATIO = 0.68;
	const MOBILE_HOME_COVER_IO_THRESHOLDS = [0, 0.4, MOBILE_HOME_COVER_IO_RATIO, 1];

	function lottieIntersectsViewportEnough(e: IntersectionObserverEntry): boolean {
		return e.isIntersecting && e.intersectionRatio > 0.02;
	}

	/** One-shot carousel Lotties: need a majority of the slide visible in the carousel scrollport (or viewport for single-slide). */
	const CAROUSEL_LOTTIE_MIN_RATIO = 0.48;

	/** These replay from frame 0 every time their carousel slide becomes active (scroll), not only on first IO. */
	const CAROUSEL_LOTTIE_SCROLL_REPLAY_PATHS = new Set(['/assets/sobero-ds-components01.json']);

	function lottieCarouselSlideVisible(e: IntersectionObserverEntry): boolean {
		return e.isIntersecting && e.intersectionRatio >= CAROUSEL_LOTTIE_MIN_RATIO;
	}

	/** Fraction of the element’s area that overlaps the viewport (for Impact fallback). */
	function lottieHostAreaRatioInViewport(el: HTMLElement): number {
		const r = el.getBoundingClientRect();
		const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
		const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
		if (r.width <= 0 || r.height <= 0) return 0;
		const iw = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
		const ih = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
		return (iw * ih) / (r.width * r.height);
	}

	/** Looping work-panel Lottie: play while the host is on-screen; pause otherwise. */
	function workPanelLottie(node: HTMLDivElement, path: string) {
		let anim: import('lottie-web').AnimationItem | null = null;
		let cancelled = false;
		let io: IntersectionObserver | null = null;
		void import('lottie-web').then(({ default: lottie }) => {
			if (cancelled) return;
			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			anim = lottie.loadAnimation({
				container: node,
				renderer: 'svg',
				loop: true,
				autoplay: false,
				path,
				rendererSettings: {
					preserveAspectRatio: lottiePanelPreserveAspectRatio()
				}
			});
			anim.addEventListener('DOMLoaded', () => {
				if (cancelled || !anim) return;
				if (reduce) {
					anim.goToAndStop(0, true);
					return;
				}
				anim.goToAndStop(0, true);
				io = new IntersectionObserver(
					(entries) => {
						const e = entries[0];
						if (!e || !anim || cancelled) return;
						const on = lottieIntersectsViewportEnough(e);
						if (on) anim.play();
						else anim.pause();
					},
					{ root: null, threshold: LOTTIE_IO_THRESHOLDS }
				);
				io.observe(node);
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						if (cancelled || !anim) return;
						if (lottieHostAreaRatioInViewport(node) >= 0.12) anim.play();
					});
				});
			});
		});
		return {
			destroy() {
				cancelled = true;
				io?.disconnect();
				io = null;
				anim?.destroy();
				anim = null;
			}
		};
	}

	/** Carousel Lottie: play once a slide is mostly in view; hold last frame; replay after leaving and returning. */
	function workPanelCarouselLottieInView(node: HTMLDivElement, path: string) {
		let anim: import('lottie-web').AnimationItem | null = null;
		let cancelled = false;
		let io: IntersectionObserver | null = null;
		let wasInView = false;
		let detachCarouselScroll: (() => void) | undefined;

		const holdEnd = () => {
			if (!anim) return;
			const tf = anim.totalFrames;
			if (tf <= 0) return;
			anim.goToAndStop(tf - 1, true);
		};

		const playFromStart = () => {
			if (!anim || cancelled) return;
			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (reduce) {
				holdEnd();
				return;
			}
			anim.stop();
			anim.goToAndPlay(0, true);
		};

		void import('lottie-web').then(({ default: lottie }) => {
			if (cancelled) return;
			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			anim = lottie.loadAnimation({
				container: node,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path,
				rendererSettings: {
					preserveAspectRatio: lottiePanelPreserveAspectRatio()
				}
			});
			anim.addEventListener('complete', holdEnd);

			anim.addEventListener('DOMLoaded', () => {
				if (cancelled || !anim) return;
				if (reduce) {
					holdEnd();
					return;
				}
				anim.goToAndStop(0, true);

				const track = node.closest('.w-panel-images') as HTMLElement | null;
				const slideEl =
					(node.closest('.w-panel-carousel-slide--lottie') as HTMLElement | null) ??
					(node.parentElement as HTMLElement | null);
				const slideIndex =
					track && slideEl ? (Array.prototype.indexOf.call(track.children, slideEl) as number) : -1;
				const useScrollReplay =
					CAROUSEL_LOTTIE_SCROLL_REPLAY_PATHS.has(path) && track !== null && slideIndex >= 0;

				let lastCarouselIdx = -999;
				let carouselViewportVisible = false;

				const syncScrollReplay = () => {
					if (!anim || cancelled || !track || slideIndex < 0) return;
					const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
					const cur = carouselSlideIndex(track);
					if (reduce) {
						lastCarouselIdx = cur;
						return;
					}
					if (!carouselViewportVisible) {
						anim.pause();
						anim.goToAndStop(0, true);
						return;
					}
					if (cur === slideIndex) {
						if (lastCarouselIdx !== slideIndex) playFromStart();
					} else {
						anim.pause();
						anim.goToAndStop(0, true);
					}
					lastCarouselIdx = cur;
				};

				if (useScrollReplay) {
					const panelEl = node.closest('.w-panel') as HTMLElement | null;
					const observeViewportEl = panelEl ?? (node.closest('.w-panel-carousel') as HTMLElement | null) ?? track;

					io = new IntersectionObserver(
						(entries) => {
							const e = entries[0];
							if (!e || cancelled) return;
							const on = lottieIntersectsViewportEnough(e);
							if (!on) {
								if (carouselViewportVisible) {
									carouselViewportVisible = false;
									lastCarouselIdx = -999;
									anim?.pause();
									anim?.goToAndStop(0, true);
								}
								return;
							}
							const wasVisible = carouselViewportVisible;
							carouselViewportVisible = true;
							if (!wasVisible) lastCarouselIdx = -999;
							syncScrollReplay();
						},
						{ root: null, threshold: LOTTIE_IO_THRESHOLDS }
					);
					io.observe(observeViewportEl);

					track.addEventListener('scroll', syncScrollReplay, { passive: true });
					track.addEventListener('scrollend', syncScrollReplay as EventListener);
					detachCarouselScroll = () => {
						track.removeEventListener('scroll', syncScrollReplay);
						track.removeEventListener('scrollend', syncScrollReplay as EventListener);
					};
				} else {
					const syncFromIo = (e: IntersectionObserverEntry) => {
						if (!anim || cancelled) return;
						const on = lottieCarouselSlideVisible(e);
						if (!on) {
							if (wasInView) {
								anim.pause();
								anim.goToAndStop(0, true);
							}
							wasInView = false;
							return;
						}
						if (!wasInView) playFromStart();
						wasInView = true;
					};

					io = new IntersectionObserver(
						(entries) => {
							const e = entries[0];
							if (!e || !anim || cancelled) return;
							syncFromIo(e);
						},
						{ root: track, threshold: LOTTIE_IO_THRESHOLDS }
					);
					io.observe(node);
				}
			});
		});

		return {
			destroy() {
				cancelled = true;
				detachCarouselScroll?.();
				detachCarouselScroll = undefined;
				io?.disconnect();
				io = null;
				anim?.destroy();
				anim = null;
			}
		};
	}

	function carouselStepPx(track: HTMLElement): number {
		// Slides are full-width (`flex: 0 0 100%` / `width: 100%`), so using the track width
		// avoids off-by-a-few-pixels rounding that can cause the snap to pick the same slide.
		return track.clientWidth || 0;
	}

	function carouselSlideCount(track: HTMLElement): number {
		return track.children.length;
	}

	/**
	 * Active carousel slide by which child is closest to the track’s horizontal center.
	 * `floor(scrollLeft / clientWidth)` mis-detects after snap / subpixel scroll and breaks replay + arrows.
	 */
	function carouselSlideIndex(track: HTMLElement): number {
		const n = track.children.length;
		if (n <= 0) return 0;
		const tr = track.getBoundingClientRect();
		if (tr.width <= 0) return 0;
		const midX = tr.left + tr.width * 0.5;
		let best = 0;
		let bestDist = Infinity;
		for (let i = 0; i < n; i++) {
			const cr = (track.children[i] as HTMLElement).getBoundingClientRect();
			const cx = (cr.left + cr.right) * 0.5;
			const d = Math.abs(cx - midX);
			if (d < bestDist) {
				bestDist = d;
				best = i;
			}
		}
		return best;
	}

	function preloadProjectCarouselImages(project: string) {
		const projectDef = PROJECTS[project];
		if (!projectDef) return;
		for (const panel of projectDef.panels) {
			if (!panel.images || panel.images.length === 0) continue;
			for (const src of panel.images) {
				if (preloadedCarouselSrcs.has(src)) continue;
				preloadedCarouselSrcs.add(src);
				const img = new Image();
				img.decoding = 'async';
				img.src = src;
			}
		}
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
			node.style.transform = 'scale(1)';
			attemptPlayFromStart();
		};

		node.muted = true;
		node.playsInline = true;
		node.style.transition = 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)';
		node.style.visibility = 'hidden';
		node.style.opacity = '0';
		node.style.transform = 'scale(0.985)';
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
		const n = carouselSlideCount(track);
		const i = carouselSlideIndex(track);
		prev.disabled = i <= 0;
		next.disabled = i >= n - 1;
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
		const w = carouselStepPx(track);
		const count = carouselSlideCount(track);
		if (w <= 0 || count <= 0) return;
		const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
		const i = carouselSlideIndex(track);
		const nextI = Math.min(count - 1, Math.max(0, i + dir));
		const targetLeft =
			nextI >= count - 1 ? maxScroll : Math.min(maxScroll, Math.max(0, nextI * w));
		track.scrollTo({ left: targetLeft, behavior: smooth ? 'smooth' : 'auto' });
		const sync = () => syncCarouselArrows(track);
		sync();
		track.addEventListener('scrollend', sync, { once: true });
		window.setTimeout(sync, 450);
	}

	$effect(() => {
		void activePage;
		void currentProject;
		if (activePage !== 'work') return;
		preloadProjectCarouselImages(currentProject);
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
		el.addEventListener('mousedown', onDown);
		document.addEventListener('mousemove', onMove);
		document.addEventListener('mouseup', onUp);
		el.addEventListener('click', onClick, true);
		el.addEventListener('wheel', onWheel, { passive: false });

		return () => {
			el.removeEventListener('mousedown', onDown);
			document.removeEventListener('mousemove', onMove);
			document.removeEventListener('mouseup', onUp);
			el.removeEventListener('click', onClick, true);
			el.removeEventListener('wheel', onWheel);
		};
	}

	onMount(() => {
		const home = document.getElementById('strip-home');
		const work = document.getElementById('strip-work');
		let alicaneClockTimer: number | undefined;
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
					if (entry.intersectionRatio >= MOBILE_HOME_COVER_IO_RATIO) {
						if (kwitMobileInView) return;
						kwitMobileInView = true;
						void playKwitAnimationOnce();
						return;
					}
					kwitMobileInView = false;
					stopKwitAnimation();
				},
				{ threshold: MOBILE_HOME_COVER_IO_THRESHOLDS }
			);
			kwitObserver.observe(kwitPanelEl);
		}
		if (soberoPanelEl) {
			soberoObserver = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= MOBILE_HOME_COVER_IO_RATIO) {
						if (soberoMobileInView) return;
						soberoMobileInView = true;
						void playSoberoAnimationOnce();
						return;
					}
					soberoMobileInView = false;
					stopSoberoAnimation();
				},
				{ threshold: MOBILE_HOME_COVER_IO_THRESHOLDS }
			);
			soberoObserver.observe(soberoPanelEl);
		}
		if (yazio01PanelEl) {
			yazio01Observer = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= MOBILE_HOME_COVER_IO_RATIO) {
						if (yazio01MobileInView) return;
						yazio01MobileInView = true;
						void playYazio01AnimationOnce();
						return;
					}
					yazio01MobileInView = false;
					stopYazio01Animation();
				},
				{ threshold: MOBILE_HOME_COVER_IO_THRESHOLDS }
			);
			yazio01Observer.observe(yazio01PanelEl);
		}
		if (yazio02PanelEl) {
			yazio02Observer = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= MOBILE_HOME_COVER_IO_RATIO) {
						if (yazio02MobileInView) return;
						yazio02MobileInView = true;
						void playYazio02AnimationOnce();
						return;
					}
					yazio02MobileInView = false;
					stopYazio02Animation();
				},
				{ threshold: MOBILE_HOME_COVER_IO_THRESHOLDS }
			);
			yazio02Observer.observe(yazio02PanelEl);
		}
		if (welltechPanelEl) {
			welltechObserver = new IntersectionObserver(
				(entries) => {
					if (!isCoarsePointerDevice()) return;
					const entry = entries[0];
					if (!entry) return;
					if (entry.intersectionRatio >= MOBILE_HOME_COVER_IO_RATIO) {
						if (welltechMobileInView) return;
						welltechMobileInView = true;
						void playWelltechAnimationOnce();
						return;
					}
					welltechMobileInView = false;
					stopWelltechAnimation();
				},
				{ threshold: MOBILE_HOME_COVER_IO_THRESHOLDS }
			);
			welltechObserver.observe(welltechPanelEl);
		}
		// Preload animated home-cover assets so first hover starts immediately.
		void ensureKwitAnimation();
		void ensureSoberoAnimation();
		void ensureYazio01Animation();
		void ensureYazio02Animation();
		void ensureWelltechAnimation();
		preloadProjectCarouselImages(currentProject);
		updateAlicaneTime();
		alicaneClockTimer = window.setInterval(updateAlicaneTime, 1000 * 30);

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
			stopSayWordCycle();
			if (alicaneClockTimer) window.clearInterval(alicaneClockTimer);
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
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
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
		if (e.key === 'Escape' && caseStudyFabOpen) {
			e.preventDefault();
			closeCaseStudyPanel();
			return;
		}
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

		<div class="nav-work">
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
			<a
				class="nav-say-hola"
				href="mailto:lperezmolines@gmail.com"
				onmouseenter={startSayWordCycle}
				onmouseleave={stopSayWordCycle}
				onfocus={startSayWordCycle}
				onblur={stopSayWordCycle}
				>Say <span class="nav-say-word" class:is-hidden={!sayWordVisible}>{sayWord}</span></a
			>
			<span class="nav-static nav-location-time">Alicante, Spain {alicaneTime}</span>
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
			<div class="mob-foot">Alicante, Spain<br />Available for projects</div>
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
				style="--chip-index: 0;"
				onclick={() => openProjectRoute('UX Maturity')}
				onkeydown={(e) => chipOpenProject(e, 'UX Maturity')}
			>
				{@render chipLetters('UX-matured environments')}
			</span>,
			<span
				role="button"
				tabindex="0"
				class="chip"
				style="--chip-index: 1;"
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
				style="--chip-index: 2;"
				onclick={() => openProjectRoute('0-to-1 Product')}
				onkeydown={(e) => chipOpenProject(e, '0-to-1 Product')}
			>
				{@render chipLetters('0-to-1 products')}
			</span>, accelerated
			<span
				role="button"
				tabindex="0"
				class="chip"
				style="--chip-index: 3;"
				onclick={() => openProjectRoute('Time-to-Value')}
				onkeydown={(e) => chipOpenProject(e, 'Time-to-Value')}
			>
				{@render chipLetters('time-to-value')}
			</span>, and crafted meaningful
			<span
				role="button"
				tabindex="0"
				class="chip"
				style="--chip-index: 4;"
				onclick={() => openProjectRoute('Habit Loops')}
				onkeydown={(e) => chipOpenProject(e, 'Habit Loops')}
			>
				{@render chipLetters('habit loops')}
			</span>. Recently, I've been focusing on improving
			<span
				role="button"
				tabindex="0"
				class="chip"
				style="--chip-index: 5;"
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
					<div
						class="w-panel"
						class:w-panel--double={panel.size === 'double'}
						style={`--panel-index: ${i};`}
					>
						<div
							class="w-panel-bg"
							class:w-panel-bg--video={panel.video ||
								panel.image ||
								panel.lottie ||
								panel.carouselLeadingLottie ||
								panel.carouselTrailingLottie ||
								(panel.carouselLotties && panel.carouselLotties.length > 0) ||
								(panel.images && panel.images.length > 0)}
							class:w-panel-bg--force-dark-label={panel.label === 'Modular product architecture'}
							class:w-panel-bg--placeholder={!panel.video &&
								!panel.image &&
								!panel.lottie &&
								!panel.carouselLeadingLottie &&
								!panel.carouselTrailingLottie &&
								!(panel.carouselLotties && panel.carouselLotties.length > 0) &&
								!(panel.images && panel.images.length > 0)}
						>
							{#if workPanelCarouselSlideCount(panel) > 1}
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
										{#if panel.carouselLeadingLottie}
											{#key `${currentProject}-${panel.label}-${panel.carouselLeadingLottie}`}
												<div class="w-panel-carousel-slide w-panel-carousel-slide--lottie">
													<div
														class="w-panel-carousel-lottie-host"
														use:workPanelCarouselLottieInView={panel.carouselLeadingLottie}
														aria-hidden="true"
													></div>
												</div>
											{/key}
										{/if}
										{#each panel.images ?? [] as src, i}
											<img
												class="w-panel-carousel-img"
												{src}
												alt="{panel.label} {i + 1}"
												loading="eager"
												draggable="false"
												onload={(e) => {
													const t = (e.currentTarget as HTMLElement).closest('.w-panel-images');
													if (t) syncCarouselArrows(t as HTMLElement);
												}}
											/>
										{/each}
										{#each panel.carouselLotties ?? [] as path, li}
											{#key `${currentProject}-${panel.label}-${path}-${li}`}
												<div class="w-panel-carousel-slide w-panel-carousel-slide--lottie">
													<div
														class="w-panel-carousel-lottie-host"
														use:workPanelCarouselLottieInView={path}
														aria-hidden="true"
													></div>
												</div>
											{/key}
										{/each}
										{#if panel.carouselTrailingLottie}
											{#key `${currentProject}-${panel.label}-${panel.carouselTrailingLottie}`}
												<div class="w-panel-carousel-slide w-panel-carousel-slide--lottie">
													<div
														class="w-panel-carousel-lottie-host"
														use:workPanelCarouselLottieInView={panel.carouselTrailingLottie}
														aria-hidden="true"
													></div>
												</div>
											{/key}
										{/if}
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
							{:else if workPanelCarouselSlideCount(panel) === 1}
								{@const single = singleCarouselSlide(panel)}
								{#if single?.type === 'lottie'}
									{#key `${currentProject}-${panel.label}-${single.path}`}
										<div class="w-panel-single-lottie">
											<div
												class="w-panel-carousel-lottie-host"
												use:workPanelCarouselLottieInView={single.path}
												aria-hidden="true"
											></div>
										</div>
									{/key}
								{:else if single?.type === 'image'}
									<img
										class="w-panel-media w-panel-media--image"
										src={single.src}
										alt={panel.label}
										loading="eager"
										draggable="false"
									/>
								{/if}
							{:else if panel.lottie}
								{#key `${currentProject}-${panel.label}-${panel.lottie}`}
									<div
										class="w-panel-media w-panel-lottie"
										use:workPanelLottie={panel.lottie}
										aria-hidden="true"
									></div>
								{/key}
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

{#if caseStudyWidgetVisible && caseStudyAccordion}
	<button
		type="button"
		class="case-study-overlay"
		class:open={caseStudyFabOpen}
		onclick={closeCaseStudyPanel}
		aria-label="Close case study details"
		tabindex={caseStudyFabOpen ? 0 : -1}
	></button>
	<div
		class="case-study-panel"
		class:open={caseStudyFabOpen}
		role="dialog"
		aria-label="Project details"
		aria-hidden={!caseStudyFabOpen}
	>
		{#each caseStudyAccordion.sections as section, i (i)}
			<div class="case-study-acc-item" class:open={caseStudyAccordionIndex === i}>
				<button
					type="button"
					class="case-study-accordion-header"
					id={`case-study-acc-h-${i}`}
					data-acc-idx={i}
					aria-expanded={caseStudyAccordionIndex === i}
					aria-controls={`case-study-acc-p-${i}`}
					onclick={() => toggleCaseStudyAccordion(i)}
					onkeydown={(e) =>
						caseStudyAccordionHeaderKeydown(
							e,
							i,
							caseStudyAccordion!.sections.length
						)}
				>
					<span class="case-study-accordion-heading">{section.heading}</span>
					<svg
						class="case-study-acc-disclosure"
						viewBox="0 0 20 20"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M7.5 5.5 12.5 10 7.5 14.5"
							stroke="currentColor"
							stroke-width="1.65"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
				<div
					class="case-study-acc-body"
					id={`case-study-acc-p-${i}`}
					role="region"
					aria-labelledby={`case-study-acc-h-${i}`}
				>
					<div class="case-study-acc-body-inner">
						{#each section.body.split(/\n\n+/) as para}
							<p>{para}</p>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<button
		type="button"
		class="case-study-fab"
		class:open={caseStudyFabOpen}
		onclick={toggleCaseStudyPanel}
		aria-label={caseStudyFabOpen ? 'Close case study details' : 'Open case study details'}
		aria-expanded={caseStudyFabOpen}
	>
		<div class="case-study-fab-icon" aria-hidden="true">
			<span></span>
			<span></span>
		</div>
	</button>
{/if}

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
			<p>Based in Alicante. Currently open to new projects.</p>
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
	.nav-row :is(button, a, .nav-static) {
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
		flex: 1 1 auto;
		min-width: 0;
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
	/* Desktop + mouse: hide case-study links until Work row hover or focus inside (incl. when a case study is open). */
	@media (min-width: 801px) and (hover: hover) and (pointer: fine) {
		.nav-sub-links {
			opacity: 0;
			pointer-events: none;
		}
		.nav-work:hover .nav-sub-links,
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
		gap: 18px;
		flex: 0 0 auto;
		margin-left: auto;
		margin-right: 0;
		align-items: center;
	}
	.nav-row .nav-location-time {
		white-space: nowrap;
		cursor: default;
		margin-left: 28px;
		font-weight: normal !important;
	}
	.nav-say-word {
		display: inline-block;
		min-width: 6.5ch;
		margin-left: 0.18em;
		text-align: left;
		transition:
			opacity 0.2s ease,
			transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
		opacity: 1;
		transform: translateY(0);
	}
	.nav-say-word.is-hidden {
		opacity: 0;
		transform: translateY(2px);
	}
	.nav-say-hola:hover,
	.nav-say-hola:focus-visible {
		cursor:
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M6 18L18 6M10 6h8v8' fill='none' stroke='%230f0e0c' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
				12 12,
			alias;
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
	#page-home.active .chip {
		animation: chip-pop-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
		animation-delay: calc(var(--chip-index, 0) * 70ms + 260ms);
	}
	@keyframes chip-pop-in {
		0% {
			transform: scale(0.9);
		}
		58% {
			transform: scale(1.07);
		}
		100% {
			transform: scale(1);
		}
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
		-webkit-overflow-scrolling: touch;
		touch-action: pan-x;
	}
	.work-strip {
		display: flex;
		height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		padding-left: var(--px);
		padding-right: var(--px);
		padding-bottom: var(--px);
		cursor: grab;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-x;
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
	.w-panel--double {
		width: calc((43vw * 1.6) + var(--px));
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
	.h-panel-bg {
		width: 100%;
		height: 100%;
		background: var(--cream);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		border-radius: 14px;
	}
	.w-panel-bg {
		width: 100%;
		height: 100%;
		background: var(--cream);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		border-radius: 14px;
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
		background-color: #f6f6f6;
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
	.w-panel-bg--video .w-panel-lottie {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}
	.w-panel-bg--video .w-panel-lottie :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
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
		scroll-snap-type: x proximity;
		scrollbar-width: none;
		overscroll-behavior-x: auto;
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
	.w-panel-carousel-slide--lottie {
		flex: 0 0 100%;
		width: 100%;
		min-width: 100%;
		height: 100%;
		scroll-snap-align: start;
		scroll-snap-stop: always;
		position: relative;
		pointer-events: none;
	}
	.w-panel-carousel-lottie-host {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.w-panel-carousel-lottie-host :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
	.w-panel-single-lottie {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}
	.w-panel-bg--video:has(> img.w-panel-media--image) .w-panel-label,
	.w-panel-bg--video:has(> .w-panel-lottie) .w-panel-label,
	.w-panel-bg--video:has(.w-panel-images) .w-panel-label,
	.w-panel-bg--video:has(.w-panel-single-lottie) .w-panel-label {
		color: #595959;
		text-shadow: none;
	}
	.w-panel-bg--force-dark-label .w-panel-label {
		color: #595959;
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
		.work-strip:not(.grabbing) .w-panel:hover .w-panel-bg .w-panel-lottie {
			transform: scale(1);
		}
		.work-strip:not(.grabbing) .w-panel:hover .w-panel-bg .w-panel-carousel-img {
			transform: scale(1);
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
		padding: var(--top-gap) var(--px) 14px calc(16% + var(--px));
		gap: 0 16px;
		align-items: stretch;
	}
	.work-top-spacer {
		display: none;
	}
	.work-desc {
		grid-column: 1;
		align-self: start;
		font-size: 14px;
		line-height: 23px;
		font-weight: 400;
		max-width: 480px;
	}
	.work-meta {
		grid-column: 2;
		align-self: end;
		font-family: var(--font-body);
		font-size: 14px;
		line-height: 23px;
		font-weight: 400;
		text-align: right;
		white-space: nowrap;
		max-width: min(100%, 360px);
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
		font-family: var(--font-nav);
		font-size: 12px;
		font-weight: 500;
		line-height: 1.3;
		letter-spacing: 0;
		font-synthesis: none;
		font-feature-settings:
			'liga' 1,
			'kern' 1;
		color: #595959;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(246, 246, 246, 0.4);
		backdrop-filter: blur(1px);
		pointer-events: none;
	}
	.w-panel-bg--video .w-panel-label {
		color: #595959;
		text-shadow: none;
	}
	.w-panel-bg .w-panel-label.w-panel-label--dark {
		color: #595959 !important;
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
		.h-panel-bg img {
			object-fit: contain;
			object-position: center;
			max-width: 100%;
			box-sizing: border-box;
		}
		.h-panel,
		.w-panel {
			width: 80vw;
		}
		.w-panel--double {
			width: calc((80vw * 1.78) + var(--px));
		}
		/* Case study: drop desktop left gutter (16% + px); full-width copy */
		.work-top {
			grid-template-columns: 1fr;
			padding: 24px max(var(--px), env(safe-area-inset-right, 0px)) 14px
				max(var(--px), env(safe-area-inset-left, 0px));
			gap: 10px 0;
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
			max-width: none;
		}
		.w-panel-bg--video video.w-panel-media--file {
			border-width: 6px;
		}
		/* Mobile: fit full panel width — no horizontal crop (videos / iframes unchanged) */
		.w-panel-bg--video img.w-panel-media--image,
		.w-panel-carousel-img {
			width: 100%;
			max-width: 100%;
			height: 100%;
			object-fit: contain;
			object-position: center;
			background: #f6f6f6;
			box-sizing: border-box;
		}
		.w-panel-carousel-lottie-host :global(svg),
		.w-panel-single-lottie :global(svg),
		.w-panel-bg--video .w-panel-lottie :global(svg) {
			width: 100%;
			height: 100%;
			max-width: 100%;
			display: block;
		}
		/* Mobile: allow swiping through all carousel images (overscroll + snap avoid “stuck” slides) */
		.w-panel-carousel {
			pointer-events: auto;
			touch-action: pan-x;
			overscroll-behavior-x: contain;
		}
		.w-panel-images {
			pointer-events: auto;
			touch-action: pan-x;
			overflow-x: scroll;
			overscroll-behavior-x: contain;
			-webkit-overflow-scrolling: touch;
		}
		.w-panel-carousel-img {
			scroll-snap-stop: normal;
		}
		.w-panel-carousel-slide--lottie {
			scroll-snap-stop: normal;
		}
		.about-body {
			grid-template-columns: 1fr;
		}
	}

	/* Case study FAB + accordion (work page) */
	.case-study-overlay {
		position: fixed;
		inset: 0;
		z-index: 6000;
		display: none;
		padding: 0;
		margin: 0;
		border: none;
		background: rgba(15, 14, 12, 0.12);
		cursor: default;
		appearance: none;
	}
	.case-study-overlay.open {
		display: block;
	}
	.case-study-panel {
		position: fixed;
		bottom: 92px;
		right: 28px;
		width: 320px;
		max-height: min(70vh, 520px);
		overflow-y: auto;
		background: #fff;
		border-radius: 16px;
		box-shadow:
			0 8px 40px rgba(0, 0, 0, 0.14),
			0 2px 8px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 12px 10px 12px;
		z-index: 6001;
		font-family: var(--font-nav);
		opacity: 0;
		transform: scale(0.88) translateY(12px);
		transform-origin: bottom right;
		pointer-events: none;
		transition:
			opacity 0.24s cubic-bezier(0.4, 0, 0.2, 1),
			transform 0.24s cubic-bezier(0.4, 0, 0.2, 1);
		-webkit-overflow-scrolling: touch;
	}
	.case-study-panel.open {
		opacity: 1;
		transform: scale(1) translateY(0);
		pointer-events: auto;
	}
	.case-study-acc-item {
		background: #eceae7;
		border-radius: 10px;
		overflow: hidden;
		transition:
			background 0.18s ease,
			box-shadow 0.22s ease;
		flex-shrink: 0;
	}
	.case-study-acc-item.open {
		background: #fff;
		box-shadow:
			0 2px 10px rgba(0, 0, 0, 0.07),
			0 1px 3px rgba(0, 0, 0, 0.04);
	}
	.case-study-acc-item:not(.open):hover {
		background: #e2e0dd;
	}
	.case-study-acc-item:not(.open):active {
		background: #dddbd8;
	}
	.case-study-accordion-header {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 15px 16px;
		cursor: pointer;
		user-select: none;
		background: transparent;
		border: none;
		width: 100%;
		text-align: left;
		font-family: inherit;
		font-size: 14px;
		font-weight: 600;
		color: #111;
		letter-spacing: -0.01em;
		outline: none;
	}
	.case-study-accordion-header:focus-visible {
		outline: 2px solid #111;
		outline-offset: -3px;
		border-radius: 10px;
	}
	.case-study-accordion-heading {
		flex: 1;
		min-width: 0;
		text-align: left;
	}
	.case-study-acc-disclosure {
		width: 20px;
		height: 20px;
		flex-shrink: 0;
		color: #6a6a6a;
		transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.case-study-acc-item.open .case-study-acc-disclosure {
		transform: rotate(90deg);
		color: #333;
	}
	.case-study-acc-body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.case-study-acc-item.open .case-study-acc-body {
		grid-template-rows: 1fr;
	}
	.case-study-acc-body-inner {
		overflow: hidden;
		min-width: 0;
	}
	.case-study-acc-body-inner p {
		font-family: var(--font-nav);
		font-size: 13.5px;
		line-height: 1.7;
		color: #2a2a2a;
		padding: 2px 16px 18px;
		margin: 0;
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.22s ease 0.06s,
			transform 0.22s ease 0.06s;
	}
	.case-study-acc-item.open .case-study-acc-body-inner p {
		opacity: 1;
		transform: translateY(0);
	}
	.case-study-fab {
		position: fixed;
		bottom: 28px;
		right: 28px;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: #111;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.22),
			0 1px 4px rgba(0, 0, 0, 0.12);
		transition:
			background 0.18s,
			box-shadow 0.18s,
			transform 0.18s;
		z-index: 6002;
		outline: none;
	}
	.case-study-fab:hover {
		background: #2a2a2a;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28);
	}
	.case-study-fab:active {
		transform: scale(0.94);
	}
	.case-study-fab:focus-visible {
		outline: 2px solid #111;
		outline-offset: 3px;
	}
	.case-study-fab-icon {
		position: relative;
		width: 18px;
		height: 18px;
	}
	.case-study-fab-icon span {
		position: absolute;
		left: 0;
		top: 50%;
		width: 18px;
		height: 2px;
		background: #fff;
		border-radius: 2px;
		transform-origin: center;
		transition:
			transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.2s ease;
	}
	.case-study-fab-icon span:nth-child(1) {
		transform: translateY(-50%) rotate(90deg);
	}
	.case-study-fab-icon span:nth-child(2) {
		transform: translateY(-50%) rotate(0deg);
	}
	.case-study-fab.open .case-study-fab-icon span:nth-child(1) {
		transform: translateY(-50%) rotate(45deg);
	}
	.case-study-fab.open .case-study-fab-icon span:nth-child(2) {
		transform: translateY(-50%) rotate(-45deg);
	}
	@media (max-width: 480px) {
		.case-study-panel {
			right: 0;
			left: 0;
			bottom: 0;
			width: 100%;
			max-height: 85vh;
			border-radius: 20px 20px 0 0;
			transform-origin: bottom center;
			transform: translateY(100%);
			/* Clear home indicator + floating button so last accordion text stays readable */
			padding: 14px max(12px, env(safe-area-inset-right, 0px)) max(24px, calc(88px + env(safe-area-inset-bottom, 0px)))
				max(12px, env(safe-area-inset-left, 0px));
		}
		.case-study-panel.open {
			transform: translateY(0);
		}
		.case-study-fab {
			bottom: calc(20px + env(safe-area-inset-bottom, 0px));
			right: max(20px, env(safe-area-inset-right, 0px));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.case-study-panel,
		.case-study-acc-body,
		.case-study-acc-disclosure,
		.case-study-acc-body-inner p,
		.case-study-fab-icon span {
			transition: none;
		}
	}
</style>
