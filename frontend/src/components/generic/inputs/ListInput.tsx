import * as React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface IListInputProps {
    id: string;
    label: string;
    value?: string;
    values: string[];
    isReadonly?: boolean;
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

    if (props.isReadonly) {
        return (
            <FormGroup>
                <Label for={id}>{props.label}</Label>
                <Input type="select" id={id} value={props.value} readOnly>
                    {values}
                </Input>
            </FormGroup>
        );
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