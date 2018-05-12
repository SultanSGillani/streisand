import * as React from 'react';

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
        <div className="form-group">
            <label htmlFor={id} className="col-lg-2 control-label">{props.label}</label>
            <div className="col-lg-10">
                <input type="text" className="form-control" id={id} placeholder={props.placeholder}
                    value={props.value} onChange={(event) => props.setValue(event.target.value)} />
            </div>
        </div>
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
        <div className="form-group">
            <label htmlFor={id} className="col-lg-2 control-label">{props.label}</label>
            <div className="col-lg-10">
                <input type="number" className="form-control" id={id}
                    value={props.value} onChange={(event) => props.setValue(Number(event.target.value))} />
            </div>
        </div>
    );
}