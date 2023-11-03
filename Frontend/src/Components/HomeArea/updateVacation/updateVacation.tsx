import { useNavigate, useParams } from "react-router-dom";
import "./updateVacation.css";
import { useForm } from "react-hook-form";
import VacationsModel from "../../../Models/VacationsModel";
import dataService from "../../../Services/DataService";
import notifyService from "../../../Services/NotifyService";
import { useEffect, useState } from "react";


function UpdateVacation(): JSX.Element {
  let [source, setSource] = useState<string>();
  let { register, handleSubmit, setValue, watch } = useForm<VacationsModel>();
  let navigate = useNavigate();
  let params = useParams();
  let id = Number(params.vacationId);
  let image = watch("image");

  useEffect( () => {
    if(image && (image as unknown as FileList).length > 0) {
      console.log(image);
      let url = URL.createObjectURL((image as unknown as FileList)[0]);
      setSource(url);
    }
  }, [image]);

  useEffect(() => {
    dataService
      .getOneVacation(id)
      .then((v) => {
        setSource(v.imageUrl);
        setValue("destination", v.destination);
        setValue("description", v.description);
        setValue(
          "startDate",
          v.startDate.substring(0, v.startDate.indexOf("T"))
        );
        setValue("endDate", v.endDate.substring(0, v.startDate.indexOf("T")));
        setValue("price", v.price);
      })
      .catch((err) => notifyService.error(err));
  }, []);

  async function send(vacation: VacationsModel) {
    try {
      vacation.vacationId = id;
      // Convert the files list to have only a single file type:
      vacation.image = (vacation.image as unknown as FileList)[0];
      console.log(vacation);
      await dataService.updateVacation(vacation);
      notifyService.success("Vacation has been added successfully !");
      navigate("/home");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="updateVacation">
      <div>
        <h2>Update Vacation</h2>
        <form onSubmit={handleSubmit(send)}>
          <label>Destination: </label>
          <input
            type="text"
            {...register("destination")}
            minLength={2}
            maxLength={30}
          />
          <div className="description-div">
          <label>Description: </label>
          <textarea
            {...register("description")}
            minLength={2}
            maxLength={1000}
          />
          </div>
          <label>Starting date: </label>
          <input
            type="date"
            {...register("startDate", { valueAsDate: true })}
          />
          <label>Ending date: </label>
          <input type="date" {...register("endDate", { valueAsDate: true })} />
          <label>Price: </label>
          <input type="number" {...register("price")} min={0} max={2000} />
          <label htmlFor="fileInput" className="file-label">
            Image:
            <input
              id="fileInput"
              className="fileInput"
              type="file"
              accept="image/*"
              {...register("image")}
              required
            />
            <div className="file-preview">
              <img id="previewImage" src={source} alt="Preview" />
              {!source && <p>Select an image</p>}
            </div>
          </label>
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateVacation;
