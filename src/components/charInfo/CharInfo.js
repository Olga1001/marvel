
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;

        if (!charId) {
            return;
        }

        clearError();
        
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

    const imageStyle = thumbnail.includes('image_not_available') ? {objectFit: 'contain'} : null;

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imageStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">{description} </div>
            <div className="char__comics">Comics:</div>
            <div className="char__comics-list">
                {
                    comics.map((item, i) => {
                       
                        if (i > 9) return
                        const id = item.resourceURI.split('comics/')[1];
                        return (
                            <Link 
                                to={`/comics/${id}`} 
                                className="char__comics-item" 
                                key={i}>{item.name}
                            </Link>
                        )
                    })
                }
                {comics.length <= 0 ? 'There is no comics with this  character' : null}
            </div>
        </>
    )
}

export default CharInfo;