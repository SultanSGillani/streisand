import * as React from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, CardFooter, Button } from 'reactstrap';

import { IDispatch } from '../../actions/ActionTypes';
import { IForumGroup } from '../../models/forums/IForumGroup';
import { INewForumTopicPayload, createForumTopic } from '../../actions/forums/topics/CreateTopicAction';

export type Props = {
    groups: IForumGroup[];
};

type State = {
    title: string;
    description: string;
    group: number;
};

type ConnectedState = {};

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
            <Card className="border-primary mb-3">
                <CardBody>
                    <CardTitle>Create new forum topic</CardTitle>
                    <Form onKeyPress={createTopic} autoComplete="off">
                        <FormGroup>
                            <Label for="selectGroup">Parent forum group</Label>
                            <Input type="select" id="selectGroup" value={this.state.group}
                                onChange={(event) => this.setState({ group: Number(event.target.value) || 0 })}>
                                {groupOptions}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputTitle">Title</Label>
                            <Input type="text" id="inputTitle" placeholder="Forum topic title"
                                value={this.state.title} onChange={(event) => this.setState({ title: event.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputDescription">Description</Label>
                            <Input type="text" id="inputDescription" placeholder="Forum topic description"
                                value={this.state.description} onChange={(event) => this.setState({ description: event.target.value })} />
                        </FormGroup>
                    </Form>
                </CardBody>
                <CardFooter>
                    <div className="row m-0 justify-content-end">
                        <Button className="col-auto" color="primary" onClick={() => createTopic()}>Create topic</Button>
                    </div>
                </CardFooter>
            </Card >
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
        return false;
    }
}

const mapDispatchToProps = (dispatch: IDispatch): ConnectedDispatch => ({
    createForumTopic: (payload: INewForumTopicPayload) => dispatch(createForumTopic(payload))
});

const ForumTopicCreator: React.ComponentClass<Props> =
    connect(undefined, mapDispatchToProps)(ForumTopicCreatorComponent);
export default ForumTopicCreator;