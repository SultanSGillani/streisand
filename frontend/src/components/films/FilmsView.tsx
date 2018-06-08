import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import FilmList from './FilmList';
import CommandBar, { ICommand } from '../CommandBar';
import { IDispatch } from '../../actions/ActionTypes';

export type Props = {
    page: number;
};

type ConnectedState = {};
type ConnectedDispatch = {
    createFilm: () => void;
    searchFilm: () => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const commands: ICommand[] = [
            {
                label: 'Create new film',
                onExecute: () => { this.props.createFilm(); }
            }, {
                label: 'Search films',
                onExecute: () => { this.props.searchFilm(); }
            }
        ];
        return (
            <div>
                <CommandBar commands={commands} />
                <FilmList page={this.props.page} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createFilm: () => dispatch(push('/films/create')),
    searchFilm: () => dispatch(push('/films/search'))
});

const FilmsView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(FilmsViewComponent);
export default FilmsView;
