import * as React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

interface ITheme {
    name: string;
    key: string;
}

const THEMES: ITheme[] = [
    { name: 'Cerulean', key: 'cerulean'},
    { name: 'Cosmo', key: 'cosmo' },
    { name: 'Cyborg', key: 'cyborg' },
    { name: 'Darkly', key: 'darkly' },
    { name: 'Flatly', key: 'flatly' },
    { name: 'Journal', key: 'journal' },
    { name: 'Litera', key: 'litera' },
    { name: 'Lumen', key: 'lumen' },
    { name: 'Lux', key: 'lux' },
    { name: 'Materia', key: 'materia' },
    { name: 'Minty', key: 'minty' },
    { name: 'Pulse', key: 'pulse' },
    { name: 'Sandstone', key: 'sandstone' },
    { name: 'Simplex', key: 'simplex' },
    { name: 'Sketchy', key: 'sketchy' },
    { name: 'Slate', key: 'slate' },
    { name: 'Solar', key: 'solar' },
    { name: 'Spacelab', key: 'spacelab' },
    { name: 'Superhero', key: 'superhero' },
    { name: 'United', key: 'united' },
    { name: 'Yeti', key: 'yeti' }
];

type State = {
    theme: string;
};

export type Props = {};
class Themes extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            theme: getThemeUrl()
        };
    }

    public render() {
        const current = this.state.theme;
        const items = THEMES.map((theme: ITheme) => {
            const changeTheme = () => { this._changeTheme(theme.key); };
            return (<ListGroupItem tag="button" active={current === theme.key} onClick={changeTheme} key={theme.name} action>{theme.name}</ListGroupItem>);
        });
        return (
            <ListGroup>
                {items}
            </ListGroup>
        );
    }

    private _changeTheme(themeKey: string) {
        const link = document.querySelector('#theme');
        if (link) {
            link['href'] = getThemeUrl(themeKey);
        }
        this.setState({ theme: themeKey });
        if (typeof localStorage !== 'undefined') {
            localStorage['app.theme.key'] = themeKey;
        }
    }
}

function getThemeUrl(themeKey?: string): string {
    const key = themeKey || (typeof localStorage !== 'undefined' && localStorage['app.theme.key']) || 'darkly';
    return `https://stackpath.bootstrapcdn.com/bootswatch/4.1.1/${key}/bootstrap.min.css`;
}

export default Themes;