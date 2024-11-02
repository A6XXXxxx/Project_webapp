import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './homepage.css';
import DB from '../config.js'; 
import { TbTruckDelivery, TbHours24 } from "react-icons/tb";
import { FaChevronUp } from "react-icons/fa";

const FlowerCard = ({ image, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      className="flower-card" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        <img src={image} alt={title} />
        {isHovered && (
          <div className="hover-overlay" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <h4 style={{ margin: 0 }}>{title}</h4>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("popular");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [flowers, setFlowers] = useState({ popular: [], pairings: [] });

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(`${DB}home`);
        const data = await response.json();

        // Process data for display
        const popularFlowers = data.find((category) => category.category === "popular").items.map((item) => ({
          image: item.image,
          title: item.title,
          description: typeof item.description === 'object'
            ? Object.entries(item.description)
                .map(([color, text]) => `<strong>${color}:</strong> ${text}`)
                .join("<br/>")
            : item.description
        }));

        const flowerPairings = data.find((category) => category.category === "pairings").items;

        setFlowers({ popular: popularFlowers, pairings: flowerPairings });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const displayedFlowers = activeTab === "popular" ? flowers.popular : flowers.pairings;

  return (
    <div className="content">
      {/* welcome */}
      <div className="content" style={{ marginLeft: "0", position: "relative" }}>
        <div className="curved-image-container" style={{ position: "absolute", top: "120px", left: "350px", zIndex: 1 }}>
          <img
            src="https://i.pinimg.com/originals/7d/23/b5/7d23b574d6caf75d9e8c97161d9a18f7.jpg"
            alt="Decorative flowers"
            className="curved-image"
          />
        </div>

        <div className="back" style={{ position: "relative", zIndex: 0 }}>
          <div className="subtract-box" style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto',marginTop:'20px' }}>
            <div style={{ display: 'flex', textAlign:"right" }}>
              <p style={{ margin: '0', marginLeft: '30px', marginTop:'30px', fontSize:18 }}>
                FREE <br/> DELIVERY
              </p>
              <TbTruckDelivery style={{ height: '75px', width: '75px', marginLeft: '10px', strokeWidth: '0.3', marginTop: '27px'}} /> 
            </div>
            <div style={{ display: 'flex', textAlign:"left" }}>
              <TbHours24 style={{ height: '60px', width: '60px', marginLeft: '10px', strokeWidth: '0.5', marginTop: '27px'}}/>
              <p style={{ margin: '0', marginRight: '30px', marginTop:'30px', fontSize:18 }}>
                ORDER <br/> ONLINE 24/7
              </p>
            </div>
          </div>
          <div className="content" style={{ textAlign: "center", marginLeft: "80px" }}>
            <h1 style={{ fontFamily: "Bai Jamjuree", color: "#f5ece4", fontWeight: 600, fontSize: 36 }}>
              ยินดีต้อนรับสู่ LIL PETALS NOOK
            </h1>
            <p style={{ fontFamily: "Bai Jamjuree", color: "#f5ece4", fontWeight: 400, fontSize: 25, lineHeight: 1.8 }}>
              โลกแห่งดอกไม้ที่เต็มไปด้วยความงาม <br />
              และความรู้สึกอันลึกซึ้ง <br />
              เลือกสรรดอกไม้เพื่อบอกเล่าเรื่องราว <br />
              ของคุณในทุกโอกาสพิเศษ
            </p>
          </div>

          {/* Button */}
          <div style={{ textAlign: "right", marginRight: '30px', marginTop: '-20px' }}>
            <Link to="/buys" style={{ textDecoration: 'none', color: 'inherit' }}>
              <button className="btn" style={{ borderRadius: '25px', background: '#f5ece4', width: '190px', fontSize: 22, fontFamily: "Bai Jamjuree", height: '60px', boxShadow: 'inset 4px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                สั่งซื้อตอนนี้
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Flower Cards Section */}
      <div className="content" style={{ marginTop: '120px', background: "#E5D6C3", width: '100%', height: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab("popular")}
            className={`tab-button ${activeTab === "popular" ? "active" : ""}`}
          >
            ดอกไม้ยอดนิยม
          </button>
          <button 
            onClick={() => setActiveTab("pairings")}
            className={`tab-button ${activeTab === "pairings" ? "active" : ""}`}
          >
            การจับคู่ดอกไม้
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {displayedFlowers.map((flower, index) => (
            <FlowerCard 
              key={index} 
              image={flower.image} 
              title={flower.title} 
              description={flower.description} 
            />
          ))}
        </div>
      </div>

      {/* Why us */}
      <div className="content" style={{ marginTop: '90px', width: '100%', height: '600px', display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '20px', flex: 1 ,marginLeft:'100px'}}>
          <h2 style={{ marginBottom: '20px' }}>ทำไมต้องเรา ?</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.5' }}>
            เรามุ่งมั่นสร้างประสบการณ์ที่พิเศษสำหรับทุกโอกาส เราใส่ใจในทุกขั้นตอน ตั้งแต่การคัดเลือกดอกไม้ที่สดใหม่ที่สุดไปจนถึงการออกแบบช่อดอกไม้ที่ 
            <br />
            สะท้อนความรู้สึกของคุณ ดอกไม้ทุกช่อที่เราจัดทำขึ้นมาไม่เพียงแต่สวยงาม แต่ยังสื่อความหมายและความประณีตด้วยบริการเฉพาะบุคคล 
            <br />
            ไม่ว่าจะเป็นวันพิเศษใดๆ เราพร้อมที่จะช่วยคุณส่งต่อความรู้สึกด้วยดอกไม้ที่มีคุณภาพและการตกแต่งที่ใกล้ชิดธรรมชาติ 
            <br />
            เพื่อให้ทุกช่อดอกไม้จากเรามีทั้งความสวยงามและความประทับใจที่ยั่งยืน
          </p>
        </div>
        <img src={require('./laws_no9_4.png')} alt="US" style={{ height:'350px',borderRadius: '15px', marginRight: '200px' }} />
      </div>   

      {/* Scroll-to-top Button */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="back-to-top">
          <FaChevronUp /> 
        </button>
      )}
      
      {/* Footer */}
      <footer className="footer">
        <h2 className="footer-title">ติดต่อเรา</h2>
        <div className="footer-contact">
          <span className="contact-icon">📞</span> 
          <p>098-1238990</p>
          <span className="address-icon"></span> 
          <p>📍 101 หมู่ 3 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 80310</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
