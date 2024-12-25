import { Component, Children, cloneElement, createRef  } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBondary from "../errorBoundary/ErrorBoundary"

import decoration from '../../resources/img/vision.png';


const DynamicGreating = (props) => {
    return (
        <div className={'mb-3 p-3 border border-' + props.color}>
            {/* {props.children} */}
            {
                Children.map(props.children, child => {
                    return cloneElement(child, {className: 'show p-3 m-3 border rounded'})
                })
            }
        </div>
    )
}

const Message = (props) => {
    return (
        <h3>Message: {props.counter}</h3>
    )
}

class Counter extends Component {
    state = {
        counter: 0
    }

    changeCounter = () => {
        this.setState(({counter}) => ({
            counter: counter + 1
        }))
    }

    render() {
        return (
            <>
                <h2>Counter</h2>
                <button
                    type="button"
                    onClick={this.changeCounter}
                >Click me</button>
                {this.props.render(this.state.counter)}
            </>
        )
    }
}

class App extends Component {
    state = {
        selectedChar: null
    }
    myRef = createRef();

    // componentDidMount() {
    //     this.myRef.current.doSmth();
    // }

    onCharSelected = (id) => {
        console.log('onCharSelected: ' + id)
        this.setState({
            selectedChar: id
        })
    }

    onFirstFocus = () => {
        if (this.myRef) {
            this.myRef.focus();
        }
    }

    setInputRef = elem => {
        this.myRef = elem;
    }


    render() {
        return (
            <div className="app">
                <AppHeader/>
                <main>
                    <div>
                        <input ref={this.setInputRef} type="text"/>
                        <textarea onClick={this.onFirstFocus}></textarea>
                    </div>
                    {/* <TextInput ref={this.myRef}/> */}
                    {/* <Counter render={counter => (
                        <Message counter={counter}/>
                    )}/>
                    <DynamicGreating color={'primary'}>
                        <h2>1111</h2>
                        <h2>2222</h2>
                    </DynamicGreating> */}
                    <RandomChar/>
                    <div className="char__content">
                        <ErrorBondary> 
                            <CharList onCharSelected={this.onCharSelected}/>
                        </ErrorBondary>
                        <ErrorBondary> 
                            <CharInfo charId={this.state.selectedChar}/>
                        </ErrorBondary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision"/>
                </main>
            </div>
        )
    }
}

class TextInput extends Component {
    doSmth = () => {
        console.log('Smth');
    }

    render() {
        return (
            <input type="text"/>
        )
    }
}

export default App;