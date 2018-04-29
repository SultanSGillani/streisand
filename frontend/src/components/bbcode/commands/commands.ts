import ICommandProps from './ICommandProps';
import CommandBarProps from './CommandBarProps';

export function getModeCommand(props: CommandBarProps): ICommandProps {
    if (!props.isPreview) {
        return {
            label: 'Preview',
            title: 'Switch to preview mode',
            onExecute: () => {
                const handle = props.getHandle();
                if (handle) {
                    props.commitContent(handle.getContent());
                    props.toggleMode();
                }
            }
        };
    }

    return {
        label: 'Edit',
        title: 'Switch to edit mode',
        onExecute: () => { props.toggleMode(); }
    };
}

export function getCommandSet(props: CommandBarProps) {
    if (props.isPreview) {
        return [];
    }

    const injectTag = (tag: string, value?: string) => {
        return () => {
            const handle = props.getHandle();
            if (handle) {
                handle.injectTag(tag, value);
            }
        };
    };

    const injectText = (text: string, cursor?: number) => {
        return () => {
            const handle = props.getHandle();
            if (handle) {
                handle.injectText(text, cursor);
            }
        };
    };

    const commands: ICommandProps[] = [
        {
            icon: 'bold',
            title: 'Bold',
            onExecute: injectTag('b')
        }, {
            icon: 'italic',
            title: 'Italic',
            onExecute: injectTag('i')
        }, {
            icon: 'underline',
            title: 'Underline',
            onExecute: injectTag('u')
        }, {
            icon: 'strikethrough',
            title: 'Strikethrough',
            onExecute: injectTag('s')
        }, {
            icon: 'link',
            title: 'Link',
            onExecute: injectTag('url', 'https://example.com')
        }, {
            icon: 'image',
            title: 'Image',
            onExecute: injectTag('img')
        }, {
            icon: 'eye-slash',
            title: 'Hide',
            onExecute: injectTag('hide')
        }, {
            icon: 'quote-left',
            title: 'Quote',
            onExecute: injectTag('quote', 'unitPower')
        }, {
            icon: 'text-height',
            title: 'Text size in pixels',
            onExecute: injectTag('size', '12')
        }, {
            icon: 'paint-brush',
            title: 'Text color',
            onExecute: injectTag('color', '#000000')
        }, {
            icon: 'align-center',
            title: 'Align center',
            onExecute: injectTag('center')
        }, {
            icon: 'align-right',
            title: 'Align right',
            onExecute: injectTag('right')
        }, {
            icon: 'code',
            title: 'Code',
            children: [
                {
                    label: 'Code',
                    onExecute: injectTag('code')
                }, {
                    label: 'Inline code',
                    onExecute: injectTag('code', 'inline')
                }
            ]
        }, {
            icon: 'list',
            title: 'List',
            children: [
                {
                    label: '[*] Unordered list',
                    onExecute: injectText('[list]\n[*] First\n[*] Second\n[/list]', 10)
                }, {
                    label: '[1] Numeric list',
                    onExecute: injectText('[list=1]\n[*] First\n[*] Second\n[/list]', 12)
                }, {
                    label: '[a] Alphabetic list',
                    onExecute: injectText('[list=a]\n[*] First\n[*] Second\n[/list]', 12)
                }, {
                    label: '[A] Alphabetic list',
                    onExecute: injectText('[list=A]\n[*] First\n[*] Second\n[/list]', 12)
                }, {
                    label: '[i] Roman numeral list',
                    onExecute: injectText('[list=i]\n[*] First\n[*] Second\n[/list]', 12)
                }, {
                    label: '[I] Roman numeral list',
                    onExecute: injectText('[list=I]\n[*] First\n[*] Second\n[/list]', 12)
                }
            ]
        }, {
            icon: 'table',
            title: 'Table',
            onExecute: injectText('[table]\n  [thead]\n    [th] First column      [/th]\n    [th] Second column[/th]\n  [/thead]\n  [tbody]\n    [tr]\n      [td] First cell[/td]\n      [td] Second cell[/td]\n    [/tr]\n  [/tbody]\n[/table]', 27)
        }, {
            icon: 'info',
            title: 'BBCode help',
            onExecute: () => {
                console.log('Go to help page');
            }
        }
    ];
    return commands;
}