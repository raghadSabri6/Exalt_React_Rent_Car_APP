import React, { useState, useEffect } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import styles from "../../../loading.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig"; 

function History() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRentals = async () => {
    try {
      const rentalCollection = collection(db, "rent");
      const rentalSnapshot = await getDocs(rentalCollection);
      const rentalList = rentalSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRentals(rentalList);
      setError(false);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  if (loading) {
    return (
      <div className={styles.loader}>
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-column mt-2 mb-4">
        <h1>Rental History</h1>
        <p>There was an error loading the rental history. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container vh-100">
      <h1 className="my-4">User History</h1>
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-secondary">
            <th scope="col">#</th>
            {/* <th scope="col">Car ID</th> */}
            <th scope="col">Car</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Total $</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental, index) => (
            <tr key={rental.id}>
              <th scope="row">{index + 1}</th>
              {/* <td>{rental.carId}</td> */}
              <td>{rental.carName}</td>
              <td>{rental.from}</td>
              <td>{rental.to}</td>
              <td>{rental.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
