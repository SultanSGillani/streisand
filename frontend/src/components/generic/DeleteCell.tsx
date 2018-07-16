import * as React from 'react';
import { Button } from 'reactstrap';

import AwesomeIcon from './AwesomeIcon';

export type Props = {
    onDelete: () => void;
};

export default function DeleteCell(props: Props) {
    return (
        <td>
            <div className="row m-0 justify-content-end">
                <Button className="col-auto" size="sm" color="danger" onClick={props.onDelete} title="Delete">
                    <AwesomeIcon type="trash-alt" size="lg" />
                </Button>
            </div>
        </td>
    );
}