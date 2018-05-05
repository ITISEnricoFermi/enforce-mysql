const debug = require("debug")("enforce-database:test")
const DataBase = require("../database")

debug(`Creating database...`)
const db = new DataBase()

db.startMission(new Date().getTime().toString())

setInterval(() => {
	db.save({position: { latitude: 3, longitude: 32, altitude:64 }})
}, 10000)

setInterval(() => {
	db.save({pressure: 1000})
}, 8000)

setInterval(() => {
	db.save({temperature: {temperature: 45, missionID: "abcdhello"}})
}, 5000)
