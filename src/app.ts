import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'clean-html',
	name: 'Clean HTML',
	icon: 'box',
	description: 'Clean HTML by removing elements and attributes',
	overview: ({ html, workOnSelector, selectors, cleanAttributes, removeEmptyTags, removeComments }) => [
		{
			label: 'HTML',
			text: html,
		},
		{
			label: 'Work On Selector',
			text: workOnSelector,
		},
		{
			label: 'Selectors to Remove',
			text: selectors,
		},
		{
			label: 'Clean Attributes',
			text: cleanAttributes ? 'Yes' : 'No',
		},
		{
			label: 'Remove Empty Tags',
			text: removeEmptyTags ? 'Yes' : 'No',
		},
		{
			label: 'Remove Comments',
			text: removeComments ? 'Yes' : 'No',
		},
	],
	options: [
		{
			field: 'html',
			name: 'HTML',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'textarea',
				note: 'The HTML content to clean',
			},
		},
		{
			field: 'workOnSelector',
			name: 'Work On Selector',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input',
				note: 'Optional: CSS selector to extract only a portion of the HTML for processing',
			},
		},
		{
			field: 'selectors',
			name: 'Selectors to Remove',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'textarea',
				note: 'Comma-separated list of CSS selectors to remove from the HTML',
			},
		},
		{
			field: 'cleanAttributes',
			name: 'Clean Attributes',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				note: 'Remove all attributes from all elements',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'removeEmptyTags',
			name: 'Remove Empty Tags',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				note: 'Remove elements that have no content or only empty children',
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'removeComments',
			name: 'Remove Comments',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				note: 'Remove HTML comments from the document',
			},
			schema: {
				default_value: false,
			},
		},
	],
});
