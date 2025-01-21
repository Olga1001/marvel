import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";

const Page404 = () => {
    const navigate = useNavigate();

    return (
        <div style={{'textAlign': 'center'}}>
            <ErrorMessage/>
            <h1>Page doesn`t exist</h1>
            <br/>
            <Link to={window.history?.length > 2 ? navigate(-1) : '/'} style={{'fontSize': '24px', 'display': 'block'}}>Back</Link>
        </div>
    )
}

export default Page404;