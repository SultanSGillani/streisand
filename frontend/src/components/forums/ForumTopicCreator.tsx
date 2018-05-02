import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import { IForumGroup } from '../../models/forums/IForumGroup';
import { INewForumTopicPayload, createForumTopic } from '../../actions/forums/CreateTopicAction';

export type Props = {
    groups: IForumGroup[];
};

type State = {
    title: string;
    description: string;
    group: number;
};

type ConnectedState = { };

type ConnectedDispatch = {
    createForumTopic: (payload: INewForumTopicPayload) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumTopicCreatorComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            title: '',
            description: '',
            // We make an assumption here that there is always at least one group
            // otherwise this control should not be shown.
            group: props.groups[0].id
        };
    }

    public render() {
        const createTopic = this._createTopic.bind(this);
        const groupOptions = this.props.groups.map((group: IForumGroup) => {
            return <option value={group.id} key={group.id}>{group.title}</option>;
        });
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    Create new forum topic
                </div>
                <div className="panel-body">
                    <form className="form-horizontal" onKeyPress={createTopic}>
                        <fieldset>
                            <div className="form-group">
                                <label htmlFor="selectGroup" className="col-lg-2 control-label">Parent forum group</label>
                                <div className="col-lg-10">
                                    <select className="form-control" id="selectGroup" value={this.state.group}
                                        onChange={(event) => this.setState({ group: Number(event.target.value) || 0 })}>
                                        {groupOptions}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputTitle" className="col-lg-2 control-label">Title</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="inputTitle" placeholder="Forum topic title"
                                        value={this.state.title} onChange={(event) => this.setState({ title: event.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputDescription" className="col-lg-2 control-label">Description</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="inputDescription" placeholder="Forum topic description"
                                        value={this.state.description} onChange={(event) => this.setState({ description: event.target.value })} />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                    <button className="btn btn-primary" onClick={() => createTopic()}>Create topic</button>
                </div>
            </div>
        );
    }

    private _createTopic(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this.state.title && this.state.description) {
            this.props.createForumTopic({
                group: this.state.group,
                title: this.state.title,
                description: this.state.description
            });
        }
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    createForumTopic: (payload: INewForumTopicPayload) => dispatch(createForumTopic(payload))
});

const ForumTopicCreator: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ForumTopicCreatorComponent);
export default ForumTopicCreator;