const debug = require("debug")("enforce-database:test")
const DataBase = require("../database")

debug(`Creating database...`)
const db = DataBase()

db.startMission()

setInterval(() => {
	db.insert({position: { latitude: 3, longitude: 32, altitude:64 }})
}, 10000)

setInterval(() => {
	db.insert({pressure: 1000})
}, 8000)

setInterval(() => {
	db.insert({temperature: 45})
}, 5000)
