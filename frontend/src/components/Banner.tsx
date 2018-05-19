import * as React from 'react';
import { Alert } from 'reactstrap';

export interface IBannerProps {
    type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    children?: React.ReactNode;
    onClose?: () => void;
}

export default function Banner(props: IBannerProps) {
    return (
        <Alert color={props.type} toggle={props.onClose}>
            {props.children}
        </Alert>
    );
}