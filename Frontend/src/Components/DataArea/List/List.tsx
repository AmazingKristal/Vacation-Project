import "./List.css";
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Chart, { CategoryScale } from "chart.js/auto";
import FollowersModel from "../../../Models/FollowersModel";
import VacationsModel from "../../../Models/VacationsModel";
import dataService from "../../../Services/DataService";
import followersService from "../../../Services/FollowersService";
import notifyService from "../../../Services/NotifyService";
import { Button } from "@mui/base";

Chart.register(CategoryScale);

function List(): JSX.Element {

    let [vacations, setVacations] = useState<VacationsModel[]>([]);
    let [followers, setFollowers] = useState<FollowersModel[]>([]);

    
      let fileData = "destination,followers\r\n" + vacations.map(v => v.destination + "," + followers.filter(f => f.vacationId === v.vacationId).length).join("\r\n");
      const blob = new Blob([fileData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

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
      <a href={url} download={"xd.csv"}>Download CSV</a>
      <div className="graphDiv">
      <Bar data={data} options={options}/>
      </div>
    </div>
  );
}

export default List;
