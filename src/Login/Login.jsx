import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';
import { signInWithGoogle, signOut } from '../FireBase/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Login = () => {
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState('register'); // default to register tab
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden"; // Prevent scrolling
        return () => {
            document.body.style.overflow = "auto"; // Re-enable scrolling on unmount
        };
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null); // Reset user state when logged out
                setSelectedTab('register'); // Reset to the default tab
            }
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            if (result.user) {
                setUser(result.user);
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in: ', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            setUser(null); // Reset user state
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
                                        <div className="tab-content" style={{ marginTop: '40px' }}>
                                            <p>สมัครโดย</p>
                                            <button className="google-login" onClick={handleGoogleLogin}>
                                                เข้าสู่ระบบด้วย
                                                <img src="https://www.google.com/favicon.ico" alt="Google icon" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className={`tab ${selectedTab === 'login' ? 'clip-style-two active' : 'inactive'} login-tab`}>
                                    <h2 onClick={() => setSelectedTab('login')}>เข้าสู่ระบบ</h2>
                                    {selectedTab === 'login' && (
                                        <div className="tab-content" style={{ marginTop: '40px' }}>
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