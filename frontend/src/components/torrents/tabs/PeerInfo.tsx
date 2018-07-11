import * as React from 'react';

import PeerList from '../../peers/PeerList';
import { ITorrent } from '../../../models/ITorrent';

export type Props = {
    active: boolean;
    torrent: ITorrent;
};

type State = {
    page: number;
};

export default class PeerInfo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { page: 1 };
    }

    public render() {
        const changePage = (page: number) => this.setState({ page });
        const props = {
            changePage,
            ...this.props,
            page: this.state.page
        };

        return (
            <PeerList {...props} />
        );
    }
}