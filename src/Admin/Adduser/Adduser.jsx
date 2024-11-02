import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuUserSquare2 } from "react-icons/lu";
import './Adduser.css';
import DB from '../../config';

const AddUser = () => {
  const navigate = useNavigate();

  const handleSave = async () => {
    const displayName = document.querySelector('input[placeholder="Daisy"]').value;
    const email = document.querySelector('input[placeholder="daisy@site.com"]').value;

    // ส่งข้อมูลไปยังเซิร์ฟเวอร์
    try {
      const response = await fetch(`${DB}check/saveEmail_ad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName, email }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCancel = () => {
    navigate('/user'); 
  };

  return (
    <div className="content">
      <div className="box-add-div">
        <h3><LuUserSquare2 style={{ fontSize: '80px', fontWeight: '300', color: '#A9704D' }} /></h3>
        <label className="input flex items-center gap-2">
          Name
          <input type="text" className="grow" placeholder="Daisy" />
        </label>
        <label className="input flex items-center gap-2">
          Email
          <input type="text" className="grow" placeholder="daisy@site.com" />
        </label>
      </div>
      <div className="button-container">
        <button className="btn btn-accent" style={{ backgroundColor: '#C39A74', width:'250px',fontSize:'26px',fontWeight:'300' }} onClick={handleSave}>ตกลง</button>
        <button className="btn btn-accent" style={{ backgroundColor: '#808080', width:'250px',fontSize:'26px',fontWeight:'300' }} onClick={handleCancel}>ยกเลิก</button>
      </div>
    </div>
  );
};

export default AddUser;
