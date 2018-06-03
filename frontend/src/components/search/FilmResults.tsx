import * as React from 'react';
import { connect } from 'react-redux';
import { DropdownItem } from 'reactstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import { getNodeItems } from '../../utilities/mapping';
import ILoadingStatus, { defaultStatus } from '../../models/base/ILoadingStatus';

export const hasFilmResults = (state: Store.All): boolean => {
    const page = state.sealed.film.search.pages[1];
    if (page && page.status.loading) {
        return true;
    }
    const films = getNodeItems({
        page: 1,
        byId: state.sealed.film.byId,
        pages: state.sealed.film.search.pages
    });
    return films.length > 0;
};

export type Props = {};

type ConnectedState = {
    films: IFilm[];
    status: ILoadingStatus;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedState & ConnectedDispatch;
class FilmResultsComponent extends React.Component<CombinedProps> {
    public render() {
        const spinner = this.props.status.loading ? <i className="ml-2 fas fa-spinner fa-spin"></i> : null;
        const items = this.props.films.map((film: IFilm) => {
            return (
                <LinkContainer key={film.id} to={'/film/' + film.id}>
                    <DropdownItem title={film.title} style={{ overflowX: 'hidden', textOverflow: 'ellipsis' }} >
                        {film.title}
                    </DropdownItem>
                </LinkContainer>
            );
        });
        return (
            <>
                <DropdownItem header>Films{spinner}</DropdownItem>
                {items}
            </>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const page = state.sealed.film.search.pages[1];
    return {
        status: page ? page.status : defaultStatus,
        films: getNodeItems({
            page: 1,
            byId: state.sealed.film.byId,
            pages: state.sealed.film.search.pages
        })
    };
};

const FilmResults: React.ComponentClass<Props> =
    connect(mapStateToProps)(FilmResultsComponent);
export default FilmResults;