import React, { useState } from 'react';
import './Otp.css';

const Otp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('OTP submitted:', otp.join(''));
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <form onSubmit={handleSubmit} className="otp-form">
        {otp.map((_, index) => (
          <input 
            key={index} 
            type="text" 
            maxLength={1} 
            value={otp[index]} 
            onChange={(e) => handleChange(e, index)} 
            className="otp-input"
          />
        ))}
        <button type="submit" className="button">Submit OTP</button>
      </form>
    </div>
  );
};

export default Otp;
