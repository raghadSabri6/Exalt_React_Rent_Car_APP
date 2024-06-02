import React, { useState, useRef } from "react";
import styles from "../../../form.module.css";
import { db, storage } from "../../../../firebaseConfig";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { object, string, number, array, mixed } from "yup";

function AddCarModal() {
  const navigate = useNavigate();
  const [car, setCar] = useState({
    name: "",
    costPerDay: "",
    details: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({
      ...car,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setCar({
      ...car,
      images: Array.from(files),
    });
  };

  const validateData = async () => {
    const carSchema = object({
      name: string().min(5, "Name must be at least 5 characters").max(20, "Name can't be more than 20 characters").required("Name is required"),
      costPerDay: number().positive("Cost per day must be a positive number").integer("Cost per day must be an integer").required("Cost per day is required"),
      details: string().required("Details are required"),
      images: array().of(mixed().required("Each image is required")).min(1, "At least one image is required"),
    });

    try {
      await carSchema.validate(car, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      setLoader(false);
      const validationError = {};
      error.inner.forEach((err) => {
        validationError[err.path] = err.message;
      });
      setErrors(validationError);

      console.log(validationError);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const isValid = await validateData();
    if (!isValid) {
      console.log("Please enter valid data");
      return;
    }

    try {
      const imageUrls = await Promise.all(
        car.images.map(async (image) => {
          const imageRef = ref(storage, `cars/${uuidv4()}`);
          await uploadBytes(imageRef, image);
          const url = await getDownloadURL(imageRef);
          return url;
        })
      );

      const carData = {
        name: car.name,
        costPerDay: car.costPerDay,
        details: car.details,
        images: imageUrls,
      };

      await addDoc(collection(db, "cars"), carData);

      setCar({
        name: "",
        costPerDay: "",
        details: "",
        images: [],
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Successfully Added Car", {
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
      navigate("/"); 
    } catch (error) {
      console.error("Error adding the car info:", error);
      toast.error("Error adding the car info", {
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

  return (
    <>
      <button
        type="button"
        className="btn btn-light fw-bold"
        data-bs-toggle="modal"
        data-bs-target="#addCarModal"
      >
        +
      </button>
      <div
        className="modal fade text-black"
        id="addCarModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="addCarModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addCarModalLabel">
                Add New Car
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setErrors({});
                }}
              />
            </div>
            <div className="modal-body">
              <div className={styles["Form"]}>
                <form className={styles["form"]} onSubmit={handleSubmit}>
                  <div className={styles["row"]}>
                    <label htmlFor="name">Name</label>
                    <input
                      className="form-control w-50"
                      type="text"
                      id="name"
                      name="name"
                      value={car.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <p className={styles["inputError"]}>{errors.name}</p>
                  )}
                  <div className={styles["row"]}>
                    <label htmlFor="costPerDay">Cost Per Day</label>
                    <input
                      className="form-control w-50"
                      type="number"
                      id="costPerDay"
                      name="costPerDay"
                      value={car.costPerDay}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.costPerDay && (
                    <p className={styles["inputError"]}>{errors.costPerDay}</p>
                  )}
                  <div className={styles["row"]}>
                    <label htmlFor="images">Upload Images</label>
                    <input
                      className="form-control w-50"
                      multiple
                      type="file"
                      id="images"
                      name="images"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </div>
                  {errors.images && (
                    <p className={styles["inputError"]}>{errors.images}</p>
                  )}
                  <div className={styles["row"]}>
                    <label htmlFor="details">Details</label>
                    <textarea
                      className="form-control w-50"
                      id="details"
                      name="details"
                      value={car.details}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.details && (
                    <p className={styles["inputError"]}>{errors.details}</p>
                  )}
                  <div className="w-100 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        setErrors({});
                        window.location.reload(); 
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      disabled={loader}
                    >
                      {!loader ? "Add" : "wait..."}
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

export default AddCarModal;
