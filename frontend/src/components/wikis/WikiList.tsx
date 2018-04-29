import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Empty from '../Empty';
import Store from '../../store';
import WikiRow from './WikiRow';
import IWiki from '../../models/IWiki';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    wikis: IWiki[];
    loading: boolean;
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class WikiListComponent extends React.Component<CombinedProps> {
    public render() {
        const wikis = this.props.wikis;
        if (!wikis.length) {
            return <Empty loading={this.props.loading} />;
        }
        const rows = wikis.map((wiki: IWiki) => {
            return (<WikiRow wiki={wiki} key={wiki.id} />);
        });
        return (
            <div>
                <Pager uri="/wikis" total={this.props.total} page={this.props.page} />
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                <Pager uri="/wikis" total={this.props.total} page={this.props.page} />
            </div>
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const page = state.sealed.wikis.pages[ownProps.page];
    return {
        total: state.sealed.wikis.count,
        loading: page ? page.loading : false,
        wikis: page ? page.items : []
    };
};

const WikiList: React.ComponentClass<Props> =
    connect(mapStateToProps)(WikiListComponent);
export default WikiList;
