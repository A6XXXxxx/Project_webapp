import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import './list_ad.css';
import DB from "../../config";

const List_ad = () => {
  const [data, setData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = React.createRef();

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

    if (selectedFile) {
      const fileType = selectedFile.type;

     if (fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileType === 'application/xlsx') {
        setError('');
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryString = e.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheetName = workbook.SheetNames[0]; 
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          setData(jsonData);
        };
        reader.readAsBinaryString(selectedFile);
      } else {
        setError('กรุณาเลือกไฟล์ XLSX เท่านั้น');
        setData([]);
      }
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
        image_url: item.image_url,
      }));

      const response = await fetch(`${DB}product/new`, {
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
      setData([]);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleCancel = () => {
    setData([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
            ref={fileInputRef}
            accept=".xlsx" 
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <div className="file-show-div" style={{ flex: 1 }}>
          {data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} style={{ textAlign: 'center' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} style={{ textAlign: 'center' }}>{value}</td>
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

      <div className="database-products" style={{ width: '85%' }}>
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
                    <td>{product.price}</td>
                    <td>{product.type}</td>
                    <td>{product.balance}</td>
                    <td>{product.date_in}</td>
                    <td><img src={product.image_url} alt={product.name_flower} style={{ width: '50px' }} /></td>
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
