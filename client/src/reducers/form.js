const actionTypes = {
    ON_SUBMIT_ERROR: 'ON_SUBMIT_ERROR',
    ON_FIELD_CHANGE: 'ON_FIELD_CHANGE',
    ON_TEXT_FIELD_CHANGE: 'ON_TEXT_FIELD_CHANGE',
    ON_ALL_DAY_CHANGE: 'ON_ALL_DAY_CHANGE',
    SET_GENERATED_LINKS_AND_ICS_FILE: 'SET_GENERATED_LINKS_AND_ICS_FILE',
    ON_LINK_COPY: 'ON_LINK_COPY'
};

export const initialState = {
    title: '',
    description: '',
    allDay: false,
    location: '',
    someFieldChanged: false,
    copiedCalendar: '',
    submitWasInvalid: false,
    links: {
        google: '',
        outlook: '',
        office365: '',
        yahoo: ''
    }
};

export const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.ON_SUBMIT_ERROR:
            return {
                ...state,
                submitWasInvalid: true
            };
        case actionTypes.ON_FIELD_CHANGE:
            return {
                ...state,
                someFieldChanged: true,
                submitWasInvalid: false
            };
        case actionTypes.ON_TEXT_FIELD_CHANGE:
            return {
                ...state,
                [action.payload.field]: action.payload.value
            };
        case actionTypes.ON_ALL_DAY_CHANGE:
            return { ...state, allDay: action.payload.data };
        case actionTypes.SET_GENERATED_LINKS_AND_ICS_FILE:
            return {
                ...state,
                copiedCalendar: '',
                links: action.payload.links,
                icsFile: action.payload.file,
                linksWhereGenerated: true,
                someFieldChanged: false
            };
        case actionTypes.ON_LINK_COPY:
            return { ...state, copiedCalendar: action.payload.data };
        default:
            return { ...state };
    }
};

const onFieldChange = () => ({ type: actionTypes.ON_FIELD_CHANGE });
const onSubmitError = () => ({ type: actionTypes.ON_SUBMIT_ERROR });

const onTextFieldChange = (field, value) => {
    return {
        type: actionTypes.ON_TEXT_FIELD_CHANGE,
        payload: { field, value }
    };
};

const onAllDayChange = (value) => ({
    type: actionTypes.ON_ALL_DAY_CHANGE,
    payload: { data: value }
});

const onLinkCopy = (linkName) => ({
    type: actionTypes.ON_LINK_COPY,
    payload: { data: linkName }
});

const setGeneratedLinksAndIcsFile = ({ google, outlook, office365, yahoo, ics }) => {
    return {
        type: actionTypes.SET_GENERATED_LINKS_AND_ICS_FILE,
        payload: {
            links: {
                google,
                outlook,
                office365,
                yahoo
            },
            file: ics
        }
    };
};

export const actions = {
    onSubmitError,
    onFieldChange,
    onTextFieldChange,
    onAllDayChange,
    setGeneratedLinksAndIcsFile,
    onLinkCopy
};
