
import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';

const setContent = (process, Component, data, newItemLoading = false) => {
    switch(process) {
        case 'waiting':
            return <Skeleton/>;
        case 'loading':
            return newItemLoading ? <Component data={data}/> : <Spinner/>;
        case 'confirmed':
            return <Component data={data}/>;
        case 'error': 
            return <ErrorMessage/>;
        default:
            throw new Error('Unexpected process state');
    }
}

export default setContent;