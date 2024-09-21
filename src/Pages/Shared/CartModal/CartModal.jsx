import { useContext } from 'react';
import removeImg from '../../../assets/Images/close.png';
import { CartContext } from '../../../Features/ContextProvider';

const CartModal = ({ cloth }) => {
  const { dispatch } = useContext(CartContext);

  const Remove = id => {
    dispatch({ type: 'Remove', id });
  };

  return (
    <div>
      <div className="flex gap-2 items-center">
        <img
          src={`https://inventory-management-server-omega.vercel.app${cloth.image}`}
          className="w-1/6"
          alt={cloth.name}
        />
        <div className="ms-0">
          <p className="font-semibold">{cloth.name}</p>
          <p className="font-semibold">
            {cloth.quantity} ✕ <span className="font-semibold">৳</span>{' '}
            {cloth.salePrice}
          </p>
        </div>
        <div
          className="flex justify-center items-center ml-auto"
          onClick={() => Remove(cloth.id)}
        >
          <img
            src={removeImg}
            className="w-6 h-6 hover:bg-green-200 p-1 transition-all rounded-full"
            alt="Remove"
          />
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
};

export default CartModal;
