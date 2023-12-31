const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const checkUser = require('../functions/checkUser');
const errorResponse = require('../functions/errorResponse');

// Event database model
const Event = require("../models/eventModel");

exports.getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({});
    // Check no errors happend when retrieving all events
    if(!events) return errorResponse(res, 400, "Error occured");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: events
    });
});

exports.getOneEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Check if event id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "Event id is invalid");
    const event = await Event.findOne({_id: id});
    // Check no errors happend when retrieving event
    if(!event) return errorResponse(res, 400, "Event is not found");
    // return success response
    res.status(200).json({
        status: "Success",
        statusCode: 200,
        data: event
    });
});

exports.addEvent = asyncHandler(async (req, res) => {
    const { title, desc, location, date, userId } = req.body;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check all required fields are sent in the request
    if(!title || !desc || !location || !date) return errorResponse(res, 400, "Please fill all the fields");
    // Create new event
    const newEvent = await Event.create(req.body);
    // Check if error occurred
    if (!newEvent) return errorResponse(res, 400, "Error occured during creating new event");
    // return success response ( 201 = created successfully)
    return res.status(201).json({
        status: "Success",
        statusCode: 201,
        message: "Event created successfully",
        data: newEvent
    });
});

exports.deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.headers.authorization;
    const user = await checkUser(res, userId, "admin");
    if(!user) return;
    // Check if event id is valid
    if(!mongoose.Types.ObjectId.isValid(id)) return errorResponse(res, 400, "Event id is invalid");
    const event = await Event.findOne({_id: id});
    // Check if the needed event exists
    if(!event) {
        // 404 = NOT FOUND
        return errorResponse(res, 404, "This event is not found");
    }
    if(await event.deleteOne({_id: id})) {
        // return success response ( 204 = no content = deleted successfully)
        return res.status(204).json({
            status: "Success",
            statusCode: 204,
            message: "This event is deleted successfully"
        });
    }
    // return fail response
    return errorResponse(res, 400, "Error occured during deleting the event");
});
