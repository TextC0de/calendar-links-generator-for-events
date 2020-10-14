import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ReactGA, { GAevent } from 'react-ga';
import { google, outlook, office365, yahoo, ics } from 'calendar-link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import DateTimePicker from 'react-datetime-picker';
import { reducer, initialState, actions } from '../reducers/form';
import CalendarLink from '../components/CalendarLink';

const LinksSection = styled.section`
    ${CalendarLink}:not(:last-child) {
        margin-bottom: 1.5rem;
    }
`;

const IndexPage = () => {
    const [icsLink, setIcsLink] = useState();
    const [creatingIcs, setCreatingIcs] = useState(false);
    const [icsWasCreated, setIcsWasCreated] = useState(false);
    const [icsCreationError, setIcsCreationError] = useState(null);
    const [startDate, onStartDateChange] = useState(new Date());
    const [endDate, onEndDateChange] = useState(new Date());
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        ReactGA.initialize(`${process.env.ANALITYCS_ID}`);
        ReactGA.pageview('calendar-links-generator');
    }, []);

    const formIsValid = () =>
        state.title &&
        state.description &&
        state.location &&
        ((!state.allDay && startDate <= endDate) || state.allDay);

    const onTextFieldChange = (event) => {
        event.preventDefault();
        dispatch(actions.onTextFieldChange(event.target.id, event.target.value));
        dispatch(actions.onFieldChange());
    };

    const onAllDayFieldChange = (event) => {
        dispatch(actions.onAllDayChange(event.target.checked));
        dispatch(actions.onFieldChange());
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!formIsValid()) {
            dispatch(actions.onSubmitError());
            return;
        }

        const event = {
            title: state.title,
            description: state.description,
            location: state.location,
            start: startDate,
            end: endDate,
            allDay: state.allDay,
            url: undefined
        };

        const originalIcs = ics(event);

        let customIcs = originalIcs.substring(32, originalIcs.length).replace(/%0A/gm, '\r\n');
        customIcs = customIcs.replace(/^SUMMARY:.*/m, `SUMMARY:${state.title}\r\n`);
        customIcs = customIcs.replace(/^DESCRIPTION:.*/m, `DESCRIPTION:${state.description}\r\n`);
        customIcs = customIcs.replace(/^LOCATION:.*/m, `LOCATION:${state.location}\r\n`);

        if (!state.url) {
            customIcs = customIcs.replace(/URL.*/g, '').replace(/^\s*[\r\n]/gm, '');
        }

        const icsFile = new Blob([customIcs], {
            type: 'text/calendar;charset=utf-8',
            encoding: 'UTF-8'
        });

        setCreatingIcs(true);
        setIcsCreationError(null);
        const formData = new FormData();
        formData.append('ics', icsFile, `${state.title}.ics`);

        axios
            .post(`${process.env.SERVER_HOST}/ics/file`, formData, {
                headers: {
                    'content-type': 'text/calendar;charset=utf-8'
                }
            })
            .then((response) => {
                setIcsLink(`${process.env.SERVER_HOST}/files/${response.data}`);
                setIcsWasCreated(true);
            })
            .catch((error) => {
                setIcsCreationError(error);
            })
            .finally(() => {
                setCreatingIcs(false);
            });

        dispatch(
            actions.setGeneratedLinksAndIcsFile({
                google: google(event),
                outlook: outlook(event),
                office365: office365(event),
                yahoo: yahoo(event),
                ics: icsFile
            })
        );

        GAevent('Calendar Links Generator', 'Event generated');
    };

    const onGeneratedLinkCopy = (linkName) => {
        dispatch(actions.onLinkCopy(linkName));
        GAevent('Calendar Links Generator', `${linkName} copy`);
    };

    const onDownloadIcsClick = () => {
        GAevent('Calendar Links Generator', 'Download ICS Click');
        const element = document.createElement('a');
        element.href = URL.createObjectURL(state.icsFile);
        element.download = `${state.title}.ics`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="home-page">
            <main style={{ paddingBottom: '3rem' }}>
                <Container>
                    <Row>
                        <Col md={6} style={{ paddingTop: '3rem' }}>
                            <section>
                                <h3>Crea un evento</h3>
                                <Form onSubmit={onSubmit}>
                                    <Form.Group controlId="title">
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control
                                            required
                                            autoComplete="off"
                                            type="text"
                                            placeholder="Título del evento"
                                            onChange={onTextFieldChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="description">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control
                                            required
                                            autoComplete="off"
                                            as="textarea"
                                            rows="3"
                                            placeholder="Descripción del evento"
                                            onChange={onTextFieldChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="location">
                                        <Form.Label>Locación </Form.Label>
                                        <Form.Control
                                            required
                                            autoComplete="off"
                                            type="text"
                                            placeholder="Locación del evento"
                                            onChange={onTextFieldChange}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="allDay">
                                        <Form.Check
                                            type="checkbox"
                                            label="¿Todo el día?"
                                            onChange={onAllDayFieldChange}
                                        />
                                    </Form.Group>
                                    {!state.allDay ? (
                                        <div>
                                            <Form.Group controlId="startDate">
                                                <Form.Label>Fecha de inicio:</Form.Label>{' '}
                                                <DateTimePicker
                                                    minDate={new Date()}
                                                    onChange={(event) => {
                                                        onStartDateChange(event);
                                                        dispatch(actions.onFieldChange());
                                                    }}
                                                    value={startDate}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="endDate">
                                                <Form.Label>Fecha de finalización:</Form.Label>{' '}
                                                <DateTimePicker
                                                    minDate={startDate}
                                                    onChange={(event) => {
                                                        onEndDateChange(event);
                                                        dispatch(actions.onFieldChange());
                                                    }}
                                                    value={endDate}
                                                />
                                            </Form.Group>
                                        </div>
                                    ) : (
                                        <Form.Group controlId="date">
                                            <Form.Label>Fecha del evento:</Form.Label>{' '}
                                            <DateTimePicker
                                                minDate={new Date()}
                                                onChange={onStartDateChange}
                                                value={startDate}
                                            />{' '}
                                        </Form.Group>
                                    )}

                                    <Button variant="primary" size="lg" type="submit" block>
                                        Generar Links
                                    </Button>
                                    {state.linksWhereGenerated && !state.someFieldChanged && (
                                        <Alert className="text-center mt-3" variant="success">
                                            Los links han sido generados
                                        </Alert>
                                    )}

                                    {state.submitWasInvalid && (
                                        <Alert className="text-center mt-3" variant="warning">
                                            El formulario no es válido
                                        </Alert>
                                    )}
                                </Form>
                            </section>
                        </Col>
                        <Col md={6} style={{ paddingTop: '3rem' }}>
                            <LinksSection>
                                <h3>Links generados</h3>
                                {state.linksWhereGenerated ? (
                                    <div>
                                        <CalendarLink
                                            calendarName="Google"
                                            addToCalendarLink={state.links.google}
                                            copiedCalendar={state.copiedCalendar}
                                            onCopy={() => onGeneratedLinkCopy('google')}
                                        />
                                        <CalendarLink
                                            calendarName="Outlook"
                                            addToCalendarLink={state.links.outlook}
                                            copiedCalendar={state.copiedCalendar}
                                            onCopy={() => onGeneratedLinkCopy('outlook')}
                                        />
                                        <CalendarLink
                                            calendarName="Office365"
                                            addToCalendarLink={state.links.office365}
                                            copiedCalendar={state.copiedCalendar}
                                            onCopy={() => onGeneratedLinkCopy('office365')}
                                        />
                                        <CalendarLink
                                            calendarName="Yahoo"
                                            addToCalendarLink={state.links.yahoo}
                                            copiedCalendar={state.copiedCalendar}
                                            onCopy={() => onGeneratedLinkCopy('yahoo')}
                                        />

                                        {!creatingIcs && icsWasCreated && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <CalendarLink
                                                    calendarName="Ics"
                                                    addToCalendarLink={icsLink}
                                                    copiedCalendar={state.copiedCalendar}
                                                    onCopy={() => onGeneratedLinkCopy('ics')}
                                                />
                                            </div>
                                        )}

                                        {creatingIcs && (
                                            <Button variant="outline-primary" disabled>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                />{' '}
                                                Creando link al ics...
                                            </Button>
                                        )}

                                        {icsCreationError && (
                                            <Alert className="text-center mt-3" variant="warning">
                                                Hubo un error al crear el link al archivo .ics
                                            </Alert>
                                        )}

                                        <p style={{ margin: '1rem 0 0 0' }}>
                                            Archivo .ics para calendarios (Apple/iOS)
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={onDownloadIcsClick}
                                        >
                                            Descargar ICS
                                        </Button>
                                        {'  '}
                                    </div>
                                ) : (
                                    <span className="muted-text">
                                        No has creado ningun evento aún
                                    </span>
                                )}
                            </LinksSection>
                        </Col>
                    </Row>
                </Container>
            </main>

            <footer className="text-center mt-5 mb-5">
                <span>
                    <a
                        href="https://github.com/TextC0de/calendar-links-generator-for-events"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Proyecto
                    </a>{' '}
                    <img
                        style={{ width: '1rem', height: '1rem' }}
                        src={`${process.env.SERVER_HOST}/files/assets/github.svg`}
                        alt="Github icon"
                    />{' '}
                    por{' '}
                    <a href="https://github.com/TextC0de" target="_blank" rel="noreferrer">
                        Ignacio Guzmán
                    </a>
                    .
                </span>
            </footer>
        </div>
    );
};

export default IndexPage;
