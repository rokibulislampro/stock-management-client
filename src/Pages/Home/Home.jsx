import React, { useEffect, useState } from 'react';
import useAxiosPublic from '../../Hooks/useAxiosPublic'; // Assuming you have this custom hook for API calls
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from '../../assets/Images/tpg.png';
import bannerImg from '../../assets/Images/banner.jpg';
import sale from '../../assets/Images/direct-marketing.png';
import dashboard from '../../assets/Images/dashboards.png';
import saleLedger from '../../assets/Images/sale.png';
import stock from '../../assets/Images/statisctics.png';
import { Link } from 'react-router-dom';

const Home = () => {
  const [orders, setOrders] = useState([]); // All orders from the database
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders based on date
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default is today's date
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [profit, setProfit] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null); // Last order update time

  const axiosPublic = useAxiosPublic();

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPublic.get('/orders');
        const allOrders = response.data;

        // Sort by date and time, newest first
        allOrders.sort(
          (a, b) =>
            new Date(b.orderDetails.date) - new Date(a.orderDetails.date)
        );

        setOrders(allOrders);
        filterOrdersByDate(allOrders, selectedDate);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [axiosPublic]);

  // Filter orders based on the selected date
  useEffect(() => {
    filterOrdersByDate(orders, selectedDate);
  }, [selectedDate, orders]);

  // Function to filter orders by the selected date
  // Function to filter orders by the selected date
  const filterOrdersByDate = (orders, date) => {
    const filtered = orders.filter(order =>
      dayjs(order.orderDetails.date).isSame(dayjs(date), 'day')
    );
    setFilteredOrders(filtered);

    // Calculate income, expense, and profit for the selected date
    let totalIncome = 0;
    let totalExpense = 0;
    let totalProfit = 0;

    filtered.forEach(order => {
      const extraProfit = parseFloat(order.orderDetails.extraProfit) || 0; // Handle extraProfit as a number

      // Add extraProfit and total (sale price) to income
      const orderTotal = parseFloat(order.orderDetails.total) || 0;
      totalIncome += orderTotal + extraProfit;

      // Calculate expense based on purchase price
      order.orderDetails.products.forEach(product => {
        if (product.purchasePrice) {
          totalExpense += product.purchasePrice * product.quantity;
        }
      });

      // Profit calculation: Extra profit already added to totalIncome, so we can calculate it from income - expense
      totalProfit = totalIncome - totalExpense;
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
    setProfit(totalProfit); // Final profit calculation

    // Set last update (last order's time)
    if (filtered.length > 0) {
      const lastOrder = filtered[0];
      setLastUpdate(
        `${lastOrder.orderDetails.time} ${lastOrder.orderDetails.date}`
      );
    } else {
      setLastUpdate(null);
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  return (
    <section className="">
      <div className="m-2 lg:m-5 absolute z-50">
        <img src={logo} className="w-16 m-auto rounded-full" alt="Shop Logo" />
      </div>
      <div className="relative w-full h-full">
        <img
          src={bannerImg}
          className="w-full h-full object-cover"
          alt="Banner Image"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-blue-500 to-green-500 opacity-80"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-20">
          <h1 className="text-4xl sm:text-7xl font-bold text-[#fff] ga-maamli-regular">
            THREE PEACE GALLERY
          </h1>
        </div>
      </div>
      <div className="m-5 md:mx-40 lg:mx-80 border rounded p-5">
        <div className="text-center m-auto space-y-3">
          {/* Date Picker */}
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Today's Account:</h4>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="p-2 w-2/3 text-center rounded shadow-md border-none"
                placeholderText="Select a date"
              />
            </div>
          </div>

          <div className="space-y-2 shadow rounded-md py-2">
            <div className="flex justify-between items-center bg-green-200">
              <div className="w-full text-center p-2">
                <p className="font-semibold">Income</p>
                <h2 className="text-xl font-bold">
                  <span className="font-extrabold">৳</span> {income}
                </h2>
              </div>
              <div className="w-full text-center p-2">
                <p className="font-semibold">Expense</p>
                <h2 className="text-xl font-bold">
                  <span className="font-extrabold">৳</span> {expense}
                </h2>
              </div>
            </div>
            <div className="w-full text-center bg-green-300 p-2">
              <p className="font-semibold">Profit</p>
              <h2 className="text-xl font-bold">
                <span className="font-extrabold">৳</span> {profit}
              </h2>
            </div>
            <p className="font-semibold">
              Last Update: {lastUpdate ? lastUpdate : 'No orders today'}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-5">
            <div className="flex space-x-5">
              <Link to="/sales" className="w-full rounded-md shadow p-2">
                <img src={sale} className="w-16 m-auto" alt="Sale" />
                <h3 className="text-lg font-semibold">Sales</h3>
              </Link>
              <Link to="/dashboard" className="w-full rounded-md shadow p-2">
                <img src={dashboard} className="w-16 m-auto" alt="Dashboard" />
                <h3 className="text-lg font-semibold">Dashboard</h3>
              </Link>
            </div>
            <div className="flex space-x-5">
              <Link to="/stockManage" className="w-full rounded-md shadow p-2">
                <img
                  src={saleLedger}
                  className="w-16 m-auto"
                  alt="Sales Ledger"
                />
                <h3 className="text-lg font-semibold">Stock Manage</h3>
              </Link>
              <Link to="/stock" className="w-full rounded-md shadow p-2">
                <img src={stock} className="w-16 m-auto" alt="Stock" />
                <h3 className="text-lg font-semibold">Stock</h3>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
