const debug = require("debug")("enforce-database")
const config = require(process.env.DB_ENFORCE_CONFIG || "./config.json")
const {
	createConnection
} = require("mysql")

const moduleName = "Enforce Database System"

class BufferType {
	constructor(datatype, data) {
		this.datatype = datatype
		this.data = data
	}
}

const tables = Object.freeze(config.tables)


debug("Booting %s", moduleName)

let con = null

/**
 * @description Database class, a wrapper for mysql methods
 */
class DataBase {

	/**
	 * @param {{missionPrefix?: string, loopInterval?: number, bufferLimit?: number}} options
	 */
	constructor(options) {
		this.options = Object.assign({}, config, options)
		if (!("loopInterval" in this.options)) this.options.loopInterval = 10
		if (!("bufferLimit" in this.options)) this.options.bufferLimit = 80000

		con = createConnection(Object.assign({
			insecureAuth: true
		}, options))

		debug(`Connecting to database...`)
		con.connect(err => {
			if (err) {
				debug(`ERROR: ${err.message}`)
				return debug(`Can't connect to msql`)
			}
			debug("Connected!")
		})

		this.mission = this.options.missionPrefix || "enf"
		this.buffer = []
		this._startdbLoop()
	}

	/**
	 * @description To call before the start of every mission to generate the mission id
	 */
	startMission(missionID) {
		let now = new Date().getTime().toString()
		this.mission += now
		if (missionID) this.mission = missionID
		debug(`Starting mission: ${this.mission}`)
		return this._insert("missions", {
			time: now
		})
	}

	/**
	 * @param {"humidity"|"temperature"|"position"|"orientation"|"pressure"} datatype
	 * @param {PositionData | number | OrientationData} data
	 */
	_insert(datatype, data) {
		if (this.buffer.length > this.options.bufferLimit) return debug(`Buffer full :: data loss ::`)
		this.buffer.push(new BufferType(datatype, data))
	}

	save(data) {
		Object.keys(data).forEach(key => {
			if (key in tables) {
				if (data[key] instanceof Object) {
					this._insert(key, data[key])
				} else {
					let obj = Object.defineProperty({}, key, {
						value: data[key],
						enumerable: true,
						writable: true
					})
					if ("missionID" in data) {
						obj = Object.defineProperty(obj, "missionID", {
							value: data.missionID,
							enumerable: true,
							writable: true
						})
					}
					this._insert(key, obj)
				}
			}
		})
	}

	_startdbLoop() {
		this.to = setTimeout(() => {
			if (!this.connected() || this.buffer.length === 0) return this._startdbLoop()
			this._firstPhase(this.buffer.shift())
			this._startdbLoop()
		}, this.options.loopInterval)
	}

	/**
	 * @param {BufferType} buffertype
	 */
	_firstPhase(buffertype) {
		Object.keys(tables).forEach(key => {
			if (buffertype.datatype === key) this._trueInsert(tables[key], buffertype.data)
		})
	}

	/**
	 * @param {"humidity"|"temperature"|"position"|"orientation"|"missions"|"pressure"} table
	 * @param {{}} data
	 * @returns {Promise<void>}
	 */
	_trueInsert(table, data) {
		return new Promise((resolve, reject) => {
			if (!this.connected()) {
				debug(`Database not connected :: data loss ::`);
				return reject(`Database not connected :: data loss ::`)
			}
			debug(`Inserting into ${table}...`)
			con.query({
					sql: `INSERT INTO ?? SET ?`,
					values: [table, Object.assign({
						missionID: this.mission,
						time: new Date().getTime()
					}, data)]
				},
				(error) => {
					if (error) return reject(`ERROR: ${error.message}`)
					debug(`Done.`)
					resolve()
				})
		})
	}

	connected() {
		return con.state === "authenticated"
	}
}

module.exports = DataBase


/**
 * @typedef {{ latitude: number, longitude: number, altitude:number }} PositionData
 * @typedef {{ w: number, x: number, y: number, z: number, scale: number }} OrientationData
 */
