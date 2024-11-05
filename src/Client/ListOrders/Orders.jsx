import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Orders.css"; 
import DB from '../../config'; 
import { GrCaretNext, GrTrash } from "react-icons/gr"; // Import trash icon

const Orders = () => {
    const [basketItems, setBasketItems] = useState([]); 
    const [userEmail, setUserEmail] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); 
                console.log('User email:', user.email); 
            } else {
                setUserEmail(null); 
                console.log('User logged out.'); 
            }
        });
        return () => unsubscribe(); 
    }, []);

    useEffect(() => {
        if (userEmail) {
            fetchBasketItems(); 
        }
    }, [userEmail]);

    const fetchBasketItems = async () => {
        if (userEmail) {
            try {
                const response = await axios.get(`${DB}basket/get_items?email=${userEmail}`);
                setBasketItems(response.data); 
                console.log("Fetched basket items:", response.data); 
            } catch (error) {
                console.error("Error fetching basket items:", error);
            }
        }
    };

    const handleIncrement = async (id) => {
        try {
            await axios.post(`${DB}basket/add_cart`, {
                email: userEmail,
                id: id
            });
            setBasketItems(prevItems => 
                prevItems.map(item => 
                    item.id === id ? { ...item, count: item.count + 1 } : item
                )
            );
            console.log(`Increased quantity for ID: ${id}`);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleDecrement = async (id) => {
        try {
            await axios.post(`${DB}basket/del_cart`, {
                email: userEmail,
                id: id
            });
            setBasketItems(prevItems => 
                prevItems.map(item => 
                    item.id === id && item.count > 1 ? { ...item, count: item.count - 1 } : item
                )
            );
            console.log(`Decreased quantity for ID: ${id}`);
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const handleDelete = async (userEmail, id) => {
        try {
            const response = await fetch(`${DB}basket/delall_cart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, id: id }), 
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete item: ${errorText}`);
            }
    
            setBasketItems(prevItems => prevItems.filter(item => item.id !== id));
            alert('Item deleted successfully');
        } catch (error) {
            console.error('Error deleting item:', error);
            alert(`Failed to delete item: ${error.message}`);
        }
    };
    
    const handleNext = () => {
        navigate('/info_client'); 
    };

    const totalPrice = basketItems.reduce((total, item) => total + item.price * item.count, 0);

    return (
        <div className="content" style={{background:'#8D5941', width:'1800px', height:'650px', margin:'80px 40px 40px 40px', borderRadius:'50px', position: 'relative'}}>
            <div className="orders-list" style={{ 
                maxHeight: '500px', 
                overflowY: 'auto', 
                padding: '20px',
            }}>
                {basketItems.length > 0 ? (
                    basketItems.map(item => (
                        <div key={item.id} className="order-item" style={{ position: 'relative' }}>
                            <img src={item.image_url} alt={item.name_flower} className="product-image" />
                            <div className="order-details"> 
                                {item.name_flower && <h3>{item.name_flower}</h3>}
                                <p>ราคา {item.price} บาท</p>
                            </div>
                            <div className="count-container">
                                <button onClick={() => handleDecrement(item.id)}>-</button>
                                <span>{item.count}</span>
                                <button onClick={() => handleIncrement(item.id)}>+</button>
                            </div>
                            <button 
                                onClick={() => handleDelete(userEmail, item.id)} 
                                style={{
                                    position: 'absolute', 
                                    top: '10px', 
                                    right: '10px', 
                                    background: 'transparent', 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    color: '#8d5941',
                                }}>
                                <GrTrash style={{ fontSize: '20px' }} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No items in your basket.</p>
                )}
            </div>
            <div className="subtract-box-order">
                <div style={{ width:'100px', height:'100px', background:'#8d5941', margin:'20px 0px 0px 20px', borderRadius:'20px', padding: '10px', color:'#f5ece4'}}>
                    <button onClick={handleNext} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <GrCaretNext style={{fontSize:'48px', margin:'20px 0px 0px 30px'}} />
                    </button>
                </div>
            </div>
            <div style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '20px', 
                right: '170px', 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '30px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize:'22px'
            }}>
                <h4 style={{ margin: 0 }}>รวมทั้งหมด</h4> 
                <h4 style={{ margin: 0 }}>{totalPrice} บาท</h4>
            </div>
        </div>
    );
};

export default Orders;
