import React from "react";
import { formatCurrency } from "../../utils/helpers";
import { FaShoppingCart, FaStar, FaEye } from "react-icons/fa";

function ProductCard({ product, onAddToCart, onViewDetails }) {
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-50">
        <img
          src={product.image || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=600"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-aqua-primary-600 shadow-sm border border-white/20">
            {product.category}
          </span>
          {isOutOfStock && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions Hover */}
        <div className="absolute inset-0 bg-aqua-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
           <button 
             onClick={() => onViewDetails(product._id)}
             className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-aqua-dark hover:bg-aqua-primary-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
             title="View Details"
           >
             <FaEye className="text-xl" />
           </button>
           <button 
             onClick={() => onAddToCart(product._id)}
             disabled={isOutOfStock}
             className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-aqua-dark hover:bg-aqua-primary-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 disabled:opacity-50 disabled:cursor-not-allowed"
             title="Add to Cart"
           >
             <FaShoppingCart className="text-xl" />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 
            onClick={() => onViewDetails(product._id)}
            className="text-xl font-bold text-gray-800 line-clamp-1 cursor-pointer hover:text-aqua-primary-500 transition-colors"
          >
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 bg-gold-primary/10 px-2 py-0.5 rounded-lg">
            <FaStar className="text-gold-primary text-xs" />
            <span className="text-xs font-bold text-gold-primary">{product.rating?.toFixed(1) || "5.0"}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {product.description || "Premium quality fresh catch, sourced sustainably and handled with master care."}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Price</span>
            <span className="text-2xl font-black text-aqua-ocean">
              {formatCurrency(product.price)}
            </span>
          </div>
          
          <button
            onClick={() => onAddToCart(product._id)}
            disabled={isOutOfStock}
            className="px-5 py-3 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white rounded-2xl transition-all shadow-lg shadow-aqua-primary-500/20 active:scale-95 disabled:bg-gray-200 disabled:shadow-none font-bold text-sm"
          >
            {isOutOfStock ? "Restocking" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
