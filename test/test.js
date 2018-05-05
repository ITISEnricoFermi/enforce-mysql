const debug = require("debug")("enforce-database:test")
const DataBase = require("../database")

debug(`Creating database...`)
const db = new DataBase()

db.startMission()

setInterval(() => {
	db.save({position: { latitude: 3, longitude: 32, altitude:64 }})
}, 10000)

setInterval(() => {
	db.save({pressure: 1000})
}, 8000)

setInterval(() => {
	db.save({temperature: 45})
}, 5000)
