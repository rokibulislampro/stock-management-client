import React, { useState, useEffect } from 'react';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/Images/tpg.png';
import close from '../../assets/Images/close.png';

const Dashboard = () => {
  const [ordered, setOrdered] = useState([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders
  const [filter, setFilter] = useState('today'); // Default filter is 'today'
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for specific-day filter
  const axiosPublic = useAxiosPublic(); // Axios instance to make API calls

  useEffect(() => {
    const fetchOrdered = async () => {
      try {
        const response = await axiosPublic.get('/orders');
        let orders = response.data;

        // Sort orders by date (newest first)
        orders.sort(
          (a, b) =>
            new Date(b.orderDetails.date) - new Date(a.orderDetails.date)
        );
        setOrdered(orders);
        applyFilter(orders, filter);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrdered();
  }, [axiosPublic]); // Fetch orders once when the component mounts

  useEffect(() => {
    applyFilter(ordered, filter);
  }, [filter, selectedDate]); // Re-run filtering logic whenever filter or selectedDate changes

  // Apply filter logic based on filter type
  const applyFilter = (orders, filterType) => {
    const now = dayjs(); // Current date/time
    let filtered = [];

    if (filterType === 'today') {
      filtered = orders.filter(order =>
        dayjs(order.orderDetails.date).isSame(now, 'day')
      );
    } else if (filterType === 'week') {
      filtered = orders.filter(order =>
        dayjs(order.orderDetails.date).isSame(now, 'week')
      );
    } else if (filterType === 'month') {
      filtered = orders.filter(order =>
        dayjs(order.orderDetails.date).isSame(now, 'month')
      );
    } else if (filterType === 'year') {
      filtered = orders.filter(order =>
        dayjs(order.orderDetails.date).isSame(now, 'year')
      );
    } else if (filterType === 'specific-day' && selectedDate) {
      // Use startOf('day') to ensure time is not compared
      filtered = orders.filter(order =>
        dayjs(order.orderDetails.date)
          .startOf('day')
          .isSame(dayjs(selectedDate).startOf('day'))
      );
    } else {
      filtered = orders; // Default case (lifetime filter)
    }

    setFilteredOrders(filtered);
  };

  const calculateTotalPrice = () => {
    return filteredOrders.reduce((total, order) => {
      const orderTotal = parseFloat(order.orderDetails.total) || 0; // Ensure total is a number
      return total + orderTotal; // Add total only
    }, 0);
  };

  const handleFilterChange = newFilter => {
    setFilter(newFilter); // Update the filter type
    setSelectedDate(null); // Reset the selected date for non-date filters
  };

  const handleDateChange = date => {
    setSelectedDate(date); // Set the selected date from DatePicker
    setFilter('specific-day'); // Switch filter to specific-day
  };

  const handleDelete = async orderId => {
    try {
      await axiosPublic.delete(`/orders/${orderId}`);
      const updatedOrders = ordered.filter(order => order._id !== orderId);
      setOrdered(updatedOrders); // Update orders after deletion
      applyFilter(updatedOrders, filter); // Re-apply the current filter
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  return (
    <section className="w-full lg:w-[80%] m-auto p-5">
      <div className="container mx-auto">
        <div className="md:flex justify-between items-center">
          <div className="flex justify-between items-center w-full">
            <Link to="/" className="flex justify-center p-3">
              <img src={logo} className="w-16 rounded-full" alt="Shop Logo" />
            </Link>
            <div>
              <DatePicker
                selected={selectedDate} // Bind selectedDate to DatePicker
                onChange={handleDateChange} // Handle date change
                placeholderText="Select a date" // Placeholder text for the picker
                className="p-2 text-center rounded bg-green-200 border-none"
              />
            </div>
          </div>
          <div className="flex justify-between md:justify-end items-center w-full">
            <button
              onClick={() => handleFilterChange('today')}
              className={`px-4 py-2 rounded ${
                filter === 'today' ? 'bg-green-400 text-white' : ''
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleFilterChange('week')}
              className={`px-4 py-2 rounded ${
                filter === 'week' ? 'bg-green-400 text-white' : ''
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleFilterChange('month')}
              className={`px-4 py-2 rounded ${
                filter === 'month' ? 'bg-green-400 text-white' : ''
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleFilterChange('year')}
              className={`px-4 py-2 rounded ${
                filter === 'year' ? 'bg-green-400 text-white' : ''
              }`}
            >
              Year
            </button>
            <button
              onClick={() => handleFilterChange('lifetime')}
              className={`px-4 py-2 rounded ${
                filter === 'lifetime' ? 'bg-green-400 text-white' : ''
              }`}
            >
              LifeTime
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center m-4">
          <h1 className="text-2xl font-bold">Order List</h1>
          <div className="text-end text-green-400">
            <h2 className="font-semibold">Items: {filteredOrders.length}</h2>
            <h2 className="font-semibold">
              Total: {calculateTotalPrice()} BDT
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h2 className="font-semibold text-lg">
                  Order ID: {order.orderId}
                </h2>
                <div className="flex items-center">
                  <p className="text-sm text-green-300">
                    {dayjs(order.orderDetails.date).format('YYYY-MM-DD')}{' '}
                    {order.orderDetails.time}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="w-11 px-4 py-2"
                    >
                      <img src={close} alt="Delete" />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {order.orderDetails.products.map((product, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.brand} - {product.category}
                      </p>
                      <p className="text-sm">Quantity: {product.quantity}</p>
                    </div>
                    <div className="space-y-3 text-end mt-7">
                      <p className="font-semibold">{product.salePrice} BDT</p>
                      <p className="font-bold text-green-500">
                        Total: {order.orderDetails.total} BDT
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
