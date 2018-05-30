import * as React from 'react';
import { connect } from 'react-redux';

import Store from '../../store';
import IWiki from '../../models/IWiki';
import { getNode } from '../../utilities/mapping';
import Empty from '../../components/generic/Empty';
import { IDispatch } from '../../actions/ActionTypes';
import Loading from '../../components/generic/Loading';
import WikiView from '../../components/wikis/WikiView';
import { numericIdentifier } from '../../utilities/shim';
import { getWiki } from '../../actions/wikis/WikiAction';

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
        if (!wiki || !wiki.body) {
            return this.props.loading ? <Loading /> : <Empty />;
        }

        return (
            <WikiView wiki={wiki} />
        );
    }
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    const wikiId = numericIdentifier(props.params.wikiId);
    const node = getNode({ id: wikiId, byId: state.sealed.wiki.byId });
    return {
        wikiId: wikiId,
        wiki: node.item,
        loading: node.status.loading
    };
};

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    getWiki: (id: number) => dispatch(getWiki(id))
});

const WikiPage: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(WikiPageComponent);
export default WikiPage;
