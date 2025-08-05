import trapezoidBg from "../launchpod-event/img/trapezoidbg.png";
import speakerImg from "../launchpod-event/img/speaker-img.png";
import fbImg from "../launchpod-event/img/fb.png";
import igImg from "../launchpod-event/img/ig.png";
import spotifyImg from "../launchpod-event/img/spotify.png";
import linkedinImg from "../launchpod-event/img/linkedin.png";
import webImg from "../launchpod-event/img/web.png";
import eventsTitleImg from "../launchpod-event/img/events-title.png";
import bgImg from "../launchpod-event/img/bg.jpg";
import "../launchpod-event/eventStyles.css";
import EventCountdown from "./EventCoundown";
import MotionUp from "../../components/animated/MotionUp";

const LaunchPodEventPage = () => {
  return (
    <div className="events-page">
      <MotionUp delay={0.1}>
        <img
          src={eventsTitleImg}
          alt="Events Title"
          className="events-title-img"
          draggable="false"
        />
        <h2>PRESENTS</h2>

        <h2>EVENT STARTS IN</h2>
      </MotionUp>
      <div className="py-1 sm:py-10"></div>
      <MotionUp delay={0.2}>
        <EventCountdown />
        <div className="sm: py-3"></div>
        <h2 className="!text-[2vw] !tracking-[1vw] !text-white !m-0 !text-center">
          August 27, 2025
        </h2>
     

      </MotionUp>
      <div className="py-1 sm:py-2"></div>
      <MotionUp delay={0.3}>
        <div className="divider">
          <div className="circle opacity-16"></div>
          <div className="circle opacity-40"></div>
          <div className="circle opacity-77"></div>
          <div className="center-bar"></div>
          <div className="circle opacity-77"></div>
          <div className="circle opacity-40"></div>
          <div className="circle opacity-16"></div>
        </div>
      </MotionUp>
      <MotionUp delay={0.2}>
        <h1>
          The Future of Work in the
          <br />
          Age of the
          <span style={{ color: "#01B7D7" }}> AI Gold Rush</span>
        </h1>
        <div className="py-3 sm:py-6"></div>
      </MotionUp>
      <MotionUp>
        <h1>
          Keynote
          <span style={{ color: "#01B7D7" }}> Speaker</span>
        </h1>
      </MotionUp>
      <MotionUp delay={1}>
        <img
          src={trapezoidBg}
          alt="Trape BG"
          className="trape-bg"
          draggable="false"
        />
      </MotionUp>
      <MotionUp delay={0.8}>
        <img
          src={speakerImg}
          alt="Speaker Image"
          className="speaker-img"
          draggable="false"
        />
      </MotionUp>
      <MotionUp delay={0.3}>
        <h3>
          <span style={{ color: "#01B7D7" }}>Scott</span>
          <br />
          Sherrill
        </h3>
      </MotionUp>
      <MotionUp delay={0.3}>
        <h4>
          <span style={{ color: "#01B7D7" }}>VP of Data Operations</span>
        </h4>
      </MotionUp>
      <MotionUp delay={0.3}>
        <h4>Redica Systems</h4>
      </MotionUp>
      <MotionUp delay={0.4}>
        <h5>
          Investor, Executive and Operator, Scott is the VP-Data Operations for
          pharma-tech venture-backed startup, Redica Systems. He was previously
          the COO of Aumni (a JP Morgan company). With over 15 years of
          leadership experience spanning operations, data, legal, and customer
          experience, he brings with him a strong track record of driving
          business growth and operational efficiency. He will talk about how a
          countryside talent can thrive successfully in fast-paced,
          venture-backed, high-growth startups.
        </h5>
      </MotionUp>
      <h6>
        <div className="event-details">
          <div className="event-details-inline">
            <MotionUp delay={0.5}>
              <span className="event-detail-inline">Panel Discussion</span>
            </MotionUp>
            <span className="event-detail-inline">•</span>
            <MotionUp delay={1}>
              <span className="event-detail-inline">Small Bites</span>
            </MotionUp>
            <span className="event-detail-inline">•</span>
            <MotionUp delay={1.5}>
              <span className="event-detail-inline">Drinks and Wine</span>
            </MotionUp>
          </div>
        </div>
      </h6>
      <MotionUp delay={0.2}>
        <div className="divider2">
          <div className="circle opacity-16"></div>
          <div className="circle opacity-40"></div>
          <div className="circle opacity-77"></div>
          <div className="center-bar"></div>
          <div className="circle opacity-77"></div>
          <div className="circle opacity-40"></div>
          <div className="circle opacity-16"></div>
        </div>
      </MotionUp>
      <MotionUp delay={0.4}>
       <h2 className="!text-[2vw] !tracking-[0.5vw]">Curious about us?</h2>
      </MotionUp>
      <div className="social-row">
        <MotionUp delay={0.6}>
          <a
            href="https://www.facebook.com/thefullsuitepod"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={fbImg}
              alt="Facebook"
              className="social-icon"
              draggable="false"
            />
          </a>
        </MotionUp>
        <MotionUp delay={0.8}>
          <a
            href="https://www.instagram.com/thefullsuitepod/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={igImg}
              alt="Instagram"
              className="social-icon"
              draggable="false"
            />
          </a>
        </MotionUp>
        <MotionUp delay={1}>
          <a
            href="https://open.spotify.com/show/4RkvO7uRfuCow52vKjutPj?si=2ac49945fdd14152"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={spotifyImg}
              alt="Spotify"
              className="social-icon"
              draggable="false"
            />
          </a>
        </MotionUp>
        <MotionUp delay={1.2}>
          <a
            href="https://www.linkedin.com/company/fullsuite"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={linkedinImg}
              alt="LinkedIn"
              className="social-icon"
              draggable="false"
            />
          </a>
        </MotionUp>
        <MotionUp delay={1.4}>
          <a
            href="https://getfullsuite.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={webImg}
              alt="Web"
              className="social-icon"
              draggable="false"
            />
          </a>
        </MotionUp>
      </div>
      <div className="py-3 sm:py-5"></div>
    </div>
  );
};

export default LaunchPodEventPage;
