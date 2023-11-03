import { NavLink, useNavigate } from "react-router-dom";
import VacationsModel from "../../../../Models/VacationsModel";
import "./VacationsCard.css";
import { useState, useEffect } from "react";
import UserModel from "../../../../Models/UserModel";
import { authStore } from "../../../../Redux/AuthState";
import followersService from "../../../../Services/FollowersService";
import FollowersModel from "../../../../Models/FollowersModel";
import notifyService from "../../../../Services/NotifyService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

interface VacationsCardProps {
	vacation: VacationsModel;
    delete: (vacationId: number) => void;
}

function VacationsCard(props: VacationsCardProps): JSX.Element {

    let [user, setUser] = useState<UserModel>();
    let [followers, setFollowers] = useState<FollowersModel[]>();
    let [showHearts, setShowHearts] = useState(false);
    let navigate =  useNavigate();

    useEffect(() => {
        followersService.getFollowersByVacation(props.vacation.vacationId)
        .then(f => setFollowers(f))
        .catch(err  => notifyService.error(err));
    }, []);

    useEffect(() => {
        setUser(authStore.getState().user);
        let unsubscribe = authStore.subscribe(() => setUser(authStore.getState().user));
        return unsubscribe;
    }, []);

    

    function deleteMe() {
        props.delete(props.vacation.vacationId);
    }

    function updateMe() {
        navigate('/update-vacations/' + props.vacation.vacationId);
    }

    // Handles the follow
    async function followMe() {
        // Check if the user is already following
        let isFollowing = followers.findIndex(f => f.userId === user.userId 
            && f.vacationId === props.vacation.vacationId);
            if(isFollowing < 0) {
                // Add the user to the follow list
                let follower = new FollowersModel();
                follower = {... follower, userId: user.userId, vacationId: props.vacation.vacationId};
                await followersService.addFollowers(follower);
                setFollowers([... followers, follower]);
            }
            else {
                // Delete the user from the follow list
                await followersService.deleteFollower(user.userId, props.vacation.vacationId);
                setFollowers(followers.filter(f => !(f.userId === user.userId 
                    && f.vacationId === props.vacation.vacationId)));

            }
        
    }

    return (
        <div className="VacationsCard">
            <div className="card card-div">
            <div>
                {user?.role === 1 && <button onClick={deleteMe} className="delete-button">Delete</button>}
                {user?.role === 1 && <button onClick={updateMe} className="update-button">Update</button>}
                {user?.role === 2 &&
                    <button onClick={followMe} className="follow-button">
                <FontAwesomeIcon icon={faHeart} className="heart-icon" />
                <span className="followers-count">{followers?.length}</span>
                </button>
                }
            </div>
                <img src={props.vacation.imageUrl}></img>
                <div>
                    <div className="destination-div">
			<span className="destination-span">{props.vacation.destination}</span>
            </div>
            <div className="description-container">
            <span>{props.vacation.description}</span>
            </div>
            <span className="date-span">{`${new Date(props.vacation.startDate).toLocaleDateString()} -
             ${new Date(props.vacation.endDate).toLocaleDateString()}`}</span>
            <div className="button-div">
            <button className="price-button">{props.vacation.price}$</button>
            </div>
            </div>
            </div>
            
        </div>
    );
}

export default VacationsCard;
