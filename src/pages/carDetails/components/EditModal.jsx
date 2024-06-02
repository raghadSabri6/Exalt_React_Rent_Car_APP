import React, { useState, useRef, useEffect } from "react";
import styles from "../../../form.module.css";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { db, storage } from "../../../../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditModal({ id }) {
  const [car, setCar] = useState({
    name: "",
    costPerDay: "",
    details: "",
    image: "",
  });
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);
  const [loader, setLoader] = useState(false);

  const fetchCarDetails = async (id) => {
    try {
      const carDoc = await getDoc(doc(db, "cars", id));
      if (carDoc.exists()) {
        setCar(carDoc.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching car details: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCar({
      ...car,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setCar({
      ...car,
      [name]: files[0],
    });
  };

  const validateData = async () => {
    const editSchema = object({
      name: string().min(5).max(20),
      costPerDay: string().min(3).max(20),
      details: string(),
      image: string(),
    });
    try {
      await editSchema.validate(car, { abortEarly: false });
      setErrors([]);
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
      if (car.image instanceof File) {
        const imageRef = ref(storage, `carImages/${car.image.name}`);
        await uploadBytes(imageRef, car.image);
        const imageUrl = await getDownloadURL(imageRef);
        car.image = imageUrl; 
      }

      await updateDoc(doc(db, "cars", id), car);

      toast.success("Car information updated successfully", {
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
      console.error("Error updating car information:", error);
      toast.error("Error updating car information", {
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

  const handleEditClick = async () => {
    await fetchCarDetails(id);
  };

  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="col-md-2 btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#editModal"
        onClick={handleEditClick}
      >
        Edit
      </button>
      {/* Modal */}
      <div
        className="modal fade text-black"
        id="editModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editModalLabel">
                Edit Car Information
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
                  {errors.name ? (
                    <p className={styles["inputError"]}>{errors.name}</p>
                  ) : (
                    ""
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
                  {errors.costPerDay ? (
                    <p className={styles["inputError"]}>{errors.costPerDay}</p>
                  ) : (
                    ""
                  )}
                  <div className={styles["row"]}>
                    <label htmlFor="image">Upload Images</label>
                    <input
                      className="form-control w-50"
                      multiple
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </div>
                  {errors.image ? (
                    <p className={styles["inputError"]}>{errors.image}</p>
                  ) : (
                    ""
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
                  {errors.details ? (
                    <p className={styles["inputError"]}>{errors.details}</p>
                  ) : (
                    ""
                  )}

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
                      {!loader ? "Edit" : "wait..."}
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

export default EditModal;
