import React, { useState, useEffect } from 'react';
import './Albums.css';

const Albums = () => {
   const [albums, setAlbums] = useState([]);
   const [photos, setPhotos] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [newAlbumTitle, setNewAlbumTitle] = useState('');
   const [newPhotoTitle, setNewPhotoTitle] = useState('');
   const [newPhotoUrl, setNewPhotoUrl] = useState('');
   const [selectedAlbum, setSelectedAlbum] = useState(null);
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
   const [photoBatch, setPhotoBatch] = useState(8);
   const [allPhotosLoaded, setAllPhotosLoaded] = useState(false);

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
      setAllPhotosLoaded(data.length < 8);
   };

   const handleLoadMorePhotos = async () => {
      const newBatch = photoBatch + 8;
      const response = await fetch(`http://localhost:3001/photos?albumId=${selectedAlbum.id}&_limit=${newBatch}`);
      const data = await response.json();
      setPhotos(data);
      setPhotoBatch(newBatch);
      setAllPhotosLoaded(data.length < newBatch);
   };

   const handleAddAlbum = async () => {
      const newId = albums.length > 0 ? Math.max(...albums.map(album => parseInt(album.id))) + 1 : 1;

      const newAlbum = {
         id: newId.toString(),
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

   const handleAddPhoto = async () => {
      if (!newPhotoTitle || !newPhotoUrl) return;

      const newPhoto = {
         albumId: selectedAlbum.id,
         title: newPhotoTitle,
         url: newPhotoUrl,
         thumbnailUrl: newPhotoUrl
      };

      const response = await fetch('http://localhost:3001/photos', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newPhoto),
      });

      const addedPhoto = await response.json();
      setPhotos([...photos, addedPhoto]);
      setNewPhotoTitle('');
      setNewPhotoUrl('');
   };

   const handleDeletePhoto = async (id) => {
      await fetch(`http://localhost:3001/photos/${id}`, {
         method: 'DELETE'
      });

      setPhotos(photos.filter(photo => photo.id !== id));
   };

   const handleUpdatePhoto = async (id, updatedTitle, updatedUrl) => {
      const updatedPhoto = {
         ...photos.find(photo => photo.id === id),
         title: updatedTitle,
         url: updatedUrl,
         thumbnailUrl: updatedUrl
      };

      await fetch(`http://localhost:3001/photos/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(updatedPhoto)
      });

      setPhotos(photos.map(photo => (photo.id === id ? updatedPhoto : photo)));
   };

   const handleDeleteAlbum = async (id) => {
      await fetch(`http://localhost:3001/albums/${id}`, {
         method: 'DELETE'
      });

      setAlbums(albums.filter(album => album.id !== id));
      setSelectedAlbum(null);
      setPhotos([]);
   };

   const handleUpdateAlbum = async (id, updatedTitle) => {
      const updatedAlbum = {
         ...albums.find(album => album.id === id),
         title: updatedTitle
      };

      await fetch(`http://localhost:3001/albums/${id}`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(updatedAlbum)
      });

      setAlbums(albums.map(album => (album.id === id ? updatedAlbum : album)));
   };

   return (
      <div className="albums-container">
         <h2>Albums of {user.username} </h2>
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
                  {
                     filteredAlbums.map((album, index) => (
                        <li key={album.id}>
                           <span onClick={() => handleSelectAlbum(album)}>{index + 1}. {album.title}</span>
                           <div className='album-controls-buttuns'>
                              <button
                                 onClick={() => handleUpdateAlbum(album.id, prompt('Update Album Title', album.title))}
                                 className="update-button"
                              >
                                 Update
                              </button>
                              <button onClick={() => handleDeleteAlbum(album.id)} className="delete-button">Delete</button>
                              <button onClick={() => handleSelectAlbum(album)} className="view-button">View</button>
                           </div>
                        </li>
                     ))}
               </ul>
            </div>
            {selectedAlbum && (
               <div className="album-details">
                  <h3>{selectedAlbum.title}</h3>
                  <div className="new-photo-container">
                     <input
                        type="text"
                        placeholder="New Photo Title"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        className="photo-input"
                     />
                     <input
                        type="text"
                        placeholder="New Photo URL"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="photo-input"
                     />
                     <button onClick={handleAddPhoto} className="add-button">Add Photo</button>
                  </div>
                  <ul className="photo-list">
                     {photos.map((photo) => (
                        <li key={photo.id}>
                           <img src={photo.thumbnailUrl} alt={photo.title} className="photo-thumbnail" />
                           <p>{photo.title}</p>
                           <div className="photo-actions">
                              <button
                                 onClick={() => handleUpdatePhoto(photo.id, prompt('Update Title', photo.title), prompt('Update URL', photo.url))}
                                 className="update-button"
                              >
                                 Update
                              </button>
                              <button onClick={() => handleDeletePhoto(photo.id)} className="delete-button">Delete</button>
                           </div>
                        </li>
                     ))}
                  </ul>
                  {!allPhotosLoaded && (
                     <button onClick={handleLoadMorePhotos} className="load-more-button">Load More Photos</button>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

export default Albums;
