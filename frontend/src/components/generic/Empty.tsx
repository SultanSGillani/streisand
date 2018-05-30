import * as React from 'react';
import { Card, CardBody } from 'reactstrap';

export default function Empty() {
    return (
        <Card className="text-center">
            <CardBody>
                <h5 className="mb-0">Nothing found</h5>
            </CardBody>
        </Card>
    );
}