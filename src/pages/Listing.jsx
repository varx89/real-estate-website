import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { FaShare, FaMapMarkerAlt } from 'react-icons/fa';

const Listing = () => {

    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    SwiperCore.use([Autoplay, Navigation, Pagination]);

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingID);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingID]);

    if (loading) {
        return <Spinner />;
    }
  return (
    <main>
        <Swiper slidesPerView={1} navigation pagination={{type: 'progressbar'}} effect='fade' modules={[EffectFade]} autoplay={{delay: 3000}}>
            {listing.imgUrls.map((url, index) => (
                <SwiperSlide key={index}>
                    <div className='relative w-full overflow-hidden h-[300px]' style={{background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover",}}></div>
                </SwiperSlide>
            ))}
        </Swiper>
        <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center' 
        onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
                setShareLinkCopied(false);
            }, 2000);
        } }>
                <FaShare className='text-lg text-slate-500' />
        </div>
        {shareLinkCopied && (
            <p className='fixed top-[23%] right-[5%] font-semibold border-2 text-slate-500 border-gray-400 rounded-md bg-white z-10 p-2'>Link Copied!</p>
        )}
        <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5'>
            <div className='w-full h-[200px] lg-[400px]'>
                <p className='text-2xl font-bold mb3 text-blue-900'>
                    {listing.name} - ${listing.offer ? listing.discountedPrice.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {listing.type === 'rent' && ' / month'}
                </p>
                <p className='flex items-center mt-6 mb-3 font-semibold'>
                <FaMapMarkerAlt className='text-green-700 mr-1' />
                {listing.address}
                </p>
                <div className='flex justify-start items-center space-x-4 w-[75%]'>
                    <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>{listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
                    {listing.offer && (
                        <p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md'>${listing.regularPrice - listing.discountedPrice} discount</p>
                    )}
                </div>
            </div>
            <div className='bg-blue-300 w-full h-[200px] lg-[400px] z-10 overflow-x-hidden'></div>
        </div>
    </main>
  )
}

export default Listing;