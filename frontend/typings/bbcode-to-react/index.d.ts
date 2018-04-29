/// <reference path="../../node_modules/@types/react/index.d.ts" />

declare module 'bbcode-to-react' {
    class Tag {
        params: any;
        public constructor(renderer: any, settings: any);
        getComponents(): any[];
        getContent(raw: boolean): string;
        toText(contentAsHTML: boolean): string;
        toHTML(): string;
        toReact(): React.ReactNode | React.ReactNode[];
    }

    class Parser {
        public constructor();
        public registerTag(name: string, tag: any): void;
        public toHTML(input: string): string;
        public toReact(input: string): React.ReactNode;
    }
}