import React, {useState} from 'react'
import {auth, fs} from '../Config/Config'
import { useHistory } from 'react-router-dom';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const Modal = ({TotalPrice, totalQty, hideModal}) => {

    const history = useHistory();

    const [cell, setCell] = useState(null);
    const [residentialAddress, setResidentialAddress] = useState('');
    const [cartPrice] = useState(TotalPrice);
    const [cartQty] = useState(totalQty);

    const handleCloseModal = () =>{
        hideModal ();
    }

    const handleCashOnDelivery = async(e) =>{
        e.preventDefault();
        //console.log(cell, residentialAddress, cartPrice, cartQty);
        const uid = auth.currentUser.uid;
        const userData = await fs.collection('users').doc(uid).get();
        await fs.collection('Buyer-Personal-Info').add({
            Name: userData.data().NombreCompleto,
            Email: userData.data().Email,
            CellNo: cell,
            ResidentialAdress: residentialAddress,
            CartPrice: cartPrice,
            CartQty: cartQty
        })
        const cartData = await fs.collection('cart ' + uid).get();
        for(var snap of cartData.docs){
            var data = snap.data();
            data.ID = snap.id;
            await fs.collection('Buyer-cart ' + uid).add(data);
            await fs.collection('cart ' + uid).doc(snap.id).delete();
        }
        hideModal();
        history.push('/');
        toast.success('Su orden ha sido realizada correctamente', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    }

    return (
        <div className='shade-area'>
            <div className='modal-container'>
                <form className='form-group' onSubmit={handleCashOnDelivery}>
                    <input type="number" className='form-control' placeholder='Numero de telefono'
                        required onChange={(e) => setCell(e.target.value)} value={cell}
                    />
                    <br></br>
                    <input type="text" className='form-control' placeholder='Direccion'
                        required onChange={(e) => setResidentialAddress(e.target.value)}
                        value={residentialAddress}
                    />
                    <br></br>
                    <label>Cantidad Total</label>
                    <input type="text" className='form-control' readOnly
                        required value={cartQty}
                    />
                    <br></br>
                    <label>Precio Total</label>
                    <input type="text" className='form-control' readOnly
                        required value={cartPrice}
                    />
                    <br></br>
                    <button type='submit' className='btn btn-success btn-md'>Enviar</button>
                </form>
                <div className='delete-icon' onClick={handleCloseModal}>x</div>
            </div>
        </div>
    )
}