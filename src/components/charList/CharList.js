import { useEffect, useState, useRef } from "react";
import useMarvelService from "../../services/MarvelService"
import './charList.scss';
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        console.log('add chars list');
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ?  setNewItemLoading(false) : setNewItemLoading(true);
       
        getAllCharacters(offset)
            .then(res => onCharListLoaded(res));
    }
    
    const onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);
       
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended)
    }

    const itemRefs = useRef([]);
    
    const focusOnItem = (index) => {
        console.log(index)
        // вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет большего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[index].classList.add('char__item_selected');
        itemRefs.current[index].focus();
    }

    const renderChars = (arrChars) => {
        const elements = arrChars.map((element, i) => {
            const imageStyle = element.thumbnail.includes('image_not_available') ? {objectPosition: 'left'} : {};

            const classes = 'char__item' + (element.id === props.charId ? ' char__item_selected' : '');

            return (
                <li className={classes}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={element.id}
                    onClick={() => {
                        props.onCharSelected(element.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(element.id);
                            focusOnItem(i);
                        }
                    }}>
                        <img src={element.thumbnail} alt={element.name} style={imageStyle}/>
                        <div className="char__name">{element.name}</div>
                </li>
            )
        });
        return (
            <ul className="char__grid">{elements}</ul>
        )
    }
    const items = renderChars(charList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    // const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            {/* {content} */}

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