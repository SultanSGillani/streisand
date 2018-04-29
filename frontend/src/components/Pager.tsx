import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../store';
import globals from '../utilities/globals';
import { ScreenSize } from '../models/IDeviceInfo';

const PAGE_SIZE = globals.pageSize;

const center = {
    'display': 'flex',
    'justify-content': 'center'
};

export type Props = {
    uri: string;
    page: number;
    total: number;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type CombinedProps = Props & ConnectedState;
class PagerComponent extends React.Component<CombinedProps> {
    public render() {
        const { uri, page, total } = this.props;
        const pageCount = Math.ceil(total / PAGE_SIZE);
        if (pageCount <= 1) {
            // No need to render paging controls if there is only one page
            return null;
        }

        const pagesToShow = getPagesToShow(this.props.screenSize);
        const half = (pagesToShow - 1) / 2;

        // left is going to be the page number of the left most paging button
        let left = page - half > 0 ? page - half : 1;
        // right is the page number of the right most paging button
        let right = Math.min(pageCount, page + pagesToShow - 1 - (page - left));
        left = Math.max(1, page - pagesToShow + 1 + (right - page));

        let pages: JSX.Element[] = [];
        for (let i = left; i <= right; i++) {
            const start = PAGE_SIZE * (i - 1) + 1;
            const end = Math.min(start + PAGE_SIZE - 1, total);
            const classes = i === page ? 'active' : '';
            pages.push(<li className={classes} key={i} title={`${start} - ${end}`}><Link to={`${uri}/${i}`}>{i}</Link></li>);
        }
        return (
            <ul style={center} className="pagination">
                <li className={page === 1 ? 'disabled' : ''}>
                    <Link to={`${uri}/1`}>«</Link>
                </li>
                {pages}
                <li className={page === pageCount ? 'disabled' : ''}>
                    <Link to={`${uri}/${pageCount}`}>» </Link>
                </li>
            </ul>
        );
    }
}

function getPagesToShow(screenSize: ScreenSize): number {
    // Returns the number of pages to show in the paging control
    // All returned values should be odd so that the current page can be centered
    switch (screenSize) {
        case ScreenSize.extraSmall:
            return 3;
        case ScreenSize.small:
            return 7;
        default:
            return 11;
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const Pager: React.ComponentClass<Props> =
    connect(mapStateToProps)(PagerComponent);
export default Pager;