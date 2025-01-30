import { useState } from "react";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBondary from "../errorBoundary/ErrorBoundary";
import CharSearchForm from "../charSearchForm/CharSearchForm";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    const [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => {
        setChar(id)
    }

    return (
        <>
            <ErrorBondary> 
                <RandomChar/> 
            </ErrorBondary>
            <div className="char__content">
                <ErrorBondary> 
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBondary>
                <div> 
                    <ErrorBondary> 
                        <CharInfo charId={selectedChar}/>
                    </ErrorBondary>
                    <CharSearchForm/>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;