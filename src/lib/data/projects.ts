export type WorkPanelVideo =
	| { type: 'file'; src: string; poster?: string }
	| { type: 'youtube'; id: string }
	| { type: 'vimeo'; id: string };

export type WorkPanel = {
	label: string;
	video?: WorkPanelVideo;
	image?: string;
	images?: string[];
	size?: 'double';
};

export type ProjectDef = {
	desc: string;
	meta: string;
	panels: WorkPanel[];
};

export const PROJECTS: Record<string, ProjectDef> = {
	'UX Maturity': {
		desc: 'Designed working environments and design system frameworks that raised UX maturity across product teams - establishing shared principles, critique rituals, and scalable component libraries.',
		meta: 'UX Strategy.<br>Design Systems.<br>Spain',
		panels: [
			{
				label: 'Discovery',
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
		panels: [
			{
				label: 'Progressive onboarding',
				video: { type: 'file', src: '/assets/0-to-1-research-sobero.mov' }
			},
			{
				label: 'Modular product architecture',
				image: '/assets/sobero-modular.png'
			},
			{
				label: 'Foundational research',
				images: ['/assets/sobero-foundational-03.png', '/assets/sobero-foundational-02.png']
			},
			{
				label: 'UI Design',
				images: [
					'/assets/sobero-icons-default.png',
					'/assets/sobero-icons-selected.png',
					'/assets/sobero-pictograms.png',
					'/assets/sobero-scenes.png',
					'/assets/sobero-illustrations.png'
				]
			},
			{
				label: 'Design System',
				images: [
					'/assets/sobero-ds-foundation-01.png',
					'/assets/sobero-ds-foundation-02.png',
					'/assets/sobero-ds-foundation-03.png'
				]
			},
			{
				label: 'Design System',
				images: [
					'/assets/sobero-ds-components-01.png',
					'/assets/sobero-ds-components-02.png',
					'/assets/sobero-ds-components-03.png'
				]
			},
			{
				label: 'User Interface - Core flows',
				images: [
					'/assets/sobero-mockups-01.png',
					'/assets/sobero-mockups-02.png',
					'/assets/sobero-mockups-03.png',
					'/assets/sobero-mockups-04.png',
					'/assets/sobero-mockups-05.png'
				]
			},
			{
				label: 'Sobero Site',
				image: '/assets/sobero-site.png'
			},
			{
				label: 'Apple Store Reviews',
				images: [
					'/assets/sobero-opinions-01.png',
					'/assets/sobero-opinions-02.png',
					'/assets/sobero-opinions-03.png',
					'/assets/sobero-opinions-04.png'
				]
			},
			{
				label: 'Impact',
				image: '/assets/sobero-impact.png',
				size: 'double'
			}
		]
	},
	'Time-to-Value': {
		desc: 'Accelerated time-to-value in onboarding funnels by reducing friction, clarifying value propositions, and designing progressive disclosure flows that get users to their first meaningful moment faster.',
		meta: 'Onboarding Design.<br>Conversion.<br>Spain',
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
