import React, { useState } from 'react';
import { Search, X } from 'react-feather';

const SearchBar = ({
    liveSearch = false,
    iconSize = 16,
    placeholder = 'Type and Enter to search . . .',
    onSearch = () => { }
}) => {
    const [keyword, setKeyword] = useState('');

    const onEnter = e => {
        if (!liveSearch) {
            e.key === 'Enter' && onSearch(keyword);
        }
    };

    const onDelete = () => {
        setKeyword('');
        onSearch();
    };

    const onKeyword = e => {
        if (liveSearch) {
            onSearch(e.target.value);
        }

        setKeyword(e.target.value);
    };

    return (
        <div className='flex w-full'>
            <div className='flex justify-center items-center p-2 text-gray-600 z-10'>
                <Search size={iconSize} />
            </div>
            <input
                type='text'
                value={keyword}
                className='bg-dark border-gray-300 rounded-sm border-solid border-1 w-full px-8 py-2 h-8 text-xs text-white -ml-8'
                placeholder={placeholder}
                onChange={onKeyword}
                onKeyDown={onEnter} />
            {keyword && <div className='flex justify-center items-center p-2 text-gray-600 cursor-pointer -ml-8' onClick={onDelete}>
                <X size={iconSize} />
            </div>}
        </div>
    );
};

export default SearchBar;