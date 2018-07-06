import * as React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

export interface ITextInputProps {
    id: string;
    label: string;
    value?: string;
    isReadonly?: boolean;
    placeholder?: string;
    setValue: (value: string) => void;
    type?: 'text' | 'email' | 'textarea';
}

export function StringInput(props: ITextInputProps) {
    const id = `${props.id}Input`;
    const type = props.type || 'text';
    const value = props.value || ''

    if (props.isReadonly) {
        if (props.type === 'textarea') {
            return (
                <FormGroup>
                    <Label for={id}>{props.label}</Label>
                    <textarea id={id} value={value} className="form-control" readOnly rows={4} />
                </FormGroup>
            );
        }
        return (
            <FormGroup>
                <Label for={id}>{props.label}</Label>
                <Input type={type} id={id} value={value} readOnly/>
            </FormGroup>
        );
    }

    if (props.type === 'textarea') {
        return (
            <FormGroup>
                <Label for={id}>{props.label}</Label>
                <textarea id={id} value={value} className="form-control"
                    placeholder={props.placeholder} rows={4}
                    onChange={(event) => props.setValue(event.target.value)} />
            </FormGroup>
        );
    }

    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <Input type={type} id={id} value={value} placeholder={props.placeholder}
                onChange={(event) => props.setValue(event.target.value)} />
        </FormGroup>
    );
}