import { useContext, useEffect, useState } from 'react';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { CartContext } from '../../Features/ContextProvider';
import { Link } from 'react-router-dom';
import logo from '../../assets/Images/tpg.png';
import cartImg from '../../assets/Images/cart.png';
import shoppingBag from '../../assets/Images/bag.png';
import { totalItem, totalPrice } from '../../Features/CartReducer';
import './Sales.css';
import CartModal from '../Shared/CartModal/CartModal';

const Sales = () => {
  const [saleCloth, setSaleCloth] = useState([]);
  const axiosPublic = useAxiosPublic();
  const { cart, dispatch } = useContext(CartContext);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchSaleCloth = async () => {
      let response = await axiosPublic.get('/cloths');
      let cloths = response.data;
      setSaleCloth(cloths);
    };

    fetchSaleCloth();
  }, [axiosPublic]);

  const addToCart = cloth => {
    dispatch({
      type: 'Add',
      cloth: { ...cloth, id: cloth._id },
    });
  };

  const removeFromCart = id => {
    dispatch({ type: 'Remove', id });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="w-full lg:w-[80%] m-auto">
      <div className="flex justify-between items-center mx-10">
        <Link to="/" className="flex justify-center p-3">
          <img src={logo} className="w-16 rounded-full" alt="Shop Logo" />
        </Link>
        <div
          className="relative"
          style={{ width: '3rem' }}
          onClick={handleOpenModal}
        >
          <img
            src={cartImg}
            alt="Add to Cart"
            className="cursor-pointer"
            style={{ width: '100%' }}
          />
          <span className="badge-count font-semibold">{totalItem(cart)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 m-5">
        {saleCloth.map(cloth => {
          const isInCart = cart.some(item => item.id === cloth._id);
          return (
            <div
              key={cloth._id}
              className="h-full shadow hover:shadow-md hover:border p-4 transition-all hover:text-green-500 grid"
            >
              <div className="relative">
                <div className="flex justify-center items-center h-48 lg:h-60">
                  <img
                    src={`http://localhost:5000/uploads/${cloth.image}`}
                    alt={cloth.name}
                    className="w-full h-full object-cover transition-all hover:w-[95%] hover:h-[95%]"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">{cloth.name}</p>
              </div>
              <div className="flex items-center justify-between py-1">
                <p className="text-slate-300 text-md font-bold">
                  <span className="font-extrabold">৳ </span>
                  {cloth.salePrice}
                </p>
                <p className="text-slate-400 text-md font-bold">
                  Slots: {cloth.slots}
                </p>
              </div>
              {!isInCart ? (
                <button
                  className="button text-center w-full h-10 rounded bg-green-500 text-white font-semibold mt-2"
                  onClick={() => addToCart(cloth)}
                >
                  Add To Cart
                </button>
              ) : (
                <button
                  className="button text-center w-full h-10 rounded border border-green-500 bg-white text-green-500 font-semibold mt-2"
                  onClick={() => removeFromCart(cloth._id)}
                >
                  Remove Item
                </button>
              )}
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-end z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseModal}
          ></div>
          <div className="w-2/3 sm:w-1/2 lg:w-1/4 h-full bg-white shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 slide-in-from-right">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h3 className="font-semibold text-xl">Shopping Cart</h3>
            <hr style={{ marginTop: '2px' }} />
            <div>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-10">
                  <div className="bg-slate-200 p-2 rounded-full overflow-hidden">
                    <img
                      className="w-12 translate-y-3"
                      src={shoppingBag}
                      alt=""
                    />
                  </div>
                  <p className="py-4 text-sm font-semibold text-center">
                    No cloths in the Cart
                  </p>
                </div>
              ) : (
                <div className="mt-4 bottom">
                  {cart.map(cloth => (
                    <CartModal key={cloth.id} cloth={cloth} />
                  ))}
                  <div className="bottom-0">
                    <div className="flex justify-between text-lg">
                      <p className="font-semibold">Total Cloth</p>
                      <p className="font-bold">{totalItem(cart)}</p>
                    </div>
                    <div className="flex justify-between text-lg">
                      <p className="font-semibold">Subtotal</p>
                      <p className="text-md font-bold">
                        <span className="font-extrabold">৳ </span>
                        {totalPrice(cart)}
                      </p>
                    </div>
                    <div>
                      <Link to="/order">
                        <button
                          className="text-center w-full h-11 rounded bg-green-500 text-white font-semibold mt-2"
                          onClick={handleCloseModal}
                        >
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Sales;
