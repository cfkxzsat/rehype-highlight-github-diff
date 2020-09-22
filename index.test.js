const highlight = require('rehype-highlight');
const raw = require('rehype-raw');
const html = require('rehype-stringify');
const parse = require('remark-parse');
const remark2rehype = require('remark-rehype');
const unified = require('unified');
const highlightDiff = require('./index');

const mdToHtml = (markdown) => {
		// get tree node phase
		const tree = unified()
		.use(parse)
		.parse(markdown);
		// run phase
		const transformedTree = unified()
			.use(remark2rehype, {
				allowDangerousHtml: true, // https://github.com/rehypejs/rehype-raw
			})
			.use(raw)
			.use(highlight, {
				ignoreMissing: true, // 忽略不支持语言的代码块的错误
				plainText: ['diff'], // gfm里diff和git diff的语句块是不同展示规则，highlight.js会默认处理，导致冲突
			})
			.use(highlightDiff, {
				className: 'hljs', // 和其他highlightjs处理过的代码块可以应用相同的样式
			}) // github code diff支持
			.runSync(tree);

		// stringify phase
		return unified().use(html).stringify(transformedTree);
};

// test('first test to run', () => {
// 	expect(mdToHtml('### Test')).toBe('<h3 class=\"\">Test</h3>')
// })

test('first test to run', () => {
	expect(mdToHtml('```diff\n- text in red\n+ text in green\n! text in orange\n# text in gray\n```'))
		.toBe('<pre class=""><code class="language-diff hljs"><span class="diff-del">- text in red</span>\n<span class="diff-add">+ text in green</span>\n<span class="diff-warn">! text in orange</span>\n<span class="diff-comment"># text in gray</span>\n</code></pre>')
})
