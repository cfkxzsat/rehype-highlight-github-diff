const visit = require('unist-util-visit');
const classList = require('hast-util-class-list');

module.exports = highlightDiffCodeBlockPlugin;

function highlightDiffCodeBlockPlugin(options) {
	const { className } = options;
	return transformer;

	function transformer(tree, file) {
		visit(tree, 'element', visitor);

		function visitor(node, index, parent) {
			if (classList(node).contains('language-diff')) {
				const arr = [];
				for (const c of node.children) {
					// remove last \n
					const v = c.value.endsWith('\n') ? c.value.slice(0, c.value.length - 1) : c.value;
					for (const line of v.split('\n')) {
						let diffClassName = '';
						if (/^- \S/.test(line)) {
							diffClassName = 'diff-del';
						} else if (/^\+ \S/.test(line)) {
							diffClassName = 'diff-add';
						} else if (/^! \S/.test(line)) {
							diffClassName = 'diff-warn';
						} else if (/^# \S/.test(line)) {
							diffClassName = 'diff-comment';
						}
						arr.push({
							type: 'element',
							tagName: 'span',
							properties: {
								className: [
									diffClassName, // "diff-add" or "diff-warn" or "diff-comment"
								],
							},
							children: [
								{
									type: 'text',
									value: line, //以- + ! #和一个空格作为标识
								},
							],
						});
						arr.push({
							type: 'text',
							value: '\n',
						});
					}
				}
				classList(node).add(className);
				node.children = arr;
			}
		}
	}
}

// transform tree node

// "type": "element",
// "tagName": "code",
// "properties": {
//     "className": [
//         "language-diff"
//     ]
// },
// "children": [
//     {
//         "type": "text",
//         "value": "- text in red\n+ text in green\n! text in orange\n# text in gray\n"
//     }
// ],

// to

// "type": "element",
// "tagName": "code",
// "properties": {
//     "className": [
//         "language-diff"
//     ]
// },
// "children": [
//     {
//         "type": "element",
//         "tagName": "span",
//         "properties": {
//             "className": [
//                 "diff-del" // "diff-add" or "diff-warn" or "diff-comment"
//             ]
//         },
//         "children": [
//             {
//                 "type": "text",
//                 "value": "- text in red"
//             }
//         ]
//     }
//     {
//         "type": "text",
//         "value": "\n"
//     }
// ],
