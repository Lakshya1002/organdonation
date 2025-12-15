import React from 'react';
import { FaHospitalAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Hospitals.css';

const Hospitals = () => {
  const hospitals = [
    { id: 1, name: 'AIIMS Delhi', location: 'Delhi, India' },
    { id: 2, name: 'Apollo Hospital', location: 'Mumbai, India' },
    { id: 3, name: 'Fortis Bangalore', location: 'Bangalore, India' },
    { id: 4, name: 'Medanta Hospital', location: 'Gurgaon, India' },
    { id: 5, name: 'Narayana Health', location: 'Bangalore, India' },
    { id: 6, name: 'Max Super Speciality', location: 'Delhi, India' },
  ];

  return (
    <div className="hospitals">
      <h2>Top Organ Transplant Hospitals</h2>
      <p className="hospital-subtext">
      Discover the top registered hospitals in India for life-saving organ transplants!
      </p>
      
      <div className="hospital-list">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="hospital-item">
            <FaHospitalAlt className="hospital-icon" />
            <div className="hospital-info">
              <h3 className="hospital-name">{hospital.name}</h3>
              <p className="hospital-location">
                <FaMapMarkerAlt className="location-icon" /> {hospital.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
