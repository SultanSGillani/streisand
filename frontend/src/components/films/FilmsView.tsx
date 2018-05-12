import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Store from '../../store';
import FilmList from './FilmList';
import CommandBar, { ICommand } from '../CommandBar';

export type Props = {
    page: number;
};

type ConnectedState = {};
type ConnectedDispatch = {
    createFilm: () => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class FilmsViewComponent extends React.Component<CombinedProps> {
    public render() {
        const commands: ICommand[] = [{
            label: 'Create new film',
            onExecute: () => { this.props.createFilm(); }
        }];
        return (
            <div>
                <CommandBar commands={commands} />
                <FilmList page={this.props.page} />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    createFilm: () => dispatch(push('/film/create'))
});

const FilmsView: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(FilmsViewComponent);
export default FilmsView;
