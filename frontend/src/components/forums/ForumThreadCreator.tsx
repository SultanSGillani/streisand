import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, CardFooter, Button } from 'reactstrap';

import { IDispatch } from '../../actions/ActionTypes';
import { IForumTopic } from '../../models/forums/IForumTopic';
import { INewForumThreadPayload, createForumThread } from '../../actions/forums/threads/CreateThreadAction';

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
            <Card color="primary" className="mb-3">
                <CardBody>
                    <CardTitle>Create new forum thread</CardTitle>
                    <Form onKeyPress={createThread} autoComplete="off">
                        <FormGroup>
                            <Label for="inputTitle">Title</Label>
                            <Input type="text" id="inputTitle" placeholder="Forum thread title"
                                value={this.state.title} onChange={(event) => this.setState({ title: event.target.value })} />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={() => createThread()}>Create thread</Button>
                    </div>
                </CardFooter>
            </Card >
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
        return false;
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createForumThread: (payload: INewForumThreadPayload) => dispatch(createForumThread(payload))
});

const ForumThreadCreator: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ForumThreadCreatorComponent);
export default ForumThreadCreator;