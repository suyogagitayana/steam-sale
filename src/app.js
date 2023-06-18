import React, { useCallback, useEffect, useState } from 'react';
import { fetchData } from './data/axios';
import SearchBar from './components/search-bar';
import { debounce, isEmpty } from 'lodash';


const App = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState();
    const [loading, setLoading] = useState(true);
    const [lowerPrice, setLowerPrice] = useState();
    const [upperPrice, setUpperPrice] = useState();

    const updateData = result => {
        setData(result);
        setLoading(false);
    };

    const debounceSearch = useCallback(debounce(({search, lowerPrice, upperPrice}) => {
        fetchData({
            storeID: 1,
            pageSize: 10,
            title: search,
            lowerPrice,
            upperPrice
        }, updateData);
    }, 1100), []);

    useEffect(() => {
        setLoading(true);
        debounceSearch({
            search,
            lowerPrice,
            upperPrice
        });
    }, [search, lowerPrice, upperPrice]);

    const getRating = (rating, text) => {
        let color = 'text-gray-400';

        if (parseInt(rating) > 70) {
            color = 'cl-blue';
        } else if (parseInt(rating) < 40) {
            color = 'cl-red';
        }

        return <p className={`font-light text-xs ${color}`}>{text}</p>;
    };

    return <div className=' text-gray-200'>
        <div className='text-center text-xs p-2 bg-yellow cl-yellow fixed inset-x-0 top-0 left-0'>This project is just for fun. I didnt guarantee the accuracy of any information here. All data is provided by <a className='cl-blue' href='https://apidocs.cheapshark.com/' target='_blank' rel='noreferrer'>CheapShark API</a></div>
        <div className='flex flex-wrap content-center items-center mt-8'>
            <h1 className='flex justify-center font-bold text-5xl w-full gap-2 mb-1'>
                STEAM<span className='font-light'>SALE</span>
            </h1>
            <h3 className='flex justify-center font-light text-base w-full mb-2'>CHECK RECENT GAME DEALS</h3>
            <SearchBar
                liveSearch={true}
                placeholder={'Type to search games...'}
                onSearch={setSearch} />
            <div className='flex w-full items-center gap-4 my-4'>
                <p className='w-1/3'>Price Ranges</p>
                <input
                    type='number'
                    value={lowerPrice}
                    className='bg-dark border-gray-300 rounded-sm border-solid border-1 px-2 h-8 text-xs w-1/3'
                    placeholder='Minimum Price ($)'
                    onChange={e => setLowerPrice(!isEmpty(e.target.value) ? e.target.value : undefined)} />
                <input
                    type='number'
                    value={upperPrice}
                    className='bg-dark border-gray-300 rounded-sm border-solid border-1 px-2 h-8 text-xs w-1/3'
                    placeholder='Maximum Price ($)'
                    onChange={e => setUpperPrice(!isEmpty(e.target.value) ? e.target.value : undefined)} />
            </div>
        </div>
        {loading ? [...Array(10)].map((key) => {
            return <div key={key} className='bg-dark flex p-2 gap-2 mb-2 border-1 border-gray-600 rounded-sm relative skeleton' style={{height: '68.25px'}}></div>;
        }) : !isEmpty(data) ? data.map(game => {
            const {
                steamAppID,
                thumb,
                title,
                isOnSale,
                savings,
                salePrice,
                normalPrice,
                steamRatingPercent,
                steamRatingText,
            } = game;

            return <div key={steamAppID} className='bg-dark flex p-2 gap-2 mb-2 border-1 border-gray-600 rounded-sm relative'>
                <div className='flex items-center w-1/5'>
                    <a className='w-full' href={`https://store.steampowered.com/app/${steamAppID}`}>
                        <img className='w-full' src={thumb} />
                    </a>
                </div>
                <div className='w-3/5'>
                    <h3 className='font-medium text-sm break-words'>
                        <a href={`https://store.steampowered.com/app/${steamAppID}`}>{title}</a>
                    </h3>
                    {getRating(steamRatingPercent, steamRatingText)}
                </div>
                <div className='flex items-center justify-end w-1/5'>
                    {isOnSale === '1' && <div className='flex items-center justify-center bg-green cl-green w-1/2 py-1'>
                        <p className='font-medium text-sm'>-{Math.round(savings)}%</p>
                    </div>}
                    <div className='flex flex-wrap items-center w-1/2 pl-3'>
                        <p className='w-full font-light text-gray-400 text-xs'>{isOnSale === '1' && <strike>${normalPrice}</strike>}</p>
                        <p className='w-full font-normal text-base'>${salePrice}</p>
                    </div>
                </div>
            </div>;
        }) : <div className='flex justify-center items-center w-full h-32'><p>No Deal Found</p></div>}
    </div>;
};

export default App;