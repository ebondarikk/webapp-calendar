import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

const searchParams = new URLSearchParams(window.location.search)
const scheduleJSON = searchParams.get("schedule")?.toString() || "{}";
const locale = searchParams.get("locale") || "en";

const schedule = JSON.parse(scheduleJSON);

root.render(
  <React.StrictMode>
    <App tg={tg} sourceSchedule={schedule} locale={locale}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
