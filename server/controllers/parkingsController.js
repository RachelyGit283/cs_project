// const Owners = require("../models/Owners");
const Parkings = require("../models/Parkings");
const Users = require("../models/Users");
const Parkinglots = require("../models/Parkinglots");
const Cars = require("../models/Cars");
// const twilio = require('twilio');
const nodemailer = require('nodemailer');
require('dotenv').config();
// const accountSid = process.env.TWILIO_ACCOUNT_SID; // החלף ב-Account SID שלך
// const authToken =process.env.TWILIO_AUTH_TOKEN;   // החלף ב-Auth Token שלך
// const client = twilio(accountSid, authToken);

// async function makeCall(toPhoneNumber) {
//     try {
//         const call = await client.calls.create({
//             url: 'http://demo.twilio.com/docs/voice.xml', // URL לקובץ XML שמכיל את תוכן השיחה
//             to: toPhoneNumber, // מספר היעד (כולל קידומת המדינה, לדוגמה: +972 לישראל)
//             from: process.env.TWILIO_PHONE_NUMBER, // מספר Twilio שלך
//         });
//         console.log('Call SID:', call.sid);
//     } catch (error) {
//         console.error('Error making call:', error);
//     }
// }

const transporter = nodemailer.createTransport({
    service: 'Outlook365', // או 'hotmail' אם אתה משתמש בחשבון Hotmail
    auth: {
        user: '38215085283@mby.co.il', // כתובת המייל שלך
        pass: 'Student@264', // הסיסמה שלך
    }
});
function sendEmail(to, subject, text) {
    const mailOptions = {
        from: '38215085283@mby.co.il', // כתובת המייל שלך
        to: to, // כתובת המייל של הנמען
        subject: subject, // נושא המייל
        text: text, // תוכן המייל
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}
// creat1
function isValidString(str) {
    const regex = /^[A-Z][0-9]+$/;
    return regex.test(str);
}
const createNewParking = async (req, res) => {
    const { _id } = req.user
    const user = await Users.findById(_id, { passwordUser: 0 }).lean()
    if (!user) {
        return res.status(400).json({ message: 'No user' })
    }
    // console.log(user.rolesUser)
    if (user.rolesUser != "managerParkinglot") {
        return res.status(400).json({ message: 'No rolse' })
    }
    const { locationParking, isHandicappedParking, sizeParking, parkinglotOfParking, priceParking } = req.body
    if (!locationParking || !sizeParking || !parkinglotOfParking) {
        return res.status(400).json({ message: 'locationParking and sizeParking are required' })
    }

    try {
        if (!isValidString(locationParking)) {
            return res.status(400).json({ message: 'change locationParking' })

        }
        const parkings = await Parkings.create({ locationParking, isHandicappedParking, sizeParking, parkinglotOfParking, priceParking })
        if (parkings) {
            try {

                const parkinglots = await Parkinglots.findById(parkinglotOfParking);
                // console.log(parkinglots)

                if (!parkinglots) {
                    return res.status(400).json({ message: 'No Parkinglots' })
                }
                parkinglots.allParkinglot.push(parkings);

                parkinglots.save();

            } catch (error) {
                return res.status(500).json({ message: 'Error geting Parkinglots', error });
            }

            return res.status(201).json(Parkings)
        } else {
            return res.status(400).json({ message: 'Invalid parkings' })
        }
    } catch (error) {
        if (error.code === 11000) {
            console.error('Duplicate parking entry: ', error.message);
        }
        return res.status(500).json({ message: 'Error creating parking', error });
    }
}
//read
const getAllParkings = async (req, res) => {
    try {
        const parkings = await Parkings.find().lean()
        if (!parkings?.length) {
            return res.status(400).json({ message: 'No Parkings found' })
        }
        res.json(parkings)
    } catch (error) {
        return res.status(500).json({ message: 'Error geting parking', error });
    }
}


const getParkingById = async (req, res) => {
    const { _id } = req.params
    try {
        const parkings = await Parkings.findById(_id).lean()
        if (!parkings) {
            return res.status(400).json({ message: 'No Parkings' })
        }
        res.json(parkings)
    } catch (error) {
        return res.status(500).json({ message: 'Error geting parking', error });
    }
}
//כל החניות של בעל מסויים
const getParkingByUser = async (req, res) => {
    const { _id } = req.user
    try {
        const parkings = await Parkings.find().populate({
            path: 'carParking',
            match: {
                userCar: _id
            }
        }).lean()
        const filteredParkings = parkings.filter(parking => parking.carParking);

        if (filteredParkings.length === 0) {
            return res.status(404).json({ message: 'No parkings found for this user car' });
        }

        res.json(filteredParkings);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving parkings', error });
    }
}
const updateParkings = async (req, res) => {
    const { id } = req.params
    const { locationParking, isFullParking, isHandicappedParking, sizeParking, carParking, priceParking, timeFtartParking, timeStartParking, intresteCar, unintresteCar } = req.body
    if (!id) {
        return res.status(400).json({ message: 'field is required' })
    }
    try {
        const parkings = await Parkings.findById(id).exec()
        if (!parkings) {
            return res.status(400).json({ message: 'parkings not found' })
        }
        locationParking ? parkings.locationParking = locationParking : parkings.locationParking
        isFullParking ? parkings.isFullParking = isFullParking : parkings.isFullParking
        isHandicappedParking ? parkings.isHandicappedParking = isHandicappedParking : parkings.isHandicappedParking
        sizeParking ? parkings.sizeParking = sizeParking : parkings.sizeParking
        carParking ? parkings.carParking = carParking : parkings.carParking
        priceParking ? parkings.priceParking = priceParking : parkings.priceParking
        timeFtartParking ? parkings.timeFtartParking = timeFtartParking : parkings.timeFtartParking
        timeStartParking ? parkings.timeStartParking = timeStartParking : parkings.timeStartParking
        if (intresteCar) {
            parkings.intrestedParking.push(intresteCar);
        }
        //להסיר רכב מתעניין
        if (unintresteCar) {
            const index = parkings.intrestedParking.indexOf(parking);
            if (index !== -1) {
                parkings.intrestedParking.splice(index, 1);
            }
        }
        const updateParkings = await parkings.save()

        return res.status(201).json(parkings)
    } catch (error) {
        return res.status(500).json({ message: 'Error updating parking', error });
    }
}

// להפוך רכב לחונה
const updatePcar = async (req, res) => {
    try {
        const { format } = require("date-fns");
        const { id } = req.params;
        const { carParking } = req.body;

        if (!id || !carParking) {
            return res.status(400).json({ message: 'fields are required' });
        }

        const parkings = await Parkings.findById(id).exec();
        if (!parkings) {
            return res.status(400).json({ message: 'Parkings not found' });
        }
        if (parkings.isFullParking) {
            return res.status(400).json({ message: 'The Parkings is full' });
        }

        const car = await Cars.findById(carParking).exec();
        if (!car) {
            return res.status(400).json({ message: 'No car found' });
        }
        if (car.isParkingCar) {
            return res.status(400).json({ message: 'The car is parking' });
        }
        if (parkings.sizeParking != car.sizeCar) {
            return res.status(400).json({ message: 'The Parkings are not in the same size' });
        }
        if (parkings.isHandicappedParking != car.isHandicappedCar) {
            return res.status(400).json({ message: 'HandicappedParking' });
        }

        parkings.isFullParking = true;
        car.isParkingCar = true;
        parkings.carParking = carParking;
        parkings.timeStartParking = format(new Date(), "yyyy-MM-dd\tHH:mm:ss");

        const updatep = await parkings.save();
        await car.save();

        // const index = parkings.intrestedParking.indexOf(carParking);
        // if (index !== -1) {
        //     parkings.intrestedParking.splice(index, 1);
        // }


        // for (let index = 0; index < parkings.intrestedParking.length; index++) {
        //     const element = parkings.intrestedParking[index];
        //     try {
        //         console.log("element",element)
        //         const cars = await Cars.findById(element).populate("userCar").lean();
        //         if (!cars) {
        //             return res.status(400).json({ message: 'No Cars' })
        //         }
        //         sendEmail(cars.userCar.emailUser, "interested", `you interester in ${parkings.locationParking}`)
        //     } catch (error) {
        //         return res.status(500).json({ message: 'no send mail', error });
        //     }
        //     // if (index !== -1) {
        //     //     parkings.intrestedParking.splice(index, 1);
        //     // }
        // }
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (let index = 0; index < parkings.intrestedParking.length; index++) {
            const element = parkings.intrestedParking[index];
            try {
                console.log("element", element);
                const cars = await Cars.findById(element).populate("userCar").lean();
                if (!cars) {
                    return res.status(400).json({ message: 'No Cars' });
                }
        
                await sendEmail(cars.userCar.emailUser, "interested", `You are interested in ${parkings.locationParking}`);
                
                // עיכוב בין שליחות, לדוגמה: 1 שנייה
                await delay(1000);
            } catch (error) {
                console.error("Error sending email to:", element, error);
            }
        }


        parkings.intrestedParking = [];
        res.json(parkings);
    } catch (error) {
        console.error('Error updating parking:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
// להפוך רכב ללא לחונה
const updateUPcar = async (req, res) => {
    const { format } = require("date-fns")
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'field is required' })
    }
    try {
        const parkings = await Parkings.findById(id).exec()
        if (!parkings) {
            return res.status(400).json({ message: 'Parkings not found' })
        }
        const car = await Cars.findById(parkings.carParking).exec()
        if (!car) { return res.status(400).json({ message: 'No car found' }) }
        if (!parkings.isFullParking || !car.isParkingCar) { return res.status(400).json({ message: 'not parking' }) }
        parkings.isFullParking = false;
        car.isParkingCar = false;
        parkings.carParking = null;
        const dateNow = format(new Date(), "yyyy-MM-dd\tHH:mm:ss")
        const date1 = new Date(parkings.timeStartParking);
        const date2 = new Date(dateNow);

        // חישוב ההפרש בדקות
        const dateDiffDays = Math.abs((date2 - date1) / (1000 * 60)) * parkings.priceParking;
        // console.log("dateDiffDays", dateDiffDays)

        const updatep = await parkings.save()
        await car.save()
        const parkings2 = await Parkings.find().lean()
        // console.log("dateDiffDays", date1)
        // console.log("dateDiffDays", date2)


        if (!parkings2?.length) {
            return res.status(400).json({ message: 'No Parkings found' })
        }
        res.json({ parkings2, dateDiffDays })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating parking', error });
    }

}

const deleteParking = async (req, res) => {
    const { id } = req.params
    try {

        const parking = await Parkings.findById(id).exec()
        if (!parking) {
            return res.status(400).json({ message: 'parking not found' })
        }
        try {
            const parkinglots = await Parkinglots.findById(parking.parkinglotOfParking).lean()
            if (!parkinglots) {
                return res.status(400).json({ message: 'No Parkinglots' })
            }
            const index = parkinglots.allParkinglot.indexOf(parking);
            if (index !== -1) {
                parkinglots.allParkinglot.splice(index, 1);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error geting Parkinglots', error });
        }
        const result = await parking.deleteOne()
        const parking2 = await Parkings.find().lean()
        if (!parking2?.length) {
            return res.status(400).json({ message: 'No Parkings found' })
        }
        res.json(parking2)
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting parking', error });
    }
}

module.exports = {
    createNewParking,
    updatePcar,
    deleteParking,
    updateUPcar,
    updateParkings,
    getAllParkings,
    getParkingById,
    getParkingByUser
}