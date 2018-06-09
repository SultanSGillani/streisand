import * as React from 'react';

import IUser from '../../models/IUser';

export type Props = {
    user?: IUser;
};

// TODO get offical default avatar
const defaultAvatar = 'https://i.imgur.com/2Gi9kAm.png';
export default function Avatar(props: Props) {
    const url = (props.user && props.user.details && props.user.details.avatarUrl) || defaultAvatar;
    return (
        <div>
            <img src={url} width="150" onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
                const element: HTMLImageElement = event.target as HTMLImageElement;
                if (element.src !== defaultAvatar) {
                    element.src = defaultAvatar;
                }
            }} />
        </div>
    );
}