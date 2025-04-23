import React from 'react';
 

const PlanCard = ({ plan, onClick }) => {
  return (
    <div className="plan-card" onClick={onClick}>
      <h3 className="plan-card-title">{plan.naziv}</h3>
      <p className="plan-card-period">{plan.period_od} do {plan.period_do}</p>
    </div>
  );
};

export default PlanCard;
