import * as React from 'react';
import { Tag } from 'bbcode-to-react';
import { MouseEvent } from 'react';

export default class HideTag extends Tag {
    public toReact() {
        const onMouseOver = (a: MouseEvent<HTMLSpanElement>) => {
            (a.target as HTMLSpanElement).style.color = 'white';
        };
        const onMouseOut = (a: MouseEvent<HTMLSpanElement>) => {
            (a.target as HTMLSpanElement).style.color = 'black';
        };
        return (
            <span style={{ backgroundColor: 'black', color: 'black' }} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
                {this.getContent(true)}
            </span>
        );
    }
}