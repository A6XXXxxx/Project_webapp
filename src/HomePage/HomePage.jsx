import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './homepage.css';
import { TbTruckDelivery, TbHours24 } from "react-icons/tb";
import { FaChevronUp } from "react-icons/fa";

const FlowerCard = ({ image, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div 
      className="flower-card" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '20px',
        width: '380px',
        marginRight: '20px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: '0.3s',
        backgroundColor: '#fff'
      }}
    >
      <div style={{ position: 'relative', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
        <img src={image} alt={title} style={{ height: '350px', width: '100%', objectFit: 'cover' }} />
        {isHovered && (
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black background with opacity
              color: '#fff',
              padding: '10px',
              textAlign: 'center',
              transition: 'opacity 0.3s',
            }}
            dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br/>") }}
          />
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // เนื้อหาของ "ดอกไม้ยอดนิยม"
  const popularFlowers = [
    { image: "https://www.venopi.com/media/uploads/venue/space/116365850_906955033123244_9176918348158133925_n.webp", 
      title: "ไฮเดรนเยีย", 
      description: "ไฮเดรนเยียสีฟ้า : ไม่ว่าจะเกิดอะไรขึ้น ฉันพร้อมจะให้อภัย <br/> ไฮเดรนเยียสีม่วง : เธอช่างมีเสน่ห์ และสูงส่งสำหรับฉัน <br/> ไฮเดรนเยียสีชมพู : เพราะเธอคือความอ่อนโยน  <br/>ไฮเดรนเยียสีขาว : เพราะเธอคือรักที่บริสุทธิ์" },
    { image: "https://i.pinimg.com/736x/3e/a6/b4/3ea6b402024c524d8c70b3dbcad6a097.jpg", 
      title: "ทิวลิป", 
      description: "ดอกทิวลิปสีขาว : ฉันพร้อมจะเสียสละทุกอย่างเพื่อคุณ <br/>ดอกทิวลิปสีแดง : ฉันแอบชอบคุณอยู่นะ <br/>ดอกทิวลิปสีเหลือง : ฉันพร้อมแล้วกับความสัมพันธ์ของเรา หรือ ฉันรักและเคารพคุณมากนะ <br/>ดอกทิวลิปสีม่วง : ฉันพร้อมจะซื่อสัตย์กับคุณเสมอ" },
    { image: "https://i.pinimg.com/564x/13/b6/7c/13b67cda0feaaddb69465ca1e8c257d7.jpg", title: "ทานตะวัน", description: "ดอกทานตะวัน : รักของฉันมั่นคงและภักดีต่อเธอเสมอ ดุจดั่งทานตวันที่ไม่เคยหันมองผู้ใด นอกจากดวงอาทิตย์" },
  ];

  // เนื้อหาของ "การจับคู่ดอกไม้"
  const flowerPairings = [
    { image: "https://fairyfleur.com/assets/preview/white-lily-with-red-rose-1-636f5a94f850fac33a6dc792788084e0.jpg", 
      title: "กุหลาบสีแดงและลิลลี่สีขาว", 
      description: "กุหลาบ เป็นสัญลักษณ์ของความรัก ลิลลี่แสดงถึงความบริสุทธิ์และความเป็นมิตร" },
    { image: "https://static.wixstatic.com/media/ddab77_5ae2619d5f2241d5a16df4e7fb6fb4c6~mv2.jpg/v1/fill/w_440,h_500,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/ddab77_5ae2619d5f2241d5a16df4e7fb6fb4c6~mv2.jpg", 
      title: "ทานตะวันและเดซี่",
      description: "ทานตะวัน ความสดใสและพลัง<br/> เดซี่ : ความบริสุทธิ์และความเป็นมิตร การจับคู่กันทำให้ช่อดอกไม้มีความสดชื่นและเป็นกันเอง"},
    { image: "https://flowerlabbychanana.com/wp-content/uploads/2019/10/2019-09-03-10.43.45-1.jpg", 
      title: "ไฮเดรนเยียและกุหลาบ",
      description: "ไฮเดรนเยียม : ฟูฟ่องและสีสันสดใส <br/> กุหลาบจะทำให้ช่อดอกไม้ดูสดใสและเป็นธรรมชาติ" },
  ];

  const displayedFlowers = activeTab === "popular" ? popularFlowers : flowerPairings;

  return (
    <div className="content">
      <div className="content" style={{ marginLeft: "0", position: "relative" }}>
        <div className="curved-image-container" style={{ position: "absolute", top: "120px", left: "350px", zIndex: 1 }}>
          <img
            src="https://i.pinimg.com/originals/7d/23/b5/7d23b574d6caf75d9e8c97161d9a18f7.jpg"
            alt="Decorative flowers"
            className="curved-image"
          />
        </div>

        <div className="back" style={{ position: "relative", zIndex: 0 }}>
          <div className="subtract-box" style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
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
          <div style={{ textAlign:"right", marginRight:'30px', marginTop:'60px'}}>
            <Link to="/buys" style={{ textDecoration: 'none', color: 'inherit' }}>
              <button className="btn" style={{ borderRadius: '25px', background: '#f5ece4', width:'190px', fontSize:22, fontFamily:"Bai Jamjuree", height:'60px', boxShadow: 'inset 4px 4px 4px rgba(0, 0, 0, 0.25)' }}>สั่งซื้อตอนนี้</button> 
            </Link>
          </div> 
        </div>
      </div>

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

      <div className="content" style={{ marginTop: '90px', width: '100%', height: '600px', display: 'flex', justifyContent: 'center',  alignItems: 'center', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', padding: '20px', flex: 1 }}>
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
        <img src={require('./laws_no9_4.png')} alt="US" style={{ width: '300px', borderRadius: '15px', marginLeft: '20px' }} />
      </div>       

      {showScrollTop && (
        <button onClick={scrollToTop} className="back-to-top">
          <FaChevronUp /> 
        </button>
      )}             
      
      <footer class="footer">
        <h2 class="footer-title">ติดต่อเรา</h2>
        <div class="footer-contact">
            <span class="contact-icon">📞</span> 
            <p>098-1238990</p>
            <span class="address-icon">📍</span> 
            <p>101 หมู่ 3 ตำบลทุ่งสุขลา อำเภอศรีราชา จังหวัดชลบุรี 80310</p>
        </div>
      </footer>


    </div>
  );
};

export default HomePage;
