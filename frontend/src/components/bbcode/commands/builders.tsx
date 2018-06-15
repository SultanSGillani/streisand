import * as React from 'react';

import ICommandProps from './ICommandProps';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

function getIcon(type: string) {
    return <i className={`fas fa-${type} fa-sm`} />;
}

function MenuItem(props: ICommandProps) {
    return (
        <DropdownItem onClick={props.onExecute}>
            {props.icon && <span style={{ width: '28px', display: 'inline-block' }}>{props.icon && getIcon(props.icon)}</span>}
            {props.label || props.title}
        </DropdownItem>
    );
}

type CommandState = { dropdownOpen: boolean; };
class Command extends React.Component<ICommandProps, CommandState> {
    constructor(props: ICommandProps) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
    }

    public render() {
        const children = this.props.children as ICommandProps[];
        if (children && children.length) {
            const toggle = () => { this.setState({ dropdownOpen: !this.state.dropdownOpen }); };
            const menuItems = children.map((child: ICommandProps) => <MenuItem key={child.label || child.title} {...child} />);
            return (
                <ButtonDropdown size="md" isOpen={this.state.dropdownOpen} toggle={toggle} title={this.props.title}>
                    <DropdownToggle caret>
                        <span>
                            {this.props.icon && getIcon(this.props.icon)}
                            {this.props.label}
                        </span>
                    </DropdownToggle>
                    <DropdownMenu>
                        {menuItems}
                    </DropdownMenu>
                </ButtonDropdown>
            );
        } else {
            return (
                <Button color="secondary" size="md" title={this.props.title} onClick={this.props.onExecute}>
                    {this.props.icon && getIcon(this.props.icon)}
                    {this.props.label}
                </Button>
            );
        }
    }
}

function buildCommand(props: ICommandProps, asMenuItems?: boolean): JSX.Element[] {
    if (asMenuItems && props.children) {
        // We don't have support for submenus at this time,
        // so we either need to flatten the tree of commands
        if (props.expand) {
            return props.children.map((child: ICommandProps) => {
                const childProps = {
                    ...{
                        icon: props.icon
                    },
                    ...child
                };
                return buildCommand(childProps, asMenuItems)[0];
            });
        }

        // or we just show the first child
        const first = props.children[0];
        const combinedProps: ICommandProps = {
            icon: props.icon,
            label: props.label,
            title: props.title,
            onExecute: first.onExecute
        };
        return [<MenuItem key={combinedProps.label || combinedProps.title} {...combinedProps} />];
    }
    return [asMenuItems ?
        <MenuItem key={props.label || props.title} {...props} /> :
        <Command key={props.label || props.title} {...props} />
    ];
}

export function buildCommands(commandProps: ICommandProps[], asMenuItems?: boolean): JSX.Element[] {
    let commands: JSX.Element[] = [];
    for (const props of commandProps) {
        commands = [...commands, ...buildCommand(props, asMenuItems)];
    }
    return commands;
}
