import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../state/store';
import ICollection from '../../models/ICollection';
import DeleteCell from '../generic/DeleteCell';
import { ScreenSize } from '../../models/IDeviceInfo';
import { IDispatch } from '../../state/actions/ActionTypes';
import { IActionProps, deleteCollection } from '../../state/collection/actions/DeleteCollectionAction';

export type Props = {
    collection: ICollection;
    page: number;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteCollection: (props: IActionProps) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CollectionRowComponent extends React.Component<CombinedProps> {
    public render() {
        const collection = this.props.collection;
        const onDelete = () => {
            this.props.deleteCollection({
                id: collection.id,
                currentPage: this.props.page
            });
        };
        const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <tr>
                <td className="align-middle">
                    <Link to={'/collection/' + collection.id} title={collection.title}>{collection.title}</Link>
                </td>
                {full && <DeleteCell onDelete={onDelete} />}
            </tr>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    deleteCollection: (props: IActionProps) => dispatch(deleteCollection(props))
});

const CollectionRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CollectionRowComponent);
export default CollectionRow;
