import React, { useState, useEffect } from "react";
import { MutatingDots } from "react-loader-spinner";
import styles from "../../../loading.module.css";
import { Link } from "react-router-dom";
import { db } from "../../../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Car = () => {
  const [Cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCars = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const carsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCars(carsData);
      setError(false);
    } catch (err) {
      console.error("Error fetching Cars:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <MutatingDots
          visible={true}
          height={100}
          width={100}
          color="#D3D3D3"
          secondaryColor="#808080"
          radius={12.5}
          ariaLabel="mutating-dots-loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-column mt-2 mb-4">
        <h1>Cars List</h1>
        <p>There was an error loading the Cars list. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center w-100 flex-column mt-2 mb-4">
      <h1>Cars List</h1>
      <div className="d-flex flex-row flex-wrap w-100 justify-content-around row gy-3">
        {Cars.map((car) => (
          <div className="card" style={{ width: "14rem" }} key={car.id}>
            <img
              src={car.images[0]}
              className="card-img-top"
              alt={car.name}
              style={{
                objectFit: "contain",
                height: "250px",
                margin: "10px auto",
              }}
            />
            <div className="card-body d-flex flex-column justify-content-between align-content-center">
              <h5 className="card-title text-danger">{car.name}</h5>
              <div className="card-text w-75 d-flex align-items-center justify-content-between flex-row flex-wrap">
                <p>Cost Per Day: <span className="text-success">{car.costPerDay}$</span></p>
                <p>Brief description: <span className="text-primary">{car.details.split(' ').slice(0, 6).join(' ')}...</span></p>

              </div>
              <Link className="btn btn-primary mt-auto" to={`/carDetails/${car.id}`}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Car;
