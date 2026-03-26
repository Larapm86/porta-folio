import { error } from '@sveltejs/kit';
import { PROJECTS, slugToProject } from '$lib/data/projects';

export function load({ params }) {
	const slug = params.slug;
	const projectName = slugToProject(slug);
	if (!projectName) throw error(404, 'Case study not found');

	const project = PROJECTS[projectName];
	return { slug, projectName, project };
}
