
import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Card, CardTitle, CardText, Button } from 'reactstrap';

export default function StaffTools() {
    return (
        <div>
            <h1>Staff Tools</h1>
            <Row>
                <Col sm="6">
                    <Card body>
                        <CardTitle>Detached torrents</CardTitle>
                        <CardText>
                            There are cases were a torrent can exist without being connected to a film release.
                            The most common way this can happen is if a user does not or is not able to complaete the torrent upload process.
                        </CardText>
                        <LinkContainer to={'/torrents/detached/1'}>
                            <Button>View all detached torrents</Button>
                        </LinkContainer>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card body>
                        <CardTitle>Releases</CardTitle>
                        <CardText>
                            Normally you need to enter a film to see release details.
                            You can use this view to see all releases at what films they belong to.
                        </CardText>
                        <LinkContainer to={'/releases/1'}>
                            <Button>View all releases</Button>
                        </LinkContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
