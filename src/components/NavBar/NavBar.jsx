import React, { useState } from "react";
import './NavBar.css'
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

function NavBar() {
	const [showMessage, setShowMessage] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);
	const [inputValue, setInput] = useState("");
	const [isDashboardOpen, setIsDashboardOpen] = useState(false);

	const navigate = useNavigate();

	const handleLogoutClick = () => {
		setShowMessage(true);
		setIsDisabled(true);
	};

	const handleConfirm = () => {
		setShowMessage(false);
		setIsDisabled(false);

		navigate('/login');
	};

	const handleCancel = () => {
		setShowMessage(false);
		setIsDisabled(false);
	};

	const handleInputChange = (event) => {
		setInput(event.target.value);
	};

	const handleClearButton = () => {
		setInput("");
	};

	const toggleDashboard = () => {
		setIsDashboardOpen(!isDashboardOpen);
	};

	const closeDashboard = () => {
		setIsDashboardOpen(false);
	};

	const navigateAndClose = (url) => {
		closeDashboard();
		navigate(url);
	};

	return (
		<>
			<div className="navbar">
				<div className="blur"></div>
				<div className="logo-container">
					<Link to="/home" className={isDisabled ? "disabled-link" : ""}>
						<img src="./public/lobic_logo.png" className="logo" alt="Logo" />
					</Link>
				</div>

				<ul className="navbar-items">
					<li>
						<Link
							to="/home"
							className={`navbar-link ${isDisabled ? "disabled-link" : ""}`}
						>
							<img
								className="navbar-home"
								src="./public/home.png"
								alt="Home Icon"
							/>
						</Link>
					</li>
					<li>
						<Link
							to="/lobby"
							className={`navbar-link ${isDisabled ? "disabled-link" : ""}`}
						>
							<img
								className="navbar-icons"
								src="./public/people.png"
								alt="Friends Icon"
							/>
						</Link>
					</li>
					<li>
						<Link
							to="/playlists"
							className={`navbar-link ${isDisabled ? "disabled-link" : ""}`}
						>
							<img
								className="navbar-icons"
								src="./public/playlist.png"
								alt="Playlist Icon"
							/>
						</Link>
					</li>
					<li>
						<Link
							to="/notifications"
							className={`navbar-link ${isDisabled ? "disabled-link" : ""}`}
						>
							<img
								className="navbar-bell"
								src="./public/bell.png"
								alt="Notifications Icon"
							/>
						</Link>
					</li>
				</ul>

				<SearchBar
					isDisabled={isDisabled}
					inputValue={inputValue}
					onInputChange={handleInputChange}
					onClearInput={handleClearButton}
				/>

				<div className="user-icon">
					<button className="profile-button" onClick={() => {navigateAndClose('/profile')}}>
						<img src="/public/sadit.jpg" className="profile-pic" alt="Profile" />
					</button>
				</div>

				<div className="logout">
					<button
						className="logout-button"
						onClick={handleLogoutClick}
						disabled={isDisabled}
						style={{ pointerEvents: isDisabled ? "none" : "auto" }}
					>
						<img
							className="navbar-button"
							src="./public/logout.png"
							alt="Logout"
						/>
					</button>
				</div>

				<div className="hamburger">
					<button
						className="hamburger-button"
						style={{ pointerEvents: isDisabled ? "none" : "auto" }}
						onClick={toggleDashboard}
					>
						<img
							src="./public/hamburger.png"
							className="hamburger-icon"
							alt="Hamburger"
						/>
					</button>
				</div>

				{isDashboardOpen && (
					<>
						<div className="overlay" onClick={closeDashboard}></div>
						<div className="dashboard open">
							<div className="dashboard-content">
								<h2>Dashboard</h2>
								<button className='dashboard-buttons' onClick={() => navigateAndClose("/home")}>Home</button>
								<button className='dashboard-buttons' onClick={() => navigateAndClose("/playlists")}>
									Playlists
								</button>
								<button className='dashboard-buttons' onClick={() => navigateAndClose("/notifications")}>
									Notifications
								</button>
								<button className='dashboard-buttons' onClick={() => navigateAndClose("/lobby")}>
									Lobby
								</button>
								<button className='dashboard-buttons' onClick={() => navigateAndClose("/profile")}>
									Profile
								</button>
							</div>
						</div>
					</>
				)}
			</div>

			{showMessage && (
				<div className="floating-message">
					<p>Are you sure you want to logout?</p>
					<div className="button-group">
						<button className="confirm-button" onClick={handleConfirm}>
							Confirm
						</button>
						<button className="cancel-button" onClick={handleCancel}>
							Cancel
						</button>
					</div>
				</div>
			)}
		</>
	);
}

export default NavBar;
