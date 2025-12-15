import React, { useContext } from 'react';
import { OrganContext } from '../context/OrganContext'; // Import OrganContext
import './Alerts.css';

const Alerts = () => {
  const { alerts } = useContext(OrganContext); // Use OrganContext

  return (
    <div className="alerts">
      <h2>Alerts</h2>
      <p className="alerts-description">
        Stay updated with real-time alerts about organ availability and urgent needs.
      </p>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id} className={`alert ${alert.priority.toLowerCase()}`}>
            <strong>{alert.date}:</strong> {alert.message}
            <span className="priority">{alert.priority}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;