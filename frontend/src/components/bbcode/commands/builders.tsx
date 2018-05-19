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
                <ButtonDropdown color="secondary" size="md" isOpen={this.state.dropdownOpen} toggle={toggle}>
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

export function buildCommands(commands: ICommandProps[], asMenuItems?: boolean) {
    return commands.map((props: ICommandProps) => {
        if (asMenuItems && props.children) {
            // We don't have support for submenus at this time,
            // so we need to flatten the tree of commands by using only the first command
            const first = props.children[0];
            const combinedProps: ICommandProps = {
                icon: props.icon,
                label: props.label,
                title: props.title,
                onExecute: first.onExecute
            };
            return <MenuItem {...combinedProps} />
        }
        return asMenuItems ? <MenuItem {...props} /> : <Command key={props.label || props.title} {...props} />;
    });
}
