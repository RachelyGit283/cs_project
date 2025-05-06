
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
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
    console.log("params", params.size)
    try {
      const res = await axios.get(`http://localhost:8090/api/parkinglot/emptyNoHandicapped`, {
        params: params
      });
      if (res.status === 200) {
        console.log("parking", res.data)
        if (res.data==[])
          {alert("אין כרגע חניות פנויות")}
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
  //נותן מערך עם זמני הנסיעה הקצרים ביותר
  const shortTime = async (address) => {
    setIsLoading(true); // התחלת טעינה

    try {
        // כתובת מקומית של המחשב
        setAddress1("49 Dror, Rishon LeZion, Israel");

        // קבלת כל החניות
        await allParking();
        console.log("Total parking lots:", allPark.length);

        // איטרציה על כל החניות
        for (let index = 0; index < allPark.length; index++) {
            const element = allPark[index].locationParkinglot;
            const str = `${element.numberOfStreet} ${element.street}, ${element.city}, ${element.country}`;

            setAddress2(str);

            // חישוב זמן נסיעה
            const res = await calculateTravelTime(str, address1);
            console.log("Parking ID:", allPark[index]._id);

            // הוספת התוצאה למערך
            const newItem = { key: `${res}`, value: `${allPark[index]._id.toString()}` };
            setArrTimes((prevArr) => [...prevArr, newItem]); // שימוש ב-state הקודם
        }

        // מיון המערך
        sortArrayByKey(arrTimes);
        console.log("Sorted Times:", arrTimes);

        // פעולת המשך
        optionParking();
    } catch (error) {
        console.error("Error in shortTime:", error);
    } finally {
        setIsLoading(false); // סיום טעינה
    }
};
  const optionParking = () => {
    if (indexOption >= 0 && indexOption < arrTimes.length) {
      setTravelMinTime(arrTimes[indexOption].key)
      setTravelMinPark(arrTimes[indexOption].value)
      
      if (indexOption + 1 < arrTimes.length) {
        setbool(true);
        setIndexOption(indexOption + 1)
      }
      else
        setbool(false);
    }
  };
  // const shortTime = async (address) => {
  //   setIsLoading(true); 
  //   //זו הכתובת המקומית של המחשב 
  //   // debugger
  //   setAddress1("49 Dror, Rishon LeZion, Israel");
  //   //in setAllPark all the parkinglots that ok
  //   allParking();
  //   // let newArr = [];
  //   // let min = Number.MAX_SAFE_INTEGER;
  //   // let parkingShort;     
  //   console.log(allPark.length)
  //   for (let index = 0; index < allPark.length; index++) {
  //     const element = allPark[index].locationParkinglot;
  //     const str = `${element.numberOfStreet} ${element.street}, ${element.city}, ${element.country}`;
  //     setAddress2(str);
  //     // handleCalculate()
  //     let res = await calculateTravelTime(str, address1)
  //     console.log("allPark[index]",allPark[index]._id)

  //     const newItem = { key: `${res}`, value: `${allPark[index]._id.toString()}` };
  //     setArrTimes([...arrTimes, newItem]);
  //   };

  //   sortArrayByKey(arrTimes);
  //   console.log("arrTimes", arrTimes)
  //   optionParking();
 
  // }
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
         
        console.log("parking", res.data)
        setGoodP(res.data)

      }
    } catch (e) {
      return [];
    }
    try {
      const res = await axios.put(`http://localhost:8090/api/parking/${goodP[0]._id}`, { intresteCar: product._id });
      if (res.status === 200) {
        console.log("parking", res.data)
        alert(`car number:${product.numberCar} intersted in park:${travelMinPark}`)

      }
    } catch (e) {
      return [];
    }
  }

  const prevOption = () => {
    setIndexOption(indexOption - 1);
    optionParking();
  };
  //הפונקציה אינה מושלמת
  const chooseParking = async () => {
    hideInterestedDialog()
    const params = {
      Handicapped: product.isHandicappedCar,
      size: product.sizeCar
    }
    console.log("params",params,"travelMinPark",travelMinPark)
    try {
      const res = await axios.get(`http://localhost:8090/api/parkinglot/getParkingEmptyOnSize/${travelMinPark}`, {
        params: params
      });
      if (res.status === 200) {
        setIndexOption(0)
        console.log("parking", res.data)
        setGoodP(res.data)
      }
    } catch (e) {
      return [];
    }
    try {
      console.log(product._id)
      const res = await axios.put(`http://localhost:8090/api/parking/P/${goodP[0]._id}`, {carParking:product._id});
      if (res.status === 200) {
        console.log("parking", res.data)
        alert(`car number:${product.numberCar} parking in park:${travelMinPark._id}`)
        goToOtherComponent();

setbool(false)
      }
    } catch (e) {
      return [];
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
          console.log("address", address)
          throw new Error("כתובת לא נמצאה");
        }
        const { lat, lon } = response.data[0];
        return [parseFloat(lat), parseFloat(lon)];
      };
      //צריל להיות :
      //const coords1 = await getCoordinates(address1);
      //const coords2 = await getCoordinates(address2);
      const coords1 = await getCoordinates(a2);
      //  debugger
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
        {/* <button onClick={() => shortTime("Your Address Here")}>Run Short Time</button> */}
        {/* תוכן נוסף */}
    </div>
      {/* <h1>מחשבון זמן נסיעה</h1>
      <div>
        <label>
          כתובת 1:
          <input
            type="text"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            placeholder="הכנס כתובת ראשונה"
          />
        </label>
      </div>
      <div>
        <label>
          כתובת 2:
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            placeholder="הכנס כתובת שנייה"
          />
        </label>
      </div> */}
      {
        console.log(product)
      }
      <button onClick={() => shortTime(currentUrl)}> חניה אופציונלית </button>
      {bool ? <button onClick={() => optionParking()}>אופציה נוספת</button> : ""}
      {bool ? <button onClick={() => prevOption()}>חזרה לאופציה הקודמת </button> : ""}

      <Dialog visible={interested} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={interestedDialoge} onHide={hideInterestedDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>if you want to parking pass yes if you want to know if the parking catch pass interest</span>}
        </div>
      </Dialog>
      {travelMinTime !== null && (
        <p>זמן הנסיעה המשוער{travelMinPark} הוא {travelMinTime} דקות</p>
        

      )}
      <br />
      {travelMinTime !== null && (
        <button onClick={() => setInterested(true)}> בחירת חניון </button>
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
// const handleCalculate = async () => {
//   try {
//     setError(null);
//     setTravelTime(null);

//     // המרת הכתובות לקואורדינטות
//     const coords1 = await getCoordinatesFromAddress(address1);
//     const coords2 = await getCoordinatesFromAddress(address2);

//     // חישובs המרחק וזמן הנסיעה
//     const distanceMeters = getDistance(
//       { latitude: coords1.latitude, longitude: coords1.longitude },
//       { latitude: coords2.latitude, longitude: coords2.longitude }
//     );
//     const distanceKm = distanceMeters / 1000; // המרחק בקילומטרים
//     const time = distanceKm / averageSpeedKmh; // זמן הנסיעה בשעות

//     setTravelTime(time);
//   } catch (err) {
//     setError(err.message);
//   }
// };
// const getCoordinatesFromAddress = async (address) => {
//   const url = `https://geocode.xyz/${encodeURIComponent(address)}?json=1`;
//   try {
//     const response = await axios.get(url);
//     if (response.data.error) {
//       throw new Error('כתובת לא נמצאה.');
//     }
//     const { latt, longt } = response.data;
//     return { latitude: parseFloat(latt), longitude: parseFloat(longt) };
//   } catch (err) {
//     throw new Error('שגיאה באיתור קואורדינטות.');
//   }
// };
// const allParkingHandicapped = async () => {
//   try {
//     const res = await axios.get(`http://localhost:8090/api/parkinglot/emptySpace`);
//     if (res.status === 200) {
//       console.log("parking", res.data)
//       setAllPark(res.data)
//       return res.data;
//     }
//   } catch (e) {
//     return [];
//   }

// }

