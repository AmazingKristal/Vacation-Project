import "./List.css";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart, { CategoryScale } from "chart.js/auto";
import FollowersModel from "../../../Models/FollowersModel";
import VacationsModel from "../../../Models/VacationsModel";
import dataService from "../../../Services/DataService";
import followersService from "../../../Services/FollowersService";
import notifyService from "../../../Services/NotifyService";

Chart.register(CategoryScale);

function List(): JSX.Element {

    let [vacations, setVacations] = useState<VacationsModel[]>([]);
    let [followers, setFollowers] = useState<FollowersModel[]>([]);


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


    // Calculate the number of followers for each vacation.
    let followersNumber = [];
    for(const v of vacations) {
        let count = 0;
        for(const f of followers) {
           if(f.vacationId === v.vacationId) {
            count++;
           }
        }
        followersNumber.push(count);
    }
 
    const labels = vacations.map(v => v.destination);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of followers",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: followersNumber,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Vacations",
        },
      },
      y: {
        title: {
          display: true,
          text: "Followers",
        },
        suggestedMin: 0,   
        suggestedMax: followers ? followers.length : 10, 
        stepSize: 1,      
      },
    },
  };

  return (
    <div className="List">
      <h2>Our followers graph</h2>
      <Bar data={data} options={options}/>
    </div>
  );
}

export default List;
