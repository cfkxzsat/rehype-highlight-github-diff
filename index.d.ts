import type { Node as UnistNode } from 'unist';
declare function highlightDiffCodeBlockPlugin(options: { className: string }): (tree: UnistNode, file: any) => void;
export = highlightDiffCodeBlockPlugin;