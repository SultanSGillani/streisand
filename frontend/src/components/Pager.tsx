import * as React from 'react';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

import Store from '../store';
import { ScreenSize } from '../models/IDeviceInfo';

export type Props = {
    uri?: string;
    page: number;
    total: number;
    pageSize: number;
    onPageChange?: (page: number) => void;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type CombinedProps = Props & ConnectedState;
class PagerComponent extends React.Component<CombinedProps> {
    public render() {
        const { uri, page, onPageChange, total = 0, pageSize = 0 } = this.props;
        const pageCount = Math.ceil(total / (pageSize || 1));
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
            const start = pageSize * (i - 1) + 1;
            const end = Math.min(start + pageSize - 1, total);
            pages.push(
                <Page key={i} active={i === page} page={i}
                    url={`${uri}/${i}`} title={`${start} - ${end}`}
                    value={i} onPageChange={onPageChange} />
            );
        }
        return (
            <Pagination className="center-pagination">
                <Page disabled={page === 1} page={1} url={`${uri}/1`} value="«"
                    title="first page" onPageChange={onPageChange} />
                {pages}
                <Page disabled={page === pageCount} page={pageCount} value="»"
                    url={`${uri}/${pageCount}`} title="last page" onPageChange={onPageChange} />
            </Pagination>
        );
    }
}

type PageProps = {
    url: string;
    title: string;
    value: string | number;
    page: number;
    active?: boolean;
    disabled?: boolean;
    onPageChange?: (page: number) => void;
};

function Page(props: PageProps) {
    if (!props.onPageChange) {
        return (
            <PaginationItem title={props.title} disabled={props.disabled} active={props.active}>
                <LinkContainer to={props.url}><PaginationLink>{props.value}</PaginationLink></LinkContainer>
            </PaginationItem>
        );
    }

    const onClick = () => props.onPageChange && props.onPageChange(props.page);
    return (
        <PaginationItem title={props.title} disabled={props.disabled} active={props.active}>
            <PaginationLink onClick={onClick}>{props.value}</PaginationLink>
        </PaginationItem>
    );
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