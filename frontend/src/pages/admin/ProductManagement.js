import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaInbox, FaSearch, 
  FaFilter, FaBoxOpen, FaTag, FaDollarSign, FaBoxes, FaImage
} from "react-icons/fa";
import Loading from "../../components/common/Loading";
import Toast from "../../components/common/Toast";
import { formatCurrency } from "../../utils/helpers";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Fresh Fish",
    stock: "",
  });

  const categories = ["Fresh Fish", "Frozen Fish", "Processed Fish", "Aquatic Plants"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products?limit=100");
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      setToast({ message: "❌ Error loading products", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "Fresh Fish",
        stock: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, formData);
        setToast({ message: "✅ Product updated successfully", type: "success" });
      } else {
        await axios.post("/api/products", formData);
        setToast({ message: "✅ Product added to inventory", type: "success" });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setToast({ message: "❌ Operation failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/products/${id}`);
        setToast({ message: "✅ Product deleted successfully", type: "success" });
        fetchProducts();
      } catch (err) {
        setToast({ message: "❌ Deletion failed", type: "error" });
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-blue-600 font-semibold tracking-wider text-xs uppercase mb-1 block">
              Resource Management
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Inventory Ledger
            </h1>
            <p className="mt-1 md:mt-2 text-sm text-gray-500 font-medium">
              Control and monitor your global product distribution
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <FaPlus /> Add New Product
          </button>
        </header>

        {/* Analytics & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search products by name or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Total Assets Card */}
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-3 flex items-center justify-between shadow-sm shrink-0 min-w-[200px]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-lg">
                <FaBoxOpen />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Total Items</span>
                <span className="text-2xl font-bold text-gray-900 leading-none">{products.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Level</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border border-gray-200 overflow-hidden bg-white flex-shrink-0 shadow-sm">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 mb-0.5 line-clamp-1">{product.name}</p>
                            <p className="text-[11px] md:text-xs font-medium text-gray-500">ID: #{product._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full whitespace-nowrap">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full max-w-[120px]">
                          <div className="flex justify-between text-xs font-medium mb-1.5">
                            <span className={product.stock > 10 ? 'text-emerald-600' : 'text-rose-600'}>
                              {product.stock} Units
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${product.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                              style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4 md:w-4.5 md:h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                         <FaInbox className="text-3xl text-gray-300" />
                      </div>
                      <p className="text-base font-bold text-gray-900 mb-1">No products found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search or add a new product.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Product Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div 
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up"
              style={{ maxHeight: 'calc(100vh - 2rem)' }} // Ensures it never exceeds screen height
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-5 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl shrink-0">
                <div className="flex items-center gap-3 md:gap-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0">
                      {editingProduct ? <FaEdit /> : <FaPlus />}
                   </div>
                   <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </h3>
                      <p className="text-[11px] md:text-xs text-gray-500 font-medium mt-0.5 md:mt-1 hidden sm:block">Fill in the product information below.</p>
                   </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-800 rounded-full transition-colors shrink-0"
                >
                  <FaTimes className="text-sm md:text-base" />
                </button>
              </div>

              {/* Modal Form Body - Scrollable Area */}
              <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
                <div className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Product Name</label>
                      <div className="relative">
                        <FaTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all text-sm font-medium"
                          placeholder="e.g. Premium Fish Food"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Category</label>
                      <div className="relative">
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all text-sm font-medium appearance-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all text-sm font-medium resize-none"
                      placeholder="Brief description of the product..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
                      <div className="relative">
                        <FaDollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all text-sm font-medium"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700">Stock</label>
                      <div className="relative">
                        <FaBoxes className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="0"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all text-sm font-medium"
                          placeholder="Qty"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:col-span-3 lg:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700">Image URL</label>
                      <div className="relative">
                        <FaImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          required
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all text-sm font-medium"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions - Fixed at Bottom */}
                <div className="p-5 md:p-6 bg-gray-50/50 border-t border-gray-100 rounded-b-2xl shrink-0 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;