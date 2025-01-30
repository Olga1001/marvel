import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from "yup";
import {Link} from 'react-router-dom';

import './charSearchForm.scss';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from "../errorMessage/ErrorMessage";


const CharSearchForm = () => {
    const [char, setChar] = useState(null);

    const {loading, error, clearError, getCharacterByName} = useMarvelService();

    const updateChar = (charName) => {
        clearError();
        console.log(charName)

        getCharacterByName(charName)
            .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

    return (
        <div className='char__search-form'>
            <Formik
                initialValues={{ charName: ''}}
                validationSchema={Yup.object({
                    charName: Yup.string().required("This field is required"),
                })}
            
                onSubmit = { ({charName}) => {
                    updateChar(charName);
                }}
            >
                <Form>
                    <label htmlFor="name" className="char__search-label">Or find a character by name:</label>
                    
                    <div className="char__search-wrapper">
                        <Field 
                            id="name" 
                            name="charName" 
                            type="text" 
                            placeholder="Enter name"/>
                        <button className="button button__main" type="submit" disabled={loading}>
                            <div class="inner">FIND</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {
                !char ? null : char.length > 0 ? (
                    <div className="char__search-wrapper">
                        <p className='char__search-success'>There is! Visit {char[0].name} page?</p>
                        <Link 
                            to={`/character/${char[0].id}`} 
                            className='button button__secondary'>
                            <div class="inner">TO PAGE</div>
                        </Link>
                    </div>) : 
                    <div className='char__search-error'>The character was not found. Check the name and try again</div>
            }
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;