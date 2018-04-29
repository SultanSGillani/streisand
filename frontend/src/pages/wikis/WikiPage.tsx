import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import IWiki from '../../models/IWiki';
import Empty from '../../components/Empty';
import WikiView from '../../components/wikis/WikiView';
import { numericIdentifier } from '../../utilities/shim';
import { getWiki } from '../../actions/wikis/WikiAction';
import { isLoadingItem } from '../../models/base/ILoadingItem';

export type Props = {
    params: {
        wikiId: string;
    };
};

type ConnectedState = {
    wikiId: number;
    wiki?: IWiki;
    loading: boolean;
};

type ConnectedDispatch = {
    getWiki: (id: number) => void;
};

type CombinedProps = ConnectedState & ConnectedDispatch & Props;
class WikiPageComponent extends React.Component<CombinedProps, void> {
    public componentWillMount() {
        const hasContent = this.props.wiki && this.props.wiki.body;
        if (!this.props.loading && !hasContent) {
            this.props.getWiki(this.props.wikiId);
        }
    }

    public componentWillReceiveProps(props: CombinedProps) {
        const hasContent = props.wiki && props.wiki.body;
        if (!props.loading && !hasContent) {
            this.props.getWiki(props.wikiId);
        }
    }

    public render() {
        const wiki = this.props.wiki;
        if (!wiki || !wiki.body || this.props.loading) {
            return <Empty loading={this.props.loading} />;
        }

        return (
            <WikiView wiki={wiki} />
        );
    }
}

const mapStateToProps = (state: Store.All, ownProps: Props): ConnectedState => {
    const wikiId = numericIdentifier(ownProps.params.wikiId);
    const item = state.sealed.wikis.byId[wikiId];

    let wiki: IWiki | undefined;
    let loading = false;
    if (isLoadingItem(item)) {
        loading = item.loading;
    } else if (item) {
        wiki = item;
    }

    return {
        loading: loading,
        wiki: wiki,
        wikiId: wikiId
    };
};

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    getWiki: (id: number) => dispatch(getWiki(id))
});

const WikiPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(WikiPageComponent);
export default WikiPage;
