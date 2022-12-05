import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import Spinner from '../components/Spinner';
import { db } from '../firebase';

const Offers = () => {

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchListing, setLastFetchListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, 'listings');
        const qry = query(listingRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(8));

        const qrySnap = await getDocs(qry);
        const lastVisible = qrySnap.docs[qrySnap.docs.length - 1];
        setLastFetchListing(lastVisible);

        const listings = [];
        qrySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch listings!');
      }
    }
    fetchListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      const listingRef = collection(db, 'listings');
      const qry = query(listingRef, where('offer', '==', true), orderBy('timestamp', 'desc'), startAfter(lastFetchListing), limit(4));

      const qrySnap = await getDocs(qry);
      const lastVisible = qrySnap.docs[qrySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      const listings = [];
      qrySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Could not fetch listings!');
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>
        Offers
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {listings.map((listing) => (
                <ListingItem key={listing.id} id={listing.id} listing={listing.data} />
              ))}
            </ul>
          </main>
          {lastFetchListing && (
            <div className='flex justify-center items-center'>
              <button onClick={onFetchMoreListings} className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out'>Load more</button>
            </div>
          )}
        </>
      ) : (
        <p>There are no listings available</p>
      )}
    </div>
  )
}

export default Offers;
