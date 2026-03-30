export type WorkPanelVideo =
	| { type: 'file'; src: string; poster?: string }
	| { type: 'youtube'; id: string }
	| { type: 'vimeo'; id: string };

export type WorkPanel = {
	label: string;
	video?: WorkPanelVideo;
	image?: string;
	images?: string[];
	/** Lottie JSON under `/static` (e.g. `/assets/foo.json`) */
	lottie?: string;
	/** First slide in a multi-image strip (plays once in view; holds last frame; replays when re-entering view). */
	carouselLeadingLottie?: string;
	/** Last slide after `images` (same in-view Lottie behavior as `carouselLeadingLottie`). */
	carouselTrailingLottie?: string;
	/** Extra Lottie slides after `images`, before `carouselTrailingLottie` (same in-view behavior). */
	carouselLotties?: string[];
	size?: 'double';
};

export type CaseStudyAccordionSection = {
	heading: string;
	/** Plain text; line breaks can use \n\n */
	body: string;
};

export type ProjectDef = {
	desc: string;
	meta: string;
	panels: WorkPanel[];
	/** FAB + accordion with extra narrative for this case study */
	caseStudyAccordion?: {
		sections: CaseStudyAccordionSection[];
	};
};

export const PROJECTS: Record<string, ProjectDef> = {
	'UX Maturity': {
		desc: 'Designed working environments and design system frameworks that raised UX maturity across product teams - establishing shared principles, critique rituals, and scalable component libraries.',
		meta: 'UX Strategy.<br>Design Systems.<br>Spain',
		caseStudyAccordion: {
			sections: [
				{
					heading: 'Starting point',
					body: 'Teams were shipping fast but inconsistently — patterns diverged, critique was ad hoc, and there was no shared language for quality. The goal was to raise the floor without slowing delivery.'
				},
				{
					heading: 'Outcome',
					body: 'We introduced lightweight frameworks: principles people could argue with, critique rituals that felt fair, and a component system that made the right thing the easy thing. Maturity showed up in fewer regressions and faster alignment.'
				},
				{
					heading: 'Focus areas',
					body: 'Design tokens and component governance, documentation that stayed alive in Figma and code, and rituals (critique, pairing, office hours) that kept standards from rotting on a shelf.'
				},
				{
					heading: 'Credits',
					body: 'Cross-functional partnership with product and engineering; facilitation with design leadership; rollout alongside pilot squads before wider adoption.'
				}
			]
		},
		panels: [
			{
				label: 'Selected as Ones to watch by Apple',
				video: { type: 'file', src: '/assets/ux-maturity-discovery.mov' }
			},
			{ label: 'Frameworks' },
			{ label: 'Components' },
			{ label: 'Rituals' }
		]
	},
	'Premium Retention': {
		desc: 'Crafted premium retention journeys for smoke-free products - combining behavioral triggers, personalization, and habit-forming UX patterns to keep users engaged long-term.',
		meta: 'Retention Design.<br>Behavioral UX.<br>Spain',
		caseStudyAccordion: {
			sections: [
				{
					heading: 'Starting point',
					body: 'Retention was treated as a set of campaigns rather than a product surface. Triggers felt generic, and the product did not yet reflect why people stayed or slipped.'
				},
				{
					heading: 'Outcome',
					body: 'A calmer, more personal journey: the right nudge at the right time, clear value on return visits, and loops that rewarded consistency without feeling punitive.'
				},
				{
					heading: 'Methods',
					body: 'Behavioral mapping, cohort-informed messaging, experimentation on timing and tone, and UX patterns that supported habit without dark patterns.'
				},
				{
					heading: 'Credits',
					body: 'Collaboration with CRM, product analytics, and brand; iterative testing with research and compliance constraints in the loop.'
				}
			]
		},
		panels: [
			{ label: 'Onboarding' },
			{ label: 'Triggers' },
			{ label: 'Personalization' },
			{ label: 'Loops' }
		]
	},
	'0-to-1 Product': {
		desc: 'Co-developed a 0-to-1 product to help people drink mindfully - from early concept and research through to shipped experience, covering strategy, UX, and product design.',
		meta: 'Product Design.<br>0-to-1.<br>Spain',
		caseStudyAccordion: {
			sections: [
				{
					heading: 'Starting point',
					body: 'The space between intention and habit is crowded with one-size-fits-all apps. We started from research: what helps people notice patterns, set boundaries, and stay kind to themselves — without shame-based mechanics.'
				},
				{
					heading: 'Outcome',
					body: 'A focused 0-to-1 product: progressive onboarding, modular architecture for future features, and a visual language that felt human — from brand motion through design system to core flows and store presence.'
				},
				{
					heading: 'Craft',
					body: 'End-to-end product design: strategy and UX, UI and motion, design system foundations and components, marketing site, and iteration from qualitative feedback and store reviews.'
				},
				{
					heading: 'Credits',
					body: 'Built with tight loops alongside product and engineering; brand and motion in step with research insights. (Replace with your preferred names and partners.)'
				}
			]
		},
		panels: [
			{
				label: 'Progressive onboarding',
				video: { type: 'file', src: '/assets/0-to-1-research-sobero.mov' }
			},
			{
				label: 'Impact',
				lottie: '/assets/sobero-hero.json',
				size: 'double'
			},
			{
				label: 'Modular product architecture',
				carouselLeadingLottie: '/assets/sobero-strategy01.json'
			},
			{
				label: 'Foundational research',
				images: ['/assets/sobero-foundational-03.png', '/assets/sobero-foundational-02.png']
			},
			{
				label: 'Brand design',
				carouselLeadingLottie: '/assets/sobero-branding02.json',
				images: ['/assets/sobero-brand-design-02.png'],
				carouselTrailingLottie: '/assets/branding-03.json'
			},
			{
				label: 'UI Design',
				images: [
					'/assets/sobero-icons-default.png',
					'/assets/sobero-icons-selected.png',
					'/assets/sobero-pictograms.png',
					'/assets/sobero-scenes.png'
				],
				carouselTrailingLottie: '/assets/sobero-illustrations.json'
			},
			{
				label: 'Design System - Foundations',
				images: [
					'/assets/sobero-ds-foundation-01.png',
					'/assets/sobero-ds-foundation-02.png',
					'/assets/sobero-ds-foundation-03.png'
				]
			},
			{
				label: 'Design System - Components',
				carouselLeadingLottie: '/assets/sobero-ds-components01.json',
				images: ['/assets/sobero-ds-components-02b.png', '/assets/sobero-ds-components-03.png']
			},
			{
				label: 'User Interface - Core flows',
				carouselLotties: [
					'/assets/sobero-mockups01.json',
					'/assets/sobero-mockups02.json',
					'/assets/sobero-mockups03.json',
					'/assets/sobero-mockups04.json',
					'/assets/sobero-mockups05.json'
				]
			},
			{
				label: 'Sobero Site',
				lottie: '/assets/sobero-web.json'
			},
			{
				label: 'Apple Store Reviews',
				carouselLotties: [
					'/assets/sobero-opinions01.json',
					'/assets/sobero-opinions02.json',
					'/assets/sobero-opinions03.json',
					'/assets/sobero-opinions04.json'
				]
			}
		]
	},
	'Time-to-Value': {
		desc: 'Accelerated time-to-value in onboarding funnels by reducing friction, clarifying value propositions, and designing progressive disclosure flows that get users to their first meaningful moment faster.',
		meta: 'Onboarding Design.<br>Conversion.<br>Spain',
		caseStudyAccordion: {
			sections: [
				{
					heading: 'Starting point',
					body: 'Onboarding asked for too much too soon. Users bounced before they saw why the product mattered; teams measured clicks, not time-to-first-success.'
				},
				{
					heading: 'Outcome',
					body: 'Clearer value framing, fewer steps to the first “win,” and progressive disclosure so advanced options appeared when people were ready — not on step one.'
				},
				{
					heading: 'Approach',
					body: 'Funnel audit, jobs-to-be-done interviews, iterative copy and layout tests, and instrumentation tied to meaningful activation milestones.'
				},
				{
					heading: 'Credits',
					body: 'Partnered with growth and analytics; close iteration with PM and engineering on experiment scope and implementation.'
				}
			]
		},
		panels: [
			{ label: 'Audit' },
			{ label: 'Flow Design' },
			{ label: 'Testing' },
			{ label: 'Optimization' }
		]
	},
	'Habit Loops': {
		desc: 'Crafted meaningful habit loops for better nutrition - applying behavior design principles to create engaging, sustainable product experiences that make healthy choices easier.',
		meta: 'Behavior Design.<br>Habit UX.<br>Spain',
		caseStudyAccordion: {
			sections: [
				{
					heading: 'Starting point',
					body: 'Users wanted sustainable change, not streak anxiety. The product needed loops that felt supportive — cues, actions, and rewards that matched real life.'
				},
				{
					heading: 'Outcome',
					body: 'Habit design that respected motivation curves: small wins, sensible defaults, and feedback that reinforced identity (“I’m someone who…”) over guilt.'
				},
				{
					heading: 'Principles',
					body: 'Behavior design toolkit: triggers that users control, friction tuned to skill level, and variable rewards that did not rely on shame.'
				},
				{
					heading: 'Credits',
					body: 'Research-led iteration with nutrition and product teams; content and UX aligned to scientific guardrails.'
				}
			]
		},
		panels: [
			{ label: 'Research' },
			{ label: 'Loop Design' },
			{ label: 'Triggers' },
			{ label: 'Rewards' }
		]
	},
	'Growth Systems': {
		desc: 'Focused on improving growth systems - designing activation, retention, and referral loops that compound over time and create sustainable product-led growth.',
		meta: 'Growth Design.<br>Systems Thinking.<br>Spain',
		caseStudyAccordion: {
			sections: [
				{
					heading: 'Starting point',
					body: 'Growth was a list of tactics. Activation, retention, and referral were owned by different teams — metrics conflicted and the experience felt disjointed.'
				},
				{
					heading: 'Outcome',
					body: 'A coherent system: loops that compound, shared definitions of “activated,” and surfaces that connected short-term experiments to long-term retention.'
				},
				{
					heading: 'Scope',
					body: 'Journey mapping across acquisition and product, referral mechanics that felt native, and dashboards that tied design changes to system-level outcomes.'
				},
				{
					heading: 'Credits',
					body: 'Collaboration across growth, product, and data; alignment workshops with leadership on north-star and guardrails.'
				}
			]
		},
		panels: [
			{ label: 'Activation' },
			{ label: 'Retention' },
			{ label: 'Referral' },
			{ label: 'Analytics' }
		]
	}
};

export function projectToSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function slugToProject(slug: string): string | null {
	for (const name of Object.keys(PROJECTS)) {
		if (projectToSlug(name) === slug) return name;
	}
	return null;
}
