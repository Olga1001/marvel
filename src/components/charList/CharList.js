import { useEffect, useState, useRef, createRef, useCallback } from "react";
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import './charList.scss';
import useMarvelService from "../../services/MarvelService"
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const setContent = (process, Component, newItemLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error': 
            return <ErrorMessage/>;
            break;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    const [charSelected, setCharSelected] = useState(null);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        console.log('add chars list');
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ?  setNewItemLoading(false) : setNewItemLoading(true);
       
        getAllCharacters(offset)
            .then(res => onCharListLoaded(res))
            .then(() => setProcess('confirmed'));
    }
    
    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);
       
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)
    }

    const renderChars = (arrChars) => {
        const elements = arrChars.map((element, i) => {
            const imageStyle = element.thumbnail.includes('image_not_available') ? {objectPosition: 'left'} : {};
     
            const classes = 'char__item' + (element.id === props.charId || i == charSelected ? ' char__item_selected' : '');
            const nodeRef = createRef(null);
            const duration = i * 100;

            return (
                <CSSTransition 
                    nodeRef={nodeRef} 
                    timeout={duration} 
                    key={element.id}
                    classNames="char__item">
                        <li className={classes}
                            tabIndex={0}
                            ref={nodeRef}
                            key={element.id}
                            onClick={() => {
                                props.onCharSelected(element.id);
                                setCharSelected(i)
                            }}
                            onKeyPress={(e) => {
                                if (e.key === ' ' || e.key === "Enter") {
                                    props.onCharSelected(element.id);
                                    setCharSelected(i)
                                }
                            }}>
                                <img src={element.thumbnail} alt={element.name} style={imageStyle}/>
                                <div className="char__name">{element.name}</div>
                        </li>
                </CSSTransition>
            )
        });
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {elements}
                </TransitionGroup>
            </ul>
        )
    }
 
    return (
        <div className="char__list">
            {setContent(process, () => renderChars(charList), newItemLoading)}

            <button className="button button__main button__long"
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}
                style={{'display': charEnded ? 'none':'block'}}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;