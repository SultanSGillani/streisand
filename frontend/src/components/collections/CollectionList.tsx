import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import CollectionRow from './CollectionRow';
import Store from '../../state/store';
import ICollection from '../../models/ICollection';
import { ScreenSize } from '../../models/IDeviceInfo';
import { getNodeItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    collections: ICollection[];
    screenSize: ScreenSize;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class CollectionListComponent extends React.Component<CombinedProps> {
    public render() {
        const { collections, page, total, pageSize } = this.props;
        const pager = <Pager uri="/collections" total={total} page={page} pageSize={pageSize} />;
        const rows = collections.map((collection: ICollection) => {
            return (<CollectionRow collection={collection} key={collection.id} page={page} />);
        });
        const full = this.props.screenSize > ScreenSize.small || undefined;
        // TODO: Create issue on reactstrap to fix the typings for Table and include borderless as a prop
        return (
            <div>
                {pager}
                <Table className="table-borderless" striped hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            {full && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </Table>
                {pager}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const list = state.sealed.collection.list;
    return {
        total: list.count,
        pageSize: list.pageSize,
        screenSize: state.deviceInfo.screenSize,
        collections: getNodeItems({
            page: props.page,
            byId: state.sealed.collection.byId,
            pages: list.pages
        })
    };
};

const CollectionList: React.ComponentClass<Props> =
    connect(mapStateToProps)(CollectionListComponent);
export default CollectionList;
