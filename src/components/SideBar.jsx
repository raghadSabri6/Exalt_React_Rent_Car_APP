import { useContext } from "react";
import DefaultProfile from "../images/DefaultProfile.jpg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/User";

function SideBar() {
    const btnStyles1 = "btn btn-dark w-100 border border-top-0 rounded-0 p-2";
    const btnStyles2 = "btn btn-danger m-2 p-2";
    const navigate = useNavigate();
    const { admin, changeRole } = useContext(UserContext);

  const handleCar = () => {
    navigate("/");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const handleRole = () => {
    changeRole();
    console.log({ admin });
  };

  return (
    <>
      <div className="sidebar-container bg-dark text-light h-100">
        <img
          className="w-100 p-0 m-0"
          src={DefaultProfile}
          alt="Default avatar profile icon of social media user"
        />
        <ul className="list-unstyled text-center d-flex flex-column ">
          <li>
            <button type="button" className={btnStyles1} onClick={handleCar}>
              Cars
            </button>
          </li>
          <li>
            <button type="button" id="historyButton" className={btnStyles1} onClick={handleHistory}>
              History
            </button>
          </li>
          <li>
            <button type="button" className={btnStyles2} onClick={handleRole}>
                {admin ? 'Admin' : 'User'}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SideBar;
