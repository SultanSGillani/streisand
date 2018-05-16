import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import WikiRow from './WikiRow';
import IWiki from '../../models/IWiki';
import { getNodeItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    pageSize: number;
    wikis: IWiki[];
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
        return (
            <div>
                {pager}
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                {pager}
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    return {
        total: state.sealed.wikis.count,
        pageSize: state.sealed.wikis.pageSize,
        wikis: getNodeItems({
            page: ownProps.page,
            byId: state.sealed.wikis.byId,
            pages: state.sealed.wikis.pages
        })
    };
};

const WikiList: React.ComponentClass<Props> =
    connect(mapStateToProps)(WikiListComponent);
export default WikiList;
