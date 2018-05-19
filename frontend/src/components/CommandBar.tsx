import * as React from 'react';
import { Card, CardBody, ButtonToolbar, Button } from 'reactstrap';

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
        const status = command.status ? command.status : 'secondary';
        return (
            <Button className="mx-1" size="md" key={command.label} color={status} disabled={command.disabled} onClick={command.onExecute}>
                {command.label}
            </Button>
        );
    });
    return (
        <Card className="my-2">
            <CardBody className="p-1">
                <ButtonToolbar className="justify-content-center">
                    {commands}
                </ButtonToolbar>
            </CardBody>
        </Card>
    );
}

export default CommandBar;