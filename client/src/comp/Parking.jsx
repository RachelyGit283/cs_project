
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { Card } from 'primereact/card';

import { useLocation } from 'react-router-dom';
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
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';
import { TiParking } from 'react-icons/ti';
import { IoMdCloseCircle } from 'react-icons/io';
import { ToggleButton } from 'primereact/togglebutton';
import { set } from 'react-hook-form';
import { FaParking, FaMapMarkerAlt } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { getDistance } from 'geolib';

const Parking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [address1, setAddress1] = useState('');
  const [indexOption, setIndexOption] = useState(0);
  const [address2, setAddress2] = useState('');
  const [allPark, setAllPark] = useState([]);
  const [arrTimes, setArrTimes] = useState([]);
  const [travelTime, setTravelTime] = useState(null);
  const [travelMinTime, setTravelMinTime] = useState(null);
  //the best parkinglot
  const [travelMinPark, setTravelMinPark] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  // the best park
  const [goodP, setGoodP] = useState([]);
  const [locationpl, setLocationpl] = useState({
    _id: "",
    nameParkinglot: "",
    locationParkinglot: {
      city: "",
      country: "",
      street: "",
      numberOfStreet: 0
    },
    sizeParkinglot: 0
  });

  const [error, setError] = useState(null);
  const [bool, setbool] = useState(false);
  const location = useLocation();
  const [interested, setInterested] = useState();
  const navigate = useNavigate();

  const { product } = location.state || {};
  const averageSpeedKmh = 50; // מהירות ממוצעת בקמ"ש
  const goToOtherComponent = () => {
    navigate("/AllCars");
  };
  useEffect(() => {
    // עדכון הכתובת הנוכחית
    setCurrentUrl(window.location.href);
  }, []);
  useEffect(() => {
    if (arrTimes.length > 0) {
      optionParking(); // קריאה לפונקציה רק לאחר ש-arrTimes עודכן
    }
  }, [arrTimes]); // מעקב אחרי שינויים ב-arrTimes
  const Loader = () => (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

  //all parkinglots that fit
  const allParking = async () => {
    const params = {
      Handicapped: product.isHandicappedCar,
      size: product.sizeCar
    }
    // console.log("params", params.size)
    try {
      const res = await axios.get(`http://localhost:8090/api/parkinglot/emptyNoHandicapped`, {
        params: params
      });
      if (res.status === 200) {
        //  console.log("parking", res.data)
        if (res.data.length===0) { return alert("אין כרגע חניות פנויות") }
        setAllPark(res.data)
        return res.data;
      }
    } catch (e) {
      return [];
    }

  }

  const sortArrayByKey = (array) => {
    return array.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });
  };
  const shortTime = async (address) => {
    setIsLoading(true); // התחלת טעינה
    try {
      // כתובת מקומית של המחשב
      setAddress1("49 Dror, Rishon LeZion, Israel");
  
      // קבלת כל החניות
      const parkingLots = await allParking(); // שמירת התוצאה במשתנה מקומי
      console.log("Total parking lots:", parkingLots.length);
  
      const times = []; // מערך זמני נסיעה
  
      // איטרציה על כל החניות
      for (let parkingLot of parkingLots) {
        const element = parkingLot.locationParkinglot;
        const str = `${element.numberOfStreet} ${element.street}, ${element.city}, ${element.country}`;
  
        const res = await calculateTravelTime(str, address);
        times.push({ key: `${res}`, value: `${parkingLot._id}` });
      }
  
      // מיון המערך ועדכון ה-state
      const sortedTimes = sortArrayByKey(times);
      setArrTimes(sortedTimes); // optionParking תופעל אוטומטית דרך useEffect
    } catch (error) {
      console.error("Error in shortTime:", error);
    } finally {
      setIsLoading(false); // סיום טעינה
    }
  };
  // const shortTime = async (address) => {
  //   setIsLoading(true); // התחלת טעינה
  //  debugger
  //   try {
  //     // כתובת מקומית של המחשב
  //     setAddress1("49 Dror, Rishon LeZion, Israel");
  
  //     // קבלת כל החניות
  //     const parkingLots = await allParking(); // שמירת התוצאה במשתנה מקומי
  //     console.log("Total parking lots:", parkingLots.length);
  
  //     const times = []; // מערך זמני נסיעה
  
  //     // איטרציה על כל החניות
  //     for (let parkingLot of parkingLots) {
  //       const element = parkingLot.locationParkinglot;
  //       const str = `${element.numberOfStreet} ${element.street}, ${element.city}, ${element.country}`;
  
  //       const res = await calculateTravelTime(str, address);
  //       // console.log("Parking ID:", parkingLot._id);
  
  //       // הוספת התוצאה למערך
  //       times.push({ key: `${res}`, value: `${parkingLot._id}` });
  //     }
  
  //     // מיון המערך ועדכון ה-state
  //     const sortedTimes = sortArrayByKey(times);
  //     setArrTimes(sortedTimes);
  //     // console.log("Sorted Times:", sortedTimes);
  
  //     // פעולת המשך
  //     optionParking();
  //   } catch (error) {
  //     console.error("Error in shortTime:", error);
  //   } finally {
  //     setIsLoading(false); // סיום טעינה
  //   }
  // };
  
  const optionParking = async () => {
    if (indexOption >= 0 && indexOption < arrTimes.length) {
      setTravelMinTime(arrTimes[indexOption].key)
      setTravelMinPark(arrTimes[indexOption].value)
      try {
        // console.log(arrTimes[indexOption].value)
        const res = await axios.get(`http://localhost:8090/api/parkinglot/${arrTimes[indexOption].value}`);
        if (res.status === 200) {
          setLocationpl(res.data)
          // console.log("parkinglot in option", res.data.locationParkinglot)
          // console.log("parkinglot in option", locationpl)

        }
      } catch (e) {
        return {};
      }
      if (indexOption + 1 < arrTimes.length) {
        setbool(true);
        setIndexOption(indexOption + 1)
      }
      // else
      //   setbool(false);
    }
  };
  
  const interestedParking = async () => {
    // debugger
    hideInterestedDialog()
    const params = {
      Handicapped: product.isHandicappedCar,
      size: product.sizeCar
    }
    try {
      const res = await axios.get(`http://localhost:8090/api/parkinglot/getParkingEmptyOnSize/${travelMinPark}`, {
        params: params
      });
      if (res.status === 200) {

        // console.log("parking", res.data)
        setGoodP(res.data)

      }
    } catch (e) {
      return [];
    }
    try {
      const res = await axios.put(`http://localhost:8090/api/parking/${goodP[0]._id}`, { intresteCar: product._id });
      // if (res.status === 200) {
      //   console.log("parking", res.data)

      // }
      alert(`car number:${product.numberCar} intersted in parkinglot:${locationpl.nameParkinglot} in park:${res.data.locationParking}`)

    } catch (e) {
      return [];
    }
  }

  const prevOption = () => {
    setIndexOption(indexOption - 1);
    optionParking();
  };

  const chooseParking = async () => {
    hideInterestedDialog(); // סגירת הדיאלוג
    setIsLoading(true); // הצגת טעינה
    const params = {
      Handicapped: product.isHandicappedCar,
      size: product.sizeCar
    };
  
    try {
      // קבלת החניה הטובה ביותר
      const res1 = await axios.get(`http://localhost:8090/api/parkinglot/getParkingEmptyOnSize/${travelMinPark}`, {
        params: params
      });
      if (res1.status === 200) {
        setGoodP(res1.data);
        console.log("parking", res1.data);
      }
  
      // עדכון החניה עם המידע של הרכב
      if (res1.data && res1.data.length > 0) {
        const res2 = await axios.put(`http://localhost:8090/api/parking/P/${res1.data[0]._id}`, { carParking: product._id });
        if (res2.status === 200) {
          // console.log("parking in ", res2.data.locationParking);
          alert(`car number:${product.numberCar} parking in parkinglot:${locationpl.nameParkinglot} parking in parking:${res2.data.locationParking}`);
          goToOtherComponent();
          setbool(false); // סיום התהליך
        }
      }
    } catch (e) {
      console.error("Error in chooseParking:", e);
    } finally {
      setIsLoading(false); // סיום טעינה
    }
  };
  const hideInterestedDialog = () => {
    setInterested(false);
  };
  const interestedDialoge = (
    <React.Fragment>
      <Button label="interested" icon="pi pi-times" outlined onClick={interestedParking} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={chooseParking} />
    </React.Fragment>
  );

  const calculateTravelTime = async (a1, a2) => {
    try {
      setError("");

      // המרות כתובות לקואורדינטות באמצעות Nominatim API
      const getCoordinates = async (address) => {
        
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
        if (response.data.length === 0) {
          // console.log("address", address)
          throw new Error("כתובת לא נמצאה");
        }
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      };
      //צריל להיות :
      //const coords1 = await getCoordinates(address1);
      //const coords2 = await getCoordinates(address2);
      
      const coords1 = await getCoordinates(a2);
        // debugger
      const coords2 = await getCoordinates(a1);

      // בקשה למסלול וזמן נסיעה באמצעות OSRM API
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coords1[1]},${coords1[0]};${coords2[1]},${coords2[0]}?overview=full&geometries=geojson`;
      const routeResponse = await axios.get(osrmUrl);

      const route = routeResponse.data.routes[0];

      // זמן נסיעה
      const durationInMinutes = Math.round(route.duration / 60);
      setTravelTime(durationInMinutes);

      // קואורדינטות המסלול
      const coordinates = route.geometry.coordinates.map((point) => [
        point[1],
        point[0],
      ]);
      setRouteCoords(coordinates);
      return durationInMinutes;
    } catch (err) {
      setError(err.message || "שגיאה בחישוב זמן הנסיעה");
    }
  };
  return (
    <div>
      <div>
        {isLoading && <Loader />} {/* הצגת אנימציה בזמן טעינה */}
       
      </div>
  
      {/* {
        console.log(product)
      } */}
     {!bool && ( <Button
        label="חניה אופציונלית"
        icon="pi pi-map-marker"
        className="p-button-raised p-button-rounded p-button-success"
        onClick={() => shortTime("49 Dror, Rishon LeZion, Israel")}
      />
)}

      {bool && (
        <Button
          label="אופציה נוספת"
          icon="pi pi-plus"
          className="p-button-raised p-button-rounded p-button-warning"
          onClick={() => optionParking()}
        />
      )}

      {bool && (
        <Button
          label="חזרה לאופציה הקודמת"
          icon="pi pi-arrow-left"
          className="p-button-raised p-button-rounded p-button-secondary"
          onClick={() => prevOption()}
        />
      )}

      <Dialog visible={interested} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={interestedDialoge} onHide={hideInterestedDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>if you want to parking pass yes if you want to know if the parking catch pass interest</span>}
        </div>
      </Dialog>
      {travelMinTime !== null && (
        <Card
          title="Parking Lot Details"
          subTitle={`Estimated Travel Time: ${travelMinTime}`}
          className="p-shadow-4"
        >
          <div>
            <p><strong>Parking Lot Name:</strong> {locationpl.nameParkinglot}</p>
            <p><strong>Location:</strong></p>
            <ul>
              <li><strong>City:</strong> {locationpl.locationParkinglot.city}</li>
              <li><strong>Country:</strong> {locationpl.locationParkinglot.country}</li>
              <li><strong>Street:</strong> {locationpl.locationParkinglot.street}</li>
              <li><strong>Street Number:</strong> {locationpl.locationParkinglot.numberOfStreet}</li>
            </ul>
          </div>
        </Card>
      )}
      <br />
      {travelMinTime !== null && (
        <Button
          label="בחירת חניון"
          icon="pi pi-check"
          className="p-button-raised p-button-rounded p-button-primary"
          onClick={() => setInterested(true)}
        />
      )}
      {error && <p style={{ color: 'red' }}>שגיאה: {error}</p>}
      <MapContainer
        style={{ height: "500px", width: "100%" }}
        center={[31.7683, 35.2137]} // ברירת מחדל: ירושלים
        zoom={13}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {routeCoords.length > 0 && (
          <>
            <Marker position={routeCoords[0]} />
            <Marker position={routeCoords[routeCoords.length - 1]} />
            <Polyline positions={routeCoords} color="blue" />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Parking;


