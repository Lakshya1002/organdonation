import React from 'react';
import {
  FaHeart,
  FaLungs,
  FaEye,
  FaProcedures,
  FaPills,
  FaBone,
  FaHands,
  FaTint,
  FaFlask,
  FaSyringe,
  FaSkull,
} from 'react-icons/fa';
import './OrganInfo.css';

const OrganInfo = () => {
  const organs = [
    {
      name: 'Heart',
      icon: <FaHeart />,
      description: 'Helps pump blood throughout the body.',
      details:
        'The heart is a muscular organ that pumps blood through the circulatory system. Heart transplants are life-saving for patients with end-stage heart failure. The heart beats approximately 100,000 times a day, ensuring oxygen and nutrients are delivered to all parts of the body.',
    },
    {
      name: 'Lungs',
      icon: <FaLungs />,
      description: 'Helps in breathing and oxygen exchange.',
      details:
        'The lungs facilitate the exchange of oxygen and carbon dioxide. Lung transplants are critical for patients with severe lung diseases like COPD or cystic fibrosis. The lungs contain over 300 million alveoli, which are tiny air sacs where gas exchange occurs.',
    },
    {
      name: 'Cornea',
      icon: <FaEye />,
      description: 'Helps restore vision.',
      details:
        'The cornea is the transparent front part of the eye. Corneal transplants can restore vision for individuals with corneal damage or disease. The cornea is responsible for focusing light onto the retina, enabling clear vision.',
    },
    {
      name: 'Kidneys',
      icon: <FaProcedures />,
      description: 'Helps filter waste from the blood.',
      details:
        'The kidneys filter waste products from the blood. Kidney transplants are essential for patients with end-stage renal disease. Each kidney contains about 1 million nephrons, which are the functional units responsible for filtration.',
    },
    {
      name: 'Liver',
      icon: <FaFlask />,
      description: 'Processes nutrients and detoxifies the body.',
      details:
        'The liver processes nutrients and detoxifies harmful substances. Liver transplants are life-saving for patients with liver failure or severe liver disease. The liver also produces bile, which aids in digestion.',
    },
    {
      name: 'Pancreas',
      icon: <FaPills />,
      description: 'Regulates blood sugar levels.',
      details:
        'The pancreas produces insulin and enzymes for digestion. Pancreas transplants are performed for patients with type 1 diabetes. The pancreas plays a crucial role in maintaining blood glucose levels.',
    },
    {
      name: 'Bone Marrow',
      icon: <FaBone />,
      description: 'Produces blood cells.',
      details:
        'Bone marrow produces red blood cells, white blood cells, and platelets. Bone marrow transplants are used to treat blood disorders like leukemia. Bone marrow is found in the cavities of bones.',
    },
    {
      name: 'Skin',
      icon: <FaHands />,
      description: 'Protects the body from external damage.',
      details:
        'Skin is the largest organ and protects the body from external damage. Skin grafts are used for burn victims or patients with severe skin damage. The skin also regulates body temperature and stores water and fat.',
    },
    {
      name: 'Intestines',
      icon: <FaTint />,
      description: 'Helps in nutrient absorption.',
      details:
        'The intestines absorb nutrients from food. Intestinal transplants are rare but can save lives in cases of intestinal failure. The intestines are divided into the small and large intestines.',
    },
    {
      name: 'Blood',
      icon: <FaSyringe />,
      description: 'Transports oxygen and nutrients.',
      details:
        'Blood carries oxygen, nutrients, and waste products throughout the body. Blood donations are crucial for surgeries and trauma care. Blood is composed of plasma, red blood cells, white blood cells, and platelets.',
    },
    {
      name: 'Eyes',
      icon: <FaEye />,
      description: 'Helps in vision.',
      details:
        'The eyes are essential for vision. Eye donations (corneas) can restore sight to the blind. The eyes work with the brain to process visual information.',
    },
    {
      name: 'Bones',
      icon: <FaSkull />,
      description: 'Provides structural support.',
      details:
        'Bones provide structural support and protect internal organs. Bone donations are used in reconstructive surgeries. Bones also store minerals like calcium and phosphorus.',
    },
    {
      name: 'Tendons',
      icon: <FaHands />,
      description: 'Connects muscles to bones.',
      details:
        'Tendons connect muscles to bones and are essential for movement. Tendon donations are used in orthopedic surgeries. Tendons are made of strong fibrous tissue.',
    },
    {
      name: 'Cartilage',
      icon: <FaBone />,
      description: 'Cushions joints.',
      details:
        'Cartilage cushions joints and prevents bone friction. Cartilage donations are used in joint repair surgeries. Cartilage is a flexible connective tissue found in various parts of the body.',
    },
    {
      name: 'Heart Valves',
      icon: <FaHeart />,
      description: 'Regulates blood flow.',
      details:
        'Heart valves regulate blood flow within the heart. Valve donations are used in cardiac surgeries. There are four valves in the heart: mitral, tricuspid, aortic, and pulmonary.',
    },
  ];

  return (
    <div className="organ-info">
      <h2>Organ Information</h2>
      <div className="organ-grid">
        {organs.map((organ, index) => (
          <div key={index} className="organ-card">
            <div className="organ-card-inner">
              <div className="organ-card-front">
                <div className="organ-icon">{organ.icon}</div>
                <h3>{organ.name}</h3>
                <p>{organ.description}</p>
              </div>
              <div className="organ-card-back">
                <p>{organ.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganInfo;