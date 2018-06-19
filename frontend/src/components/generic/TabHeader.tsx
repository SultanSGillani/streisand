import * as React from 'react';
import { NavItem, NavLink } from 'reactstrap';

export interface ITabHeaderProps {
    id: string;
    title: string;
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export default function TabHeader(props: ITabHeaderProps) {
    const classes = props.activeTab === props.id ? 'active' : '';
    const onClick = () => { props.setActiveTab(props.id); };
    return (
        <NavItem key={props.id}>
            <NavLink className={classes} onClick={onClick} href={`#${props.id}`}>
                {props.title}
            </NavLink>
        </NavItem>
    );
}