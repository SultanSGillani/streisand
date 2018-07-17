import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../state/store';
import IWiki from '../../models/IWiki';
import DeleteCell from '../generic/DeleteCell';
import { ScreenSize } from '../../models/IDeviceInfo';
import { IDispatch } from '../../state/actions/ActionTypes';
import { IActionProps, deleteWiki } from '../../state/wiki/actions/DeleteWikiAction';

export type Props = {
    wiki: IWiki;
    page: number;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type ConnectedDispatch = {
    deleteWiki: (props: IActionProps) => void;
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
        const full = this.props.screenSize > ScreenSize.small || undefined;
        return (
            <tr>
                <td className="align-middle">
                    <Link to={'/wiki/' + wiki.id} title={wiki.title}>{wiki.title}</Link>
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
    deleteWiki: (props: IActionProps) => dispatch(deleteWiki(props))
});

const WikiRow: React.ComponentClass<Props> =
    connect(mapStateToProps, mapDispatchToProps)(WikiRowComponent);
export default WikiRow;