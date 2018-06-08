import * as React from 'react';
import { Card, CardBody } from 'reactstrap';

export default function Loading() {
    return (
        <Card className="text-center">
            <CardBody>
                <h5 className="mb-0">Loading...</h5>
            </CardBody>
        </Card>
    );
}