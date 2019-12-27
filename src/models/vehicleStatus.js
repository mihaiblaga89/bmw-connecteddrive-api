import moment from 'moment';

const cbsData = (data = {}) => {
    /**
     * CBSData
     *
     * @typedef CBSData
     * @type {Object}
     * @property {String} description Description of the message
     * @property {Moment} dueDate Due date for the message, as a {@link https://momentjs.com/docs/|Moment} object
     * @property {Number} remainingMileage Remaining mileage until due
     * @property {String} state State of the message
     * @property {String} type Type of the message (what the message reffers to)
     */
    return {
        description: data.cbsDescription,
        dueDate: data.cbsDueDate ? moment(data.cbsDueDate, 'YYYY-MM') : null,
        remainingMileage: data.cbsRemainingMileage,
        state: data.cbsState,
        type: data.cbsType,
    };
};

const vehicleStatus = (status = {}) => {
    /**
     * VehicleStatus
     *
     * @typedef VehicleStatus
     * @type {Object}
     * @property {String} digitalChargingServiceActivation Status of the Digital Charging Services
     * @property {String} digitalChargingServiceOngoing Status of the Digital Charging Services
     * @property {Array<CBSData>} conditionBasedServicingData CBS Data
     * @property {Boolean} cached Whether or not the data returned is from cache or not
     */
    return {
        digitalChargingServiceActivation: status.DCS_CCH_Activation,
        digitalChargingServiceOngoing: status.DCS_CCH_Ongoing,
        conditionBasedServicingData: status.cbsData ? status.cbsData.map(cbsData) : [],
        chargingConnectionType: status.chargingConnectionType,
        chargingLevelHv: status.chargingLevelHv,
        chargingStatus: status.chargingStatus,
        checkControlMessages: status.checkControlMessages,
        connectionStatus: status.connectionStatus,
        doorDriverFront: status.doorDriverFront,
        doorDriverRear: status.doorDriverRear,
        doorLockState: status.doorLockState,
        doorPassengerFront: status.doorPassengerFront,
        doorPassengerRear: status.doorPassengerRear,
        hood: status.hood,
        internalClock: status.internalDataTimeUTC ? moment(status.internalDataTimeUTC) : null,
        lastChargingEndReason: status.lastChargingEndReason,
        lastChargingEndResult: status.lastChargingEndResult,
        maxRangeElectric: status.maxRangeElectric,
        maxRangeElectricMls: status.maxRangeElectricMls,
        mileage: status.mileage,
        parkingLight: status.parkingLight,
        position: status.position,
        positionLight: status.positionLight,
        rearWindow: status.rearWindow,
        remainingFuel: status.remainingFuel,
        remainingRangeElectric: status.remainingRangeElectric,
        remainingRangeElectricMls: status.remainingRangeElectricMls,
        remainingRangeFuel: status.remainingRangeFuel,
        remainingRangeFuelMls: status.remainingRangeFuelMls,
        remainingRangeTotal: status.remainingRangeFuel + status.remainingRangeElectric,
        remainingRangeTotalMls: status.remainingRangeFuelMls + status.remainingRangeElectricMls,
        singleImmediateCharging: status.singleImmediateCharging,
        trunk: status.trunk,
        updateReason: status.updateReason,
        updateTime: status.updateTime ? moment(status.updateTime) : null,
        vehicleCountry: status.vehicleCountry,
        vin: status.vin,
        windowDriverFront: status.windowDriverFront,
        windowDriverRear: status.windowDriverRear,
        windowPassengerFront: status.windowPassengerFront,
        windowPassengerRear: status.windowPassengerRear,
        cached: false,
    };
};

export default vehicleStatus;
