import React, { useState, useEffect, useContext, Suspense } from "react";
import { ProgressBar } from "react-loader-spinner";
import styles from "../../../loading.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-coverflow";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import { UserContext } from "../../../context/User";
import RentModal from "./RentModal";
import EditModal from "./EditModal";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import style from "./image.module.css";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { admin } = useContext(UserContext);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState({ from: null, to: null });
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchCar = async () => {
    try {
      const carDoc = await getDoc(doc(db, "cars", id));
      if (carDoc.exists()) {
        setCar({ id: carDoc.id, ...carDoc.data() });
        checkIfCarIsRented(id);
      } else {
        console.error("No such car!");
        setError(true);
      }
    } catch (err) {
      setError(true);
      console.error("Error fetching Car:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfCarIsRented = async (carId) => {
    try {
      const rentQuery = query(collection(db, "rent"), where("carId", "==", carId));
      const rentSnapshot = await getDocs(rentQuery);
      if (!rentSnapshot.empty) {
        const currentDate = new Date();

        const validRentals = rentSnapshot.docs
          .map(doc => doc.data())
          .filter(rental => new Date(rental.to) >= currentDate)
          .sort((a, b) => new Date(b.to) - new Date(a.to));

        if (validRentals.length > 0) {
          const latestRental = validRentals[0];
          setIsRented(true);
          setRentalPeriod({ from: latestRental.from, to: latestRental.to });
        } else {
          setIsRented(false);
          setRentalPeriod({ from: null, to: null });
        }
      } else {
        setIsRented(false);
        setRentalPeriod({ from: null, to: null });
      }
    } catch (err) {
      console.error("Error checking if car is rented:", err);
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id, isDeleted]);

  const handleDelete = async (carId) => {
    try {
      await deleteDoc(doc(db, "cars", carId));
      toast.success("Successfully deleted Car", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
      setIsDeleted(true);
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete the car. Please try again.", { 
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <ProgressBar
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="progress-bar-loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-column mt-2 mb-4">
        <h1>Car Details</h1>
        <p className="vh-100">
          There was an error loading the Car Details. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="container my-3 text-center vh-100">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h1 className="">Car Details</h1>
        <div
          className={`w-50 d-flex ${
            admin ? "justify-content-between" : "justify-content-end"
          } align-items-center`}
        >
          {admin && (
            <button
              className="col-md-2 btn btn-outline-danger"
              onClick={() => handleDelete(car.id)}
            >
              Delete
            </button>
          )}
          {admin && <EditModal id={car.id} />}
          <RentModal id={car.id} disabled={isRented} />
        </div>
      </div>
      <div className="row d-flex flex-column justify-content-center align-items-center ">
        <div className="col-md-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Swiper
              spaceBetween={50}
              slidesPerView={2}
              centeredSlides={true}
              loop={true}
              navigation={true}
              autoplay={{ delay: 1000, disableOnInteraction: false }}
              effect="coverflow"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              modules={[Navigation, Autoplay, EffectCoverflow]}
              className="mySwiper"
            >
              {car.images &&
                car.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      className={`${style["slider-image"]} w-100`}
                      src={image}
                      alt={car.name}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </Suspense>
        </div>

        <div className="w-100">
          <div className="card-body">
            <h2 className="card-title text-primary m-2">{car.name}</h2>
            <div className="w-100 d-flex align-items-center justify-content-around flex-row">
              <p className="col-md-3 border border-secondary-subtle p-1 rounded">
                From: <span className="text-danger">{rentalPeriod.from || "-"}</span>
              </p>
              <p className="col-md-3 border border-secondary-subtle p-1 rounded">
                To: <span className="text-primary">{rentalPeriod.to || "-"}</span>
              </p>
              <p className="col-md-3 border border-secondary-subtle p-1 rounded">
                Price Per Day:{" "}
                <span className="text-success">{car.costPerDay}$</span>
              </p>
            </div>
            <p className="card-text">{car.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
