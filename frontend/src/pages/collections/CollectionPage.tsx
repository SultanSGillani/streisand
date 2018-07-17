import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../state/store';
import ICollection from '../../models/ICollection';
import { getNode } from '../../utilities/mapping';
import Empty from '../../components/generic/Empty';
import Loading from '../../components/generic/Loading';
import CollectionView from '../../components/collections/CollectionView';
import { numericIdentifier } from '../../utilities/shim';
import { IDispatch } from '../../state/actions/ActionTypes';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { getCollection } from '../../state/collection/actions/CollectionAction';

export type Props = {
    params: {
        collectionId: string;
    };
};

type ConnectedState = {
    collectionId: number;
    collection?: ICollection;
    status: ILoadingStatus;
};

type ConnectedDispatch = {
    getCollection: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class CollectionPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        const hasContent = this.props.collection && (this.props.collection.description || this.props.collection.description === '');
        if (!this.props.status.loading && !hasContent) {
            this.props.getCollection(this.props.collectionId);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const status = props.status;
        const hasContent = props.collection && (props.collection.description || props.collection.description === '');
        const changed = props.collectionId !== this.props.collectionId;
        const needUpdate = !status.failed && (!status.loaded || status.outdated);
        if (!status.loading && (changed || needUpdate || !hasContent)) {
            this.props.getCollection(props.collectionId);
        }
    }

    public render() {
        const collection = this.props.collection;
        if (!collection || !(collection.description || collection.description === '')) {
            return this.props.status.loading ? <Loading /> : <Empty />;
        }

        return (
            <CollectionView collection={collection} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const collectionId = numericIdentifier(props.params.collectionId);
    const node = getNode({ id: collectionId, byId: state.sealed.collection.byId });
    return {
        collectionId: collectionId,
        collection: node.item,
        status: node.status
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getCollection: (id: number) => dispatch(getCollection(id))
});

const CollectionPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(CollectionPageComponent);
export default CollectionPage;
