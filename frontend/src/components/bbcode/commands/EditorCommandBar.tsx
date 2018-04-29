import * as React from 'react';
import { connect } from 'react-redux';
import { DropdownButton } from 'react-bootstrap';

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

type ConnectedState = {
    screenSize: ScreenSize;
};

type CombinedProps = Props & ConnectedState;
class EditorCommandBarComponent extends React.Component<CombinedProps> {
    public render() {
        const primary = buildCommands([
            getModeCommand(this.props)
        ]);

        const collapse = this.props.screenSize <= ScreenSize.medium;
        const secondaryCommands = buildCommands(getCommandSet(this.props), collapse);
        const secondary = !collapse ? secondaryCommands : (
            <DropdownButton title="BBCode Tools" bsSize="small" id="editor-tools-dropdown">
                {secondaryCommands}
            </DropdownButton>
        );
        return (
            <div style={{ display: 'flex', marginBottom: '4px' }}>
                <div className="btn-toolbar" style={{ marginRight: '20px' }}>
                    {primary}
                </div>
                <div className="btn-toolbar">
                    {secondary}
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state: Store.All): ConnectedState => ({
    screenSize: state.deviceInfo.screenSize
});

const EditorCommandBar: React.ComponentClass<Props> =
    connect(mapStateToProps)(EditorCommandBarComponent);
export default EditorCommandBar;