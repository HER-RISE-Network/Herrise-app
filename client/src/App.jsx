import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./App.css";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
  <App />
</GoogleOAuthProvider>

// --- 1. ASSET IMPORTS ---
import heroImg from "./images/hero.jpg";
import authBg from "./images/hero.jpg";
import techImg from "./images/course1.jpg";
import courseImg from "./images/course2.jpg";
import rightsImg from "./images/rights.jpg";
import mentor1 from "./images/mentor1.jpg";
import mentor2 from "./images/mentor2.jpg";
import mentor3 from "./images/mentor3.jpg";
// Donation/Project Images (New imports)
import scholarshipImg from "./images/scholarship.jpg";
import techHubImg from "./images/school.jpg"
import safetyGearImg from "./images/food.jpg";

// Leaflet Icon Fix
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const SOCKET_SERVER_URL = "http://localhost:5000"; 

const mentorsData = [
  { id: "m1", name: "Alice Mwangi", career: "Civil Engineer", bio: "Expert in Structural Mechanics.", image: mentor1 },
  { id: "m2", name: "Jane Otieno", career: "Project Manager", bio: "Infrastructure lead in Nairobi.", image: mentor2 },
  { id: "m3", name: "Faith Kimani", career: "Environmentalist", bio: "Specializing in sustainable drainage.", image: mentor3 },
];

function App() {
  // --- 2. GLOBAL STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  const [activeSection, setActiveSection] = useState("home");
  const [heroText, setHeroText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [scholarPoints, setScholarPoints] = useState(1250); 
  const [mentorFilter, setMentorFilter] = useState("All");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [reportCoords, setReportCoords] = useState({ lat: -1.286389, lng: 36.817223 });

  // Chat & Community States
  const [realOnlineUsers, setRealOnlineUsers] = useState([]);
  const [chatType, setChatType] = useState("public"); 
  const [activeRecipient, setActiveRecipient] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [publicMessages, setPublicMessages] = useState([]);
  const [privateThreads, setPrivateThreads] = useState({}); 

  const socketRef = useRef();

  // --- 3. CORE LOGIC (Sockets & Animations) ---
  useEffect(() => {
    if (isLoggedIn && user?.token) {
      socketRef.current = io(SOCKET_SERVER_URL, { auth: { token: user.token } });
      socketRef.current.on("online-users", (users) => setRealOnlineUsers(users.filter(u => u.id !== user.id)));
      socketRef.current.on("message", (msg) => setPublicMessages(prev => [...prev, msg]));
      socketRef.current.on("private-message", (msg) => {
        const partnerId = msg.fromUserId === user.id ? msg.toUserId : msg.fromUserId;
        setPrivateThreads(prev => ({ ...prev, [partnerId]: [...(prev[partnerId] || []), msg] }));
      });
      return () => socketRef.current.disconnect();
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (isLoggedIn && activeSection === "home") {
      const fullText = "Empowering Women Through Knowledge & Community";
      let i = 0; setHeroText("");
      const interval = setInterval(() => {
        setHeroText(fullText.slice(0, i + 1)); i++;
        if (i === fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, activeSection]);

  const handleAuth = (e) => { 
    e.preventDefault();
    setUser({ id: "user_777", name: "Alicia", email: "alicia@herrise.org", role: "Civil Engineer Student", token: "jwt_secure_999" });
    setIsLoggedIn(true); 
  };

  function LocationMarker() {
    useMapEvents({ click(e) { setReportCoords(e.latlng); } });
    return <Marker position={reportCoords}><Popup>Incident Pinned.</Popup></Marker>;
  }

  // --- 4. AUTH VIEW ---
 if (!isLoggedIn) return (
  /* Apply the imported 'authBg' here via inline styles */
  <div 
    className="auth-page-wrapper" 
    style={{ backgroundImage: `url(${authBg})` }}
  >
    <div className="auth-overlay">
      <div className="auth-card animate-pop">
        <h1 className="auth-logo">HerRise</h1>
        <p className="auth-subtitle">Empowering Women in STEM</p>
        
        <form onSubmit={handleAuth} className="auth-form">
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <button className="btn-primary" type="submit">Sign In</button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button 
          className="btn-google" 
          type="button"
          onClick={() => {
            // Mock login logic
            setUser({ name: "Google User", role: "Engineer", token: "abc" });
            setIsLoggedIn(true);
          }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" alt="Google" />
          Continue with Google
        </button>
        
        <p className="auth-footer">Don't have an account? <span>Sign Up</span></p>
      </div>
    </div>
  </div>
);
  return (
    <div className="App">
      {/* NAVIGATION BAR WITH PROFILE TOGGLE */}
      <nav className="navbar">
        <div className="logo">HerRise</div>
        <div className="top-nav-links">
          <button onClick={() => setActiveSection("home")}>Dashboard</button>
          <button className="profile-nav-btn" onClick={() => setShowProfile(!showProfile)}>👤 Profile</button>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Log Out</button>
        </div>
      </nav>

      {/* PROFILE DROPDOWN MODAL */}
      {showProfile && (
        <div className="profile-overlay-card animate-pop">
          <h3>My Profile</h3>
          <div className="profile-details">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <div className="scholar-badge">🏆 {scholarPoints} Scholar Points</div>
          </div>
          <button className="close-profile" onClick={() => setShowProfile(false)}>Close</button>
        </div>
      )}

      <aside className="sidebar">
        {["home", "courses", "mentorship", "donate", "community", "report"].map(item => (
          <button key={item} className={activeSection === item ? "active" : ""} onClick={() => setActiveSection(item)}>
            {item.toUpperCase()}
          </button>
        ))}
      </aside>

      <main className="content">
        <div className="announcement-bar">
          <p>📢 <strong>Scholarship Alert:</strong> Top scholars in the 'Rights' category win 5,000 KES tuition credits this week!</p>
        </div>

        {/* HERO */}
        {activeSection === "home" && (
          <section className="hero">
            <img src={heroImg} alt="Hero" className="hero-img" />
            <div className="hero-overlay">
              <h1 className="typing-text">{heroText}</h1>
              <p className="hero-subtext-animate">Scaling New Heights in Engineering and Tech</p>
            </div>
          </section>
        )}

        {/* COURSES SECTION (Detailed categorization) */}
        {(activeSection === "home" || activeSection === "courses") && (
          <section className="courses reveal-section">
            <h2 className="animated-heading zoom">COURSES</h2>
            <div className="grid">
              
              {/* CARD 1: TECH SKILLS (Fee Based) */}
              <div className="card course-card labeled-card" data-label="Tech Skill">
                <img src={techImg} alt="Tech" />
                <div className="card-body">
                  <h3>Tech Skills</h3>
                  <select className="course-select">
                    <option>frontend — 1,500 KES</option>
                    <option>React & Node.js — 4,000 KES</option>
                    <option>dart and flutter — 2,000 KES</option>
                  </select>
                  <div className="progress-container"><div className="progress-bar" style={{width: '65%'}}></div></div>
                  <button className="btn-primary" onClick={() => setScholarPoints(prev => prev + 10)}>Enroll in Tech</button>
                </div>
              </div>
              
              {/* CARD 2: SOFT SKILLS (Free) */}
              <div className="card course-card labeled-card" data-label="Soft Skill">
                <img src={courseImg} alt="Soft Skills" />
                <div className="card-body">
                  <h3>soft skills</h3>
                  <select className="course-select">
                    <option>Public Speaking — FREE</option>
                    <option>Project Management 101 — 1500ksh</option>
                    <option>Emotional Intelligence — FREE</option>
                  </select>
                  <div className="progress-container"><div className="progress-bar" style={{width: '10%'}}></div></div>
                  <button className="btn-free">Access Free Course</button>
                </div>
              </div>

              {/* CARD 3: KNOW YOUR RIGHTS (Gamified) */}
              <div className="card course-card labeled-card" data-label="Know Your Rights">
                <img src={rightsImg} alt="Rights" />
                <div className="card-body">
                  <h3>Know Your Rights</h3>
                  <select className="course-select">
                    <option>Labor & Contract Law</option>
                    <option>Workplace Safety (OSHA)</option>
                    <option>Equality & Inclusion Acts</option>
                  </select>
                  <div className="gamified-stats">
                    <p>Current Rank: <strong>Scholar Tier 1</strong></p>
                    <p>Correct Answers: 45/50</p>
                  </div>
                  <button className="btn-danger" onClick={() => {alert("Correct! +50 Points"); setScholarPoints(prev => prev + 50);}}>Take Rights Quiz</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MENTORSHIP */}
        {(activeSection === "home" || activeSection === "mentorship") && (
          <section className="mentorship reveal-section">
            <div className="section-header-flex">
              <h2 className="animated-heading sway">Mentorship Hub</h2>
              <select className="filter-select" onChange={(e) => setMentorFilter(e.target.value)}>
                <option value="All">All Sectors</option>
                <option value="Civil Engineer">Civil Engineering</option>
                <option value="Project Manager">Project Management</option>
              </select>
            </div>
            <div className="grid">
              {mentorsData.filter(m => mentorFilter === "All" || m.career === mentorFilter).map(m => (
                <div key={m.id} className="mentor-card">
                  <img src={m.image} alt={m.name} />
                  <h3>{m.name}</h3><p>{m.career}</p>
                  <button className="btn-primary" onClick={() => setSelectedMentor(m)}>Book Session</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* COMMUNITY CHAT */}
        {activeSection === "community" && (
          <section className="community-section">
            <div className="chat-interface">
              <div className="chat-tabs">
                <button className={chatType === "public" ? "tab active" : "tab"} onClick={() => {setChatType("public"); setActiveRecipient(null);}}>🌐 Public</button>
                {realOnlineUsers.map(u => (
                  <button key={u.id} className={activeRecipient?.id === u.id ? "tab active" : "tab"} onClick={() => {setChatType("private"); setActiveRecipient(u);}}>👤 {u.name}</button>
                ))}
              </div>
              <div className="chat-window">
                <div className="messages`-list">
                  {(chatType === "public" ? publicMessages : (privateThreads[activeRecipient?.id] || [])).map((msg, i) => (
                    <div key={i} className={`message-bubble ${msg.userId === user.id || msg.fromUserId === user.id ? "sent" : "received"}`}>
                      <small>{msg.name || msg.fromName}</small><p>{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form className="chat-input-area" onSubmit={(e) => { 
                  e.preventDefault(); 
                  if(!chatInput.trim()) return;
                  socketRef.current.emit(chatType === "public" ? "message" : "private-message", chatType === "public" ? chatInput : { toUserId: activeRecipient.id, text: chatInput });
                  setChatInput("");
                }}>
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type..." />
                  <button type="submit">Send</button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* DONATE PROJECTS: Each with Image and Description */}
        {(activeSection === "home" || activeSection === "donate") && (
          <section className="donate reveal-section">
            <h2 className="animated-heading zoom">Ongoing Support</h2>
            <div className="grid">
               
               <div className="card donate-card project-card">
                 <img src={scholarshipImg} alt="STEM Scholarship" className="project-card-img" />
                 <div className="project-tag">Active</div>
                 <h3>STEM Scholarships</h3>
                 <p>Tuition support for female final-year engineering students facing financial hardship in Kenyan universities.</p>
                 <button className="btn-mpesa">Donate via M-PESA</button>
               </div>
               
               <div className="card donate-card project-card">
                 <img src={techHubImg} alt="Turkana Tech Hub" className="project-card-img" />
                 <div className="project-tag">Phase 1</div>
                 <h3>Turkana Tech Hub</h3>
                 <p>Buiilding a school to promote education in remote areas.</p>
                 <button className="btn-mpesa">Donate via M-PESA</button>
               </div>
               
               <div className="card donate-card project-card">
                 <img src={safetyGearImg} alt="Safety Gear Fund" className="project-card-img" />
                 <div className="project-tag">Critical</div>
                 <h3>Basic women needs</h3>
                 <p>Help build and raise a woman of substance in this difficult and harsh world.</p>
                 <button className="btn-mpesa">Donate via M-PESA</button>
               </div>
            </div>
          </section>
        )}

        {/* REPORT SECTION (Live Map) */}
        {activeSection === "report" && (
          <section className="report-container">
            <div className="report-flex">
              <div className="report-form-box">
                <h2>Safety Report</h2>
                <div className="coords-display">{reportCoords.lat.toFixed(5)}, {reportCoords.lng.toFixed(5)}</div>
                <form className="report-form"><textarea placeholder="Incident details..."></textarea><button className="btn-danger">Submit Confidential Report</button></form>
              </div>
              <div className="map-wrapper">
                <MapContainer center={[-1.286389, 36.817223]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
            </div>
          </section>
        )}
        {/* STATS, PARTNERSHIPS & CONTACT (HOME ONLY) */}
        {activeSection === "home" && (
          <>
            <section className="stats-horizontal-container">
              <div className="stats-horizontal">
                <div className="stat-item"><h3>50+</h3><p>Projects</p></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><h3>12</h3><p>Partners</p></div>
                <div className="stat-divider"></div>
                <div className="stat-item"><h3>1,200+</h3><p>Impacted</p></div>
              </div>
            </section>

            <section className="partnerships-horizontal-container">
              <div className="partners-horizontal">
                <div className="partner-item">IEK Kenya</div>
                <div className="partner-item">UNESCO</div>
                <div className="partner-item">Safaricom</div>
              </div>
            </section>

            <section className="contact-dev-section">
              <div className="dev-column">
                <h3 className="section-subtitle">Lead Developers</h3>
                {[1, 2].map((dev) => (
                  <div key={dev} className="dev-card-mini">
                    <img src={`https://via.placeholder.com/150`} alt="Dev" />
                    <div className="dev-info">
                      <h4>Developer Name</h4>
                      <p>Full Stack Engineer</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-form-column">
                <h3>Get In Touch</h3>
                <form className="contact-form">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                  <textarea placeholder="Your Message" rows="4" required></textarea>
                  <button type="submit" className="btn-send">Send Message</button>
                </form>
              </div>

              <div className="contact-info-column">
                <div className="info-box"><h4>Office Location</h4><p>Tech Hub, Nairobi</p></div>
                <div className="info-box"><h4>Email Us</h4><p>support@herrise.org</p></div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
export default App;