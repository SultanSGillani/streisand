import HideTag from './HideTag';
import { Parser } from 'bbcode-to-react';

export function extendParser(parser: Parser) {
    parser.registerTag('hide', HideTag);
    return parser;
}