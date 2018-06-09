import * as React from 'react';
import { Tag } from 'bbcode-to-react';

export default class ImageTag extends Tag {
    public toReact() {
        const src = this.getContent(true);
        return (
            <img
                role="presentation"
                src={src}
                width={this.params.width}
                height={this.params.height}
                style={{ maxWidth: '100%' }}
            />
        );
    }
}