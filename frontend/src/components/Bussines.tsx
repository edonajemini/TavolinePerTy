import { NavLink } from "react-router-dom";

export function Bussines(){
    return(
    <div className="bussines">
     <ul className="bussines-nav">
            <NavLink  to={"/bussiness"}>For Businesses |</NavLink>
            <p>Help</p>
            <p>English</p>
          </ul>
    </div>
    )
}