import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import './list_ad.css';
import DB from "../../config";

const List_ad = () => {
  const [data, setData] = useState([]); // For uploaded CSV data
  const [productData, setProductData] = useState([]); // For data from the database
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${DB}product`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const products = await response.json();
        setProductData(products);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchProductData();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === 'text/csv') {
      setError('');
      Papa.parse(selectedFile, {
        complete: (results) => {
          setData(results.data);
        },
        header: true,
        skipEmptyLines: true,
        error: (err) => {
          setError('Error parsing CSV file');
          console.error(err);
        }
      });
    } else {
      setError('กรุณาเลือกไฟล์ CSV เท่านั้น');
      setData([]);
    }
  };

  const handleSave = async () => {
    try {
      const products = data.map(item => ({
        id: item.id,
        name_flower: item.name_flower,
        price: item.price,
        type: item.type,
        balance: item.balance,
        date_in: item.date_in,
        image: item.image,
      }));

      const response = await fetch(`${DB}product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error('Failed to save info of product');
      }

      alert('ข้อมูลได้ถูกบันทึกแล้ว!');
      const updatedResponse = await fetch(`${DB}product`);
      const updatedProducts = await updatedResponse.json();
      setProductData(updatedProducts); 
    } catch (error) {
      console.error('Error saving product:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleCancel = () => {
    setData([]);
    setError('');
  };

  return (
    <div className="content">
      <div className="flex-container">
        <div className="file-input-div">
          <h2 style={{ textAlign: 'center', color: '#724A3A' }}>นำเข้าข้อมูล</h2>
          <input
            type="file"
            className="file-input file-input-bordered file-input-info"
            onChange={handleFileChange}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <div className="file-show-div" style={{ flex: 1 }}>
          {data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>ไม่มีข้อมูลที่แสดง</p>
          )}
        </div>

        <div className="btn-div">
          <button className="btn btn-accent" onClick={handleSave}>ตกลง</button>
          <button className="btn btn-accent" style={{ backgroundColor: '#ededed' }} onClick={handleCancel}>ยกเลิก</button>
        </div>
      </div>

      <div className="database-products" style={{width:'85%'}}>
  <h2 style={{ textAlign: 'center', color: '#724A3A' }}>ข้อมูลทั้งหมดในฐานข้อมูล</h2>
  {productData.length > 0 ? (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>ชื่อดอกไม้</th>
            <th>ราคา</th>
            <th>ประเภท</th>
            <th>ยอดคงเหลือ</th>
            <th>วันที่นำเข้า</th>
            <th>ภาพ</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name_flower}</td>
              <td>{product[' price']}</td>
              <td>{product.type}</td>
              <td>{product.balance}</td>
              <td>{product.date_in}</td>
              <td><img src={product.image} alt={product.name_flower} style={{ width: '50px' }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p>ยังไม่มีข้อมูลในฐานข้อมูล</p>
  )}
</div>

    </div>
  );
};

export default List_ad;
