import Header from "./Header";
import './About.css';
import React, { useEffect, useState } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://www.ftcmaster.org/";
export default function About() {
  const { pathname} = useLocation();

  useEffect(() => {
    let desc = document.querySelector("meta[name='description']");
    if (!desc) {
        desc = document.createElement("meta");
        desc.name = "description";
        document.head.appendChild(desc);
    }
    desc.content = "Learn about FTCMaster, a resource for FTC robotics teams, competitions, and strategy insights. Visualize powerful metrics";
  }, []);
  useEffect(() => {
    // Check if a canonical link already exists
    let link = document.querySelector("link[rel='canonical']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }

    // Set the href to the full URL
    link.href = `${BASE_URL}${pathname}`;
  }, [pathname]);
  return (
    <div className="about-screen">
      <Header />
      <div className="about-box">
        <h2 className="about-title">About FTCMaster</h2>
        <h3><u>What is FTCMaster?</u></h3>
        <p>FTCMaster is a comprehensive tool for analyzing and visualizing FTC team data and history.
        It was developed by <a href="https://h-webster.github.io/" target="_blank">Harrison</a>, who is apart of <a href="https://ftcmaster.org/teams/25702" target="_blank">Rundle Robotics Castle 25702. </a>
        FTCMaster is aimed to help teams find unique data and advanced insights to help support team scouting and strategy. For example in FTC INTO THE DEEP 2024-2025, the website made predictions on what role a team will play in an alliance (specimen or sample).
        </p>
        <br />
        <br />
        <h3><u>Future Plans</u></h3>
        FTCMaster isn't fully done and I'm currently working on new features. Here are planned features:
        <ul>
          <li>Event insights/breakdowns</li>
          <li>Dark/Light Mode</li>
          <li>More detailed team analytics</li>
          <li>Mobile improvements</li>
        </ul>
        <br />
        <br />
        <h3><u>Acknowledgements</u></h3>
        <p>FTCMaster is inspired by many other FTC tools and resources, especially <a href="https://ftcscout.org/" target="_blank">FTCScout</a> and <a href="https://theorangealliance.org/" target="_blank">The Orange Alliance</a>. For the OPR stats I used the api data from <a href="https://ftcscout.org/" target="_blank">FTCScout</a> and all other data from <a href="https://ftc-events.firstinspires.org/services/API" target="_blank">FTC Events API</a>.</p>
          </div>
      <Analytics/>
    </div>
  );
}
