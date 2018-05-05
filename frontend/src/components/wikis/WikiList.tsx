import * as React from 'react';
import { connect } from 'react-redux';

import Pager from '../Pager';
import Store from '../../store';
import WikiRow from './WikiRow';
import IWiki from '../../models/IWiki';
import { getItems } from '../../utilities/mapping';

export type Props = {
    page: number;
};

type ConnectedState = {
    total: number;
    wikis: IWiki[];
};
type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class WikiListComponent extends React.Component<CombinedProps> {
    public render() {
        const wikis = this.props.wikis;
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
    return {
        total: state.sealed.wikis.count,
        wikis: getItems({
            page: ownProps.page,
            byId: state.sealed.wikis.byId,
            pages: state.sealed.wikis.pages
        })
    };
};

const WikiList: React.ComponentClass<Props> =
    connect(mapStateToProps)(WikiListComponent);
export default WikiList;
