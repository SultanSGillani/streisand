import * as React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';

import TextView from '../../bbcode/TextView';
import IRelease from '../../../models/IRelease';

export interface IGeneralContentProps {
    release: IRelease;
}

export default function ReleaseContent(props: IGeneralContentProps) {
    const { release } = props;
    return (
        <>
            <Card body className="my-1">
                <CardTitle>Release Information</CardTitle>
                <CardText>{release.releaseGroup} / {release.releaseName}</CardText>
                <TextView content={release.description} />
            </Card>
        </>
    );
}