import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const CalendarLink = ({ className, calendarName, addToCalendarLink, copiedCalendar, onCopy }) => (
    <div className={className}>
        <small>
            <p style={{ marginBottom: '.5rem', lineBreak: 'anywhere' }}>
                <b>{calendarName}:</b>
                {addToCalendarLink}
            </p>
        </small>
        <CopyToClipboard text={addToCalendarLink} onCopy={onCopy}>
            <Button variant="outline-primary" size="sm">
                <span>Copiar al portapapeles</span>
            </Button>
        </CopyToClipboard>
        {'  '}
        {copiedCalendar.toLowerCase() === calendarName.toLowerCase() && (
            <small style={{ textTransform: 'uppercase', fontWeight: 600, color: '#6c757d' }}>
                Copiado
            </small>
        )}
    </div>
);

CalendarLink.propTypes = {
    className: PropTypes.string.isRequired,
    calendarName: PropTypes.string.isRequired,
    addToCalendarLink: PropTypes.string.isRequired,
    copiedCalendar: PropTypes.string,
    onCopy: PropTypes.func.isRequired
};

CalendarLink.defaultProps = {
    copiedCalendar: ''
};

const StyledCalendarLink = styled(CalendarLink)``;

export default StyledCalendarLink;
