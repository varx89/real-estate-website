import React from 'react';

const ListingItem = ( { listing, id } ) => {
  return (
    <div>{listing.name}</div>
  )
}

export default ListingItem