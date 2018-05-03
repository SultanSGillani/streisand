import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';

import Store from '../../store';
import { IForumTopic } from '../../models/forums/IForumTopic';
import { INewForumThreadPayload, createForumThread } from '../../actions/forums/CreateThreadAction';

export type Props = {
    topic: IForumTopic;
};

type State = {
    title: string;
};

type ConnectedState = {};

type ConnectedDispatch = {
    createForumThread: (payload: INewForumThreadPayload) => void;
};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ForumThreadCreatorComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            title: ''
        };
    }

    public render() {
        const createThread = this._createThread.bind(this);
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    Create new forum thread
                </div>
                <div className="panel-body">
                    <form className="form-horizontal" onKeyPress={createThread}>
                        <fieldset>
                            <div className="form-group">
                                <label htmlFor="inputTitle" className="col-lg-2 control-label">Title</label>
                                <div className="col-lg-10">
                                    <input type="text" className="form-control" id="inputTitle" placeholder="Forum thread title"
                                        value={this.state.title} onChange={(event) => this.setState({ title: event.target.value })} />
                                </div>
                            </div>
                        </fieldset>
                    </form>
                    <div style={{ display: 'flex', flexFlow: 'row-reverse' }}>
                        <button className="btn btn-primary" onClick={() => createThread()}>Create thread</button>
                    </div>
                </div>
            </div>
        );
    }

    private _createThread(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this.state.title) {
            this.props.createForumThread({
                topic: this.props.topic.id,
                title: this.state.title
            });
        }
    }
}

const mapDispatchToProps = (dispatch: redux.Dispatch<Store.All>): ConnectedDispatch => ({
    createForumThread: (payload: INewForumThreadPayload) => dispatch(createForumThread(payload))
});

const ForumThreadCreator: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ForumThreadCreatorComponent);
export default ForumThreadCreator;