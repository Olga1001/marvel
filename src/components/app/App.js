
import {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router';

import AppHeader from "../appHeader/AppHeader";
// import {Page404, MainPage, ComicsPage, SingleComicPage} from "../pages";
import Spinner from '../spinner/Spinner';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/singleComicPage/SingleComicPage'));
const SingleCharacterPage = lazy(() => import('../pages/singleCharacterPage/SingleCharacterPage'));
const SinglePage = lazy(() => import('../pages/SinglePage'));
//1,46 МБ => 1,50 МБ 
const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}> 
                        <Routes>
                            <Route path="/" element={<MainPage/>}/> 
                            <Route path="/comics" element={<ComicsPage/>}/>
                            <Route path="/comics/:id" element={<SinglePage BaseComponent={SingleComicPage} dataType="comic"/>}/>
                            <Route path="/character/:id" element={<SinglePage BaseComponent={SingleCharacterPage} dataType="character"/>}/>
                            
                            <Route path="*" element={<Page404/>} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
           
        </Router>
    )
}

export default App;