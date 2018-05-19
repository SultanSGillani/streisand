import * as React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface ITextInputProps {
    id: string;
    label: string;
    value?: string;
    placeholder?: string;
    setValue: (value: string) => void;
}

export function TextInput(props: ITextInputProps) {
    const id = `${props.id}Input`;
    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <Input type="text" id={id} value={props.value} placeholder={props.placeholder}
                onChange={(event) => props.setValue(event.target.value)} />
        </FormGroup>
    );
}

export interface INumericInputProps {
    id: string;
    label: string;
    value?: number;
    setValue: (value: number) => void;
}

export function NumericInput(props: INumericInputProps) {
    const id = `${props.id}Input`;
    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <Input type="number" id={id} value={props.value}
                onChange={(event) => props.setValue(Number(event.target.value))} />
        </FormGroup>
    );
}