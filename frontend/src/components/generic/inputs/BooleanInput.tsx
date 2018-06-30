import * as React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface IBooleanInputProps {
    id: string;
    label: string;
    value?: boolean;
    isReadonly?: boolean;
    setValue: (value: boolean) => void;
}

export function BooleanInput(props: IBooleanInputProps) {
    const id = `${props.id}Input`;
    if (props.isReadonly) {
        return (
            <FormGroup check inline>
                <Label for={id} check>
                    <Input type="checkbox" id={id} checked={props.value} readOnly />
                    {props.label}
                </Label>
            </FormGroup>
        );
    }
    return (
        <FormGroup check inline>
            <Label for={id} check>
                <Input type="checkbox" id={id} checked={props.value}
                    onChange={(event) => props.setValue(event.target.checked)} />
                {props.label}
            </Label>
        </FormGroup>
    );
}