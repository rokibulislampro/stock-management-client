import logo from '../../assets/Images/tpg.png';
import close from '../../assets/Images/close.png';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { Link } from 'react-router-dom';

const StockManage = () => {
  const [stockCloth, setStockCloth] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [clothImage, setClothImage] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchStockCloth = async () => {
      try {
        const response = await axiosPublic.get('/cloths');
        setStockCloth(response.data);
      } catch (error) {
        console.error('Error fetching cloths:', error);
        toast.error('Failed to fetch items!', {
          position: 'top-right',
          autoClose: 1500,
        });
      }
    };

    fetchStockCloth();
  }, [axiosPublic]);

  const handleDelete = async id => {
    try {
      await axiosPublic.delete(`/cloths/${id}`);
      setStockCloth(prev => prev.filter(cloth => cloth._id !== id));
      toast.success('Item deleted successfully!', {
        position: 'top-right',
        autoClose: 1500,
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item!', {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const handleUpdateClick = item => {
    setSelectedItem(item);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', selectedItem.name);
    formData.append('category', selectedItem.category);
    formData.append('subcategory', selectedItem.subcategory);
    formData.append('purchasePrice', selectedItem.purchasePrice);
    formData.append('salePrice', selectedItem.salePrice);
    formData.append('slots', selectedItem.slots);

    if (clothImage) {
      formData.append('image', clothImage);
    }
    if (categoryImage) {
      formData.append('categoryImage', categoryImage);
    }

    try {
      const { _id } = selectedItem;
      const response = await axiosPublic.put(`/cloths/${_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200 || response.status === 204) {
        toast.success('Item updated successfully!', {
          position: 'top-right',
          autoClose: 1500,
        });

        setShowUpdateModal(false);
        setClothImage(null);
        setCategoryImage(null);
        setTimeout(() => {
          window.location.reload(); // Reload the page after item is added
        }, 1500);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      toast.error(`Failed to update item: ${error.message}`, {
        position: 'top-right',
        autoClose: 1500,
      });
    }
  };

  const handleInputChange = e => {
    setSelectedItem({
      ...selectedItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleClothImageChange = e => {
    setClothImage(e.target.files[0]);
  };

  const handleCategoryImageChange = e => {
    setCategoryImage(e.target.files[0]);
  };

  return (
    <section>
      <div className="w-full lg:w-[80%] m-auto px-5">
        <Link to="/" className="flex justify-start p-3">
          <img src={logo} className="w-16 rounded-full" alt="Shop Logo" />
        </Link>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
          {stockCloth.map(cloth => (
            <div
              key={cloth._id}
              className="flex sm:flex-col shadow p-2 justify-between items-center sm:items-stretch gap-4 sm:gap-0"
            >
              <div className="w-20 sm:w-full h-20 sm:h-48 flex justify-center items-center">
                <img
                  src={cloth.image}
                  alt={cloth.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{cloth.name}</p>
                <p className="text-gray-500">
                  Stock: <span className="text-green-500">{cloth.slots}</span>{' '}
                  Pieces
                </p>
              </div>
              <div className="flex items-center gap-3 font-semibold my-1">
                <p className="font-bold text-red-500">৳ {cloth.salePrice}</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(cloth._id)}
                >
                  Delete
                </button>
                <button
                  className="px-3 py-1 bg-indigo-500 text-white rounded"
                  onClick={() => handleUpdateClick(cloth)}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUpdateModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md w-[90%] max-w-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold mb-3">Update Item</h3>
              <img
                src={close}
                alt="Close Form"
                className="w-4"
                onClick={() => setShowUpdateModal(false)}
              />
            </div>
            <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
              <div className="md:flex justify-center items-center gap-4">
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={selectedItem.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  />
                </div>
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={selectedItem.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  />
                </div>
              </div>
              <div className="md:flex justify-center items-center gap-4">
                <div className="mb-4 space-y-2">
                  <label className="text-sm">SubCategory</label>
                  <input
                    type="text"
                    name="subcategory"
                    value={selectedItem.subcategory}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  />
                </div>
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Stock Slots</label>
                  <input
                    type="number"
                    name="slots"
                    value={selectedItem.slots}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  />
                </div>
              </div>
              <div className="md:flex justify-center items-center gap-4">
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Purchase Price</label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={selectedItem.purchasePrice}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  />
                </div>
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Sale Price</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={selectedItem.salePrice}
                    onChange={handleInputChange}
                    className="w-full p-2 border"
                  />
                </div>
              </div>
              <div className="md:flex justify-center items-center gap-4">
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Cloth Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleClothImageChange} // Cloth Image Handle
                    className="w-full p-2 border"
                  />
                </div>
                <div className="mb-4 space-y-2">
                  <label className="text-sm">Category Image</label>
                  <input
                    type="file"
                    name="categoryImage"
                    onChange={handleCategoryImageChange} // Category Image Handle
                    className="w-full p-2 border"
                  />
                </div>
              </div>
              <button type="submit" className="btn bg-indigo-500 text-white">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default StockManage;
