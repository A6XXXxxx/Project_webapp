import React, { useEffect, useState } from "react";
import './user_ad.css';
import DB from '../../config';
import { FaCrown } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'; 
import { TiDeleteOutline } from "react-icons/ti";

const User_ad = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${DB}check`); 
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUserClick = () => {
    navigate('/adduser'); 
  };

  const handleDeleteUser = async (email) => {
    try {
      const response = await fetch(`${DB}check/deleteEmail_ad`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // ลบข้อมูลออกจาก state หลังจากลบสำเร็จ
      setUsers(users.filter(user => user.email !== email));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="content">
      <div className="box-user-div" style={{ position: 'relative' }}>
        <FaUserPlus 
          onClick={handleAddUserClick} 
          style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '60px', cursor: 'pointer', color:'#A9704D' }} 
        />
        {users.filter(user => user.key === 0).map((user) => (
          <div 
            className="member" 
            key={user._id} 
            onMouseEnter={() => document.getElementById(`delete-${user._id}`).style.display = 'block'}
            onMouseLeave={() => document.getElementById(`delete-${user._id}`).style.display = 'none'}
          >
            <FaCrown className="icon-crown" />
            <div className="user-info">
              <h2>{user.displayName || "No Display Name"}</h2>
              <p>{user.email}</p>
            </div>
            <TiDeleteOutline 
              id={`delete-${user._id}`}
              className="delete-icon" 
              onClick={() => handleDeleteUser(user.email)} 
              style={{ display: 'none', cursor: 'pointer' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default User_ad;
