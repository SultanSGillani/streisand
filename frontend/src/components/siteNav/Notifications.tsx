import * as React from 'react';
import { Button, Badge, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

import AwesomeIcon from '../generic/AwesomeIcon';

export default class Notifications extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            popoverOpen: false
        };
    }

    public toggle() {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }

    public render() {
        return (
            <>
                <Button id="Popover1" color="primary" onClick={this.toggle}>
                    <AwesomeIcon type="bell" /> <Badge color="primary">500</Badge>
                </Button>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
                    <PopoverHeader>Popover Titleq wdpo mqwpdomqwdpo mqwpdo mqwpdom qpwdomqwpdom qpwodmqpwodmqpwomdqpwodm qpwomd qpwomd qpwodm pqowmd qpowmd q</PopoverHeader>
                    <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.owe inwoeifn weoifn woeinfoweinfwoein fowienf owinefoi wenfoiwn eoiwfn oinweoinw oinfw oinw eoinwe oinweoinweo inwe oinwe in</PopoverBody>
                </Popover>
            </>
        );
    }
}
