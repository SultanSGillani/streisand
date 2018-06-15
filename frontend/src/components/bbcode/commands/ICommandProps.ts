interface ICommandProps {
    icon?: string;
    label?: string;
    title?: string;
    expand?: boolean;
    children?: ICommandProps[];
    onExecute?: () => void;
}

export default ICommandProps;