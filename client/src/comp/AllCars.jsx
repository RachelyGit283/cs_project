import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Car } from './Car';
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
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { TiParking } from 'react-icons/ti';
import { IoMdCloseCircle } from 'react-icons/io';
import { ToggleButton } from 'primereact/togglebutton';
import { set } from 'react-hook-form';
import { FaParking, FaMapMarkerAlt } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Parking from "./Parking";

export default function AllCars() {
    let emptyProduct = {
        _id: '',
        numberCar: null,
        isHandicappedCar: false,
        sizeCar: 0,
        isParkingCar: false
    };
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [checked, setChecked] = useState(product.isHandicappedCar);
    const [releaseCar, setReleaseCar] = useState(false);
    const [releaseDate, setReleaseDate] = useState();
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const token = useSelector((state) => state.token.token);
    const navigate = useNavigate();
    // const goToOtherComponent = () => {
    //     navigate("/Parking");
    // };
    useEffect(() => {
        Car.getProducts(token).then((data) => setProducts(data));
    }, []);
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setChecked(emptyProduct.isHandicappedCar)
        setProductDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        Car.getProducts(token).then((data) => setProducts(data));
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
        if (product.numberCar&&product.sizeCar){

        setSubmitted(true);
        if (product.numberCar.trim()) {
            let _products = [...products];
            let _product = { ...product };
            if (product._id) {
                const index = findIndexById(product._id);
                _products[index] = _product;
                // console.log("p", product)
                const res = await axios.put(`http://localhost:8090/api/Car/${product._id}`, product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {

                const res = await axios.post(`http://localhost:8090/api/Car`, product, {
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
        }
    }
    alert("מיספר רכב וגודלו הינם חובה")

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
            const res = await axios.delete(`http://localhost:8090/api/Car/${product._id}`)
        }
        catch (a) {
            console.log("server error", a);
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };
    const release = async () => {
        setReleaseCar(false)
        // console.log("product_id", releaseDate)

        try {
            const res = await axios.get(`http://localhost:8090/api/parking/`);
            let _parking = res.data.filter((val) => val.carParking === releaseDate._id);
            if (res.status === 200) {
                console.log("parking", _parking[0])
                // return res.data;
            }
            if (_parking.length === 0) { return console.log("error in datails") }

            const putRes = await axios.put(`http://localhost:8090/api/parking/unP/${_parking[0]._id}`);
            console.log("putRes.status", putRes.data.dateDiffDays);

            if (putRes.status === 200) {
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

        // console.log("products", products)
        let _productsDelete = products.filter((val) => selectedProducts.includes(val));
        try {
            for (let i = 0; i < _productsDelete.length; i++) {

                await axios.delete(`http://localhost:8090/api/car/${_productsDelete[i]._id}`)

            }
        }
        catch (a) {
            console.log("server error", a);
        }
        let _products = products.filter((val) => !selectedProducts.includes(val));
        // console.log("products", _products)
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };
    // const deleteSelectedProducts = () => {
    //     let _products = products.filter((val) => !selectedProducts.includes(val));

    //     setProducts(_products);
    //     setDeleteProductsDialog(false);
    //     setSelectedProducts(null);
    //     toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    // };

    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['sizeCar'] = e.value;
        setProduct(_product);
    };
    // const onCategoryChange = (e) => {
    //     setProduct((prevState) => ({
    //       ...prevState,
    //       Size: e.value,
    //     }));
    //   };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    // const onInputNumberChange = (e, name) => {
    //     const val = e.value || 0;
    //     let _product = { ...product };

    //     _product[`${name}`] = val;

    //     setProduct(_product);
    // };

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

    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    // };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.sizeCar);
    };

    // const ratingBodyTemplate = (rowData) => {
    //     return <Rating value={rowData.rating} readOnly cancel={false} />;
    // };

    //     useEffect(() => {

    //         return ()=>{
    //         <div className="card flex justify-content-center">
    //             <ToggleButton disabled checked={product.isHandicappedCar}  className="w-8rem" />
    //             //onChange={(e) => setChecked(e.value)}
    //         </div>}
    //     }, [checked]
    // )s
    const HandicappedCar = (rowData) => {
        return <div className="card flex justify-content-center">
            {/* {console.log(rowData, rowData.isHandicappedCar,rowData)} */}
            {/* { rowData.isHandicappedCar?<ToggleButton disabled checked={true} className="w-8rem" />:<ToggleButton disabled checked={false} className="w-8rem" />} */}
            <ToggleButton disabled checked={rowData.isHandicappedCar} className="w-8rem" />
        </div>
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const setCheckedAnd = (value) => {
        setChecked(value);
        product.isHandicappedCar = value;

    };
    // const parking = async () => {
    //     try {
    //         const res = await axios.get(`http://localhost:8090/api/parkinglot/67d17afef9b9780994cfa660`);
    //         if (res.status === 200) {
    //             console.log("parking", res.data)
    //             getInMap(res.data)
    //             return res.data.carsUser;
    //         }
    //     } catch (e) {
    //         return [];
    //     }

    // }

    // const getInMap = (branch) => {
    //     const fixedDestination = `${branch.locationParkinglot.city}, ${branch.locationParkinglot.street}, ${branch.locationParkinglot.numberOfStreet}`; // Fixed Address
    //     const address = encodeURIComponent(fixedDestination); // Address
    //     // Open the directions to the fixed destination.
    //     window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=driving`, '_blank');
    // };
    // const getInMap = (branch) => {
    //     const address = encodeURIComponent(`${branch.locationParkinglot.city}, ${branch.locationParkinglot.street}, ${branch.locationParkinglot.numberOfStreet}`); // Address
    //     window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=driving`, '_blank');
    // };

    const statusBodyTemplate = (rowData) => {
        const handleParkingClick = () => {
            setReleaseDate(rowData)

            setReleaseCar(true)
            console.log('Location icon clicked!');
        };

        const handleLocationClick = () => {
            console.log("rowData", rowData)

            navigate('/parking', { state: { product: rowData } }); // מעבר לקומפוננטת Parking והעברת פרופס
            // goToOtherComponent()
            // parking()
            console.log('Parking icon clicked!');
        };

        return (
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {rowData.isParkingCar ? (
                    <>
                        <FaParking color="green" title="Car is parked" style={{ fontSize: '24px' }} onClick={handleParkingClick} />
                        <span style={{ marginLeft: '8px', fontSize: '16px' }}>הרכב חונה לשיחרור החניה לחץ כאן</span>
                    </>
                ) : (
                    <>
                        <FaMapMarkerAlt color="orange" title="Car is not parked" style={{ fontSize: '24px' }} onClick={handleLocationClick} />
                        <span style={{ marginLeft: '8px', fontSize: '16px' }}> הרכב אינו חונה למציאת החניה הקרובה ביותר לחץ כאן</span>
                    </>
                )}
            </button>
        );
    };
    // const getSeverity = (product) => {
    //     switch (product.inventoryStatus) {
    //         case 'INSTOCK':
    //             return 'success';

    //         case 'LOWSTOCK':
    //             return 'warning';

    //         case 'OUTOFSTOCK':
    //             return 'danger';

    //         default:
    //             return null;
    //     }
    // };
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
    const releaseCarDialoge = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideReleaseCarDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={release} />
        </React.Fragment>
    );
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
                    <Column field="numberCar" header="numberCar" sortable style={{ minWidth: '12rem' }}></Column>
                    {/* <Column field="Name" header="Name" sortable style={{ minWidth: '16rem' }}></Column> */}
                    {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
                    <Column field="sizeCar" header="sizeCar" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="category" header="IsHandicappedCar" body={HandicappedCar} sortable style={{ minWidth: '10rem' }}></Column>
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column field="isParkingCar" header="Parking" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        numberCar
                    </label>
                    <InputText id="name" value={product.numberCar} onChange={(e) => onInputChange(e, 'numberCar')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.numberCar })} />
                    {submitted && !product.numberCar && <small className="p-error">numberCar is required.</small>}
                </div>
                {/* <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div> */}
                <div className="field">
                    <label className="mb-3 font-bold">Size</label>
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

                    <div className="card flex justify-content-center">
                        <label htmlFor="isHandicappedCar" className="font-bold">
                            isHandicappedCar
                        </label>

                        <ToggleButton invalid onIcon="pi pi-check" offIcon="pi pi-times" checked={product.isHandicappedCar} onChange={(e) => setCheckedAnd(e.value)} className="w-8rem" />
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.numberCar}</b>?
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

            <Dialog visible={releaseCar} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={releaseCarDialoge} onHide={hideReleaseCarDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to release the selected car?</span>}
                </div>
            </Dialog>
        </div>

    );
}
