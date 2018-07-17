import * as React from 'react';
import { connect } from 'react-redux';
import { DropdownItem } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Store from '../../state/store';
import { getItems } from '../../utilities/mapping';
import { IForumThread } from '../../models/forums/IForumThread';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export const hasThreadResults = (state: Store.All): boolean => {
    const page = state.sealed.forum.thread.search.pages[1];
    if (page && page.status.loading) {
        return true;
    }
    return page && page.items.length > 0;
};

export type Props = {};

type ConnectedState = {
    threads: IForumThread[];
    status: ILoadingStatus;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class ThreadResultsComponent extends React.Component<CombinedProps> {
    public render() {
        const spinner = this.props.status.loading ? <i className="ml-2 fas fa-spinner fa-spin"></i> : null;
        const items = this.props.threads.map((thread: IForumThread) => {
            return (
                <LinkContainer key={thread.id} to={'/forum/thread/' + thread.id}>
                    <DropdownItem title={thread.title} style={{ overflowX: 'hidden', textOverflow: 'ellipsis' }} >
                        {thread.title}
                    </DropdownItem>
                </LinkContainer>
            );
        });
        return (
            <>
                <DropdownItem header>Forum Threads{spinner}</DropdownItem>
                {items}
            </>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const page = state.sealed.forum.thread.search.pages[1];
    return {
        status: page ? page.status : defaultStatus,
        threads: getItems({
            page: 1,
            byId: state.sealed.forum.thread.byId,
            pages: state.sealed.forum.thread.search.pages
        })
    };
};

const ThreadResults: React.ComponentClass<Props> =
    connect(mapStateToProps)(ThreadResultsComponent);
export default ThreadResults;