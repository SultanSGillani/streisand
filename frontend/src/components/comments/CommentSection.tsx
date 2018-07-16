import * as React from 'react';

import IFilm from '../../models/IFilm';
import CommentList from './CommentList';

export type Props = {
    film: IFilm;
};

type State = {
    page: number;
};

export default class CommentSection extends React.Component<Props, State> {
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
            <CommentList {...props} />
        );
    }
}