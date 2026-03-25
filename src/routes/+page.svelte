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

	let activePage = 'home';
	let currentProject = 'UX Maturity';
	let mobileOpen = false;

	function show(id: string, project: string | null = null) {
		activePage = id;
		if (id === 'work' && project) currentProject = project;
	}

	function closeMob() {
		mobileOpen = false;
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
	<link
		href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Quadrant+Text:ital,wght@0,400;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<header>
	<div class="nav-row">
		<div class="nav-brand">
			<button onclick={() => show('home')}>Lara Perez</button>
		</div>

		<div class="nav-work" class:sub-visible={activePage === 'work'}>
			<button class="nav-work-label" class:active={activePage === 'work'} onclick={() => show('home')}
				>Work</button
			>
			<div class="nav-sub-links">
				{#each Object.keys(PROJECTS) as proj}
					<button
						class:current={currentProject === proj}
						onclick={() => {
							show('work', proj);
						}}
					>
						{proj}
					</button>
				{/each}
			</div>
		</div>

		<nav class="nav-right">
			<button onclick={() => show('about')}>About</button>
			<button onclick={() => show('contact')}>Contact</button>
		</nav>

		<button class="nav-index" onclick={() => (mobileOpen = true)}>Index</button>
	</div>
</header>

<div class="mob-menu" class:open={mobileOpen}>
	<button class="mob-close" onclick={closeMob}>Close</button>
	<div class="mob-links">
		<button
			onclick={() => {
				show('home');
				closeMob();
			}}>Work</button
		>
		<button
			onclick={() => {
				show('about');
				closeMob();
			}}>About</button
		>
		<button
			onclick={() => {
				show('contact');
				closeMob();
			}}>Contact</button
		>
	</div>
	<div class="mob-foot">Barcelona, Spain<br />Available for projects</div>
</div>

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
		<div>
			<div class="about-info-block">
				<div class="about-info-title">Brand Strategy</div>
				<div class="about-info-detail">Visual Identity<br />Naming and Positioning<br />Brand Guidelines</div>
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

<div id="page-contact" class="page" class:active={activePage === 'contact'}>
	<h1>Get in<br /><em>touch.</em></h1>
	<div class="contact-body">
		<div class="contact-portrait"><span class="about-ph">YN</span></div>
		<div>
			<div class="c-link"><a href="mailto:hello@example.com">hello@example.com</a><span>→</span></div>
			<div class="c-link"><a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a><span>→</span></div>
			<div class="c-link"><a href="https://linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a><span>→</span></div>
			<div class="c-link"><a href="https://read.cv/" target="_blank" rel="noreferrer">Read.cv</a><span>→</span></div>
			<div class="contact-location">Barcelona, Spain<br />Available for new projects</div>
		</div>
	</div>
</div>

<style>
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
		--gray: #999997;
		--px: 18px;
		--nav-h: 38px;
		--top-gap: 56px;
	}

	:global(html),
	:global(body) {
		height: 100%;
		overflow: hidden;
		background: var(--white);
		color: var(--black);
		font-family: 'Quadrant Text', 'Courier Prime', monospace;
		font-size: 14px;
		line-height: 1.5;
	}

	button {
		background: none;
		border: none;
		cursor: pointer;
		color: inherit;
		padding: 0;
		font-family: 'Quadrant Text', 'Courier Prime', monospace;
		font-size: inherit;
		font-weight: 400;
	}

	header button,
	.nav-brand button,
	.nav-sub-links button,
	.nav-right button,
	.nav-index,
	.nav-work-label {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
		font-size: 13px !important;
		font-weight: 600 !important;
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
		align-items: center;
	}

	.nav-row {
		width: 100%;
		display: flex;
		align-items: center;
	}
	.nav-brand {
		flex: 0 0 16%;
	}
	.nav-brand button:hover,
	.nav-right button:hover,
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
	.nav-sub-links {
		display: flex;
		gap: 20px;
		margin-left: 20px;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s;
		white-space: nowrap;
	}
	.nav-work:hover .nav-sub-links,
	.nav-work.sub-visible .nav-sub-links {
		opacity: 1;
		pointer-events: auto;
	}
	.nav-sub-links button.current {
		text-decoration: underline;
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
		font-size: clamp(1rem, 1.25vw, 1.15rem);
		line-height: 1.85;
		max-width: 72%;
	}
	.chip {
		display: inline;
		background: rgba(0, 0, 0, 0.07);
		border-radius: 30px;
		padding: 2px 14px;
		white-space: nowrap;
	}

	.home-strip,
	.work-strip {
		flex: 1;
		min-height: 0;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		display: flex;
		padding-left: var(--px);
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
	}

	#page-work {
		display: flex;
		flex-direction: column;
	}
	.work-top {
		display: grid;
		grid-template-columns: 1fr auto;
		padding: var(--top-gap) var(--px) 18px calc(16% + var(--px));
		gap: 0 20px;
	}
	.work-top-spacer {
		display: none;
	}
	.work-desc {
		font-size: 13px;
		line-height: 1.75;
		max-width: 480px;
	}
	.work-meta {
		font-size: 13px;
		line-height: 1.75;
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
		pointer-events: none;
		z-index: 10;
		letter-spacing: -0.015em;
	}
	.w-panel-label {
		position: absolute;
		bottom: 12px;
		left: 14px;
		font-size: 13px;
	}

	#page-about,
	#page-contact {
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
	.about-body {
		display: grid;
		grid-template-columns: 40vw 1fr 1fr;
		gap: 40px;
	}
	.about-portrait,
	.contact-portrait {
		background: var(--cream);
		aspect-ratio: 3 / 4;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.about-ph {
		font-size: clamp(5rem, 14vw, 14rem);
		color: rgba(0, 0, 0, 0.06);
	}
	.about-bio p {
		font-size: clamp(0.85rem, 1.1vw, 1rem);
		line-height: 1.85;
		margin-bottom: 1.2em;
	}
	.about-info-block {
		margin-bottom: 20px;
	}
	.about-info-title {
		font-size: clamp(1rem, 1.4vw, 1.3rem);
		margin-bottom: 3px;
	}
	.about-info-detail {
		font-size: 13px;
		color: var(--gray);
		line-height: 1.75;
	}
	.contact-body {
		display: grid;
		grid-template-columns: 40vw 1fr;
		gap: 40px;
	}
	.c-link {
		display: flex;
		justify-content: space-between;
		padding: 14px 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}
	.c-link:first-child {
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}
	.c-link:hover {
		opacity: 0.45;
	}
	.c-link a {
		font-size: clamp(1rem, 1.8vw, 1.5rem);
		color: inherit;
		text-decoration: none;
	}
	.contact-location {
		margin-top: 24px;
		font-size: 13px;
		color: var(--gray);
		line-height: 1.9;
	}

	.mob-menu {
		display: none;
		position: fixed;
		inset: 0;
		background: var(--white);
		z-index: 399;
		padding: var(--px);
		flex-direction: column;
		justify-content: space-between;
	}
	.mob-menu.open {
		display: flex;
	}
	.mob-close {
		position: absolute;
		top: 12px;
		right: var(--px);
		color: var(--gray);
	}
	.mob-links {
		padding-top: 60px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		font-size: clamp(2rem, 9vw, 4rem);
	}
	.mob-links button {
		text-align: left;
		line-height: 1.35;
	}
	.mob-foot {
		padding-bottom: 28px;
		font-size: 13px;
		color: var(--gray);
		line-height: 1.9;
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
		.about-body,
		.contact-body {
			grid-template-columns: 1fr;
		}
		h1 {
			font-size: clamp(2rem, 12vw, 4rem);
		}
	}
</style>
