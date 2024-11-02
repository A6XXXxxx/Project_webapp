import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
import { signInWithGoogle, signOut } from '../FireBase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import DB from "../config";

const Login = () => {
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('register');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                setSelectedTab('register');
            }
        });
        return () => unsubscribe();
    }, []);

    const saveEmailToDatabase = async (email, displayName) => {
        try {
            const response = await fetch(`${DB}check/saveEmail`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, displayName }), 
            });
            if (!response.ok) {
                throw new Error('Failed to save email and displayName');
            }
        } catch (error) {
            console.error('Error saving email and displayName:', error);
        }
    };
    

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            if (result.user) {
                setUser(result.user);
                await saveEmailToDatabase(result.user.email, result.user.displayName); // ส่ง displayName
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in: ', error);
        }
    };    

    const handleLogout = async () => {
        try {
            await signOut();
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    const renderUserInfo = () => (
        <div className="tab-content" style={{ marginTop: '-60px' }}>
            <h3>ข้อมูลบัญชี</h3>
            <p><strong>ชื่อ :</strong> {user.displayName}</p>
            <p><strong>อีเมล :</strong> {user.email}</p>
            <button className="logout-button" onClick={handleLogout}>
                ออกจากระบบ
            </button>
        </div>
    );

    return (
        <div className="page-container">
            <div className="image-container">
                <img
                    src="https://pbs.twimg.com/media/GYgksEWXQAAwWg6?format=jpg&name=large"
                    alt="Side Graphic"
                    className="side-image"
                />
            </div>

            <div className="login-container">
                <div className="side-frame">
                    <div className="tabs-container">
                        {user ? (
                            renderUserInfo()
                        ) : (
                            <>
                                <div className={`tab ${selectedTab === 'register' ? 'clip-style-one active' : 'inactive'} register-tab`}>
                                    <h2 onClick={() => setSelectedTab('register')}>สมัครบัญชีผู้ใช้</h2>
                                    {selectedTab === 'register' && (
                                        <div className="tab-content" style={{ marginTop: '100px' }}>
                                            <p>สมัครโดย</p>
                                            <button className="google-login" onClick={handleGoogleLogin}>
                                                สมัครบัญชีผู้ใช้ด้วย
                                                <img src="https://www.google.com/favicon.ico" alt="Google icon" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={`tab ${selectedTab === 'login' ? 'clip-style-two active' : 'inactive'} login-tab`}>
                                    <h2 onClick={() => setSelectedTab('login')}>เข้าสู่ระบบ</h2>
                                    {selectedTab === 'login' && (
                                        <div className="tab-content" style={{ marginTop: '100px' }}>
                                            <p>เข้าสู่ระบบโดย</p>
                                            <button className="google-login" onClick={handleGoogleLogin}>
                                                เข้าสู่ระบบด้วย
                                                <img src="https://www.google.com/favicon.ico" alt="Google icon" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;