import { useState } from "react";
import { Search } from "lucide-react"; 

function SearchBar({ placeholder = "ابحث...", className = "", onChange }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        if (onChange) onChange(e.target.value);
    };

    return (
        <div className={`flex items-center bg-gray-200 rounded-full px-4 py-2 w-full max-w-sm ${className}`}>
            <Search className="text-gray-500 ml-2 rtl:ml-0 rtl:mr-2 " size={20} />
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base placeholder:text-gray-500 text-black mx-1"
            />
        </div>
    );
}

export default SearchBar;
