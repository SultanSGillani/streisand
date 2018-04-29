interface ICommandProps {
    icon?: string;
    label?: string;
    title?: string;
    children?: ICommandProps[];
    onExecute?: () => void;
}

export default ICommandProps;