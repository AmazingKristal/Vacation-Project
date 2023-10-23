import { useState, useEffect, ChangeEventHandler } from "react";
import VacationsModel from "../../../Models/VacationsModel";
import dataService from "../../../Services/DataService";
import notifyService from "../../../Services/NotifyService";
import "./Home.css";
import VacationsCard from "../VacationsArea/VacationsCard/VacationsCard";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import { NavLink } from "react-router-dom";
import FollowersModel from "../../../Models/FollowersModel";
import followersService from "../../../Services/FollowersService";
import { FollowersStore } from "../../../Redux/FollowersState";

function Home(): JSX.Element {

  let [vacations, setVacations] = useState<VacationsModel[]>([]);
  let [user, setUser] = useState<UserModel>();
  let [followers, setFollowers] = useState<FollowersModel[]>();
  let [filteredVacations, setFilteredVacations] = useState<VacationsModel[]>([]);
  let [followCheckbox, setFollowCheckbox] = useState(false);
  let [didntStartCheckbox, setdidntStartCheckbox] = useState(false);
  let [ongoingCheckbox, setOngoingCheckbox] = useState(false);

  useEffect(() => {
    dataService
      .getAllVacations()
      .then((v) => setVacations(v))
      .catch((err) => notifyService.error(err.message));
  }, []);

  useEffect(() => {
    followersService.getAllFollowers()
    .then(f => setFollowers(f))
    .catch(err  => notifyService.error(err));
}, []);

  useEffect(() => {
    setUser(authStore.getState().user);
    let unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
    return unsubscribe;
}, []);

// Delete vacation
  async function deleteVacation(vacationId: number): Promise<void> {
    try {
      await dataService.deleteVacation(vacationId);
      notifyService.success("Vacation has been deleted successfully !");
      setVacations(vacations.filter(v => v.vacationId !== vacationId));
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  // show the followed vacations after the checkbox tick
  function showFollowedVac(checkbox: React.ChangeEvent<HTMLInputElement>) {
    if (checkbox.target.checked) {
      setFollowCheckbox(true);
      let filteredFollowers = followers.filter(f => f.userId === user.userId);
      console.log(filteredFollowers);
      console.log(followers);
      let followVac = vacations.filter(v => filteredFollowers.some(f => f.vacationId === v.vacationId))
      setFilteredVacations(followVac);
    } else {
      setFollowCheckbox(false);
    }
  }

  function didntStartYet(checkbox: React.ChangeEvent<HTMLInputElement>) {
    let now = new Date().toISOString();
    if (checkbox.target.checked) {
      setDidntStartCheckbox(true);
      setFilteredVacations(vacations.filter((v) => v.startDate > now));
    } else {
      setDidntStartCheckbox(false);
    }
  }

  function onGoing(checkbox: React.ChangeEvent<HTMLInputElement>) {
    let now = new Date().toISOString();
    if (checkbox.target.checked) {
      setOngoingCheckbox(true);
      setFilteredVacations(
        vacations.filter((v) => v.startDate <= now && v.endDate >= now)
      );
    } else {
      setOngoingCheckbox(false);
    }
  }

  const itemsPerPage = 9; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);


  // Calculate the range of items to display on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the vacations array to get the items for the current page
  const displayedVacations = vacations.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(vacations.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="Home">
      <h2>Welcome to the vacation site !</h2>
      {(user?.role === 2) && <div className="checkbox-div">
      <label htmlFor="following-checkbox">filter by following</label>
      <input type="checkbox" id="following-checkbox" className="following-checkbox" onChange={showFollowedVac}></input>

      <label htmlFor="didntstart-checkbox">filter by didnt start yet</label>
      <input type="checkbox" id="didntstart-checkbox" className="didntstart-checkbox" onChange={didntStartYet}></input>

      <label htmlFor="ongoing-checkbox">filter by going on</label>
      <input type="checkbox" id="ongoing-checkbox" className="ongoing-checkbox" onChange={onGoing}></input>
      </div>}


      {user?.role !== 1 && user?.role !== 2 && 
      <div className="offer-div">
          <h5>To see what we have to offer please login !</h5>
          <br/>
          <NavLink to="/login" className="btn btn-outline-primary">Login</NavLink>
        </div>}
        <div className="card-box">

      {(user?.role === 1 || user?.role === 2) && (followCheckbox || didntStartCheckbox || ongoingCheckbox ? 
      ((filteredVacations.length === 0) ? <span>No vacations found!</span> : filteredVacations.map((v) => (
        <VacationsCard
          key={v.vacationId}
          vacation={v}
          delete={deleteVacation}
        ></VacationsCard>
        )))
        :
        displayedVacations.map((v) => (
          <VacationsCard
            key={v.vacationId}
            vacation={v}
            delete={deleteVacation}
          ></VacationsCard>
        ))
      )}

      {/* {(user?.role === 1 || user?.role === 2) && displayedVacations.map((v) => (
        <VacationsCard
          key={v.vacationId}
          vacation={v}
          delete={deleteVacation}
        ></VacationsCard>
      ))} */}
      </div>

      {(user?.role === 1 || user?.role === 2) && <div className="page-div">
        <button className="btn btn-outline-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            className="btn btn-outline-primary"
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-outline-primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>}
    </div>
  );
}

export default Home;
