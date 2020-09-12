import React, { useState, useReducer } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { google, outlook, office365, yahoo, ics } from 'calendar-link';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import DateTimePicker from 'react-datetime-picker';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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

        if (!state.url) {
            customIcs = customIcs.replace(/URL.*/g, '').replace(/^\s*[\r\n]/gm, '');
        }

        const icsFile = new Blob([customIcs], {
            type: 'text/calendar;charset=UTF-8',
            encoding: 'UTF-8'
        });

        setCreatingIcs(true);
        const formData = new FormData();
        formData.append('ics', icsFile, `${state.title}.ics`);
        console.log(process.env);

        axios
            .post(`http://${process.env.REACT_APP_SERVER_HOST}/ics/file`, formData, {
                headers: {
                    'content-type': 'text/calendar'
                }
            })
            .then((response) => {
                setIcsLink(
                    `http://${process.env.REACT_APP_SERVER_HOST}/ics/uploads/${response.data}`
                );
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
    };

    const onGeneratedLinkCopy = (linkName) => {
        dispatch(actions.onLinkCopy(linkName));
    };

    const onDownloadIcsClick = () => {
        const element = document.createElement('a');
        element.href = URL.createObjectURL(state.icsFile);
        element.download = `${state.title}.ics`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="home-page">
            <main style={{ padding: '3rem 0' }}>
                <Container>
                    <h1 className="text-center">Generador de links para añadir a calendarios</h1>
                    <p className="text-center text-muted">
                        Crea un evento y obten los links para añadirlo a calendarios de Google,
                        Outlook, Microsoft365, Yahoo y Apple.
                    </p>
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
                                        <p>Archivo .ics para calendarios como el de Apple</p>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={onDownloadIcsClick}
                                        >
                                            Descargar ICS
                                        </Button>
                                        {'  '}

                                        {icsWasCreated && (
                                            <div style={{ display: 'inline-block' }}>
                                                <CopyToClipboard
                                                    text={icsLink}
                                                    onCopy={() => onGeneratedLinkCopy('ics')}
                                                >
                                                    <Button variant="outline-primary" size="sm">
                                                        <span>Copiar link al ICS</span>
                                                    </Button>
                                                </CopyToClipboard>
                                                {'  '}
                                                {state.copiedCalendar.toLowerCase() === 'ics' && (
                                                    <small
                                                        style={{
                                                            textTransform: 'uppercase',
                                                            fontWeight: 600,
                                                            color: '#6c757d'
                                                        }}
                                                    >
                                                        Copiado
                                                    </small>
                                                )}
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
                    Por <a href="https://github.com/TextC0de">Ignacio Guzmán</a>.
                </span>
            </footer>
        </div>
    );
};

export default IndexPage;
