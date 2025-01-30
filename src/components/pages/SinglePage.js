import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';

const SinglePage = ({BaseComponent, dataType}) => {
    const {id} = useParams(); // key/value {id: '61788'}
    const [data, setData] = useState(null);
    const {loading, error, getCharacter, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateData();
    }, [id])

    const updateData = () => {
        clearError();
        
        switch (dataType) {
            case 'comic':
                getComic(id).then(onDataLoaded);
                break;
            case 'character':
                getCharacter(id).then(onDataLoaded);
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !data) ? <BaseComponent data={data}/> : null;

    return (
        <>
            <AppBanner/>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

export default SinglePage;