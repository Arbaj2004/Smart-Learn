const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_URL}/raw/upload`;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'NGO_WEBSITE');
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  const responseData = await response.json();
  return responseData;
};

export default uploadFile;