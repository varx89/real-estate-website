import React from 'react';
import { useEffect } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css/bundle';
import { useNavigate } from 'react-router';

const Slider = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    SwiperCore.use([Autoplay, Navigation, Pagination]);
  
    useEffect(() => {
      const fetchListings = async () => {
        const listingRef = collection(db, 'listings');
        const qry = query(listingRef, orderBy('timestamp', 'desc'), limit(5));
        const qrySnap = await getDocs(qry);
        let listings = [];
        qrySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      };
      fetchListings();
    }, []);
  
    if (loading) {
      return <Spinner />
    }
    if (listings.length === 0) {
      return (<></>);
    }
  
  return listings && (
    <>
        <Swiper slidesPerView={1} navigation pagination={{type: 'progressbar'}} effect='fade' modules={[EffectFade]} autoplay={{delay: 3000}}>
            {listings.map(({data, id}) => (
                <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                    <div className='relative w-full h-[300px] overflow-hidden' style={{background: `url(${data.imgUrls[0]}) center, no-repeat`, backgroundSize: 'cover'}}></div>
                    <p className='text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-99 p-2 rounded-br-3xl'>
                        {data.name}
                    </p>
                    <p className='text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-99 p-2 rounded-tr-3xl'>
                       Price: ${data.discountedPrice ?? data.regularPrice}
                        {data.type === 'rent' && ' / month'}
                    </p>
                </SwiperSlide>
            ))}
        </Swiper>
    </>
  )
}

export default Slider;