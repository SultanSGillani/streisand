import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Store from '../../store';
import IFilm from '../../models/IFilm';
import IRelease from '../../models/IRelease';
import { getItem } from '../../utilities/mapping';
import { ScreenSize } from '../../models/IDeviceInfo';

export type Props = {
    page: number;
    release: IRelease;
};

type ConnectedState = {
    film?: IFilm;
    screenSize: ScreenSize;
};

type ConnectedDispatch = {};

type CombinedProps = Props & ConnectedDispatch & ConnectedState;
class ReleaseRowComponent extends React.Component<CombinedProps> {
    public render() {
        const film = this.props.film;
        const release = this.props.release;
        const filmCell = film
            ? <Link to={'/film/' + film.id} title={film.title}>{film.title}</Link>
            : <div>The release is not attached to a film</div>;
        return (
            <tr>
                <td className="align-middle">{filmCell}</td>
                <td className="align-middle">{getInfo(release)}</td>
                <td className="align-middle">{release.releaseGroup} / {release.releaseName}</td>
            </tr>
        );
    }
}

function getInfo(release: IRelease) {
    let name = `${release.codec} / ${release.container} / ${release.sourceMedia} / ${release.resolution}`;
    if (release.is3d) {
        name += ' / 3D';
    }
    if (release.isScene) {
        name += ' / Scene';
    }

    return name;
}

const mapStateToProps = (state: Store.All, props: Props): ConnectedState => {
    return {
        screenSize: state.deviceInfo.screenSize,
        film: getItem({
            id: props.release.film,
            byId: state.sealed.film.byId
        })
    };
};

const ReleaseRow: React.ComponentClass<Props> =
    connect(mapStateToProps)(ReleaseRowComponent);
export default ReleaseRow;