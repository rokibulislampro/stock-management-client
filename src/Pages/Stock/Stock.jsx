import logo from '../../assets/Images/tpg.png';
import add from '../../assets/Images/add.png';
import close from '../../assets/Images/close.png';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { Link } from 'react-router-dom';

const Stock = () => {
  const [stockCloth, setStockCloth] = useState([]);
  const [viewMode, setViewMode] = useState('stock');
  const [showPopup, setShowPopup] = useState(false); // State to control popup
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    image: '',
    categoryImage: '',
    purchasePrice: '',
    salePrice: '',
    slots: '',
    date: '',
    time: '',
  });
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchStockCloth = async () => {
      let response = await axiosPublic.get('/cloths');
      let cloths = response.data;
      setStockCloth(cloths);
    };

    fetchStockCloth();
  }, [axiosPublic]);

  // Setting current date and time when form opens
  useEffect(() => {
    if (showPopup) {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];
      const formattedTime = currentDate
        .toTimeString()
        .split(':')
        .slice(0, 2)
        .join(':');

      setNewItem(prev => ({
        ...prev,
        date: formattedDate,
        time: formattedTime,
      }));
    }
  }, [showPopup]);

  // Calculate total stock pieces
  const totalStockPieces = stockCloth.reduce((total, cloth) => {
    const slot = Number(cloth.slots) || 0; // Ensure stock is a number, default to 0 if undefined
    return total + slot;
  }, 0);

  // Calculate total Price
  const totalPrice = stockCloth.reduce((total, cloth) => {
    const slot = Number(cloth.slots) || 0; // Ensure stock is a number
    const salePrice = parseFloat(cloth.salePrice) || 0; // Ensure Price is a float, default to 0 if undefined or empty
    return total + slot * salePrice; // Multiply stock with Price for total Price
  }, 0);

  // Group products by category
  const categories = stockCloth.reduce((acc, cloth) => {
    if (!acc[cloth.category]) {
      acc[cloth.category] = {
        name: cloth.category,
        image: cloth.categoryImage, // Assuming there is a category image field
        count: 1,
      };
    } else {
      acc[cloth.category].count += 1;
    }
    return acc;
  }, {});

  const handleChange = e => {
    const { name, type, files, value } = e.target;

    // Handle file input
    if (type === 'file') {
      setNewItem(prev => ({ ...prev, [name]: files[0] })); // Store file in state
    } else {
      setNewItem(prev => ({ ...prev, [name]: value })); // Handle other input types
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in newItem) {
      formData.append(key, newItem[key]);
    }

    try {
      await axiosPublic.post('/cloths', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStockCloth(prev => [...prev, newItem]);
      setShowPopup(false);

      // Reset form
      setNewItem({
        name: '',
        category: '',
        subcategory: '',
        brand: '',
        image: '',
        categoryImage: '',
        purchasePrice: '',
        salePrice: '',
        slots: '',
        date: '',
        time: '',
      });

      toast.success('Item added successfully!', {
        position: 'top-right',
        autoClose: 1500,
      });

      // Page reload
      setTimeout(() => {
        window.location.reload(); // Reload the page after item is added
      }, 1500); // Optional: Delay to let the toast notification display
    } catch (error) {
      console.error('Error adding new item:', error);
      toast.error('Failed to add item!', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  return (
    <section>
      <div className="w-full lg:w-[80%] m-auto px-5">
        <Link to="/" className="flex justify-start p-3">
          <img src={logo} className="w-16 rounded-full" alt="Shop Logo" />
        </Link>
        <div>
          <div className="flex justify-around p-2 rounded-md shadow gap-2">
            <div
              className="flex flex-col items-center w-full p-3 border-r-2 border-green-300 cursor-pointer"
              onClick={() => setViewMode('stock')}
            >
              <p className="font-bold text-green-600">Stock list</p>
              <div className="md:flex items-center space-x-2 text-green-500 mt-1">
                <p>
                  Total Products:{' '}
                  <span className="font-bold">{stockCloth.length}</span>
                </p>
                <p className="text-xl hidden md:block"> \ </p>
                <p>
                  Pieces: <span className="font-bold">{totalStockPieces}</span>
                </p>
              </div>
            </div>
            <div
              className="flex flex-col items-center w-full p-3 cursor-pointer"
              onClick={() => setViewMode('category')}
            >
              <p className="font-bold text-green-600">Category list</p>
              <p className="text-green-500 mt-1">
                Total Price:{' '}
                <span className="font-bold">
                  ৳ {totalPrice.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div>
          {viewMode === 'stock' ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {stockCloth.map(cloth => (
                <div
                  key={cloth._id}
                  className="flex sm:flex-col shadow hover:shadow-md hover:border p-2 transition-all justify-between items-center sm:items-stretch gap-4 sm:gap-0"
                >
                  <div className="relative">
                    <div className="w-20 sm:w-full h-20 sm:h-48 lg:h-60 flex justify-center items-center">
                      <img
                        src={`http://localhost:5000/uploads/${cloth.image}`}
                        alt={cloth.name}
                        className="w-full h-full object-cover transition-all hover:w-[95%] hover:h-[95%]"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{cloth.name}</p>
                    <p className="text-gray-500">
                      Stock{' '}
                      <span className="text-green-500">{cloth.slots}</span>{' '}
                      Pieces
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-semibold my-1">
                    <p className="font-bold text-red-500">
                      <span className="font-extrabold">৳</span>{' '}
                      {cloth.salePrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
              {Object.values(categories).map(category => (
                <div
                  key={category.name}
                  className="flex sm:flex-col justify-between items-center shadow hover:shadow-md hover:border p-4 transition-all gap-4 sm:gap-0"
                >
                  <div className="w-20 sm:w-full h-20 sm:h-48 lg:h-60 flex justify-center items-center">
                    <img
                      src={`http://localhost:5000/uploads/${category.image}`}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all hover:w-[95%] hover:h-[95%]"
                    />
                  </div>
                  <p className="font-bold ">{category.name}</p>
                  <p className="text-gray-500 font-semibold">
                    Products:{' '}
                    <span className="font-bold text-green-500">
                      {category.count}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Item Button */}
      <div className="mb-5 me-5 flex justify-end fixed bottom-5 right-5">
        <button
          className="rounded-full w-14"
          onClick={() => setShowPopup(true)}
        >
          <img src={add} alt="Add New Item" />
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md w-[90%] max-w-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold mb-3">Add New Item</h3>
              <img
                src={close}
                alt="Close Form"
                className="w-4"
                onClick={() => setShowPopup(false)}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newItem.name}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newItem.category}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="subcategory"
                placeholder="Subcategory"
                value={newItem.subcategory}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={newItem.brand}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="file"
                name="categoryImage"
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="number"
                name="purchasePrice"
                placeholder="Purchase Price"
                value={newItem.purchasePrice}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="number"
                name="salePrice"
                placeholder="Sale Price"
                value={newItem.salePrice}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <input
                type="number"
                name="slots"
                placeholder="Slots"
                value={newItem.slots}
                onChange={handleChange}
                className="w-full mb-3 p-2 border rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="submit" className="btn bg-green-600 text-white">
                  Add New Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Stock;
