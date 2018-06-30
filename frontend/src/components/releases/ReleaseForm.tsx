import * as React from 'react';
import { Form, Card, CardBody, CardFooter, Button } from 'reactstrap';

import IMediaTypes from '../../models/IMediaTypes';
import { ListInput } from '../generic/inputs/ListInput';
import { StringInput } from '../generic/inputs/StringInput';
import { BooleanInput } from '../generic/inputs/BooleanInput';

export interface IReleaseFormData {
    description: string;
    cut: string;
    codec: string;
    container: string;
    resolution: string;
    sourceMedia: string;
    isScene: boolean;
    isSource: boolean;
    is3d: boolean;
    nfo: string;
    releaseGroup: string;
    releaseName: string;
}

export type Props = {
    processing?: boolean;
    mediaTypes: IMediaTypes;
    intialValues?: IReleaseFormData;
    onSubmit?: (data: IReleaseFormData) => void;
};

type State = IReleaseFormData;

function getDefaultValues() {
    return {
        description: '',
        cut: 'Theatrical',
        codec: '',
        container: '',
        resolution: '',
        sourceMedia: '',
        isScene: false,
        isSource: false,
        is3d: false,
        nfo: '',
        releaseGroup: '',
        releaseName: ''
    };
}

export default class ReleaseForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = props.intialValues || getDefaultValues();
    }

    public render() {
        const canSubmit = this._canSubmit();
        const onSubmit = this._submit.bind(this);
        const isReadonly = !this.props.onSubmit;
        const isCreating = !this.props.intialValues;
        const buttonText = this.props.processing
            ? (isCreating ? 'creating release...' : 'updating release...')
            : (isCreating ? 'Create' : 'Update');
        const footer = isReadonly ? undefined : (
            <CardFooter>
                <div className="row m-0 justify-content-end">
                    <Button className="col-auto" color="primary" disabled={!canSubmit} onClick={() => onSubmit()}>{buttonText}</Button>
                </div>
            </CardFooter>
        );
        return (
            <Card>
                <CardBody>
                    <Form onKeyPress={onSubmit} autoComplete="off">
                        <StringInput id="releaseGroup" label="Release group" isReadonly={isReadonly}
                            placeholder="Film release group" value={this.state.releaseGroup}
                            setValue={(value: string) => this.setState({ releaseGroup: value })} />
                        <StringInput id="releaseName" label="Release name" isReadonly={isReadonly}
                            placeholder="Film release name" value={this.state.releaseName}
                            setValue={(value: string) => this.setState({ releaseName: value })} />
                        <StringInput id="description" label="Description" isReadonly={isReadonly}
                            placeholder="Film release description" value={this.state.description}
                            setValue={(value: string) => this.setState({ description: value })} />
                        <StringInput id="cut" label="Cut" placeholder="Film release cut"
                            isReadonly={isReadonly} value={this.state.cut}
                            setValue={(value: string) => this.setState({ cut: value })} />
                        <ListInput id="codec" label="Codec" value={this.state.codec}
                            values={this.props.mediaTypes.codecs} isReadonly={isReadonly}
                            setValue={(value: string) => this.setState({ codec: value })} />
                        <ListInput id="container" label="Container" value={this.state.container}
                            values={this.props.mediaTypes.containers} isReadonly={isReadonly}
                            setValue={(value: string) => this.setState({ container: value })} />
                        <ListInput id="resolution" label="Resolution" value={this.state.resolution}
                            values={this.props.mediaTypes.resolutions} isReadonly={isReadonly}
                            setValue={(value: string) => this.setState({ resolution: value })} />
                        <ListInput id="sourceMedia" label="Source media" value={this.state.sourceMedia}
                            values={this.props.mediaTypes.sourceMedia} isReadonly={isReadonly}
                            setValue={(value: string) => this.setState({ sourceMedia: value })} />
                        <StringInput type="textarea" id="nfo" label="NFO" isReadonly={isReadonly}
                            placeholder="Film release nfo" value={this.state.nfo}
                            setValue={(value: string) => this.setState({ nfo: value })} />
                        <BooleanInput id="isScene" label="Scene"
                            value={this.state.isScene} isReadonly={isReadonly}
                            setValue={(value: boolean) => this.setState({ isScene: value })} />
                        <BooleanInput id="isSource" label="Source"
                            value={this.state.isSource} isReadonly={isReadonly}
                            setValue={(value: boolean) => this.setState({ isSource: value })} />
                        <BooleanInput id="is3d" label="3D"
                            value={this.state.is3d} isReadonly={isReadonly}
                            setValue={(value: boolean) => this.setState({ is3d: value })} />
                    </Form>
                </CardBody>
                { footer }
            </Card>
        );
    }

    private _canSubmit(): boolean {
        const {
            description,
            cut,
            codec,
            container,
            resolution,
            sourceMedia,
            nfo,
            releaseGroup,
            releaseName
        } = this.state;
        return !!(description && cut && codec && container
            && resolution && sourceMedia && nfo && releaseGroup && releaseName);
    }

    private _submit(event?: React.KeyboardEvent<HTMLElement>) {
        if (event && event.key !== 'Enter') {
            return;
        }

        if (this._canSubmit() && this.props.onSubmit) {
            this.props.onSubmit(this.state);
        }

        return false;
    }
}