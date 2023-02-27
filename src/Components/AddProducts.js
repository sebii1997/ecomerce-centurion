import React, {useState} from 'react'
import { storage, fs } from '../Config/Config'

export const AddProducts = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);

    const [imageError, setImageError] = useState('');

    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];
    const handleProductImg=(e)=>{
        let selectedFile = e.target.files[0];
        if(selectedFile){
            if(selectedFile&&types.includes(selectedFile.type)){
                setImage(selectedFile);
                setImageError('');
            }
            else{
                setImage(null);
                setImageError('Por favor añada una imagen valida (png o jpg)')
            }
        }
        else{
            console.log('Por favor selecciona tu archivo');
        }
    }

    const handleAddProducts = (e) =>{
        e.preventDefault();
        //console.log(title, description, price);
        //console.log(image);
        const uploadTask = storage.ref(`product-images/${image.name}`).put(image);
        uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100
            console.log(progress);
        }, error => setUploadError(error.message), () => {
            storage.ref('product-images').child(image.name).getDownloadURL().then(URL => {
                fs.collection('Products').add({
                    title,
                    description,
                    category,
                    price: Number(price),
                    URL
                }).then(() => {
                    setSuccessMsg('Producto añadido correctamente');
                    setTitle('');
                    setDescription('');
                    setPrice('');
                    document.getElementById('file').value = '';
                    setImageError('');
                    setUploadError('');
                    setTimeout(() =>{
                        setSuccessMsg('');
                    }, 3000)
                }).catch(error => setUploadError(error.message));
            })
        })
    }

  return (
    <div className='container'>
        <br></br>
        <br></br>
        <h1>Añadir Productos</h1>
        <hr></hr>
        {successMsg&&<>
            <div className='success-msg'>{successMsg}</div>
            <br></br>
        </>}
        <form autoComplete='off' className='form-group' onSubmit={handleAddProducts}>
            <label>Titulo del producto</label>
            <input type="text" className='form-control' required onChange={(e)=>setTitle(e.target.value)} value={title}></input>
            <br></br>
            <label>Descripcion del producto</label>
            <input type="text" className='form-control' required onChange={(e)=>setDescription(e.target.value)} value={description}></input>
            <br></br>
            <label>Precio del producto</label>
            <input type="number" className='form-control' required onChange={(e)=>setPrice(e.target.value)} value={price}></input>
            <br></br>
            <label>Categoria del producto</label>
            <select className='form-control' required value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Seleccionar categoria del producto</option>
                <option>Placas madres</option>
                <option>Gabinete</option>
                <option>Procesadores</option>
                <option>Memoria ram</option>
                <option>Placas de video</option>
                <option>Monitores</option>
                <option>Discos SSD</option>
                <option>Fuentes</option>
                <option>Notebooks</option>
            </select>
            <br></br>
            <label>Subir imagen del producto</label>
            <input type="file" id='file' className='form-control' required onChange={handleProductImg}></input>
            
            {imageError&&<>
                <br></br>
                <div className='error-msg'>{imageError}</div>                
            </>}
            <br></br>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button type='submit' className='btn btn-success btn-md'>
                    Enviar
                </button>
            </div>
        </form>
        {uploadError&&<>
            <br></br>
            <div className='error-msg'>{uploadError}</div>            
        </>}
    </div>
  )
}
