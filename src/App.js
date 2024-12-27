import React, { useState, useEffect, act } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { auth, provider, signInWithPopup, signOut } from './firebase';
import { Footer, Blog, Possibility, Features, WhatNETWORKINSIDER } from './containers';
import { Brand, CTA, Navbar } from './components';
import './App.css';
import { Parallax } from 'react-scroll-parallax';
import { ParallaxProvider } from 'react-scroll-parallax';
{/*import people from 'assets/people.png';
import './header.css';*/}

const Header = ({ events }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setError(null);
      const url = 'https://script.google.com/macros/s/AKfycbzBKpjnDvlikSXeYdbxFv11QG-J7zHEdq_TvYtWQs9QcSQQuUcSyOpdlIMOYOJIsG18/exec';

      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=' + encodeURIComponent(email)
      })
      .then(() => {
        setIsSubscribed(true);
        setEmail('');
        setIsLoading(false);
        // Reset subscription state after 3 seconds
        setTimeout(() => setIsSubscribed(false), 2000);
      })
      .catch(error => {
        setError('Oops! Something went wrong. Please try again.');
        setIsLoading(false);
      });
    }
  };

  return (
    <div className={`NI__header section__padding ${isSticky ? 'sticky' : ''}`} id="home">
      <div className="NI__header-image">
        <EventList events={events} />
      </div>
        <div className="NI__header-content">
          <div className="NI__header-title">
            <h1 className="gradient__text">Weekly Newsletter</h1>
          </div>
          <p>We send a weekly newsletter on Monday at 11am featuring that week's events.</p>
          <form onSubmit={handleSubscribe} className="NI__header-content__input">
          <input 
            type="email" 
            placeholder="Your Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className={isSubscribed ? 'subscribed' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        
        {error && <p className="error-message">{error}</p>}

        <div className="NI__header-content__people">
          {/*<img src={people} />
          <p>1,600 people requested access a visit in last 24 hours</p>*/}
        </div>
        
      </div>
    </div>
  );
};








const NewsletterSubscription = ({ user }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSubscribe = async () => {
    try {
      console.log("Attempting to subscribe with email:", user.email);
      const response = await axios.post("http://localhost:5005/api/subscribe", {
        email: user.email,
        name: user.displayName
      });
      console.log("Subscription response:", response);
      if (response.status === 200) {
        setSubscribed(true);
        alert("Subscribed successfully!");
      }
    } catch (error) {
      console.error("Subscription error:", error.response?.data || error.message);
      alert("Subscription failed. Please try again.");
    }
  };
  
  const handleUnsubscribe = async () => {
    try {
      const response = await axios.post("http://localhost:5005/api/unsubscribe", {
        email: user.email
      });
      if (response.status === 200) {
        setSubscribed(false);
        setDropdownVisible(false);
      }
    } catch (error) {
      console.error("Unsubscription error:", error);
      alert("Unsubscription failed. Please try again.");
    }
  };

  return (
    <div className="newsletter-subscription">
      {subscribed ? (
        <button
          className="subscribe-btn subscribed"
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          Subscribed
        </button>
      ) : (
        <button className="subscribe-btn" onClick={handleSubscribe}>
          Subscribe
        </button>
      )}
      {dropdownVisible && (
        <div className="dropdown-menu">
          <button className="unsubscribe-btn" onClick={handleUnsubscribe}>
            Unsubscribe
          </button>
        </div>
      )}
    </div>
  );
};











const isToday = (dateString) => {
  const today = new Date();
  const eventDate = new Date(dateString);

  return (
    today.getDate() === eventDate.getDate() &&
    today.getMonth() === eventDate.getMonth() &&
    today.getFullYear() === eventDate.getFullYear()
  );
};

const LoginPage = ({ onSignIn }) => (
  <div className="login-page">
    <div className="gradient-outline-box">
      <h1>Welcome to <span className="gradient__text">Network Insider</span></h1>
      <p>All networking events at Stanford and in the Bay Area</p>
      <button onClick={onSignIn} className="sign-in-btn">Sign in</button>
    </div>
  </div>
);

const ProfileDropdown = ({ user, onSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignOut();
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <div className="profile-dropdown">
      <img
        src={user.photoURL}
        alt="Profile"
        className="profile-photo"
        onClick={handleDropdownToggle}
      />
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <p>{user.displayName}</p>
            <p>{user.email}</p>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const formatEventTime = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return date.toLocaleTimeString('en-US', options);
};

const groupEventsByDate = (events) => {
  // Group by date and sort by time
  const groupedEvents = {};
  events.forEach(event => {
    const eventDate = new Date(event.date._seconds * 1000);
    const dateKey = eventDate.toLocaleDateString(); // Use date string as key

    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  // Sort by date and within each date, sort by time
  const sortedGroupedEvents = Object.keys(groupedEvents)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(dateKey => {
      const eventsOnDate = groupedEvents[dateKey].sort((a, b) => a.date._seconds - b.date._seconds);
      return { date: dateKey, events: eventsOnDate };
    });

  return sortedGroupedEvents;
};

const EventList = ({ events }) => {
  const [isSticky, setIsSticky] = useState(false);

  const groupedEvents = groupEventsByDate(events);

  useEffect(() => {
    const handleScroll = () => {
      const eventDates = document.querySelectorAll('.event-date');
      eventDates.forEach((dateElement, index) => {
        const rect = dateElement.getBoundingClientRect();
        if (rect.top <= 0) {
          setIsSticky(true); // Set sticky when the top reaches the viewport
        } else {
          setIsSticky(false); // Reset sticky if not in view
        }

        // Hide sticky date when scrolling past all events for a day
        const nextDateElement = eventDates[index + 1];
        if (nextDateElement && rect.bottom <= nextDateElement.getBoundingClientRect().top) {
          setIsSticky(false);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="event-list">
      {groupedEvents.length === 0 ? (
        <p>No events available.</p>
      ) : (
        groupedEvents.map(({ date, events }) => (
          <div key={date}>
            <div
              className={`event-date ${isSticky ? 'sticky' : ''} ${isToday(date) ? 'today' : ''}`}
            >
              {isToday(date) ? 'Today' : new Date(date).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            {events.map(event => (
              <div key={event.id} className="event-item">
                <p className="time">{formatEventTime(event.date._seconds)}</p>
                <h3>{event.title}</h3>
                <p className="location"><strong>{event.location}</strong></p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};


const MainPage = ({ user, onSignOut }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
        const filteredEvents = filterUpcomingEvents(response.data);
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error.response || error);
      }
    };


    fetchEvents();
  }, []); // Empty dependency array to run only once when the component mounts

  const filterUpcomingEvents = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter(event => {
      const eventDate = new Date(event.date._seconds * 1000);
      return eventDate >= today;
    });
  };

  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar user={user} onSignOut={onSignOut} />
      </div>
      <div>
       {/*<h1 className="welcome-heading">Welcome, {user.displayName}!</h1>*/}
      </div>
      <h2>The best career and networking events around Stanford, Palo Alto, and SF—all in one place.</h2>
      <Header events={events} /> {/* Pass events to Header */}
       {/*<Brand />
      <WhatNETWORKINSIDER />
      <Features />
      <Possibility />
      <CTA />
      <Blog />*/}
      <Footer />
    </div>
  );
};


const App = () => {
  
  const [user, setUser] = useState(null);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email.endsWith('@stanford.edu')) {
        setUser(user);
        console.log('Stanford email detected. User signed in:', user.email);
      } else {
        alert('Please sign in with your Stanford email.');
        await signOut(auth);
        setUser(null);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert('You have signed out successfully.');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <ParallaxProvider>
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage onSignIn={signInWithGoogle} />}
        />
        <Route
          path="/dashboard"
          element={user ? <MainPage user={user} onSignOut={handleSignOut} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </ParallaxProvider>

  );
};

export default App;