import { Plugin } from "unified";

declare const highlightDiffCodeBlockPlugin: Plugin<[{ className: string }?]>;
export = highlightDiffCodeBlockPlugin;
