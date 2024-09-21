import logo from '../../assets/Images/tpg.png';
import React, { useContext, useState } from 'react';
import { CartContext } from '../../Features/ContextProvider';
import OrderCartCard from '../Shared/OrderCard/OrderCartCard';
import { totalItem, totalPrice } from '../../Features/CartReducer';
import { Link } from 'react-router-dom';
import emptyCart from '../../assets/Images/bag.png';
import './OrderCart.css';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const OrderCart = () => {
  const { cart, dispatch } = useContext(CartContext);
  const [error, setError] = useState(null);
  const [extraProfit, setExtraProfit] = useState('');
  const axiosPublic = useAxiosPublic();

  const hasCloths = cart.length > 0;

  const generateOrderId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleSubmit = async e => {
    e.preventDefault(); // Prevent form from submitting automatically

    // Create a new Date object to get the current date and time
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString(); // Format: MM/DD/YYYY or DD/MM/YYYY based on locale
    const time = currentDate.toLocaleTimeString(); // Format: HH:MM:SS AM/PM based on locale

    const orderDetails = {
      products: cart.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand,
        image: product.image,
        quantity: product.quantity,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
      })),
      total: totalPrice(cart),
      extraProfit: extraProfit || 0,
      date: date, // Add the current date
      time: time, // Add the current time
    };

    const orderId = {
      orderId: generateOrderId(),
      orderDetails,
    };

    try {
      // Place the order
      await axiosPublic.post('/orders', orderId);

      // Update stock for each product
      for (const product of cart) {
        const remainingSlots = product.slots - product.quantity;

        // Send PATCH request to update the stock (slots)
        await axiosPublic.put(`/cloths/${product.id}`, {
          slots: remainingSlots,
        });
      }

      // Clear the cart after placing the order
      dispatch({ type: 'CLEAR_CART' });
      setError(null); // Clear any previous errors
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in.');
      } else {
        setError('Failed to place order. Please try again.');
      }
    }
  };


  const handleExtraProfitChange = e => {
    setExtraProfit(e.target.value);
  };

  return (
    <section>
      <Link to="/" className="flex justify-center p-3">
        <img src={logo} className="w-20 rounded-full" alt="Shop Logo" />
      </Link>
      <div className="m-5">
        {!hasCloths && (
          <div className="flex flex-col justify-center items-center">
            <img src={emptyCart} className="w-40" alt="" />
            <h2 className="text-3xl font-semibold my-4">
              Your Cart is <span className="text-green-500">Empty!</span>
            </h2>
            <p className="text-center font-semibold mb-3">
              Must add items to the cart before you proceed to checkout.
            </p>
            <Link to="/sales">
              <button className="w-fit text-white font-semibold px-8 py-1 bg-green-500 rounded-full">
                Return To Shop
              </button>
            </Link>
          </div>
        )}
        {hasCloths && (
          <form className="xl:mx-40 md:flex gap-4" onSubmit={handleSubmit}>
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl mb-4 text-green-500 font-serif font-semibold">
                Your Cart
              </h2>
              <table className="w-full flex flex-col justify-center">
                <thead className="w-full flex">
                  <tr className="w-full flex justify-between">
                    <th className="py-3 px-2 md:px-6 text-left">Cloth</th>
                    <th className="py-3 px-2 md:px-6 text-left">Price</th>
                    <th className="py-3 px-2 md:px-6 text-left">Quantity</th>
                    <th className="py-3 px-2 md:px-6 text-left">Subtotal</th>
                  </tr>
                </thead>
                <hr className="mb-3" />
                <tbody>
                  {cart.map(cloth => (
                    <OrderCartCard key={cloth.id} cloth={cloth} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full md:w-1/3 h-fit mt-10 border p-5 rounded-lg border-green-500">
              <h2 className="text-xl font-semibold font-serif">Order totals</h2>
              <hr className="my-3" />
              <div className="flex justify-between items-center">
                <p className="font-semibold">Total Items</p>
                <p className="text-lg font-bold">{totalItem(cart)}</p>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-center">
                <p className="font-semibold">Grand Total</p>
                <p className="text-lg font-bold">
                  <span className="text-xl font-extrabold">৳ </span>
                  {totalPrice(cart)}
                </p>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between items-center w-full">
                <p className="font-semibold">Extra Profit</p>
                <input
                  type="number"
                  name="extraProfit"
                  value={extraProfit}
                  onChange={handleExtraProfitChange}
                  placeholder="0"
                  className="border border-green-400 rounded p-1 text-green-500"
                />
              </div>
              <hr className="my-3" />
              <button
                type="submit"
                className="text-center w-full h-11 rounded bg-green-500 hover:bg-[#333] text-white font-semibold mt-2 transition-all"
              >
                Place Order
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default OrderCart;
