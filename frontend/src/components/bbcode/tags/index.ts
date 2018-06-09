import HideTag from './HideTag';
import { Parser } from 'bbcode-to-react';
import ImageTag from './ImageTag';

export function extendParser(parser: Parser) {
    parser.registerTag('hide', HideTag);
    parser.registerTag('img', ImageTag);
    return parser;
}