// import React, { useEffect, useState, useRef } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
// import { Password } from 'primereact/password';
// import { Checkbox } from 'primereact/checkbox';
// import { Dialog } from 'primereact/dialog';
// import { Divider } from 'primereact/divider';
// import { classNames } from 'primereact/utils';
// import { setToken } from "../Store/tokenSlice";
// import { setRolse } from "../Store/rolseSlice";

// import { AllCars } from "./AllCars";
// import { useDispatch ,useSelector} from "react-redux";
// import './FormData.css';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
// import Menu from './Navbar';

// export const Login = () => {
//     const [countries, setCountries] = useState([]);
//     const [showMessage, setShowMessage] = useState(false);
//     const [formData, setFormData] = useState({});
//     const dispatch=useDispatch()
//     const token = useSelector((state) => state.token.token);
//     const rolse = useSelector((state) => state.rolse.rolse);

//     const navigate = useNavigate();
//     const goToOtherComponent = () => {
//         navigate("/AllCars");
//       };
//       const goToRegisterComponent = () => {
//         navigate("/Register");
//       };
//     const defaultValues = {
       
//         passwordUser: '',
//         idUser: ' '
  
     
//     }
//     const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
//     const onSubmit = async (data) => {
//         console.log(data);
//         try {
//             const res = await axios.post(`http://localhost:8090/api/auth/login`, data)
//             console.log(res.data.accessToken);
//           if (res.status != "200"){
//             alert(res.data)
//           }
//           dispatch(setToken(res.data.accessToken))
//           dispatch(setRolse(res.data.rolesUser))

//             setFormData(data);
//             setShowMessage(true);
            
//             reset();
//             goToOtherComponent()
//         }
//         catch (a) {
//             console.log("server error", a);
//         }
//     };
//     const isValidIsraeliID = (id) => {
//         if (!/^\d{9}$/.test(id)) return false;

//         let sum = 0;
//         for (let i = 0; i < id.length; i++) {
//             let digit = parseInt(id[i]);
//             if (i % 2 === 0) {
//                 sum += digit;
//             } else {
//                 let double = digit * 2;
//                 sum += double > 9 ? double - 9 : double;
//             }
//         }

//         return sum % 10 === 0;
//     };
//     const getFormErrorMessage = (name) => {
//         return errors[name] && <small className="p-error">{errors[name].message}</small>
//     };

//     const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
//     const passwordHeader = <h6>Pick a password</h6>;
//     const passwordFooter = (
//         <React.Fragment>
//             <Divider />
//             <p className="mt-2">Suggestions</p>
//             <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
//                 <li>At least one lowercase</li>
//                 <li>At least one uppercase</li>
//                 <li>At least one numeric</li>
//                 <li>Minimum 8 characters</li>
//             </ul>
//         </React.Fragment>
//     );

//     return (
//         <div className="form-demo">
//             <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
//                 <div className="flex justify-content-center flex-column pt-6 px-3">
//                     <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
//                     <h5>Registration Successful!</h5>
//                     <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
//                         Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
//                     </p>
//                 </div>
//             </Dialog>

//             <div className="flex justify-content-center">
//                 <div className="card">
//                     <h5 className="text-center">Register</h5>
//                     <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                 
//                         <div className="field">
//                             <span className="p-float-label">
//                                 <Controller name="passwordUser" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
//                                     <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
//                                 )} />
//                                 <label htmlFor="passwordUser" className={classNames({ 'p-error': errors.passwordUser })}>Password*</label>
//                             </span>
//                             {getFormErrorMessage('passwordUser')}
//                         </div>
       
//                         <div className="field">
//                             <span className="p-float-label p-input-icon-right">
//                                 <i className="pi pi-key" />
//                                 <Controller name="idUser" control={control}
//                                     rules={{
//                                         required: 'ID is required.',
//                                         validate: {
//                                             validID: (value) => isValidIsraeliID(value) || 'Invalid ID number.'
//                                         }
//                                     }}
//                                     render={({ field, fieldState }) => (
//                                         <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
//                                     )} />
//                                 <label htmlFor="idUser" className={classNames({ 'p-error': !!errors.idUser })}>Id*</label>
//                             </span>
//                             {getFormErrorMessage('idUser')} 

//                         </div>
                      

//                         <Button type="submit" label="Submit" className="mt-2"  />


//                     </form>
//                     <br/>
//                     <Button label="Register" onClick={goToRegisterComponent}/>

//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { setToken } from "../Store/tokenSlice";
import { setRolse } from "../Store/rolseSlice";

import { AllCars } from "./AllCars";
import { useDispatch, useSelector } from "react-redux";
import './FormData.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Menu from './Navbar';
import { setUser } from '../Store/UserSlice';

export default function Login() {
    const [countries, setCountries] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token.token);
    const rolse = useSelector((state) => state.rolse.rolse);
    const user = useSelector((state) => state.user.user);

    const navigate = useNavigate();
    const goToOtherComponent = () => {
        navigate("/AllCars");
    };
    
    const goToRegisterComponent = () => {
        navigate("/Register");
    };
    const defaultValues = {
        passwordUser: '',
        idUser: ' '
    };
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const res = await axios.post(`http://localhost:8090/api/auth/login`, data);
            console.log(res.data.accessToken);
            if (res.status != "200") {
                alert(res.data);
            }
            dispatch(setToken(res.data.accessToken));
            dispatch(setRolse(res.data.rolesUser));
            dispatch(setUser(res.data.foundUser));

            console.log(res.data.rolesUser)
            console.log(token)
            setFormData(data);
            setShowMessage(true);

            reset();
            goToOtherComponent();
        }
        catch (a) {
            console.log("server error", a);
        }
    };
    const isValidIsraeliID = (id) => {
        if (!/^\d{9}$/.test(id)) return false;

        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            let digit = parseInt(id[i]);
            if (i % 2 === 0) {
                sum += digit;
            } else {
                let double = digit * 2;
                sum += double > 9 ? double - 9 : double;
            }
        }

        return sum % 10 === 0;
    };
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under name <b>{formData.name}</b>; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Register</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="passwordUser" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                )} />
                                <label htmlFor="passwordUser" className={classNames({ 'p-error': errors.passwordUser })}>Password*</label>
                            </span>
                            {getFormErrorMessage('passwordUser')}
                        </div>

                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-key" />
                                <Controller name="idUser" control={control}
                                    rules={{
                                        required: 'ID is required.',
                                        validate: {
                                            validID: (value) => isValidIsraeliID(value) || 'Invalid ID number.'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="idUser" className={classNames({ 'p-error': !!errors.idUser })}>Id*</label>
                            </span>
                            {getFormErrorMessage('idUser')}

                        </div>

                        <Button type="submit" label="Submit" className="mt-2" />


                    </form>
                    <br />
                    <Button label="Register" onClick={goToRegisterComponent} />

                </div>
            </div>
        </div>
    );
}