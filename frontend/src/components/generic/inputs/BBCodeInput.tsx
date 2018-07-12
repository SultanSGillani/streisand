import * as React from 'react';
import { FormGroup, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';

import BBCodeModal from '../../bbcode/BBCodeModal';

export interface ITextInputProps {
    id: string;
    label: string;
    value?: string;
    isReadonly?: boolean;
    placeholder?: string;
    setValue: (value: string) => void;
}

export function BBCodeInput(props: ITextInputProps) {
    const id = `${props.id}Input`;
    const value = props.value || '';

    return (
        <FormGroup>
            <Label for={id}>{props.label}</Label>
            <InputGroup>
                <Input type="text" id={id} value={value} readOnly={props.isReadonly} />
                <InputGroupAddon addonType="append">
                    <BBCodeModal title={props.label} text={value}
                        isReadonly={props.isReadonly} setValue={props.setValue} />
                </InputGroupAddon>
            </InputGroup>
        </FormGroup>
    );
}