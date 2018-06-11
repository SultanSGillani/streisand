import { ITextEditorHandle } from '../TextEditor';

type CommandBarProps = {
    isPreview: boolean;
    toggleHelp: () => void;
    toggleMode: () => void;
    getHandle: () => ITextEditorHandle;
    commitContent: (content: string) => void;
};

export default CommandBarProps;