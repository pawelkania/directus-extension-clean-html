import { defineOperationApi } from '@directus/extensions-sdk';
import * as cheerio from 'cheerio';

type Options = {
	html: string;
	workOnSelector: string;
	selectors: string;
	cleanAttributes: boolean;
	removeEmptyTags: boolean;
	removeComments: boolean;
};

export default defineOperationApi<Options>({
	id: 'clean-html',
	handler: ({ html, workOnSelector, selectors, cleanAttributes, removeEmptyTags, removeComments }) => {
		if (!html) {
			return {
				html: '',
				selectors: selectors || '',
			};
		}

		try {
			let $ = cheerio.load(html);
			let workingHtml = html;

			// if workOnSelector then leave only this part of html for further processing
			if (workOnSelector && workOnSelector.trim() !== '') {
				try {
					// Extract only the part of HTML that matches the workOnSelector
					const selectedElements = $(workOnSelector);

					if (selectedElements.length > 0) {
						// Create a new cheerio instance with only the selected elements
						const tempContainer = cheerio.load('<div id="temp-container"></div>');
						selectedElements.each((_, element) => {
							tempContainer('#temp-container').append(cheerio.load($.html(element)).root());
						});

						// Get the HTML of the selected elements
						workingHtml = tempContainer('#temp-container').html() || '';

						// Create a new cheerio instance with the extracted HTML
						$ = cheerio.load(workingHtml);

						console.log(`Extracted HTML using workOnSelector: ${workOnSelector}`);
					} else {
						console.log(`No elements found matching workOnSelector: ${workOnSelector}`);
					}
				} catch (workSelectorError) {
					console.error(`Error processing workOnSelector "${workOnSelector}":`, workSelectorError);
				}
			}

			if (removeComments) {
				try {
					// Remove comments using the filter method on root contents
					$.root()
						.contents()
						.filter(function() { return this.type === 'comment'; })
						.remove();
					
					// Also remove comments from within all elements
					$('*').each(function() {
						$(this)
							.contents()
							.filter(function() { return this.type === 'comment'; })
							.remove();
					});
					
					console.log('HTML comments removed');
				} catch (commentError) {
					console.error('Error removing HTML comments:', commentError);
				}
			}

			// Split selectors by comma and trim whitespace
			if (selectors && selectors.trim() !== '') {
				const selectorsArray = selectors.split(',').map(selector => selector.trim()).filter(Boolean);

				// Process each selector
				for (const selector of selectorsArray) {
					try {
						// Find and remove elements matching the selector
						$(selector).remove();
						console.log(`Removed elements matching selector: ${selector}`);
					} catch (selectorError) {
						console.error(`Error processing selector "${selector}":`, selectorError);
					}
				}
			}

			// Clean attributes if requested
			if (cleanAttributes) {
				try {

					$('*').each(function (this: cheerio.TagElement) {      // iterate over all elements
						this.attribs = {};     // remove all attributes
					});

					console.log('All attributes removed from elements');
				} catch (attrError) {
					console.error('Error removing attributes:', attrError);
				}
			}

			if (removeEmptyTags) {
				try {
					// Function to check if an element is empty (has no content or only empty children)
					const isElementEmpty = (elem: cheerio.Element): boolean => {
						const $elem = $(elem);

						// If it has text content (non-whitespace), it's not empty
						if ($elem.text().trim()) {
							return false;
						}

						// If it has no children, it's empty
						const children = $elem.children();
						if (children.length === 0) {
							return true;
						}

						// Check if all children are empty
						let allChildrenEmpty = true;
						children.each((_, child) => {
							if (!isElementEmpty(child)) {
								allChildrenEmpty = false;
								return false; // break the loop
							}
						});

						return allChildrenEmpty;
					};

					// Repeatedly remove empty elements until no more can be removed
					// This handles nested empty elements
					let removedCount: number;
					do {
						removedCount = 0;
						$('*').each((_, elem) => {
							const $elem = $(elem);
							if (isElementEmpty(elem)) {
								$elem.remove();
								removedCount++;
							}
						});
						console.log(`Removed ${removedCount} empty elements in this pass`);
					} while (removedCount > 0);

					console.log('All empty tags removed recursively');
				} catch (emptyTagError) {
					console.error('Error removing empty tags:', emptyTagError);
				}
			}

			// Get the cleaned HTML
			const cleanedHtml = $.html();

			return {
				html: cleanedHtml,
				selectors: selectors || '',
				workOnSelector: workOnSelector || '',
			};
		} catch (error: unknown) {
			console.error('Error cleaning HTML:', error);

			// Return original HTML in case of error
			return {
				html: html,
				selectors: selectors || '',
				workOnSelector: workOnSelector || '',
				error: `Failed to clean HTML: ${error instanceof Error ? error.message : String(error)}`
			};
		}
	},
});
