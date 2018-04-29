import * as React from 'react';

export interface ICommand {
    label: string;
    disabled?: boolean;
    status?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
    onExecute?: () => void;
}

export type Props = {
    commands: ICommand[];
};

function CommandBar(props: Props) {
    const commands = props.commands.map((command: ICommand) => {
        const status = command.disabled ? 'disabled' : command.status ? `btn-${command.status}` : 'btn-default';
        const classes = `btn btn-sm ${status}`;
        return <button type="button" className={classes} onClick={command.onExecute}>{command.label}</button>;
    });
    return (
        <div className="well well-sm text-center">
            <div className="btn-toolbar" style={{ justifyContent: 'center', display: 'flex'}}>
                {commands}
            </div>
        </div>
    );
}

export default CommandBar;