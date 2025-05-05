// import React, { useState } from "react";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import axios from "axios";

// const TravelCalculator = () => {
//   const [address1, setAddress1] = useState("");
//   const [address2, setAddress2] = useState("");
//   const [travelTime, setTravelTime] = useState("");
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [error, setError] = useState("");

//   const calculateTravelTime = async () => {
//     try {
//       setError("");

//       // המרות כתובות לקואורדינטות באמצעות Nominatim API
//       const getCoordinates = async (address) => {
//         const response = await axios.get(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             address
//           )}`
//         );
//         if (response.data.length === 0) {
//           throw new Error("כתובת לא נמצאה");
//         }
//         const { lat, lon } = response.data[0];
//         return [parseFloat(lat), parseFloat(lon)];
//       };

//       const coords1 = await getCoordinates(address1);
//       const coords2 = await getCoordinates(address2);

//       // בקשה למסלול וזמן נסיעה באמצעות OSRM API
//       const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords1[1]},${coords1[0]};${coords2[1]},${coords2[0]}?overview=full&geometries=geojson`;
//       const routeResponse = await axios.get(osrmUrl);

//       const route = routeResponse.data.routes[0];

//       // זמן נסיעה
//       const durationInMinutes = Math.round(route.duration / 60);
//       setTravelTime(`${durationInMinutes} דקות`);

//       // קואורדינטות המסלול
//       const coordinates = route.geometry.coordinates.map((point) => [
//         point[1],
//         point[0],
//       ]);
//       setRouteCoords(coordinates);
//     } catch (err) {
//       setError(err.message || "שגיאה בחישוב זמן הנסיעה");
//     }
//   };

//   return (
//     <div>
//       <h1>מחשבון זמן נסיעה</h1>
//       <div>
//         <label>
//           כתובת 1:
//           <input
//             type="text"
//             value={address1}
//             onChange={(e) => setAddress1(e.target.value)}
//             placeholder="הכנס כתובת ראשונה"
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           כתובת 2:
//           <input
//             type="text"
//             value={address2}
//             onChange={(e) => setAddress2(e.target.value)}
//             placeholder="הכנס כתובת שנייה"
//           />
//         </label>
//       </div>
//       <button onClick={calculateTravelTime}>חשב זמן נסיעה</button>
//       {travelTime && <p>זמן הנסיעה הוא: {travelTime}</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <MapContainer
//         style={{ height: "500px", width: "100%" }}
//         center={[31.7683, 35.2137]} // ברירת מחדל: ירושלים
//         zoom={13}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         {routeCoords.length > 0 && (
//           <>
//             <Marker position={routeCoords[0]} />
//             <Marker position={routeCoords[routeCoords.length - 1]} />
//             <Polyline positions={routeCoords} color="blue" />
//           </>
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default TravelCalculator;
//allCars
// import React, { useState, useEffect, useRef } from 'react';
// import { classNames } from 'primereact/utils';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Car } from './Car';
// import { Toast } from 'primereact/toast';
// import { Button } from 'primereact/button';
// import { FileUpload } from 'primereact/fileupload';
// import { Rating } from 'primereact/rating';
// import { Toolbar } from 'primereact/toolbar';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { IconField } from 'primereact/iconfield';
// import { InputIcon } from 'primereact/inputicon';
// import { RadioButton } from 'primereact/radiobutton';
// import { InputNumber } from 'primereact/inputnumber';
// import { Dialog } from 'primereact/dialog';
// import { InputText } from 'primereact/inputtext';
// import { Tag } from 'primereact/tag';

// export default function AllCars() {
//     let emptyProduct = {
//         id: null,
//         name: '',
//         image: null,
//         description: '',
//         category: null,
//         price: 0,
//         quantity: 0,
//         rating: 0,
//         inventoryStatus: 'INSTOCK'
//     };

//     const [products, setProducts] = useState(null);
//     const [productDialog, setProductDialog] = useState(false);
//     const [deleteProductDialog, setDeleteProductDialog] = useState(false);
//     const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
//     const [product, setProduct] = useState(emptyProduct);
//     const [selectedProducts, setSelectedProducts] = useState(null);
//     const [submitted, setSubmitted] = useState(false);
//     const [globalFilter, setGlobalFilter] = useState(null);
//     const toast = useRef(null);
//     const dt = useRef(null);

//     useEffect(() => {
//         Car.getProducts().then((data) => setProducts(data));
//     }, []);

//     const formatCurrency = (value) => {
//         return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//     };

//     const openNew = () => {
//         setProduct(emptyProduct);
//         setSubmitted(false);
//         setProductDialog(true);
//     };

//     const hideDialog = () => {
//         setSubmitted(false);
//         setProductDialog(false);
//     };

//     const hideDeleteProductDialog = () => {
//         setDeleteProductDialog(false);
//     };

//     const hideDeleteProductsDialog = () => {
//         setDeleteProductsDialog(false);
//     };

//     const saveProduct = () => {
//         setSubmitted(true);

//         if (product.name.trim()) {
//             let _products = [...products];
//             let _product = { ...product };

//             if (product.id) {
//                 const index = findIndexById(product.id);

//                 _products[index] = _product;
//                 toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
//             } else {
//                 _product.id = createId();
//                 _product.image = 'product-placeholder.svg';
//                 _products.push(_product);
//                 toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
//             }

//             setProducts(_products);
//             setProductDialog(false);
//             setProduct(emptyProduct);
//         }
//     };

//     const editProduct = (product) => {
//         setProduct({ ...product });
//         setProductDialog(true);
//     };

//     const confirmDeleteProduct = (product) => {
//         setProduct(product);
//         setDeleteProductDialog(true);
//     };

//     const deleteProduct = () => {
//         let _products = products.filter((val) => val.id !== product.id);

//         setProducts(_products);
//         setDeleteProductDialog(false);
//         setProduct(emptyProduct);
//         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
//     };

//     const findIndexById = (id) => {
//         let index = -1;

//         for (let i = 0; i < products.length; i++) {
//             if (products[i].id === id) {
//                 index = i;
//                 break;
//             }
//         }

//         return index;
//     };

//     const createId = () => {
//         let id = '';
//         let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//         for (let i = 0; i < 5; i++) {
//             id += chars.charAt(Math.floor(Math.random() * chars.length));
//         }

//         return id;
//     };

//     const exportCSV = () => {
//         dt.current.exportCSV();
//     };

//     const confirmDeleteSelected = () => {
//         setDeleteProductsDialog(true);
//     };

//     const deleteSelectedProducts = () => {
//         let _products = products.filter((val) => !selectedProducts.includes(val));

//         setProducts(_products);
//         setDeleteProductsDialog(false);
//         setSelectedProducts(null);
//         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
//     };

//     const onCategoryChange = (e) => {
//         let _product = { ...product };

//         _product['category'] = e.value;
//         setProduct(_product);
//     };

//     const onInputChange = (e, name) => {
//         const val = (e.target && e.target.value) || '';
//         let _product = { ...product };

//         _product[`${name}`] = val;

//         setProduct(_product);
//     };

//     const onInputNumberChange = (e, name) => {
//         const val = e.value || 0;
//         let _product = { ...product };

//         _product[`${name}`] = val;

//         setProduct(_product);
//     };

//     const leftToolbarTemplate = () => {
//         return (
//             <div className="flex flex-wrap gap-2">
//                 <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
//                 <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
//             </div>
//         );
//     };

//     const rightToolbarTemplate = () => {
//         return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
//     };

//     const imageBodyTemplate = (rowData) => {
//         return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
//     };

//     const priceBodyTemplate = (rowData) => {
//         return formatCurrency(rowData.price);
//     };

//     const ratingBodyTemplate = (rowData) => {
//         return <Rating value={rowData.rating} readOnly cancel={false} />;
//     };

//     const statusBodyTemplate = (rowData) => {
//         return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
//     };

//     const actionBodyTemplate = (rowData) => {
//         return (
//             <React.Fragment>
//                 <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
//                 <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
//             </React.Fragment>
//         );
//     };

//     const getSeverity = (product) => {
//         switch (product.inventoryStatus) {
//             case 'INSTOCK':
//                 return 'success';

//             case 'LOWSTOCK':
//                 return 'warning';

//             case 'OUTOFSTOCK':
//                 return 'danger';

//             default:
//                 return null;
//         }
//     };

//     const header = (
//         <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
//             <h4 className="m-0">Manage Products</h4>
//             <IconField iconPosition="left">
//                 <InputIcon className="pi pi-search" />
//                 <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
//             </IconField>
//         </div>
//     );
//     const productDialogFooter = (
//         <React.Fragment>
//             <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
//             <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
//         </React.Fragment>
//     );
//     const deleteProductDialogFooter = (
//         <React.Fragment>
//             <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
//             <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
//         </React.Fragment>
//     );
//     const deleteProductsDialogFooter = (
//         <React.Fragment>
//             <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
//             <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
//         </React.Fragment>
//     );

//     return (
//         <div>
//             <Toast ref={toast} />
//             <div className="card">
//                 <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

//                 <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
//                         dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
//                         paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//                         currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
//                     <Column selectionMode="multiple" exportable={false}></Column>
//                     <Column field="code" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
//                     <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
//                     <Column field="image" header="Image" body={imageBodyTemplate}></Column>
//                     <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
//                     <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
//                     <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
//                     <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
//                     <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
//                 </DataTable>
//             </div>

//             <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
//                 {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
//                 <div className="field">
//                     <label htmlFor="name" className="font-bold">
//                         Name
//                     </label>
//                     <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
//                     {submitted && !product.name && <small className="p-error">Name is required.</small>}
//                 </div>
//                 <div className="field">
//                     <label htmlFor="description" className="font-bold">
//                         Description
//                     </label>
//                     <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
//                 </div>

//                 <div className="field">
//                     <label className="mb-3 font-bold">Category</label>
//                     <div className="formgrid grid">
//                         <div className="field-radiobutton col-6">
//                             <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
//                             <label htmlFor="category1">Accessories</label>
//                         </div>
//                         <div className="field-radiobutton col-6">
//                             <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
//                             <label htmlFor="category2">Clothing</label>
//                         </div>
//                         <div className="field-radiobutton col-6">
//                             <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
//                             <label htmlFor="category3">Electronics</label>
//                         </div>
//                         <div className="field-radiobutton col-6">
//                             <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
//                             <label htmlFor="category4">Fitness</label>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="formgrid grid">
//                     <div className="field col">
//                         <label htmlFor="price" className="font-bold">
//                             Price
//                         </label>
//                         <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
//                     </div>
//                     <div className="field col">
//                         <label htmlFor="quantity" className="font-bold">
//                             Quantity
//                         </label>
//                         <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
//                     </div>
//                 </div>
//             </Dialog>

//             <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
//                 <div className="confirmation-content">
//                     <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
//                     {product && (
//                         <span>
//                             Are you sure you want to delete <b>{product.name}</b>?
//                         </span>
//                     )}
//                 </div>
//             </Dialog>

//             <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
//                 <div className="confirmation-content">
//                     <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
//                     {product && <span>Are you sure you want to delete the selected products?</span>}
//                 </div>
//             </Dialog>
//         </div>
//     );
// }
//parking
// import React, { useState } from 'react';
// import { getDistance } from 'geolib';
// import axios from 'axios';

// const Parking = () => {
//   // const [address1, setAddress1] = useState("");
//   // const [address2, setAddress2] = useState("");
//   const [travelTime, setTravelTime] = useState(null);
//   const averageSpeedKmh = 50; // מהירות ממוצעת בקמ"ש
//   const allParking = async () => {
//     try {
//         const res = await axios.get(`http://localhost:8090/api/parkinglot`);
//         if (res.status === 200) {
//             console.log("parking", res.data)
//             return res.data;
//         }
//     } catch (e) {
//         return [];
//     }

// }

// const shortTime = (arrParkings) => {
//   for (let index = 0; index < arrParkings.length; index++) {
//     const element = arrParkings[index].locationParkinglot;

//   }
// };

//   const calculateTravelTime = (coords1, coords2) => {
//     // חישוב המרחק במטרים
//     const distanceMeters = getDistance(
//       { latitude: coords1[0], longitude: coords1[1] },
//       { latitude: coords2[0], longitude: coords2[1] }
//     );
//     // המרת המרחק לקילומטרים
//     const distanceKm = distanceMeters / 1000;
//     // חישוב זמן נסיעה בשעות
//     return distanceKm / averageSpeedKmh;
//   };
//   const handleCalculate = () => {
//     // דוגמה לקואורדינטות - יש להחליף בערכים אמיתיים
//     const address1Coords = [32.0853, 34.7818]; // קואורדינטות של תל אביב
//     const address2Coords = [31.7683, 35.2137]; // קואורדינטות של ירושלים

//     const time = calculateTravelTime(address1Coords, address2Coords);
//     setTravelTime(time);
//   };

//   return (
//     <div>
//       {/* <h1>מחשבון זמן נסיעה</h1>
//       <div>
//         <label>
//           כתובת 1:
//           <input
//             type="text"
//             value={address1}
//             onChange={(e) => setAddress1(e.target.value)}
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           כתובת 2:
//           <input
//             type="text"
//             value={address2}
//             onChange={(e) => setAddress2(e.target.value)}
//           />
//         </label>
//       </div> */}
//       <button onClick={handleCalculate}>חשב זמן נסיעה</button>
//       {travelTime !== null && (
//         <p>זמן הנסיעה המשוער הוא {travelTime.toFixed(2)} שעות</p>
//       )}
//     </div>
//   );
// };

// export default Parking;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { getDistance } from 'geolib';

// const Parking = () => {
//   const [address1, setAddress1] = useState('');
//   const [address2, setAddress2] = useState('');
//   const [travelTime, setTravelTime] = useState(null);
//   const [error, setError] = useState(null);
//   const averageSpeedKmh = 50; // מהירות ממוצעת בקמ"ש

//   const getCoordinatesFromAddress = async (address) => {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//     try {
//       const response = await axios.get(url);
//       if (response.data.length === 0) {
//         throw new Error('כתובת לא נמצאה.');
//       }
//       const { lat, lon } = response.data[0];
//       return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
//     } catch (err) {
//       throw new Error('שגיאה באיתור קואורדינטות.');
//     }
//   };

//   const handleCalculate = async () => {
//     try {
//       setError(null);
//       setTravelTime(null);

//       // המרת הכתובות לקואורדינטות
//       const coords1 = await getCoordinatesFromAddress(address1);
//       const coords2 = await getCoordinatesFromAddress(address2);

//       // חישוב המרחק וזמן הנסיעה
//       const distanceMeters = getDistance(
//         { latitude: coords1.latitude, longitude: coords1.longitude },
//         { latitude: coords2.latitude, longitude: coords2.longitude }
//       );
//       const distanceKm = distanceMeters / 1000; // המרחק בקילומטרים
//       const time = distanceKm / averageSpeedKmh; // זמן הנסיעה בשעות

//       setTravelTime(time);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>מחשבון זמן נסיעה</h1>
//       <div>
//         <label>
//           כתובת 1:
//           <input
//             type="text"
//             value={address1}
//             onChange={(e) => setAddress1(e.target.value)}
//             placeholder="הכנס כתובת ראשונה"
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           כתובת 2:
//           <input
//             type="text"
//             value={address2}
//             onChange={(e) => setAddress2(e.target.value)}
//             placeholder="הכנס כתובת שנייה"
//           />
//         </label>
//       </div>
//       <button onClick={handleCalculate}>חשב זמן נסיעה</button>
//       {travelTime !== null && (
//         <p>זמן הנסיעה המשוער הוא {travelTime.toFixed(2)} שעות</p>
//       )}
//       {error && <p style={{ color: 'red' }}>שגיאה: {error}</p>}
//     </div>
//   );
// };

// export default Parking;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { getDistance } from 'geolib';

// const Parking = () => {
//   const [address1, setAddress1] = useState('');
//   const [address2, setAddress2] = useState('');
//   const [travelTime, setTravelTime] = useState(null);
//   const [error, setError] = useState(null);
//   const averageSpeedKmh = 50; // מהירות ממוצעת בקמ"ש

//   const getCoordinatesFromAddress = async (address) => {
//     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//     try {
//       const response = await axios.get(url);
//       if (response.data.length === 0) {
//         throw new Error('כתובת לא נמצאה.');
//       }
//       const { lat, lon } = response.data[0];
//       return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
//     } catch (err) {
//       throw new Error('שגיאה באיתור קואורדינטות.');
//     }
//   };

//   const handleCalculate = async () => {
//     try {
//       setError(null);
//       setTravelTime(null);

//       // המרת הכתובות לקואורדינטות
//       const coords1 = await getCoordinatesFromAddress(address1);
//       const coords2 = await getCoordinatesFromAddress(address2);

//       // חישוב המרחק וזמן הנסיעה
//       const distanceMeters = getDistance(
//         { latitude: coords1.latitude, longitude: coords1.longitude },
//         { latitude: coords2.latitude, longitude: coords2.longitude }
//       );
//       const distanceKm = distanceMeters / 1000; // המרחק בקילומטרים
//       const time = distanceKm / averageSpeedKmh; // זמן הנסיעה בשעות

//       setTravelTime(time);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div>
//       <h1>מחשבון זמן נסיעה</h1>
//       <div>
//         <label>
//           כתובת 1:
//           <input
//             type="text"
//             value={address1}
//             onChange={(e) => setAddress1(e.target.value)}
//             placeholder="הכנס כתובת ראשונה"
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           כתובת 2:
//           <input
//             type="text"
//             value={address2}
//             onChange={(e) => setAddress2(e.target.value)}
//             placeholder="הכנס כתובת שנייה"
//           />
//         </label>
//       </div>
//       <button onClick={handleCalculate}>חשב זמן נסיעה</button>
//       {travelTime !== null && (
//         <p>זמן הנסיעה המשוער הוא {travelTime.toFixed(2)} שעות</p>
//       )}
//       {error && <p style={{ color: 'red' }}>שגיאה: {error}</p>}
//     </div>
//   );
// };

// export default Parking;