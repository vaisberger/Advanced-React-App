import React, { useState, useEffect } from 'react';
import './Albums.css';

const Albums = () => {
   const [albums, setAlbums] = useState([]);
   const [photos, setPhotos] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [newAlbumTitle, setNewAlbumTitle] = useState('');
   const [selectedAlbum, setSelectedAlbum] = useState(null);
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
   const [photoBatch, setPhotoBatch] = useState(8);

   useEffect(() => {
      const fetchAlbums = async () => {
         const response = await fetch(`http://localhost:3001/albums?userId=${user.id}`);
         const data = await response.json();
         setAlbums(data);
      };

      fetchAlbums();
   }, [user.id]);

   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   const filteredAlbums = albums.filter((album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.id.toString().includes(searchTerm)
   );

   const handleSelectAlbum = async (album) => {
      setSelectedAlbum(album);
      const response = await fetch(`http://localhost:3001/photos?albumId=${album.id}&_limit=8`);
      const data = await response.json();
      setPhotos(data);
      setPhotoBatch(8);
   };

   const handleLoadMorePhotos = async () => {
      const newBatch = photoBatch + 8;
      const response = await fetch(`http://localhost:3001/photos?albumId=${selectedAlbum.id}&_limit=${newBatch}`);
      const data = await response.json();
      setPhotos(data);
      setPhotoBatch(newBatch);
   };

   const handleAddAlbum = async () => {
      const newAlbum = {
         title: newAlbumTitle,
         userId: user.id,
      };

      const response = await fetch('http://localhost:3001/albums', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newAlbum),
      });

      const data = await response.json();
      setAlbums([...albums, data]);
      setNewAlbumTitle('');
   };

   return (
      <div className="albums-container">
         <h2>{user.username} אלבומים</h2>
         <div className="albums-content">
            <div className="album-controls">
               <input
                  type="text"
                  placeholder="Search by ID or Title"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
               />
               <div className="new-album-container">
                  <input
                     type="text"
                     placeholder="New Album Title"
                     value={newAlbumTitle}
                     onChange={(e) => setNewAlbumTitle(e.target.value)}
                     className="album-input"
                  />
                  <button onClick={handleAddAlbum} className="add-button">Add</button>
               </div>
               <ul className="album-list">
                  {filteredAlbums.map((album) => (
                     <li key={album.id} onClick={() => handleSelectAlbum(album)}>
                        <span>{album.id}. {album.title}</span>
                     </li>
                  ))}
               </ul>
            </div>
            {selectedAlbum && (
               <div className="album-details">
                  <h3>{selectedAlbum.title}</h3>
                  <ul className="photo-list">
                     {photos.map((photo) => (
                        <li key={photo.id}>
                           <img src={photo.thumbnailUrl} alt={photo.title} className="photo-thumbnail" />
                           <p>{photo.title}</p>
                        </li>
                     ))}
                  </ul>
                  <button onClick={handleLoadMorePhotos} className="load-more-button">Load More Photos</button>
               </div>
            )}
         </div>
      </div>
   );
};

export default Albums;
