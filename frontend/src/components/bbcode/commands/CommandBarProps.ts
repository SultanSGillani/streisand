import { ITextEditorHandle } from '../TextEditor';

type CommandBarProps = {
    isPreview: boolean;
    toggleMode: () => void;
    getHandle: () => ITextEditorHandle;
    commitContent: (content: string) => void;
};

export default CommandBarProps;