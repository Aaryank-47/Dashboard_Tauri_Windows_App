import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Player } from '@lottiefiles/react-lottie-player';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Make sure you have these assets in src/assets/
import emptyAnimation from "../assets/FoodMenu.json";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Food = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentFood, setCurrentFood] = useState({
    _id: "", foodName: "", foodPrice: "", foodCategory: "", foodImage: null, foodDescription: "", isVeg: false, isActive: false
  });

  const [newFood, setNewFood] = useState({
    foodName: "", foodPrice: "", foodCategory: "", foodImage: null, foodDescription: "", isVeg: false, isActive: true
  });

  const categories = ["Fast Food", "Italian", "Healthy", "Snacks", "Chinese", "Beverages", "Hot Drinks", "Icecream", "Cold Drinks"];

  // --- DATA FETCHING AND LOGIC ---
  const fetchFoodItems = async () => {
    const adminId = localStorage.getItem('adminId');
    setIsLoading(true);
    try {
      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/canteens-menu/${adminId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFoodItems(data.foodslist.map(food => ({
        _id: food._id,
        name: food.foodName || "",
        price: food.foodPrice || 0,
        category: food.foodCategory || "",
        description: food.foodDescription || "",
        isVeg: food.isVeg || false,
        image: food.foodImage || "",
        isActive: food.isActive || false
      })));
    } catch (error) {
      toast.error('Failed to load food items.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const toggleActiveStatus = async (foodId, currentStatus) => {
    try {
      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/toggle-active/${foodId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFoodItems(foodItems.map(item =>
        item._id === foodId ? { ...item, isActive: !currentStatus } : item
      ));
      toast.success(`Item marked as ${!currentStatus ? 'active' : 'inactive'}`);

    } catch (error) {
      console.error("Error toggling active state", error.message);
      toast.error(error.message);
    }
  };

  const handleAddFood = async () => {
    const formData = new FormData();
    formData.append('foodName', newFood.foodName);
    formData.append('foodPrice', newFood.foodPrice);
    formData.append('foodCategory', newFood.foodCategory);
    formData.append('foodDescription', newFood.foodDescription);
    formData.append('isVeg', newFood.isVeg);
    formData.append('isActive', newFood.isActive);

    if (newFood.foodImage) {
      formData.append('foodImage', newFood.foodImage);
    }

    try {
      const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/foods/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add new foods');
      }

      toast.success("Food item added successfully");
      setIsAddModalOpen(false);
      setNewFood({
        foodName: "",
        foodPrice: "",
        foodCategory: "",
        foodImage: null,
        foodDescription: "",
        isVeg: false,
        isActive: true
      });

      // Refresh the food list
      const refreshResponse = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/canteens-menu/${localStorage.getItem('adminId')}`, {
        credentials: 'include',
      });
      const refreshData = await refreshResponse.json();
      setFoodItems(refreshData.foodslist.map(food => ({
        _id: food._id,
        name: food.foodName || "",
        price: food.foodPrice || "",
        category: food.foodCategory || "",
        description: food.foodDescription || "",
        isVeg: food.isVeg || false,
        isActive: food.isActive || false,
        image: food.foodImage || ""
      })));

    } catch (error) {
      console.log("Error adding food:", error);
      toast.error(error.message);
    }
  };

  const handleEditFood = async () => {
    try {
      const formData = new FormData();
      formData.append('foodName', currentFood.foodName);
      formData.append('foodPrice', currentFood.foodPrice);
      formData.append('foodCategory', currentFood.foodCategory);
      formData.append('foodDescription', currentFood.foodDescription || '');
      formData.append('isVeg', String(currentFood.isVeg));
      formData.append('isActive', String(currentFood.isActive));

      if (currentFood.foodImage instanceof File) {
        formData.append('foodImage', currentFood.foodImage);
      }

      const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/update/${currentFood._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update food item');
      }

      setFoodItems(foodItems.map(item =>
        item._id === currentFood._id ? {
          ...item,
          name: currentFood.foodName,
          price: currentFood.foodPrice,
          category: currentFood.foodCategory,
          description: currentFood.foodDescription,
          isVeg: currentFood.isVeg,
          isActive: currentFood.isActive,
          image: data.foodImage || item.image
        } : item
      ));

      toast.success("Food item updated successfully");
      setIsEditModalOpen(false);

    } catch (error) {
      console.log('Error on editing food: ', error.message);
      toast.error('Error on editing food');
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        const response = await fetch(`https://canteen-order-backend.onrender.com/api/v1/foods/delete/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete food item');
        }

        setFoodItems(foodItems.filter((item) => item._id !== id));
        toast.success("Food item deleted successfully");
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error('Failed to delete food item');
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchFoodItems();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // --- DERIVED DATA FOR METRICS AND CHARTS ---
  const menuStats = useMemo(() => {
    const activeCount = foodItems.filter(item => item.isActive).length;
    const inactiveCount = foodItems.length - activeCount;
    const totalValue = foodItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    const priceRanges = { '₹0-50': 0, '₹51-100': 0, '₹101-200': 0, '₹200+': 0 };
    foodItems.forEach(item => {
      const price = Number(item.price) || 0;
      if (price <= 50) priceRanges['₹0-50']++;
      else if (price <= 100) priceRanges['₹51-100']++;
      else if (price <= 200) priceRanges['₹101-200']++;
      else priceRanges['₹200+']++;
    });
    return { totalItems: foodItems.length, activeCount, inactiveCount, totalValue, priceDistribution: priceRanges };
  }, [foodItems]);

  // --- CHART CONFIGURATIONS ----
  const availabilityChartData = {
    labels: ['Active', 'Inactive'],
    datasets: [{ data: [menuStats.activeCount, menuStats.inactiveCount], backgroundColor: ['#10B981', '#EF4444'], borderColor: '#FFF', borderWidth: 4 }],
  };
  const priceChartData = {
    labels: Object.keys(menuStats.priceDistribution),
    datasets: [{ label: 'Number of Items', data: Object.values(menuStats.priceDistribution), backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 6 }],
  };

  // --- REUSABLE COMPONENTS ---
  const Modal = ({ isOpen, onClose, title, children, onConfirm, confirmText }) => {
     if (!isOpen) return null;
     return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-auto sm:m-4">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">{children}</div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2 sm:space-x-3 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-3 py-1.5 sm:px-4 sm:py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="button" onClick={onConfirm} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">{confirmText}</button>
            </div>
        </div>
        </div>
     );
  };
  
 const SkeletonLoader = () => (
    <div className="animate-pulse p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm h-28 sm:h-32">
            <div className="h-5 bg-slate-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm h-56 sm:h-64"></div>
        <div className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-xl shadow-sm h-56 sm:h-64"></div>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 sm:space-x-4 py-3 sm:py-4 border-b border-slate-100 last:border-b-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-200 rounded-full"></div>
            <div className="flex-1 space-y-1 sm:space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Menu Management</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Oversee your entire food catalog in one place.</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0 w-full sm:w-auto">
            <button onClick={handleRefresh} className="w-full sm:w-auto px-4 py-2 bg-white text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center text-sm font-medium border border-slate-200">Refresh</button>
            <button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center text-sm font-medium">Add Item</button>
          </div>
        </header>

        {isLoading ? <SkeletonLoader /> : (
          <>
            {foodItems.length === 0 ? (
              <div className="text-center py-10 sm:py-16 bg-white rounded-xl shadow-sm border border-slate-200 px-4">
                <Player autoplay loop src={emptyAnimation} style={{ height: '150px', width: '150px', margin: 'auto' }} />
                <h3 className="mt-4 text-lg sm:text-xl font-semibold text-slate-800">Your Menu is Empty</h3>
                <p className="mt-2 text-slate-500 text-sm sm:text-base">Add your first food item to get started.</p>
                <button onClick={() => setIsAddModalOpen(true)} className="mt-6 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-colors font-medium text-sm sm:text-base">Add Food Item</button>
              </div>
            ) : (
              <>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="text-xs sm:text-sm font-medium text-slate-500">Total Items</h3><p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1 sm:mt-2">{menuStats.totalItems}</p></div>
                  <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="text-xs sm:text-sm font-medium text-slate-500">Active Items</h3><p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{menuStats.activeCount}</p></div>
                  <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="text-xs sm:text-sm font-medium text-slate-500">Inactive Items</h3><p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{menuStats.inactiveCount}</p></div>
                  <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200"><h3 className="text-xs sm:text-sm font-medium text-slate-500">Total Menu Value</h3><p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1 sm:mt-2">₹{menuStats.totalValue.toFixed(2)}</p></div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Item Availability</h3>
                    <div className="h-48 sm:h-64 flex items-center justify-center">
                      <Doughnut data={availabilityChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } }}}}} />
                    </div>
                  </div>
                  <div className="lg:col-span-3 bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Price Distribution</h3>
                    <div className="h-48 sm:h-64">
                      <Bar data={priceChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }}, scales: { y: { beginAtZero: true, ticks: { font: { size: 10 } } }, x: { ticks: { font: { size: 10 } }}}}} />
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                          <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                          <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {foodItems.map((item) => (
                          <tr key={item._id} className={!item.isActive ? "bg-slate-50 opacity-60" : "hover:bg-slate-50"}>
                            <td className="px-4 py-3 sm:px-6 sm:py-4"><img src={item.image || "https://via.placeholder.com/150"} alt={item.name} className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover" /></td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-semibold text-slate-800">{item.name}</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600">₹{item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm text-slate-600 hidden sm:table-cell">{item.category}</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4">
                                <span 
                                  onClick={() => toggleActiveStatus(item._id, item.isActive)} 
                                  className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 ${item.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`}
                                >
                                  {item.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm font-medium flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4">
                              <button onClick={() => { setIsEditModalOpen(true); setCurrentFood({...item, foodName: item.name, foodPrice: item.price}); }} className="text-black hover:text-black text-left sm:text-center bg-white border-black">Edit</button>
                              <button onClick={() => handleDeleteFood(item._id)} className="text-black hover:text-black text-left sm:text-center bg-white border-black  ">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Food Item" onConfirm={handleAddFood} confirmText="Add Food">
         <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={newFood.foodName}
              onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              placeholder="Enter food name"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={newFood.foodPrice}
                onChange={(e) => setNewFood({ ...newFood, foodPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                placeholder="0.00"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newFood.foodCategory}
                onChange={(e) => setNewFood({ ...newFood, foodCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors bg-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newFood.foodDescription}
              onChange={(e) => setNewFood({ ...newFood, foodDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              placeholder="Optional description"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVeg"
                checked={newFood.isVeg}
                onChange={(e) => setNewFood({ ...newFood, isVeg: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="isVeg" className="ml-2 block text-sm sm:text-base text-gray-700">
                Vegetarian
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={newFood.isActive}
                onChange={(e) => setNewFood({ ...newFood, isActive: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm sm:text-base text-gray-700">
                Available
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer">
                <span className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Choose File
                </span>
                <input
                  type="file"
                  onChange={(e) => setNewFood({ ...newFood, foodImage: e.target.files[0] })}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {newFood.foodImage ? newFood.foodImage.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Food Item" onConfirm={handleEditFood} confirmText="Save Changes">
          <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              type="text"
              value={currentFood.foodName}
              onChange={(e) => setCurrentFood({ ...currentFood, foodName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={currentFood.foodPrice}
                onChange={(e) => setCurrentFood({ ...currentFood, foodPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={currentFood.foodCategory}
                onChange={(e) => setCurrentFood({ ...currentFood, foodCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors bg-white"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={currentFood.foodDescription}
              onChange={(e) => setCurrentFood({ ...currentFood, foodDescription: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsVeg"
                checked={currentFood.isVeg}
                onChange={(e) => setCurrentFood({ ...currentFood, isVeg: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="editIsVeg" className="ml-2 block text-sm sm:text-base text-gray-700">
                Vegetarian
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsActive"
                checked={currentFood.isActive}
                onChange={(e) => setCurrentFood({ ...currentFood, isActive: e.target.checked })}
                className="h-4 w-4 text-gray-700 focus:ring-gray-500 border-gray-300 rounded transition-colors"
              />
              <label htmlFor="editIsActive" className="ml-2 block text-sm sm:text-base text-gray-700">
                Available
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <div className="flex items-center">
              <label className="cursor-pointer">
                <span className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Change Image
                </span>
                <input
                  type="file"
                  onChange={(e) => setCurrentFood({ ...currentFood, foodImage: e.target.files[0] })}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              <span className="ml-2 text-sm text-gray-500">
                {currentFood.foodImage instanceof File ? currentFood.foodImage.name : "Current image"}
              </span>
            </div>
            {currentFood.foodImage && !(currentFood.foodImage instanceof File) && (
              <div className="mt-2">
                <img
                  src={currentFood.foodImage}
                  alt="Current food"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Food;