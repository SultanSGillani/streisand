import * as React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';

import Pager from '../Pager';
import WikiRow from './WikiRow';
import Store from '../../state/store';
import IWiki from '../../models/IWiki';
import { ScreenSize } from '../../models/IDeviceInfo';
import { getNodeItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    wikis: IWiki[];
    screenSize: ScreenSize;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class WikiListComponent extends React.Component<CombinedProps> {
    public render() {
        const { wikis, page, total, pageSize } = this.props;
        const pager = <Pager uri="/wikis" total={total} page={page} pageSize={pageSize} />;
        const rows = wikis.map((wiki: IWiki) => {
            return (<WikiRow wiki={wiki} key={wiki.id} page={page} />);
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
    const list = state.sealed.wiki.list;
    return {
        total: list.count,
        pageSize: list.pageSize,
        screenSize: state.deviceInfo.screenSize,
        wikis: getNodeItems({
            page: props.page,
            byId: state.sealed.wiki.byId,
            pages: list.pages
        })
    };
};

const WikiList: React.ComponentClass<Props> =
    connect(mapStateToProps)(WikiListComponent);
export default WikiList;
