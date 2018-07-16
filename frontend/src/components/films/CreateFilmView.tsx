import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import { IFilmUpdate } from '../../models/IFilm';
import { IDispatch } from '../../state/actions/ActionTypes';
import FilmForm, { IFilmFormData } from './FilmForm';
import { createFilm } from '../../actions/films/CreateFilmAction';

export type Props = {};

type ConnectedState = {
    creating: boolean;
};

type ConnectedDispatch = {
    createFilm: (film: IFilmUpdate) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CreateFilmViewComponent extends React.Component<CombinedProps> {
    public render() {
        const onCreateFilm = (data: IFilmFormData) => {
            const { duration, ...update } = data;
            this.props.createFilm({
                ...update,
                durationInMinutes: duration,
                fanartUrl: '',
                moderationNotes: '',
                lists: [],
                trailerType: 'YouTube',
                genreTags: []
            });
        };
        return (
            <div>
                <h1>Create a new film</h1>
                <FilmForm onSubmit={onCreateFilm} processing={this.props.creating} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => ({
    creating: state.sealed.wiki.creating
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createFilm: (film: IFilmUpdate) => dispatch(createFilm(film))
});

const CreateFilmView: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CreateFilmViewComponent);
export default CreateFilmView;
