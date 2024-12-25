import { Component, createRef } from "react";
import MarvelService from "../../services/MarvelService"
import './charList.scss';
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        console.log('add chars list');
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(res => this.onCharListLoaded(res))
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }
    
    onCharListLoaded = (newCharList) => {
        let ended = false;

        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (index) => {
        console.log(index)
        // вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет большего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[index].classList.add('char__item_selected');
        this.itemRefs[index].focus();
    }

    renderChars = (arrChars) => {
        const elements = arrChars.map((element, i) => {
            const imageStyle = element.thumbnail.includes('image_not_available') ? {objectPosition: 'left'} : {};

            const classes = 'char__item' + (element.id === this.props.charId ? ' char__item_selected' : '');

            return (
                <li className={classes}
                    tabIndex={0}
                    ref={this.setRef}
                    key={element.id}
                    onClick={() => {
                        this.props.onCharSelected(element.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(element.id);
                            this.focusOnItem(i);
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
       
    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? this.renderChars(charList) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}

                <button className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none':'block'}}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;