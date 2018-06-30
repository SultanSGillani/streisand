import * as React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface INumericInputProps {
    id: string;
    label: string;
    value?: number;
    isReadonly?: boolean;
    setValue: (value: number) => void;
}

export function NumericInput(props: INumericInputProps) {
    const id = `${props.id}Input`;
    if (props.isReadonly) {
        return (
            <FormGroup>
                <Label for={id}>{props.label}</Label>
                <Input type="number" id={id} value={props.value} readOnly />
            </FormGroup>
        );
    }
    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <Input type="number" id={id} value={props.value}
                onChange={(event) => props.setValue(Number(event.target.value))} />
        </FormGroup>
    );
}