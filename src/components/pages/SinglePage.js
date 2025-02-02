import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const SinglePage = ({BaseComponent, dataType}) => {
    const {id} = useParams(); // key/value {id: '61788'}
    const [data, setData] = useState(null);
    const {getCharacter, getComic, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateData();
    }, [id])

    const updateData = () => {
        clearError();
        
        switch (dataType) {
            case 'comic':
                getComic(id).then(onDataLoaded).then(() => setProcess('confirmed'));
                break;
            case 'character':
                getCharacter(id).then(onDataLoaded).then(() => setProcess('confirmed'));
        }
    }

    const onDataLoaded = (data) => {
        setData(data);
    }

    return (
        <>
            <AppBanner/>
            {setContent(process, BaseComponent, data)}
        </>
    )
}

export default SinglePage;