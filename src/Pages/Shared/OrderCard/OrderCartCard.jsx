import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../../../Features/ContextProvider';
import './OrderCartCard.css';

const OrderCartCard = ({ cloth }) => {
  const { dispatch } = useContext(CartContext);

  // Local state to manage sale price
  const [salePrice, setSalePrice] = useState(cloth.salePrice);

  const Increase = id => {
    dispatch({ type: 'Increase', id });
  };

  const Decrease = id => {
    dispatch({ type: 'Decrease', id });
  };

  const Remove = id => {
    dispatch({ type: 'Remove', id });
  };

  // Function to handle sale price change
  const handleSalePriceChange = e => {
    const newPrice = parseFloat(e.target.value);
    if (!isNaN(newPrice)) {
      setSalePrice(newPrice);

      // Dispatch updated price to the context
      dispatch({
        type: 'UpdateSalePrice',
        payload: { id: cloth.id, salePrice: newPrice },
      });
    }
  };

  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <p className="w-2/5 text-sm font-medium text-green-500">{cloth.name}</p>
        <div className="flex w-full justify-between items-center">
          {/* Editable sale price input field */}
          <input
            type="number"
            className="text-sm font-medium border border-gray-300 p-1 rounded"
            value={salePrice}
            onChange={handleSalePriceChange}
          />
          <div className="flex items-center">
            <button
              type="button"
              className="bg-slate-100 w-[30px] h-[30px] md:w-[35px] md:h-[35px] font-bold text-xl rounded-full"
              onClick={() => Decrease(cloth.id)}
            >
              -
            </button>
            <span className="px-2">{cloth.quantity}</span>
            <button
              type="button"
              className="bg-slate-100 w-[30px] h-[30px] md:w-[35px] md:h-[35px] font-bold text-xl rounded-full"
              onClick={() => Increase(cloth.id)}
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-4">
            {/* Updated subtotal calculation */}
            <p className="text-sm font-medium">
              ৳ {cloth.quantity * salePrice}
            </p>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => Remove(cloth.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr className="my-3" />
    </div>
  );
};

export default OrderCartCard;
