import * as React from 'react';
import { connect } from 'react-redux';
import { ButtonToolbar, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import Store from '../../../store';
import { ITextEditorHandle } from '../TextEditor';
import { ScreenSize } from '../../../models/IDeviceInfo';
import { buildCommands } from './builders';
import { getCommandSet, getModeCommand } from './commands';

type Props = {
    isPreview: boolean;
    toggleMode: () => void;
    getHandle: () => ITextEditorHandle;
    commitContent: (content: string) => void;
};

type State = {
    dropdownOpen: boolean;
};

type ConnectedState = {
    screenSize: ScreenSize;
};

type CombinedProps = Props & ConnectedState;
class EditorCommandBarComponent extends React.Component<CombinedProps, State> {
    constructor(props: CombinedProps) {
        super(props);

        this.state = {
            dropdownOpen: false
        };
    }

    public render() {
        const primary = buildCommands([
            getModeCommand(this.props)
        ]);

        const collapse = this.props.screenSize <= ScreenSize.medium;
        const secondaryCommands = buildCommands(getCommandSet(this.props), collapse);
        const toggle = () => { this.setState({ dropdownOpen: !this.state.dropdownOpen }); };
        const secondary = !collapse ? secondaryCommands : (
            <ButtonDropdown color="secondary" size="md" isOpen={this.state.dropdownOpen} toggle={toggle}>
                <DropdownToggle caret>BBCode Tools</DropdownToggle>
                <DropdownMenu>
                    {secondaryCommands}
                </DropdownMenu>
            </ButtonDropdown>
        );
        return (
            <ButtonToolbar className="mb-2">
                <ButtonGroup className="mr-2">
                    {primary}
                </ButtonGroup>
                <ButtonGroup>
                    {secondary}
                </ButtonGroup>
            </ButtonToolbar>
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const EditorCommandBar: React.ComponentClass<Props> =
    connect(mapStateToProps)(EditorCommandBarComponent);
export default EditorCommandBar;