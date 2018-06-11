import HideTag from './HideTag';
import { Parser } from 'bbcode-to-react';
import ImageTag from './ImageTag';
import LeftSquareBracketTag from './LeftSquareBracketTag';
import RightSquareBracketTag from './RightSquareBracketTag';

export function extendParser(parser: Parser) {
    parser.registerTag('hide', HideTag);
    parser.registerTag('img', ImageTag);
    parser.registerTag('lsb', LeftSquareBracketTag);
    parser.registerTag('rsb', RightSquareBracketTag);
    return parser;
}