import React, { useState, useEffect } from 'react';
import './Albums.css';

const Albums = () => {
   // מגדירים את המצב הפנימי (state) של הקומפוננטה
   const [albums, setAlbums] = useState([]); // אחסון רשימת האלבומים
   const [photos, setPhotos] = useState([]); // אחסון רשימת התמונות
   const [searchTerm, setSearchTerm] = useState(''); // מונח החיפוש לאלבומים
   const [newAlbumTitle, setNewAlbumTitle] = useState(''); // שם האלבום החדש
   const [newPhotoTitle, setNewPhotoTitle] = useState(''); // שם התמונה החדשה
   const [newPhotoUrl, setNewPhotoUrl] = useState(''); // כתובת ה-URL של התמונה החדשה
   const [selectedAlbum, setSelectedAlbum] = useState(null); // האלבום שנבחר
   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); // המשתמש הנוכחי מתוך ה-LocalStorage
   const [photoBatch, setPhotoBatch] = useState(8); // מספר התמונות לטעינה בכל פעם
   const [allPhotosLoaded, setAllPhotosLoaded] = useState(false); // האם כל התמונות נטענו

   useEffect(() => {
      // פוקנציה לטעינת האלבומים מהשרת
      const fetchAlbums = async () => {
         const response = await fetch(`http://localhost:3001/albums?userId=${user.id}`);
         const data = await response.json();
         console.log('Fetched albums:', data);
         setAlbums(data); // מעדכנים את רשימת האלבומים
      };

      fetchAlbums(); // קריאה לפונקציה לטעינת האלבומים
   }, [user.id]); // התלות במשתמש

   // פונקציה שמעדכנת את מונח החיפוש
   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   // סינון האלבומים בהתאם למונח החיפוש
   const filteredAlbums = albums.filter((album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.id.toString().includes(searchTerm)
   );

   // בחירת אלבום וטעינת התמונות שלו
   const handleSelectAlbum = async (album) => {
      console.log('Selected album:', album);
      setSelectedAlbum(album);
      const response = await fetch(`http://localhost:3001/photos?albumId=${album.id}&_limit=8`);
      const data = await response.json();
      console.log(`Fetched photos for album ${album.id}:`, data);
      setPhotos(data.filter(photo => photo.albumId === album.id)); // סינון התמונות השייכות לאלבום הנבחר
      setPhotoBatch(8);
      setAllPhotosLoaded(data.length < 8);
   };

   // טעינת עוד תמונות לאלבום הנבחר
   const handleLoadMorePhotos = async () => {
      const newBatch = photoBatch + 8;
      const response = await fetch(`http://localhost:3001/photos?albumId=${selectedAlbum.id}&_limit=${newBatch}`);
      const data = await response.json();
      console.log(`Loaded more photos for album ${selectedAlbum.id}:`, data);
      setPhotos(data.filter(photo => photo.albumId === selectedAlbum.id)); // סינון התמונות השייכות לאלבום הנבחר
      setPhotoBatch(newBatch);
      setAllPhotosLoaded(data.length < newBatch);
   };

   // הוספת אלבום חדש
   const handleAddAlbum = async () => {
      const newId = albums.length > 0 ? Math.max(...albums.map(album => parseInt(album.id))) + 1 : 1;
      console.log('Generated new album ID:', newId);

      const newAlbum = {
         id: newId.toString(), // יצירת ID חדש לאלבום
         title: newAlbumTitle, // שם האלבום החדש
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
      console.log('Added new album:', data);
      setAlbums([...albums, data]); // הוספת האלבום החדש לרשימה
      setNewAlbumTitle(''); // איפוס שדה הקלט של שם האלבום
   };

   // הוספת תמונה חדשה לאלבום הנבחר
   const handleAddPhoto = async () => {
      if (!newPhotoTitle || !newPhotoUrl) return;

      const newId = photos.length > 0 ? Math.max(...photos.map(photo => parseInt(photo.id))) + 1 : 1;
      console.log('Generated new photo ID:', newId);

      const newPhoto = {
         id: newId.toString(), // יצירת ID חדש לתמונה
         albumId: selectedAlbum.id, // קישור האלבום הנבחר
         title: newPhotoTitle, // שם התמונה החדשה
         url: newPhotoUrl, // כתובת ה-URL של התמונה החדשה
         thumbnailUrl: newPhotoUrl // כתובת ה-URL המוקטנת של התמונה החדשה
      };

      const response = await fetch('http://localhost:3001/photos', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(newPhoto),
      });

      const addedPhoto = await response.json();
      console.log('Added new photo:', addedPhoto);
      setPhotos([...photos, addedPhoto]); // הוספת התמונה החדשה לרשימה
      setNewPhotoTitle(''); // איפוס שדה הקלט של שם התמונה
      setNewPhotoUrl(''); // איפוס שדה הקלט של כתובת ה-URL
   };

   // מחיקת תמונה
   const handleDeletePhoto = async (id) => {
      console.log('Deleting photo with ID:', id);
      await fetch(`http://localhost:3001/photos/${id}`, {
         method: 'DELETE'
      });

      setPhotos(photos.filter(photo => photo.id !== id)); // הסרת התמונה מהרשימה
   };

   // עדכון תמונה
   const handleUpdatePhoto = async (id, updatedTitle, updatedUrl) => {
      console.log('Updating photo with ID:', id);
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

      setPhotos(photos.map(photo => (photo.id === id ? updatedPhoto : photo))); // עדכון התמונה ברשימה
   };

   // מחיקת אלבום
   const handleDeleteAlbum = async (id) => {
      console.log('Deleting album with ID:', id);
      await fetch(`http://localhost:3001/albums/${id}`, {
         method: 'DELETE'
      });

      setAlbums(albums.filter(album => album.id !== id)); // הסרת האלבום מהרשימה
      setSelectedAlbum(null); // איפוס האלבום הנבחר
      setPhotos([]); // איפוס רשימת התמונות
   };

   // עדכון אלבום
   const handleUpdateAlbum = async (id, updatedTitle) => {
      console.log('Updating album with ID:', id);
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

      setAlbums(albums.map(album => (album.id === id ? updatedAlbum : album))); // עדכון האלבום ברשימה
   };

   return (
      <div className="albums-container">
         <h2>Albums of {user.username}</h2>
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
                  {filteredAlbums.map((album, index) => (
                     <li key={album.id}>
                        <span onClick={() => handleSelectAlbum(album)}>{index + 1}. {album.title}</span>
                        <div className="album-controls-buttuns">
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
