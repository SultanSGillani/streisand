import * as React from 'react';

interface ITheme {
    name: string;
    url: string;
}

const THEMES: ITheme[] = [
    { name: 'Cerulean', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cerulean/bootstrap.min.css'},
    { name: 'Cosmo', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cosmo/bootstrap.min.css' },
    { name: 'Cyborg', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cyborg/bootstrap.min.css' },
    { name: 'Darkly', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/darkly/bootstrap.min.css' },
    { name: 'Flatly', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/flatly/bootstrap.min.css' },
    { name: 'Journal', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/journal/bootstrap.min.css' },
    { name: 'Lumen', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/lumen/bootstrap.min.css' },
    { name: 'Paper', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/paper/bootstrap.min.css' },
    { name: 'Readable', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/readable/bootstrap.min.css' },
    { name: 'Sandstone', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/sandstone/bootstrap.min.css' },
    { name: 'Simplex', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/simplex/bootstrap.min.css' },
    { name: 'Slate', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/slate/bootstrap.min.css' },
    { name: 'Solar', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/solar/bootstrap.min.css' },
    { name: 'Spacelab', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/spacelab/bootstrap.min.css' },
    { name: 'Superhero', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/superhero/bootstrap.min.css' },
    { name: 'United', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/united/bootstrap.min.css' },
    { name: 'Yeti', url: 'https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css' }
];

type State = {
    theme: string;
};

export type Props = {};
class Themes extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            theme: getTheme()
        };
    }

    public render() {
        const current = this.state.theme;
        const items = THEMES.map((theme: ITheme) => {
            const changeTheme = () => { this._changeTheme(theme.url); };
            const classes = 'list-group-item' + (current === theme.url ? ' active' : '');
            return (<a href="#" className={classes} onClick={changeTheme} key={theme.name}>{theme.name}</a>);
        });
        return (
            <div className="list-group">
                {items}
            </div>
        );
    }

    private _changeTheme(url: string) {
        const link = document.querySelector('#theme');
        if (link) {
            link['href'] = url;
        }
        this.setState({ theme: url });
        if (typeof localStorage !== 'undefined') {
            localStorage['jumpcut.theme.url'] = url;
        }
    }
}

function getTheme(): string {
    var defaultTheme = window['__defaultTheme'];
    return (typeof localStorage !== 'undefined' && localStorage['jumpcut.theme.url']) || defaultTheme;
}

export default Themes;