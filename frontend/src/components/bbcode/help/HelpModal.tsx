import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import { helpText } from './helpText';
import TextView from '../TextView';

export interface IHelpModalProps {
    toggle: () => void;
    isOpen: boolean;
}

export default function HelpModal(props: IHelpModalProps) {
    const { isOpen, toggle } = props;
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>BBCode Help</ModalHeader>
            <ModalBody>
                <TextView content={helpText} />
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
    );
}