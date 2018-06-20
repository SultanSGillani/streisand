import { Action } from 'redux';
import * as React from 'react';
import { connect } from 'react-redux';

import { INodeMap } from '../../models/base/ItemSet';
import ILoadingStatus from '../../models/base/ILoadingStatus';
import { numericIdentifier } from '../../utilities/shim';
import { getNode } from '../../utilities/mapping';
import { IDispatch } from '../../actions/ActionTypes';

export interface IItemComponentOptions<T> {
    getId: () => string;
    requestItem: (id: number) => Action;
    byId: INodeMap<T>;
}

export interface IConnectedState<T> {
    item?: T;
    itemId: number;
    status: ILoadingStatus;
}

export interface IConnectedDispatch {
    getItem: (id: number) => void;
}

export interface IItemComponentProps<T> extends IConnectedDispatch, IConnectedState<T> { }
export interface IInnerComponentProps<T> {
    item?: T;
}

export function provideItem<P, T>(options: IItemComponentOptions<T>) {
    return (InnerComponent: React.ComponentClass) => {
        const mapStateToProps = (): IConnectedState<T> => {
            const itemId = numericIdentifier(options.getId());
            const node = getNode<T>({ id: itemId, byId: options.byId });
            return { itemId, item: node.item, status: node.status };
        };

        const mapDispatchToProps = (dispatch: IDispatch): IConnectedDispatch => ({
            getItem: (id: number) => dispatch(options.requestItem(id))
        });

        let component = class extends React.Component<IItemComponentProps<T>> {
            public componentWillMount() {
                if (!this.props.status.loading) {
                    this.props.getItem(this.props.itemId);
                }
            }

            public componentWillReceiveProps(props: IItemComponentProps<T>) {
                const status = props.status;
                const changed = props.itemId !== this.props.itemId;
                const needUpdate = !status.failed && (!status.loaded || status.outdated);
                if (!status.loading && (changed || needUpdate)) {
                    this.props.getItem(props.itemId);
                }
            }

            public render() {
                let { getItem, ...props } = this.props;
                return <InnerComponent {...props} />;
            }
        };

        const ItemComponent: React.ComponentClass<P> =
            connect(mapStateToProps, mapDispatchToProps)(component);
        return ItemComponent;
    };
}