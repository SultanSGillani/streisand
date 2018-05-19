import * as React from 'react';
import * as redux from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../store';
import IWiki from '../../models/IWiki';
import DeleteCell from '../generic/DeleteCell';
import { IDeleteProps, deleteWiki } from '../../actions/wikis/DeleteWikiAction';

export type Props = {
    wiki: IWiki;
    page: number;
};

type ConnectedState = {};

type ConnectedDispatch = {
    deleteWiki: (props: IDeleteProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class WikiRowComponent extends React.Component<CombinedProps> {
    public render() {
        const wiki = this.props.wiki;
        const onDelete = () => {
            this.props.deleteWiki({
                id: wiki.id,
                currentPage: this.props.page
            });
        };
        return (
            <tr>
                <td className="align-middle">
                    <Link to={'/wiki/' + wiki.id} title={wiki.title}>{wiki.title}</Link>
                </td>
                <DeleteCell onDelete={onDelete} />
            </tr>
        );
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    deleteWiki: (props: IDeleteProps) => dispatch(deleteWiki(props))
});

const WikiRow: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(WikiRowComponent);
export default WikiRow;