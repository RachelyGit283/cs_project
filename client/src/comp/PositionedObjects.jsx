import './PositionedObjects.css';
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Parking } from './Parking';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { TiParking } from 'react-icons/ti';
import { IoMdCloseCircle } from 'react-icons/io';
import { ToggleButton } from 'primereact/togglebutton';
import { set } from 'react-hook-form';
import { FaParking, FaMapMarkerAlt } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
const Positionedparkings = () => {
        const location = useLocation();

        const { props } = location.state || {};

    const [parkings, setParkings] = useState([]);
    
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [idParkinglot, setIdParkinglot] = useState(props._id);
    const toast = useRef(null);


let emptyProduct = {
        _id: '',
        locationParking: "",
        priceParking: 0,
        timeStartParking: null,
        intrestedParking: null,
        carParking: null,
        sizeParking: "",
        parkinglotOfParking: idParkinglot,
        isHandicappedParking: false,
        isFullParking: false
    };
    const [product, setProduct] = useState(emptyProduct);
    const [checked, setChecked] = useState(product.isHandicappedParking);
    const dt = useRef(null);
    const [productDialog, setProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const token = useSelector((state) => state.token.token);
    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < parkings.length; i++) {
            if (parkings[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };
    // const exportCSV = () => {
    //     dt.current.exportCSV();
    // };
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setChecked(emptyProduct.isHandicappedParking)
        setProductDialog(true);
    };
    // const rightToolbarTemplate = () => {
    //     return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    // };
    const confirmDeleteProduct = (product) => {
        console.log("product",product)
        setProduct(product);
        setDeleteProductDialog(true);
    };
    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['sizeParking'] = e.value;
        setProduct(_product);
    };
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };
    const saveProduct = async () => {
        console.log(product)
        if (product.locationParking && product.sizeParking) {
            setSubmitted(true);
            if (product.locationParking.trim()) {
                let _products = [...parkings];
                let _product = { ...product };
                if (product._id) {
                    const index = findIndexById(product._id);
                    _products[index] = _product;
                    // console.log("p", product)
                    try {
                        const res = await axios.put(`http://localhost:8090/api/Parking/${product._id}`, product);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    }
                    catch (a) {
                        console.log("server error", a);
                    }
                }
                else {
                    try {
                        const res = await axios.post(`http://localhost:8090/api/Parking`, product, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        
                    }
                    catch (a) {
                        console.log("server error", a);
                    }

                    _product.id = createId();

                    _product.image = 'product-placeholder.svg';
                    console.log(_product,_products)
                    _products.push(_product);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                }

                setParkings(_products);
                setProductDialog(false);
                setProduct(emptyProduct);
            }

        }else{ alert("מיקום חניה וגודלה הינם חובה")}

    };
    const deleteProduct = async () => {
        let _products = parkings.filter((val) => val.id !== product.id);

        setParkings(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        try {
            console.log(product)
            const res = await axios.delete(`http://localhost:8090/api/Parking/${product._id}`)
        }
        catch (a) {
            console.log("server error", a);
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        getAllParking(token).then((data) => setParkings(data));
    };
    const deleteProductDialogFooter = (
        <React.Fragment>

            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );

    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };
    const setCheckedAnd = (value) => {
        setChecked(value);
        product.isHandicappedParking = value;

    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };
   useEffect(() => {
        getAllParking(token).then((data) => setParkings(data));
    }, []);

    const getAllParking = async (token) => {
        try {
console.log("props",props)
            const res = await axios.get(`http://localhost:8090/api/Parkinglot/${props._id}`);
            if (res.status === 200) {
                console.log("parkunglots", res.data.allParkinglot)
                return res.data.allParkinglot;
            }
        } catch (e) {
            return [];
        }
    };

 
    return (
        <div>  
                      <Toast ref={toast} />
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <div className="container">
            {/* שורה למיקום 1 */}


            <div className="row row-1" >
                {parkings
                    .filter((obj) => obj.locationParking.charAt(0) == 'A')
                    .map((obj) => (
                        <div
                            key={obj._id}
                            className="box dynamic-size"
                            style={{ backgroundColor: getRandomColor() }}
                        >
                            {actionBodyTemplate(obj)}
                            {obj.locationParking + "-"}
                            {obj.isFullParking ? "FULL" : "EMPTY"}

                        </div>
                    ))}
            </div>

            {/* עמודה למיקום 2 */}
            <div className="column column-2" >
                {parkings
                    .filter((obj) => obj.locationParking.charAt(0) == 'B')
                    .map((obj) => (
                        <div
                            key={obj._id}
                            className="box dynamic-size"
                            style={{ backgroundColor: getRandomColor() }}
                        >
                            {actionBodyTemplate(obj)}
                            {obj.locationParking + "-"}
                            {obj.isFullParking ? "FULL" : "EMPTY"}
                        </div>
                    ))}
            </div>

            {/* עמודה למיקום 3 */}
            <div className="column column-3" >
                {parkings
                    .filter((obj) => obj.locationParking.charAt(0) == 'C')
                    .map((obj) => (
                        <div
                            key={obj._id}
                            className="box dynamic-size"
                            style={{ backgroundColor: getRandomColor() }}
                        >
                            {actionBodyTemplate(obj)}
                            {obj.locationParking + "-"}
                            {obj.isFullParking ? "FULL" : "EMPTY"}

                        </div>
                    ))}
            </div>
            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        locationParking
                    </label>

                    <InputText id="name" value={product.locationParking} onChange={(e) => onInputChange(e, 'locationParking')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.locationParking })} />
                    {submitted && !product.numberCar && <small className="p-error">locationParking is required.</small>}
                </div>
                <div className="card flex justify-content-center">
                    <Button label={idParkinglot} disabled />
                </div>
                <div className="field">
                    <label className="mb-3 font-bold">locationParking</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Size1" name="Size" value="2" onChange={onCategoryChange} checked={product.Size === '2'} />
                            <label htmlFor="Size1">2</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Size2" name="Size" value="5" onChange={onCategoryChange} checked={product.Size === '5'} />
                            <label htmlFor="Size2">5</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Size3" name="Size" value="7" onChange={onCategoryChange} checked={product.Size === '7'} />
                            <label htmlFor="Size3">7</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Size4" name="Size" value="Bus" onChange={onCategoryChange} checked={product.Size === 'Bus'} />
                            <label htmlFor="Size4">Bus</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Size5" name="Size" value="7+" onChange={onCategoryChange} checked={product.Size === '7+'} />
                            <label htmlFor="Size5">7+</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="Size6" name="Size" value="MiniBus" onChange={onCategoryChange} checked={product.Size === 'MiniBus'} />
                            <label htmlFor="Size6">MiniBus</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">

                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            priceParking
                        </label>
                        <InputNumber id="price" value={product.priceParking} onValueChange={(e) => onInputNumberChange(e, 'priceParking')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    {/* <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div> */}

                    <div className="card flex justify-content-center">
                        <label htmlFor="isHandicappedParking" className="font-bold">
                            isHandicappedParking
                        </label>

                        <ToggleButton invalid onIcon="pi pi-check" offIcon="pi pi-times" checked={product.isHandicappedParking} onChange={(e) => setCheckedAnd(e.value)} className="w-8rem" />
                    </div>
                </div>
            </Dialog>
            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.locationParking}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div></div>
    );
};

export default Positionedparkings;