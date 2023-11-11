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
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function Home(): JSX.Element {

  let [vacations, setVacations] = useState<VacationsModel[]>([]);
  let [user, setUser] = useState<UserModel>();
  let [followers, setFollowers] = useState<FollowersModel[]>([]);
  let [filteredVacations, setFilteredVacations] = useState<VacationsModel[]>([]);
  let [followCheckbox, setFollowCheckbox] = useState(false);
  let [didntStartCheckbox, setDidntStartCheckbox] = useState(false);
  let [ongoingCheckbox, setOngoingCheckbox] = useState(false);
  let [deleteModal, setDeleteModal] = useState(false);
  let [specificVacId, setSpecificVacId] = useState(0);
  let [page, setPage] = useState(1);

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
  async function deleteVacation(): Promise<void> {
    try {
      await dataService.deleteVacation(specificVacId);
      notifyService.success("Vacation has been deleted successfully !");
      setVacations(vacations.filter(v => v.vacationId !== specificVacId));
      closeModal();
    } catch (err: any) {
      notifyService.error(err);
    }
  }

  // closes the modal
  function closeModal() {
    setDeleteModal(false);
  }

  // function to open the modal and to get us the vacationId we need to delete it later if we need.
  function openModal(vacationId: number) {
    setDeleteModal(true);
    setSpecificVacId(vacationId);
  }

  // show the followed vacations after the checkbox tick
  function showFollowedVac(checkbox: React.ChangeEvent<HTMLInputElement>) {
    if (checkbox.target.checked) {
      setFollowCheckbox(true);
      setDidntStartCheckbox(false);
      setOngoingCheckbox(false);
      let filteredFollowers = followers.filter(f => f.userId === user.userId);
      let followVac = vacations.filter(v => filteredFollowers.some(f => f.vacationId === v.vacationId))
      setFilteredVacations(followVac);
      setPage(1);
    } else {
      setFollowCheckbox(false);
    }
  }

  function didntStartYet(checkbox: React.ChangeEvent<HTMLInputElement>) {
    let now = new Date().toISOString();
    if (checkbox.target.checked) {
      setDidntStartCheckbox(true);
      setFollowCheckbox(false);
      setOngoingCheckbox(false);
      setFilteredVacations(vacations.filter((v) => v.startDate > now));
      setPage(1);
    } else {
      setDidntStartCheckbox(false);
    }
  }

  function onGoing(checkbox: React.ChangeEvent<HTMLInputElement>) {
    let now = new Date().toISOString();
    if (checkbox.target.checked) {
      setOngoingCheckbox(true);
      setFollowCheckbox(false);
      setDidntStartCheckbox(false);
      setFilteredVacations(
        vacations.filter((v) => v.startDate <= now && v.endDate >= now)
      );
      setPage(1);
    } else {
      setOngoingCheckbox(false);
    }
  }

  function changePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  // with this we can use pagination as needed.
  let itemsPerPage = 9;
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;

  let displayedArray = followCheckbox || didntStartCheckbox || ongoingCheckbox ? filteredVacations : vacations;

  let displayedVacations = displayedArray.slice(startIndex, endIndex);

  return (
    <div className="Home">
      <h2>Welcome to the vacation site !</h2>


      {(user?.role === 2) && <div className="checkbox-div">
        <div className="checkbox-content">

      <div className="form-check form-switch">
      <input className="form-check-input" type="checkbox" role="switch" id="followCheckBox" checked={followCheckbox} onChange={showFollowedVac}></input>
      <label className="form-check-label" htmlFor="followCheckBox">Show following</label>
      </div>

      <div className="form-check form-switch">
      <input className="form-check-input" type="checkbox" role="switch" id="didntStartCheckBox" checked={didntStartCheckbox} onChange={didntStartYet}></input>
      <label className="form-check-label" htmlFor="didntStartCheckBox">Show future vacations</label>
      </div>

      <div className="form-check form-switch">
      <input className="form-check-input" type="checkbox" role="switch" id="onChangeCheckBox" checked={ongoingCheckbox} onChange={onGoing}></input>
      <label className="form-check-label" htmlFor="onChangeCheckBox">Show ongoing vacations</label>
      </div>
      </div>
      </div>}


      {user?.role !== 1 && user?.role !== 2 && 
      <div className="offer-div">
          <h5>To see what we have to offer please login !</h5>
          <br/>
          <NavLink to="/login" className="btn btn-outline-primary">Login</NavLink>
        </div>}

        
        <div className="card-box">
        {(user?.role === 1 || user?.role === 2) && (
          (displayedVacations.length === 0 ? (
            <span>No vacations found!</span>
          ) : (
            displayedVacations.map((v) => (
              <VacationsCard
                key={v.vacationId}
                vacation={v}
                delete={openModal}
              ></VacationsCard>
            ))
          ))
        )}

      {/* {(user?.role === 1 || user?.role === 2) && (followCheckbox || didntStartCheckbox || ongoingCheckbox ? 
      ((filteredVacations.length === 0) ? <span>No vacations found!</span> : filteredVacations.map((v) => (
        <VacationsCard
          key={v.vacationId}
          vacation={v}
          delete={openModal}
        ></VacationsCard>
        )))
        : 
        vacations.map((v) => (
          <VacationsCard
            key={v.vacationId}
            vacation={v}
            delete={openModal}
          ></VacationsCard>
        ))
      )} */}

      {deleteModal && (
        <div className="modal" tabIndex={-1} role="dialog" style={{display: "block"}}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
              <button type="button" className="btn btn-primary" onClick={deleteVacation}>Delete</button>
            </div>
          </div>
        </div>
      </div>
      )}
      </div>
      {(user?.role === 1 || user?.role === 2) && <div className="page-div">
      <Stack spacing={2}>
      <Pagination count={Math.ceil(displayedArray.length / itemsPerPage)} page={page} onChange={changePage} color="primary" />
    </Stack>
    </div>}
    </div>
  );
}

export default Home;
