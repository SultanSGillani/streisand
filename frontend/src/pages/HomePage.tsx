import * as React from 'react';

import globals from '../utilities/globals';
import LatestNews from '../components/LatestNews';
import { makeRequest } from '../utilities/Requestor';

export default function HomePage() {
    return (
        <div>
            <LatestNews />
            <input className="mt-3" type="file" accept=".torrent" onChange={(event) => {
                if (event.target.files && event.target.files.length) {
                    const file = event.target.files[0];
                    makeRequest({
                        url: `${globals.baseUrl}/torrent-upload/`,
                        method: 'POST',
                        headers: {
                            'Authorization': 'Token ' + localStorage['jumpcut.token']
                        },
                        data: file
                    });
                }
            }}/>
        </div>
    );
}