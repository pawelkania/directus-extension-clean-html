# Directus Clean HTML Extension

A Directus extension that provides an operation to clean and sanitize HTML content in Directus Flows. This extension allows you to selectively remove elements, clean attributes, 
and optimize HTML structure for further processing (for example to use with AI generation nodes). Compatible with **Webhook / Request URL** node (use `{{$last.data}}` as HTML input in this node).

## Features

- Extract specific parts of HTML using CSS selectors
- Remove unwanted elements using CSS selectors
- Strip all HTML attributes
- Remove empty tags recursively
- Remove HTML comments
- Process HTML safely using Cheerio

## Installation

Use marketplace to install the extension.

## Usage

This extension adds a new "Clean HTML" operation that can be used in Directus Flows, particularly with the Webhook or Request URL nodes.

### Flow Configuration

1. Add a Webhook or Request URL node to receive HTML content
2. Add the Clean HTML operation
3. Configure the operation options:

```json
{
  "operation": "clean-html",
  "options": {
    "html": "{{$trigger.body.content}}", 
    "workOnSelector": ".content",
    "selectors": ".ads, .comments",
    "cleanAttributes": true,
    "removeEmptyTags": true,
    "removeComments": true
  }
}
```

## Operation Options

| Option          | Type    | Description                          | Default |
|-----------------|---------|--------------------------------------|---------|
| `html`          | string  | The HTML content to process          | Required|
| `workOnSelector`| string  | CSS selector to extract specific HTML portion | Optional|
| `selectors`     | string  | Comma-separated list of CSS selectors to remove | Optional|
| `cleanAttributes`| boolean | Remove all attributes from elements  | false   |
| `removeEmptyTags`| boolean | Remove elements with no content      | false   |
| `removeComments`| boolean | Remove HTML comments                 | false   |
## Response

The operation returns an object:


## Requirements

- Directus version ^10.10.0
- Node.js

## License

MIT License  

## Author

Paweł Kania