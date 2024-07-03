
const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/auto/upload`


const UploadFile = async(file) => 
{
   const formData = new FormData();
   formData.append('file',file)
   formData.append("upload_preset","chat-app")

   const res = await fetch(url, {
       method : 'post',
       body : formData
   })

   const responseData = await res.json();
   return responseData;
}

export default UploadFile;