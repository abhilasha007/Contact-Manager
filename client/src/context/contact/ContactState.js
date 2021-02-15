import React, {useReducer} from 'react';
import {v4 as uuidv4} from 'uuid';
import ContactContext from './contactContext';
import ContactReducer from './contactReducer';
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CURRENT,
    FILTER_CONTACTS,
    CLEAR_FILTER 
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: [
            {
                id: 1,
                name: 'abhilasha',
                email: 'abhilashaasaini@gmail.com',
                phone: '11111111',
                type: 'professional'
            }
        ],
        current: null,
        filtered: null
    };

    const [state, dispatch] = useReducer(ContactReducer, initialState);

    // ADD contact
    const addContact = (contact) => {
        contact.id = uuidv4();
        dispatch({ type:ADD_CONTACT, payload:contact });
    }

    //Delete contact
    const deleteContact = (id) => {
        dispatch({ type:DELETE_CONTACT, payload:id });
    }

    //Set Current Contact
    const setCurrent = (contact) => {
        dispatch({ type:SET_CURRENT, payload:contact });
    }

    // Clear curr con
    const clearCurrent = () => {
        dispatch({ type:CLEAR_CURRENT });
    }
    //Update con
    const updateContact = (contact) => {
        dispatch({ type:UPDATE_CURRENT, payload:contact });
    }
    //Filter contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text});
    }

    //Clear filter
    const clearFilter = () => {
        dispatch({ type:CLEAR_FILTER });
    }

    return (
        //contains the function we're providing to our component
        <ContactContext.Provider
            value = {{
                contacts: state.contacts,
                current: state.current,
                filtered: state.filtered,
                addContact,
                deleteContact,
                setCurrent,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter
            }}
        >
            {props.children}
        </ContactContext.Provider>
    );
};

export default ContactState; 


