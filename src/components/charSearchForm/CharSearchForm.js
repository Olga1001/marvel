import { useState } from 'react';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from "../errorMessage/ErrorMessage";

import './charSearchForm.scss';

const CharSearchForm = () => {
    const { clearError, getCharacterByName, process, setProcess } = useMarvelService();
    const [char, setChar] = useState(null);
    const [error, setError] = useState(null); 

    const formik = useFormik({
        initialValues: { charName: '' },
        validate: value => {
            setError('');
        },
        onSubmit: ({ charName }) => {
         
            if (!charName.trim()) {
                setError('Required field!');
                return;
            }
            setError('');
            updateChar(charName);
        }
    });

    const updateChar = (charName) => {
        clearError();
        getCharacterByName(charName)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
            .catch(() => setError('Something went wrong. Try again.'));
    };

    const onCharLoaded = (char) => {
        if (!char || (char && char.length === 0)) {
            setError('The character was not found. Check the name and try again');
            setChar(null);
        } else {
            setError('');
            setChar(char);
        }
    };

    const errorMessage = process === 'error' ? (
        <div className="char__search-critical-error"><ErrorMessage /></div>
    ) : null;

    const searchResult = char ? (
        <div className="char__search-wrapper">
            <p className='char__search-success'>There is! Visit {char[0].name} page?</p>
            <Link 
                to={`/character/${char[0].id}`} 
                className='button button__secondary'>
                <div className="inner">TO PAGE</div>
            </Link>
        </div>
    ) : null;

    return (
        <div className='char__search-form'>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name" className="char__search-label">Or find a character by name:</label>
                
                <div className="char__search-wrapper">
                    <input 
                        id="name" 
                        name="charName" 
                        type="text" 
                        placeholder="Enter name"
                        {...formik.getFieldProps('charName')}
                    />
                    <button 
                        className="button button__main" 
                        type="submit" 
                        disabled={process === 'loading'}
                    >
                        <div className="inner">FIND</div>
                    </button>
                </div>

                {error ? <div className="char__search-error">{error}</div> : searchResult}

            </form>
            {errorMessage}
        </div>
    );
};

export default CharSearchForm;
