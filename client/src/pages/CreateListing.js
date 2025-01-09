import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

export default function CreateListing() {

  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({    
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    regularPrice: 100,
    discountPrice: 0,
    bathRooms: 1,
    bedRooms: 1,
    furnished: false,
    parking: false,
    type: 'rent',
    offer: false
  });
  const {currentUser} = useSelector(state=> state.user);
  const navigate = useNavigate();

  function handleImageSubmit(){
    setError('');
    setUploading(true);
    if(files.length === 0){
      setUploadError('Please Choose an image to Upload');
      setUploading(false);
      return;
    }
    if(files.length > 0 && files.length + formData.imageUrls.length < 7){      
      const promises = [];

      for(let i = 0; i < files.length; i++){
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        setUploading(false);
      })
      
    }else{
      setUploadError('You can only upload 6 images per listing');
      setUploading(false);
    } 
  }


  function storeImage(file) {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
  
      const xhr = new XMLHttpRequest();
  
      xhr.open("POST", "https://api.cloudinary.com/v1_1/dbzrbmfi8/image/upload");
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          setUploadError(`Upload failed with status: ${xhr.status}`);
          reject(`Upload failed with status: ${xhr.status}`);
        }
      };
  
      xhr.onerror = () => {
        setUploadError("An error occurred during the upload.");
        reject("An error occurred during the upload.");
      };
  
      xhr.send(data);
    });
  }

  function handleRemoveImage(index){
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i)=> i !== index)
    })
  }

  function handleChange(e){
    setError('');

    if(e.target.id === 'sell' || e.target.id === 'rent'){
      setFormData({
        ...formData,
        type: e.target.id
      })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked
      })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }

  }

  async function handleSubmit(e){
    e.preventDefault();
    try {
      if(formData.imageUrls.length < 1) return setError('You must upload atleast one image');
      if(+formData.regularPrice < +formData.discountPrice) return setError('Discounted Price must be lower than regular price');
      setLoading(true);

      const res = await fetch(`/api/listing/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })

      const data = await res.json();
      setLoading(false);
      if(data.success === false){
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  function fileInput(){
    setUploadError('');
    setError('');
  }

 
  return (
    <main className='p-3 max-w-4xl mx-auto'>

        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>


            <div className='flex flex-col gap-4 flex-1'>

              <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
              <textarea onChange={handleChange} value={formData.description} type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' required/>
              <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' required/>

              <div className='flex gap-6 flex-wrap'>
                <div className='flex gap-2'>
                  <input onChange={handleChange} checked={formData.type === 'sell'} type="checkbox" id='sell' className='w-5' />
                  <span>Sell</span>
                </div>
                <div className='flex gap-2'>
                  <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" id='rent' className='w-5' />
                  <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                  <input onChange={handleChange} checked={formData.parking} type="checkbox" id='parking' className='w-5' />
                  <span>Parking Spot</span>
                </div>
                <div className='flex gap-2'>
                  <input onChange={handleChange} checked={formData.furnished} type="checkbox" id='furnished' className='w-5' />
                  <span>Furnished</span>
                </div>
                <div className='flex gap-2'>
                  <input onChange={handleChange} checked={formData.offer} type="checkbox" id='offer' className='w-5' />
                  <span>Offer</span>
                </div>
              </div>

              <div className='flex flex-wrap gap-6'>
                <div className='flex items-center gap-2'>
                  <input onChange={handleChange} value={formData.bedRooms} type="number" id='bedRooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                  <p>Beds</p>
                </div>
                <div className='flex items-center gap-2'>
                  <input onChange={handleChange} value={formData.bathRooms} type="number" id='bathRooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' />
                  <p>Baths</p>
                </div>
                <div className='flex items-center gap-2'>
                  <input onChange={handleChange} value={formData.regularPrice} type="number" id='regularPrice' min='50' required className='p-3 border border-gray-300 rounded-lg' />
                  <div className='flex flex-col items-center'>
                    <p>Regular Price</p>
                    <span className='text-xs'>($ / month)</span>
                  </div>                  
                </div>
                {
                  formData.offer && (
                    <div className='flex items-center gap-2'>
                      <input onChange={handleChange} value={formData.discountPrice} type="number" id='discountPrice' min='0' required className='p-3 border border-gray-300 rounded-lg' />
                        <div className='flex flex-col items-center'>
                          <p>Discounted Price</p>
                          <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                  )
                }
                
              </div>

            </div>


            <div className='flex flex-col flex-1 gap-4'>
              <p className='font-semibold'>Images: 
              <span className='font-normal text-gray-600 ml-2'>The first Image will be the Cover (max 6)</span>
              </p>

              <div className='flex gap-4'>
                <input onClick={fileInput} onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>
              </div>
              <p className='text-red-700 text-sm'>{uploadError && uploadError}</p>
              {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=> (
                  <div key={url} className='flex justify-between p-3 border items-center'>
                    <img src={url} alt="listing-image" className='w-20 h-20 object-contain rounded-lg' />
                    <button onClick={()=>handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                  </div>
                ))
              }
              <button disabled={uploading || loading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Listing...' : 'Create Listing'}</button>              
              {error && <p className='text-red-700 text-sm'>{error}</p> }
            </div>
            
          
        </form>

    </main>
  )
}
