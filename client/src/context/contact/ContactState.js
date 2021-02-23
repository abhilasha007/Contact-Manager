import React, {useReducer} from 'react';
import axios from 'axios';
import ContactContext from './contactContext';
import ContactReducer from './contactReducer';
import {
    ADD_CONTACT,
    DELETE_CONTACT,
    GET_CONTACTS,
    CLEAR_CONTACTS,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CURRENT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null
    };

    const [state, dispatch] = useReducer(ContactReducer, initialState);
 
    //Get Contacts
    const getContacts = async() => {
        try {
            const res = await axios.get('/api/contacts');
            dispatch({ type:GET_CONTACTS, payload:res.data });
        } catch (error) {
            dispatch({ type:CONTACT_ERROR, payload: error.response.msg });
        }
    }

    // Add contact 
    const addContact = async(contact) => {
        //when sending data
        const config ={
            header: {
                'Content-type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/contacts', contact, config);
            dispatch({ type:ADD_CONTACT, payload:res.data });
        } catch (error) {
            dispatch({ type:CONTACT_ERROR, payload: error.response.msg });
        }
    }
    
    //Delete contact
    const deleteContact = async id => {
        try {
            await axios.delete(`/api/contacts/${id}`);
            dispatch({ type:DELETE_CONTACT, payload:id });
        } catch (error) {
            dispatch({ type:CONTACT_ERROR, payload: error.response.msg });
        }
    }
    
    //Update contact
    const updateContact = async(contact) => {
        const config ={
            header: {
                'Content-type': 'application/json'
            }
        }
        try {
            const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);
            dispatch({ type:UPDATE_CURRENT, payload:res.data });
        } catch (error) {
            dispatch({ type:CONTACT_ERROR, payload: error.response.msg });
        }
    }

    // Clear Contacts
    const clearContacts = () => {
        dispatch({ type:CLEAR_CONTACTS });
    }

    //Set Current Contact
    const setCurrent = (contact) => {
        dispatch({ type:SET_CURRENT, payload:contact });
    }

    // Clear curr contact
    const clearCurrent = () => {
        dispatch({ type:CLEAR_CURRENT });
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
                error: state.error,
                addContact,
                deleteContact,
                setCurrent,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter,
                getContacts,
                clearContacts
            }}
        >
            {props.children}
        </ContactContext.Provider>
    );
};

export default ContactState; 


