import * as React from 'react';

export const enum BannerType {
    warning,
    error,
    info,
    success
}

export interface IBannerProps {
    type: BannerType;
    onClose?: () => void;
}

const TYPES = {
    [BannerType.warning]: 'alert-warning',
    [BannerType.error]: 'alert-danger',
    [BannerType.info]: 'alert-info',
    [BannerType.success]: 'alert-success'
};

export default class Banner extends React.Component<IBannerProps> {
    public render() {
        let classes = `alert ${TYPES[this.props.type]}`;
        let button;
        if (this.props.onClose) {
            classes += ' alert-dismissible';
            button = <button type="button" className="close" onClick={this.props.onClose}>×</button>;
        }
        return (
            <div className={classes}>
                {button}
                {this.props.children}
            </div>
        );
    }
}