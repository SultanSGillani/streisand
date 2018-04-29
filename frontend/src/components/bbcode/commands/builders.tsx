import * as React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import ICommandProps from './ICommandProps';

function getIcon(type: string) {
    const className = `fa fa-${type}`;
    return <i className={className} style={{ fontSize: '14px' }} />;
}

function getMenuItem(props: ICommandProps, includeBuffer: boolean) {
    const style = includeBuffer ? {
        width: '28px',
        display: 'inline-block'
    } : undefined;
    return (
        <MenuItem key={props.title} onClick={props.onExecute}>
            <span style={style}>{props.icon && getIcon(props.icon)}</span>
            {props.label || props.title}
        </MenuItem>
    );
}

function getCommand(props: ICommandProps) {
    if (props.children) {
        const contents = (
            <span style={{ marginRight: '4px' }}>
                {props.icon && getIcon(props.icon)}
                {props.label}
            </span>
        ) as any;
        const menuItems = props.children.map((child: ICommandProps) => getMenuItem(child, false));
        return (
            <DropdownButton title={contents} bsSize="small" id={`editor-${props.title}-dropdown`}>
                {menuItems}
            </DropdownButton>
        );
    }
    return <button type="button" className="btn btn-sm btn-default" title={props.title} onClick={props.onExecute}>
        {props.icon && getIcon(props.icon)}
        {props.label}
    </button>;
}

export function buildCommands(commands: ICommandProps[], asMenuItems?: boolean) {
    return commands.map((props: ICommandProps) => {
        if (asMenuItems && props.children) {
            // We don't have support for submenus at this time,
            // so we need to flatten the tree of commands by using only the first command
            const first = props.children[0];
            return getMenuItem({
                icon: props.icon,
                label: props.label || props.title,
                onExecute: first.onExecute
            }, true);
        }
        return asMenuItems ? getMenuItem(props, true) : getCommand(props);
    });
}
