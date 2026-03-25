<script lang="ts">
	import { onMount } from 'svelte';

	const PROJECTS: Record<string, { desc: string; meta: string; panels: string[] }> = {
		'UX Maturity': {
			desc: 'Designed working environments and design system frameworks that raised UX maturity across product teams - establishing shared principles, critique rituals, and scalable component libraries.',
			meta: 'UX Strategy.<br>Design Systems.<br>Spain',
			panels: ['Discovery', 'Frameworks', 'Components', 'Rituals']
		},
		'Premium Retention': {
			desc: 'Crafted premium retention journeys for smoke-free products - combining behavioral triggers, personalization, and habit-forming UX patterns to keep users engaged long-term.',
			meta: 'Retention Design.<br>Behavioral UX.<br>Spain',
			panels: ['Onboarding', 'Triggers', 'Personalization', 'Loops']
		},
		'0-to-1 Product': {
			desc: 'Co-developed a 0-to-1 product to help people drink mindfully - from early concept and research through to shipped experience, covering strategy, UX, and product design.',
			meta: 'Product Design.<br>0-to-1.<br>Spain',
			panels: ['Research', 'Concept', 'UX Design', 'Launch']
		},
		'Time-to-Value': {
			desc: 'Accelerated time-to-value in onboarding funnels by reducing friction, clarifying value propositions, and designing progressive disclosure flows that get users to their first meaningful moment faster.',
			meta: 'Onboarding Design.<br>Conversion.<br>Spain',
			panels: ['Audit', 'Flow Design', 'Testing', 'Optimization']
		},
		'Habit Loops': {
			desc: 'Crafted meaningful habit loops for better nutrition - applying behavior design principles to create engaging, sustainable product experiences that make healthy choices easier.',
			meta: 'Behavior Design.<br>Habit UX.<br>Spain',
			panels: ['Research', 'Loop Design', 'Triggers', 'Rewards']
		},
		'Growth Systems': {
			desc: 'Focused on improving growth systems - designing activation, retention, and referral loops that compound over time and create sustainable product-led growth.',
			meta: 'Growth Design.<br>Systems Thinking.<br>Spain',
			panels: ['Activation', 'Retention', 'Referral', 'Analytics']
		}
	};

	let activePage = $state('home');
	let currentProject = $state('UX Maturity');
	let mobileOpen = $state(false);

	function show(id: string, project: string | null = null) {
		activePage = id;
		if (id === 'work' && project) currentProject = project;
	}

	function closeMob() {
		mobileOpen = false;
	}

	function mobNavAbout() {
		show('about');
		closeMob();
	}

	function dragScroll(el: HTMLElement) {
		let down = false;
		let moved = false;
		let sx = 0;
		let sl = 0;
		let tx = 0;
		let ts = 0;

		const onDown = (e: MouseEvent) => {
			down = true;
			moved = false;
			sx = e.pageX;
			sl = el.scrollLeft;
			el.classList.add('grabbing');
			e.preventDefault();
		};
		const onMove = (e: MouseEvent) => {
			if (!down) return;
			const dx = e.pageX - sx;
			if (Math.abs(dx) > 3) moved = true;
			el.scrollLeft = sl - dx * 1.4;
		};
		const onUp = () => {
			down = false;
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
			el.scrollLeft += (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 1.5;
		};
		const onTouchStart = (e: TouchEvent) => {
			tx = e.touches[0].pageX;
			ts = el.scrollLeft;
		};
		const onTouchMove = (e: TouchEvent) => {
			el.scrollLeft = ts - (e.touches[0].pageX - tx) * 1.2;
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
		if (!home || !work) return;
		const destroyHome = dragScroll(home);
		const destroyWork = dragScroll(work);
		return () => {
			destroyHome();
			destroyWork();
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

<header class:menu-open={mobileOpen}>
	<div class="nav-row">
		<div class="nav-brand">
			<button type="button" onclick={() => show('home')}>Lara Perez</button>
		</div>

		<div class="nav-work" class:sub-visible={activePage === 'work'}>
			<button
				type="button"
				class="nav-work-label"
				class:active={activePage === 'work'}
				onclick={() => show('home')}
			>
				Work
			</button>
			<div class="nav-sub-links">
				{#each Object.keys(PROJECTS) as proj}
					<button
						type="button"
						class:current={activePage === 'work' && currentProject === proj}
						onclick={() => show('work', proj)}
					>
						{proj}
					</button>
				{/each}
			</div>
		</div>

		<nav class="nav-right">
			<button type="button" onclick={() => show('about')}>About</button>
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
								show('work', proj);
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
					<button type="button" class="mob-secondary-link" onclick={mobNavAbout}>About</button>
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
			Product and system designer based in Spain, working globally and remotely. Previously, I helped
			design <span class="chip">UX-matured environments</span>,
			<span class="chip">premium retention</span> journeys, <span class="chip">0-to-1 products</span>,
			accelerated <span class="chip">time-to-value</span>, and meaningful
			<span class="chip">habit loops</span>. Recently, I've been focusing on improving
			<span class="chip">growth systems</span>.
		</p>
	</div>

	<div class="home-strip" id="strip-home">
		<div class="h-panel">
			<div class="h-panel-bg">
				<img src="/assets/sobero-cover.png" alt="Sobero" />
			</div>
		</div>
		<div class="h-panel">
			<div class="h-panel-bg">
				<img
					src="/assets/kwit-cover.png"
					alt="Kwit app with World Health Organization validation"
				/>
			</div>
		</div>
		<div class="h-panel">
			<div class="h-panel-bg">
				<img
					src="/assets/yazio-cover.png"
					alt="Yazio UX case study: microcopy optimization and Apple and Google Health onboarding variants"
				/>
			</div>
		</div>
		<div class="h-panel">
			<div class="h-panel-bg">
				<img
					src="/assets/yazio-cover-02.png"
					alt="Habit loop illustration with mascot: reward, investment, trigger, and routine"
				/>
			</div>
		</div>
		<div class="h-panel">
			<div class="h-panel-bg">
				<img
					src="/assets/welltech-cover.png"
					alt="Product workflow board: hypothesis, specification, design phases with roles and pain points"
				/>
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
		<span class="work-giant">{currentProject}</span>
		<div class="work-strip" id="strip-work">
			{#each PROJECTS[currentProject].panels as panel}
				<div class="w-panel">
					<div class="w-panel-bg">
						<span class="ph">{currentProject.charAt(0)}</span>
						<span class="w-panel-label">{panel}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<div id="page-about" class="page" class:active={activePage === 'about'}>
	<h1>About</h1>
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
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition: opacity 0.25s, visibility 0.25s;
	}
	.page.active {
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
		display: inline;
		background: rgba(0, 0, 0, 0.07);
		border-radius: 30px;
		padding: 2px 14px;
		white-space: nowrap;
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
	}
	.ph {
		font-size: clamp(5rem, 13vw, 18rem);
		color: rgba(0, 0, 0, 0.07);
		letter-spacing: -0.05em;
		line-height: 1;
		user-select: none;
		pointer-events: none;
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
		line-height: 1.3;
		font-weight: 400;
		max-width: 480px;
	}
	.work-meta {
		grid-column: 2;
		font-size: 14px;
		line-height: 1.3;
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
	.work-giant {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		text-align: center;
		font-size: clamp(4rem, 15vh, 13rem);
		font-weight: 400;
		line-height: 1;
		white-space: nowrap;
		pointer-events: none;
		z-index: 10;
		letter-spacing: -0.015em;
	}
	.w-panel {
		position: relative;
		z-index: 1;
	}
	.w-panel-label {
		position: absolute;
		bottom: 12px;
		left: 14px;
		font-size: 14px;
		pointer-events: none;
	}

	#page-about {
		overflow-y: auto;
		padding: var(--top-gap) var(--px) var(--px);
	}
	h1 {
		font-size: clamp(2.5rem, 7vw, 9rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: -0.02em;
		margin-bottom: 40px;
	}
	#page-about h1 {
		font-family: var(--font-body);
		letter-spacing: -0.02em;
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
		.h-panel,
		.w-panel {
			width: 80vw;
		}
		.work-top {
			grid-template-columns: 1fr;
			padding-top: 24px;
		}
		.work-meta {
			text-align: left;
		}
		.about-body {
			grid-template-columns: 1fr;
		}
		h1 {
			font-size: clamp(2rem, 12vw, 4rem);
		}
	}
</style>
