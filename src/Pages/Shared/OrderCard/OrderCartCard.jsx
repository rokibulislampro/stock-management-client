import { useContext } from 'react';
import { CartContext } from '../../../Features/ContextProvider';
import './OrderCartCard.css';

const OrderCartCard = ({ cloth }) => {
  const { dispatch } = useContext(CartContext);

  const Increase = id => {
    dispatch({ type: 'Increase', id });
  };

  const Decrease = id => {
    dispatch({ type: 'Decrease', id });
  };

  const Remove = id => {
    dispatch({ type: 'Remove', id });
  };

  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <p className="w-2/5 text-sm font-medium text-green-500">{cloth.name}</p>
        <div className="flex w-full justify-between items-center">
          <p className="text-sm font-medium">
            <span className="text-xl">৳</span> {cloth.salePrice}
          </p>
          <div className="flex items-center">
            <button
              type="button" // Added to prevent form submission
              className="bg-slate-100 w-[30px] h-[30px] md:w-[35px] md:h-[35px] font-bold text-xl rounded-full"
              onClick={() => Decrease(cloth.id)}
            >
              -
            </button>
            <span className="px-2">{cloth.quantity}</span>
            <button
              type="button" // Added to prevent form submission
              className="bg-slate-100 w-[30px] h-[30px] md:w-[35px] md:h-[35px] font-bold text-xl rounded-full"
              onClick={() => Increase(cloth.id)}
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">
              ৳ {cloth.quantity * cloth.salePrice}
            </p>
            <button
              type="button" // Added to prevent form submission
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
