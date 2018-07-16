import * as React from 'react';

export interface IAwesomeIconProps {
    type: string;
    size?: 'xs' | 'sm' | 'lg' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
}

export default function AwesomeIcon(props: IAwesomeIconProps) {
    const size = props.size || 'sm';
    return <i className={`fas fa-${props.type} fa-${size}`} />;
}