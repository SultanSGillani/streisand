import * as React from 'react';
import { Button } from 'reactstrap';

export type Props = {
    onDelete: () => void;
};

export default function DeleteCell(props: Props) {
    return (
        <td>
            <div className="row m-0 justify-content-end">
                <Button className="col-auto" size="sm" color="danger" onClick={props.onDelete} title="Delete">
                    <i className="fas fa-trash-alt fa-lg" />
                </Button>
            </div>
        </td>
    );
}