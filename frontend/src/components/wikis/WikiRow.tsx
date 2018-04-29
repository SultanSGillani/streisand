import * as React from 'react';
import { Link } from 'react-router';

import IWiki from '../../models/IWiki';

export type Props = {
    wiki: IWiki;
};

export default function FilmRow(props: Props) {
    const wiki = props.wiki;
    return (
        <tr>
            <td>
                <Link to={'/wiki/' + wiki.id} title={wiki.title}>{wiki.title}</Link>
            </td>
        </tr>
    );
}
