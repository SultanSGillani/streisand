import { Tag } from 'bbcode-to-react';

export default class RightSquareBracketTag extends Tag {
    protected SELF_CLOSE: boolean;
    protected STRIP_OUTER: boolean;

    constructor(renderer: any, settings: any = {}) {
        super(renderer, settings);

        this.SELF_CLOSE = true;
        this.STRIP_OUTER = true;
    }

    public toReact() {
        return ']';
    }
}