import * as React from 'react';

import { getSize } from '../../utilities/dataSize';

type Props = {
    size: number;
};

export default function DataSize(props: Props) {
    const size = getSize(props.size);
    return (
        <span>{size}</span>
    );
}