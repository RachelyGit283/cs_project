import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Car } from './Car';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import {  useSelector } from "react-redux";

import {  FaMapMarkerAlt } from 'react-icons/fa';
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
export default function AllParkinglots() {
    const {user} = useSelector((state) => state.token);

    let emptyProduct = {
        _id: '',
        nameParkinglot: "",
        managerParkinglot: null,
        country: "",
        city: "",
        street: "",
        numberOfStreet: 0,
        sizeParkinglot: 0,
        managerParkinglot: user._id
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [releaseCar, setReleaseCar] = useState(false);
    const [releaseDate, setReleaseDate] = useState();
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const token = useSelector((state) => state.token.token);
    const navigate = useNavigate();

    useEffect(() => {
        getAllParking(token).then((data) => setProducts(data));
    }, []);
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };
    const getAllParking = async (token) => {
        try {
            const res = await axios.get(`http://localhost:8090/api/Parkinglot/getParkinglots`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 200) {
                // console.log("parkunglots", res.data)
                return res.data;
            }
        } catch (e) {
            return [];
        }
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        getAllParking(token).then((data) => setProducts(data));
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };
    const hideReleaseCarDialog = () => {
        setReleaseCar(false);
    };
    const saveProduct = async () => {
        if (product.nameParkinglot && product.sizeParkinglot) {
            // console.log("saveProduct", product)
            setSubmitted(true);
            if (product.nameParkinglot.trim()) {
                let _products = [...products];
                let _product = { ...product };
                if (product._id) {
                    const index = findIndexById(product._id);
                    _products[index] = _product;
                    const res = await axios.put(`http://localhost:8090/api/parkinglot/${product._id}`, product);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                }
                else {
                    // console.log("product", product)
                    const res = await axios.post(`http://localhost:8090/api/parkinglot`, product, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    _product.id = createId();
                    _product.image = 'product-placeholder.svg';
                    _products.push(_product);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                }

                setProducts(_products);
                setProductDialog(false);
                setProduct(emptyProduct);
                getAllParking(token).then((data) => setProducts(data));

            }
            else
                alert("מיקום חניון וגודלו הינם חובה")
        }

    };
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };
    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        try {
            const res = await axios.delete(`http://localhost:8090/api/Parkinglot/${product._id}`)
        }
        catch (a) {
            console.log("server error", a);
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        getAllParking(token).then((data) => setProducts(data));

    };
    const release = async () => {
        setReleaseCar(false)

        try {
            const res = await axios.get(`http://localhost:8090/api/parking/`);
            let _parking = res.data.filter((val) => val.carParking === releaseDate._id);
            // if (res.status === 200) {
            //     // console.log("parking", _parking[0])
            // }
            if (_parking.length === 0) { return console.log("error in datails") }

            const putRes = await axios.put(`http://localhost:8090/api/parking/unP/${_parking[0]._id}`);
            // console.log("putRes.status", putRes.data.dateDiffDays);

            if (putRes.status === 200) {
                alert(putRes.data.dateDiffDays)
                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'car released',
                    life: 3000,
                });
                return putRes.data;
            }
        } catch (e) {
            console.error("שגיאה:", e);
            return {};
        }
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };
    const deleteSelectedProducts = async () => {

        let _productsDelete = products.filter((val) => selectedProducts.includes(val));
        try {
            for (let i = 0; i < _productsDelete.length; i++) {

                await axios.delete(`http://localhost:8090/api/parkinglot/${_productsDelete[i]._id}`)

            }
        }
        catch (a) {
            console.log("server error", a);
        }
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };


    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['sizeParkinglot'] = e.value;
        setProduct(_product);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );

    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };


  
    const goToOtherComponent = (rowData) => {
        navigate('/PositionedObjects', { state: { product: rowData } })
    }
 

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const statusBodyTemplate = (rowData) => {

        const handleLocationClick = () => {
            // console.log("rowData", rowData)

            navigate('/PositionedObjects', { state: { props: rowData } });

            // console.log('Parking icon clicked!');
        };

        return (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <>
                    <FaMapMarkerAlt color="orange" title="Car is not parked" style={{ fontSize: '24px' }} onClick={handleLocationClick} />
                    <span style={{ marginLeft: '8px', fontSize: '16px' }}>  למעבר לחניון </span>
                </>

            </button>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>

            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
    const locationBodyTemplate = (rowData) => {
        const location = rowData.locationParkinglot; // אובייקט עם המפתחות {country, city, street, numberOfStreet}
        return location
            ? `${location.country}, ${location.city}, ${location.street} ${location.numberOfStreet}`
            : 'N/A'; // אם הנתונים אינם קיימים
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="nameParkinglot" header="nameParkinglot" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="sizeParkinglot" header="sizeParkinglot" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="locationParkinglot" header="locationParkinglot" body={locationBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="isParkingCar" header="Parking" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        nameParkinglot
                    </label>
                    <InputText id="name" value={product.nameParkinglot} onChange={(e) => onInputChange(e, 'nameParkinglot')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nameParkinglot })} />
                    {submitted && !product.nameParkinglot && <small className="p-error">nameParkinglot is required.</small>}
                </div>
                <div className="field col">
                    <label htmlFor="sizeParkinglot" className="font-bold">
                        sizeParkinglot
                    </label>
                    <InputNumber id="sizeParkinglot" value={product.sizeParkinglot} onValueChange={(e) => onInputNumberChange(e, 'sizeParkinglot')} />
                </div>
                <div className="field">
                    <label htmlFor="country" className="font-bold">
                        country
                    </label>
                    <InputText id="country" value={product.locationParkinglot?.country || ''}
                        onChange={(e) => onInputChange(e, 'country')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.country })} />
                    {submitted && !product.country && <small className="p-error">country is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="city" className="font-bold">
                        city
                    </label>
                    <InputText id="city" value={product.locationParkinglot?.city|| ''} onChange={(e) => onInputChange(e, 'city')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.city })} />
                    {submitted && !product.city && <small className="p-error">city is required.</small>}
                </div>
              
                <div className="field">
                    <label htmlFor="street" className="font-bold">
                        street
                    </label>
                    <InputText id="street" value={product.locationParkinglot?.street|| ''} onChange={(e) => onInputChange(e, 'street')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.street })} />
                    {submitted && !product.street && <small className="p-error">street is required.</small>}
                </div>
                <div className="field col">
                    <label htmlFor="numberOfStreet" className="font-bold">
                        numberOfStreet
                    </label>
                    <InputNumber id="numberOfStreet" value={product.locationParkinglot?.numberOfStreet|| ''} onValueChange={(e) => onInputNumberChange(e, 'numberOfStreet')} />
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.nameParkinglot}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>

    );
}
