const debug = require("debug")("enforce-database:test")
const DataBase = require("../database")

debug(`Creating database...`)
const db = new DataBase({
	"active": false,
	"loopInterval": 10,
	"bufferLimit": 80000,
	"host": "localhost",
	"user": "root",
	"password": "illuminati",
	"database": "enforce-db"
})

db.startMission("abcdhello")

setInterval(() => {
	db.save({position: { latitude: 3, longitude: 32, altitude:64 }, missionID: "abcdhello"})
}, 1000)

// setInterval(() => {
// 	db.save({pressure: 1000})
// }, 8000)

// setInterval(() => {
// 	db.save({temperature: 45, missionID: "abcdhello"})
// }, 1000)
