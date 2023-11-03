import { useForm } from "react-hook-form";
import "./Insert.css";
import VacationsModel from "../../../Models/VacationsModel";
import notifyService from "../../../Services/NotifyService";
import dataService from "../../../Services/DataService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Insert(): JSX.Element {
  let [source, setSource] = useState<string>();
  let { register, handleSubmit, watch } = useForm<VacationsModel>();
  let navigate = useNavigate();
  let image = watch("image");

  useEffect( () => {
    if(image) {
      let url = URL.createObjectURL((image as unknown as FileList)[0]);
      setSource(url);
    }

  }, [image]);

  async function send(vacation: VacationsModel) {
    try {
      // Convert the files list to have only a single file type:
      vacation.image = (vacation.image as unknown as FileList)[0];
      await dataService.addVacation(vacation);
      notifyService.success("Vacation has been added successfully !");
      navigate("/home");
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  return (
    <div className="Insert">
      <h2>Add a vacation</h2>

      <div>
        <form onSubmit={handleSubmit(send)}>
          <label>Destination: </label>
          <input
            type="text"
            {...register("destination")}
            required
            minLength={2}
            maxLength={30}
          />
          <label>Description: </label>
          <input
            type="textarea"
            {...register("description")}
            required
            minLength={2}
            maxLength={300}
          />
          <label>Starting date: </label>
          <input type="date" {...register("startDate")} required />
          <label>Ending date: </label>
          <input type="date" {...register("endDate")} required />
          <label>Price: </label>
          <input
            type="number"
            {...register("price")}
            required
            min={0}
            max={2000}
          />
          <label htmlFor="fileInput" className="file-label">Image:
          <input id="fileInput" className="fileInput" type="file" accept="image/*" {...register("image")} required />
          <div className="file-preview">
            {source ? <img id="previewImage" src={source} alt="Preview"/> : <p>Select an image</p>}
          </div>
          </label>
          
          <button>Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Insert;
