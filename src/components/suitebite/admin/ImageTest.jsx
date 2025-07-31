import React from 'react';

const ImageTest = ({ imageUrl }) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <h3 className="text-lg font-bold mb-2">Image Test</h3>
      <p className="text-sm text-gray-600 mb-2">URL: {imageUrl}</p>
      
      {/* Simple image display */}
      <div className="w-32 h-32 border border-gray-400 bg-gray-100 mb-4">
        <img 
          src={imageUrl} 
          alt="Test image"
          className="w-full h-full object-contain"
          onLoad={(e) => console.log('✅ Image loaded successfully:', e.target.src)}
          onError={(e) => console.error('❌ Image failed to load:', e.target.src)}
        />
      </div>
      
      {/* Direct link */}
      <a 
        href={imageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-sm"
      >
        Open image in new tab
      </a>
    </div>
  );
};

export default ImageTest; 