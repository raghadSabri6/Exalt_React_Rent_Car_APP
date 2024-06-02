import React, { useState, useEffect } from "react";
import styles from "../../../form.module.css";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { db } from "../../../../firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

function RentModal({ id, disabled }) {
  const [user, setUser] = useState({
    from: "",
    to: "",
    totalCost: "",
  });
  const [errors, setErrors] = useState([]);
  const [loader, setLoader] = useState(false);
  const [carDetails, setCarDetails] = useState({ name: "", costPerDay: 0 });

  useEffect(() => {
    console.log("RentModal mounted with id:", id);
    if (id) {
      fetchCarDetails(id);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const validateData = async () => {
    const registerSchema = object({
      from: string().required("Start date is required"),
      to: string().required("End date is required"),
    });
    try {
      await registerSchema.validate(user, { abortEarly: false });

      const currentDate = new Date();
      const startDate = new Date(user.from);
      const endDate = new Date(user.to);

      if (startDate < currentDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          from: "Start date cannot be in the past",
        }));
        setLoader(false);
        return false;
      }

      if (endDate < startDate) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          to: "End date cannot be before start date",
        }));
        setLoader(false);
        return false;
      }

      setErrors([]);
      return true;
    } catch (error) {
      setLoader(false);
      const validationError = {};
      error.inner.forEach((err) => {
        validationError[err.path] = err.message;
      });
      setErrors(validationError);
      console.log("Validation Errors:", validationError);
      return false;
    }
  };

  const fetchCarDetails = async (carId) => {
    try {
      const carDoc = await getDoc(doc(db, "cars", carId));
      if (carDoc.exists()) {
        const carData = carDoc.data();
        console.log("Fetched car details:", carData);
        setCarDetails({ name: carData.name, costPerDay: carData.costPerDay });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching car details: ", error);
    }
  };

  const calculateTotalCost = () => {
    const { from, to } = user;
    if (from && to) {
      const startDate = new Date(from);
      const endDate = new Date(to);
      const timeDiff = endDate - startDate;
      const dayDiff = timeDiff / (1000 * 3600 * 24) + 1; 
      const totalCost = dayDiff * carDetails.costPerDay;
      console.log("Calculated total cost:", totalCost);
      setUser({ ...user, totalCost: totalCost.toFixed(2) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const isValid = await validateData();
    if (!isValid) {
      console.log("Please enter valid data");
      setLoader(false); 
      return;
    }

    try {
      console.log("Submitting rent data:", {
        carId: id,
        carName: carDetails.name,
        from: user.from,
        to: user.to,
        totalCost: user.totalCost,
      });
      const docRef = await addDoc(collection(db, "rent"), {
        carId: id,
        carName: carDetails.name,
        from: user.from,
        to: user.to,
        totalCost: user.totalCost,
      });
      console.log("Document written with ID: ", docRef.id);

      setUser({
        from: "",
        to: "",
        totalCost: "",
      });

      toast.success("Successfully Rented", {
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
    } catch (error) {
      console.error("Error adding document: ", error.message);
      toast.error("Error renting car", {
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
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCarDetails(id); 
    }
  }, [id]);

  useEffect(() => {
    calculateTotalCost(); 
  }, [user.from, user.to]);

  return (
    <>
      <button
        type="button"
        className="col-md-2 btn btn-outline-success"
        data-bs-toggle="modal"
        data-bs-target="#rentModal"
        disabled={disabled}
      >
        Rent
      </button>
      <div
        className="modal fade text-black"
        id="rentModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="rentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="rentModalLabel">
                Rent a Car
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setErrors([]);
                }}
              />
            </div>
            <div className="modal-body">
              <div className={styles["Form"]}>
                <form className={styles["form"]} onSubmit={handleSubmit}>
                  <div className={styles["row"]}>
                    <label htmlFor="from">From</label>
                    <input
                      className="form-control w-50"
                      type="date"
                      id="from"
                      name="from"
                      value={user.from}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.from ? (
                    <p className={styles["inputError"]}>{errors.from}</p>
                  ) : (
                    ""
                  )}
                  <div className={styles["row"]}>
                    <label htmlFor="to">To</label>
                    <input
                      className="form-control w-50"
                      type="date"
                      id="to"
                      name="to"
                      value={user.to}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.to ? (
                    <p className={styles["inputError"]}>{errors.to}</p>
                  ) : (
                    ""
                  )}
                  <div className={styles["row"]}>
                    <label htmlFor="totalCost">Total Cost</label>
                    <input
                      className="form-control w-50"
                      id="totalCost"
                      name="totalCost"
                      value={user.totalCost}
                      readOnly
                    />
                  </div>
                  <div className="w-100 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        setErrors([]);
                        window.location.reload(); 
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      disabled={loader ? "disabled" : null}
                    >
                      {!loader ? "Rent" : "wait..."}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RentModal;
