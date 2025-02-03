import { useEffect, useState, useRef, useMemo } from "react";
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import './charList.scss';
import useMarvelService from "../../services/MarvelService";
import setContent from '../../utils/setContent';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();

    useEffect(() => {
        console.log('add chars list');
        onRequest(offset, true);
    }, []) // eslint-disable-line 

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

    const itemRefs = useRef([]);

    const focusOnItem = (index) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[index].classList.add('char__item_selected');
        itemRefs.current[index].focus();
    }

    const renderChars = (arrChars) => {
        console.log('renderChars', arrChars)
        const elements = arrChars.map((element, i) => {
            const imageStyle = element.thumbnail.includes('image_not_available') ? {objectPosition: 'left'} : {};
            const duration = (i + 1) * 100;

            return (
                <CSSTransition 
                    // nodeRef={itemRefs.current[i]} 
                    timeout={duration} 
                    key={element.id}
                    classNames="char__item">
                        <li className="char__item"
                            tabIndex={i}
                            ref={el => itemRefs.current[i] = el}
                            key={element.id}
                            onClick={() => {
                                focusOnItem(i);
                                props.onCharSelected(element.id);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === ' ' || e.key === "Enter") {
                                    focusOnItem(i);
                                    props.onCharSelected(element.id);
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
 
    const elements = useMemo(() => {
        return setContent(process, () => renderChars(charList), null, newItemLoading);
    }, [process]); // eslint-disable-line 

    return (
        <div className="char__list">
            {elements}

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