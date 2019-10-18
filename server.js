const express = require('express')

const server = express()
server.use(express.json())

const database = {
    doctors: [
        {
            id: "1",
            firstName: "Billy",
            lastName: "Hibbert",
            appointments: [
                {
                    id: "1",
                    firstName: "Bob",
                    lastName: "Belcher",
                    date: new Date(2019, 9, 18, 12, 30),
                    kind: "New Patient"
                },
                {
                    id: "2",
                    firstName: "Scott",
                    lastName: "Mescudi",
                    date: new Date(2019, 9, 22, 8, 45),
                    kind: "New Patient"
                } 
            ]
        },
        {
            id: "2",
            firstName: "Jimothy",
            lastName: "Hodgins",
            appointments: [
                {
                    id: "1",
                    firstName: "Ray",
                    lastName: "Charles",
                    date: new Date(2019, 10, 10, 9, 15),
                    kind: "Follow-up"
                },
                {
                    id: "2",
                    firstName: "Kate",
                    lastName: "Violet",
                    date: new Date(2019, 10, 10, 9, 45),
                    kind: "New Patient"
                } 
            ]
        }
    ]
}

//GET - Root endpoint
server.get("/", (req, res) => {
    res.status(200).json("Server is running!")
})

//GET - Get a list of doctors
server.get("/doctors", (req, res) => {
    res.status(200).json(database.doctors)
})

//GET - Get a specific doctor's appointments
server.get("/doctors/:id/appointments", (req, res) => {
    const { id } = req.params
    let filteredDoctor = database.doctors.find(doctor => doctor.id === id)
    if(filteredDoctor) {
        res.status(200).json(filteredDoctor.appointments)
    } else {
        res.status(404).json("No such doctor with given ID")
    }
})

//DELETE - Delete an existing appointment
server.delete("/doctors/:doctorID/appointments/:appointmentID", (req, res) => {
    const { doctorID, appointmentID } = req.params
    let filteredDoctor = database.doctors.find(doctor => doctor.id === doctorID)
    let filteredAppointments = filteredDoctor.appointments.filter(appointment => appointment.id !== appointmentID)
    if(filteredDoctor) {
        filteredDoctor.appointments = filteredAppointments
        res.status(200).json(filteredDoctor.appointments)
    } else {
        res.status(404).json("No such appointment for given doctor")
    }
})

//POST - Add an appointment to a doctor's calendar
server.post("/doctors/:id/appointments", (req, res) => {
    const { id } = req.params
    const appointment = req.body;
    let filteredDoctor = database.doctors.find(doctor => doctor.id === id)
    //check the minutes property of the incoming Date object here and see if it is === 0, 15, 30, or 45 
    //OR if minutes % 15 === 0, if it is, allow the POST to succeed
    if(appointment.id && appointment.firstName && appointment.lastName && appointment.date && appointment.kind) {
        filteredDoctor.appointments.push(appointment)
        res.status(200).json("Successfully added new appointment")
    } else {
        res.status(400).json("Error adding user")
    }
})


server.listen(5000, () => {
    console.log("Server is listening on port 5000")
})