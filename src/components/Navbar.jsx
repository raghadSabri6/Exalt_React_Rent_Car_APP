import { useContext } from "react";
import { UserContext } from "../context/User";
import AddCarModal from "../pages/car/components/AddCarModal";


function Navbar() {
  const { admin } = useContext(UserContext);

  return (
    <>
      <section>
        <nav className="bg-dark rounded-top text-light mh-25 w-100 py-4 px-5 d-flex flex-row align-items-center justify-content-between ">
          <div>
            <i class="fa-solid fa-car fs-3">
              <span className="fs-3"> Cars Rental </span>
            </i>
          </div>
          <div>
            {admin &&
             <AddCarModal />
            }
           
          </div>
        </nav>
      </section>
    </>
  );
}

export default Navbar;
