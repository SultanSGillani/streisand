import * as React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface ITextInputProps {
    id: string;
    label: string;
    type?: 'text' | 'email' | 'textarea';
    value?: string;
    placeholder?: string;
    setValue: (value: string) => void;
}

export function StringInput(props: ITextInputProps) {
    const id = `${props.id}Input`;
    const type = props.type || 'text';
    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <Input type={type} id={id} value={props.value} placeholder={props.placeholder}
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

export interface IBooleanInputProps {
    id: string;
    label: string;
    value?: boolean;
    setValue: (value: boolean) => void;
}

export function BooleanInput(props: IBooleanInputProps) {
    const id = `${props.id}Input`;

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

export interface IListInputProps {
    id: string;
    label: string;
    value?: string;
    values: string[];
    setValue: (value: string) => void;
}

export function ListInput(props: IListInputProps) {
    const id = `${props.id}Input`;

    const values = props.values.map((value: string) => {
        return <option key={value}>{value}</option>;
    });
    if (!props.value) {
        values.unshift(<option key={`${id}-empty`}></option>);
    }
    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <Input type="select" id={id} value={props.value}
                onChange={(event) => props.setValue(event.target.value)}>
                {values}
            </Input>
        </FormGroup>
    );
}