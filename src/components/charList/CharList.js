import { Component } from "react";
import MarvelService from "../../services/MarvelService"
import './charList.scss';
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharList extends Component {
    state = {
        chars: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        console.log('add chars list');
        this.marvelService
            .getAllCharacters()
            .then(res => this.onCharsLoaded(res))
            .catch(this.onError);
    }

    onCharsLoaded = (chars) => {
        this.setState({
            chars, 
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    renderChars = (arrChars) => {
        const elements = arrChars.map(element => {
            const imageStyle = element.thumbnail.includes('image_not_available') ? {objectPosition: 'left'} : {};

            return (
                <li className="char__item" 
                    key={element.id}
                    onClick={() => this.props.onCharSelected(element.id)}
                >
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
        const {chars, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? this.renderChars(chars) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}

                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;