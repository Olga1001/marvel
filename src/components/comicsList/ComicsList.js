import { useState, useEffect, useMemo } from "react";
import {Link } from 'react-router';
import './comicsList.scss';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComickEnded] = useState(false);

    const {clearError, getAllComics, process, setProcess} = useMarvelService();

    useEffect(() => {
        console.log('add Comics list');
        onRequest(offset ,true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ?  setNewItemLoading(false) : setNewItemLoading(true);
        clearError();
        getAllComics(offset)
            .then(res => onComicsListLoaded(res))
            .then(() => setProcess('confirmed'))
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;

        if (newComicsList.length < 8) {
            ended = true
        }

        setComicsList([...comicsList, ...newComicsList]);
       
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComickEnded(ended)
    }

    console.log('render')

    const renderComicsList = (arrComicsList) => {
        console.log(arrComicsList)
        const elements = arrComicsList.map((element, i) => {
            return (
                <li className="comics__item"
                    key={i}>
                    <Link to={`/comics/${element.id}`}>
                        <img src={element.thumbnail} alt={element.title} className="comics__item-img"/>
                        <div className="comics__item-name">{element.title}</div>
                        <div className="comics__item-price">{element.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">{elements}</ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderComicsList(comicsList), null, newItemLoading)}

            <button className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{'display': comicsEnded ? 'none':'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;