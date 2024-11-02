import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Buy.css";

const Buy = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [priceRanges, setPriceRanges] = useState([]);
    const [showOtherFlowers, setShowOtherFlowers] = useState(false); // State for showing other flowers

    // State for selected filters
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/product/');
                console.log('Fetched products:', response.data);
                setProducts(response.data);

                // Extract unique categories and price ranges from products
                const uniqueCategories = Array.from(new Set(response.data.map(product => product.type)));
                const uniquePriceRanges = Array.from(new Set(response.data.map(product => product.price_range)));

                setCategories(uniqueCategories);
                setPriceRanges(uniquePriceRanges);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleReset = () => {
        setSearchTerm("");
        setSelectedCategories(new Set());
        setSelectedPriceRanges(new Set());
        setShowOtherFlowers(false); // Reset showing other flowers
    };

    // Allowed flower names
    const allowedFlowerNames = ["กุหลาบ", "ทานตะวัน", "ทิวลิป", "เดซี่", "ไฮเดรนเยีย"];

    // Filter products based on selected filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name_flower && product.name_flower.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(product.type);
        const matchesPriceRange = selectedPriceRanges.size === 0 || selectedPriceRanges.has(product.price_range);

        // Check if the flower name matches allowed names if not showing other flowers
        const matchesFlowerType = showOtherFlowers || allowedFlowerNames.some(allowed => product.name_flower.includes(allowed));

        return matchesSearch && matchesCategory && matchesPriceRange && matchesFlowerType;
    });

    // Handle checkbox change
    const handleCheckboxChange = (setter, value) => {
        setter(prev => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(value)) {
                updatedSet.delete(value);
            } else {
                updatedSet.add(value);
            }
            return updatedSet;
        });
    };

    return (
        <div className="buy-container">
            <div className="header">
                <input
                    type="text"
                    placeholder="ค้นหา"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <button onClick={handleReset} className="reset-button">ล้าง</button>
            </div>

            <div className="content-buy">
                <div className="sidebar">
                    <h3>หมวดหมู่</h3>
                    <div className="category">
                        {categories.map(category => (
                            <label key={category}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(setSelectedCategories, category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                    <h4>ช่วงราคา</h4>
                    <div className="price-range">
                        {priceRanges.map(range => (
                            <label key={range}>
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange(setSelectedPriceRanges, range)}
                                />
                                {range}
                            </label>
                        ))}
                    </div>
                    <h4>ชนิดดอกไม้</h4>
                    <div className="type-flower">
                        {allowedFlowerNames.map(flower => (
                            <label key={flower}>
                                <input
                                    type="checkbox"
                                    disabled
                                />
                                {flower}
                            </label>
                        ))}
                        <label>
                            <input
                                type="checkbox"
                                onChange={() => setShowOtherFlowers(!showOtherFlowers)}
                                checked={showOtherFlowers}
                            />
                            อื่นๆ
                        </label>
                    </div>
                </div>

                <div className="product-list">
                    <h2>รายการแนะนำ</h2>
                    <div className="products">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(({ _id, ...product }) => (
                                <div key={_id} className="product-card">
                                    <h3>{product.id} {product.name_flower}</h3>
                                    <p>{product.price} บาท</p>
                                </div>
                            ))
                        ) : (
                            <p>ไม่พบสินค้าที่ตรงกับการค้นหา</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Buy;