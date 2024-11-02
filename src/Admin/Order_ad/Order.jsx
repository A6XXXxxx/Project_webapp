import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Grid, Button, InputLabel, FormControl, Typography } from '@mui/material';
import './order.css';
import DB from '../../config';
import { CgPlayTrackNextR,CgPlayTrackPrevR } from "react-icons/cg";
import { Link } from 'react-router-dom';

const Order_ad = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [filterName, setFilterName] = useState('');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState('');
  
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' }); 

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${DB}user`); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);

      if (!data || data.length === 0) {
        throw new Error('No data available');
      }

      const formattedOrders = data.map((order, index) => ({
        _id: order._id,
        id: index + 1, 
        email: order.email,
        customerName: `${order.first_name} ${order.last_name}`,
        tel: order.tel,
        payment: order.payment,
        paymentStatus: order.payment_status,
        productDetails: order.details_purchase,
        deliveryDate: order.delivery_date,
        address: order.address_des,
        telDes: order.tel_des,
        status: order.status,
        infoShipping: order.info_shipping,
      }));
      setOrders(formattedOrders); 
    } catch (error) {
      setError(error.message); 
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchOrders(); 
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000); // Fetch new data every 10 seconds

    return () => {
      clearInterval(interval); 
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesName = order.customerName.toLowerCase().includes(filterName.toLowerCase());
    const matchesPaymentMethod = filterPaymentMethod ? order.payment === filterPaymentMethod : true;
    const matchesPaymentStatus = filterPaymentStatus ? order.paymentStatus === filterPaymentStatus : true;
    const matchesDeliveryStatus = filterDeliveryStatus ? order.status === filterDeliveryStatus : true;
    return matchesName && matchesPaymentMethod && matchesPaymentStatus && matchesDeliveryStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.key === 'deliveryDate') {
      return (new Date(a.deliveryDate) - new Date(b.deliveryDate)) * (sortConfig.direction === 'asc' ? 1 : -1);
    }
    return (a.id - b.id) * (sortConfig.direction === 'asc' ? 1 : -1);
  });

  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className='content' style={{ marginLeft: '20px', marginRight: '20px', fontFamily: 'IBM Plex Sans Thai, sans-serif' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <InputLabel>ค้นหา</InputLabel>
          <h1></h1>
          <TextField
            variant="outlined"
            size="small"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="ค้นหาชื่อผู้สั่งซื้อ..."
            style={{ width: '500px',background:'white' }}
          />
        </Grid>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginLeft: '500px'}}>
          <Grid item>
            <FormControl variant="outlined" size="small" style={{ width: '250px' }}>
              <InputLabel>วิธีการชำระเงิน</InputLabel>
              <h1></h1>
              <TextField
                select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                style={{background:'white'}}
              >
                <MenuItem value="">
                  <em>ทั้งหมด</em>
                </MenuItem>
                <MenuItem value="บัตรเครดิต">บัตรเครดิต</MenuItem>
                <MenuItem value="ชำระปลายทาง">ชำระปลายทาง</MenuItem>
                <MenuItem value="QR Code">QR Code</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" size="small" style={{ width: '250px', marginLeft: '20px' }}>
              <InputLabel>สถานะการชำระเงิน</InputLabel>
              <h1></h1>
              <TextField
                select
                value={filterPaymentStatus}
                onChange={(e) => setFilterPaymentStatus(e.target.value)}
                style={{background:'white'}}
              >
                <MenuItem value="">
                  <em>ทั้งหมด</em>
                </MenuItem>
                <MenuItem value="ชำระเงินแล้ว">ชำระเงินแล้ว</MenuItem>
                <MenuItem value="รอดำเนินการ">รอดำเนินการ</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" size="small" style={{ width: '250px', marginLeft: '20px' }}>
              <InputLabel>สถานะการจัดส่ง</InputLabel>
              <h1></h1>
              <TextField
                select
                value={filterDeliveryStatus}
                style={{background:'white'}}
                onChange={(e) => setFilterDeliveryStatus(e.target.value)}
              >
                <MenuItem value="">
                  <em>ทั้งหมด</em>
                </MenuItem>
                <MenuItem value="จัดส่งเรียบร้อย">จัดส่งเรียบร้อย</MenuItem>
                <MenuItem value="กำลังดำเนินการ">กำลังดำเนินการ</MenuItem>
                <MenuItem value="ยกเลิกแล้ว">ยกเลิกแล้ว</MenuItem>
              </TextField>
            </FormControl>
          </Grid>
        </div>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                #
                <Button onClick={() => requestSort('id')} size="small" style={{ marginLeft: '8px' }}>
                  {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : '↑↓'}
                </Button>
              </TableCell>
              <TableCell>อีเมล</TableCell>
              <TableCell>ชื่อผู้สั่งซื้อ</TableCell>
              <TableCell>วิธีการชำระเงิน</TableCell>
              <TableCell>สถานะการชำระเงิน</TableCell>
              <TableCell>รายละเอียดสินค้า</TableCell>
              <TableCell>
                วันที่กำหนดส่ง
                <Button onClick={() => requestSort('deliveryDate')} size="small" style={{ marginLeft: '8px' }}>
                  {sortConfig.key === 'deliveryDate' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : '↑↓'}
                </Button>
              </TableCell>
              <TableCell>ที่อยู่</TableCell>
              <TableCell>สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order._id} className="TableRow" component={Link} to={`/Info_order/${order._id}`} style={{ cursor: 'pointer' }}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.payment}</TableCell>
              <TableCell>{order.paymentStatus}</TableCell>
              <TableCell>{order.productDetails}</TableCell>
              <TableCell>{order.deliveryDate}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ color: '#A9704D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:'100%' }}>
        <Typography variant="body1">
          {`${indexOfFirstOrder + 1}-${Math.min(indexOfLastOrder, sortedOrders.length)} of ${sortedOrders.length}`}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CgPlayTrackPrevR onClick={handlePrevPage} disabled={currentPage === 1} style={{ marginRight: '10px', color:'#A9704D',fontSize:'22px' }}/>
          <Typography variant="body1">
            {`${currentPage}/${totalPages}`}
          </Typography>
          <CgPlayTrackNextR onClick={handleNextPage} disabled={currentPage === totalPages} style={{ color:'#A9704D', fontSize:'22px', marginLeft:'10px' }}/>
        </div>
      </div>
    </div>
  );
};

export default Order_ad;
