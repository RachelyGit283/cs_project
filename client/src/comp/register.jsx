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
import { add } from "../Store/CarSlice"
import { useSelector,useDispatch } from "react-redux"
import { classNames } from 'primereact/utils';
import './FormData.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
export default function Register() {

// export const Register = () => {
    const [countries, setCountries] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const myUser = useSelector(x=>x.CarSlice)
    const dispatch = useDispatch() 
    const navigate = useNavigate();

    const defaultValues = {
        nameUser: '',
        emailUser: '',
        passwordUser: '',
        phoneUser: ' ',
        idUser: ' ',
        accept: false
    }

    const goToOtherComponent = () => {
        navigate("/login");
      };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    const onSubmit = async (data) => {
        
        try {
            const res = await axios.post(`http://localhost:8090/api/auth/register`, data)
            console.log(res.data.accessToken);

            // if (res.status === 409)
            //     alert(res.data)
        
            dispatch(add(res))
            setFormData(data);
            setShowMessage(true);
            reset();
            goToOtherComponent()
        }
        catch (error) {
            if (error.response) {
                alert(error.response.data);
                console.log("Server error:", error.response.data);
            } else {
                alert("An error occurred. Please try again later.");
                console.log("Error:", error.message);
            }
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
        return errors[name] && <small className="p-error">{errors[name].message}</small>
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
                        Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Register</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="nameUser" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="nameUser" className={classNames({ 'p-error': errors.name })}>Name*</label>
                            </span>
                            {getFormErrorMessage('nameUser')}
                        </div>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <Controller name="emailUser" control={control}
                                    rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="emailUser" className={classNames({ 'p-error': !!errors.emailUser })}>  Email*</label>
                            </span>
                            {getFormErrorMessage('emailUser')}
                        </div>
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
                                <i className="pi pi-phone" />
                                <Controller name="phoneUser" control={control}
                                    rules={{
                                        required: 'Phone number is required.',
                                        pattern: {
                                            value: /^\+?[0-9]{10,15}$/,
                                            message: 'Invalid phone number. It must be between 10 to 15 digits.'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="phoneUser" className={classNames({ 'p-error': !!errors.phoneUser })}>Phone</label>
                            </span>
                            {getFormErrorMessage('phoneUser')}
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
                        {/* <div className="field">
                            <span className="p-float-label">
                                <Controller name="date" control={control} render={({ field }) => (
                                    <Calendar id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                                )} />
                                <label htmlFor="date">Birthday</label>
                            </span>
                        </div> */}
                        {/* <div className="field">
                            <span className="p-float-label">
                                <Controller name="country" control={control} render={({ field }) => (
                                    <Dropdown id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} options={countries} optionLabel="name" />
                                )} />
                                <label htmlFor="country">Country</label>
                            </span>
                        </div> */}
                        <div className="field-checkbox">
                            <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>I agree to the terms and conditions*</label>
                        </div>

                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                    <br/>
                    <Button label="Login" onClick={goToOtherComponent}/>

                </div>
            </div>
        </div>
    );
}
