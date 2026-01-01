import Event from "../models/Event.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**********************************
 * CREATE EVENT (ADMIN)
 **********************************/
export const createEvent = async (req, res) => {
  try {
    const newEvent = { ...req.body };

    if (req.file) {
      newEvent.image = `/uploads/events/${req.file.filename}`;
    }

    // Create event
    const event = await Event.create(newEvent);

    // 🚀 Create WebSocket Room ID
    event.groupRoomId = `event_${event._id}`;
    event.registeredStudents = [];

    await event.save();

    console.log("🟢 Event created with Room:", event.groupRoomId);

    // 🔔 Notify all connected users to refresh event list
    global.io?.emit("event_created", {
      groupRoomId: event.groupRoomId,
      title: event.title,
      id: event._id,
    });

    return res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

/**********************************
 * GET ALL EVENTS
 **********************************/
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("mentor", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**********************************
 * GET LATEST EVENTS (2)
 **********************************/
export const getLatestEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate("mentor", "name email");

    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**********************************
 * UPDATE EVENT
 **********************************/
export const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = `/uploads/events/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**********************************
 * DELETE EVENT
 **********************************/
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    // 🔔 Notify UI to remove group
    global.io?.emit("event_deleted", {
      groupRoomId: event.groupRoomId,
    });

    res.json({ msg: "Event deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**********************************
 * REGISTER STUDENT TO EVENT
 **********************************/
export const registerEvent = async (req, res) => {
  try {
    console.log("🎯 Register Event API called");

    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Check already registered
    if (event.registeredStudents.includes(userId)) {
      return res.status(400).json({ msg: "Already registered" });
    }

    // Add to registered list
    event.registeredStudents.push(userId);
    await event.save();

    // Fetch user info
    const user = await User.findById(userId);

    /*******************************
     * SEND EMAIL (Already in your code)
     *******************************/
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.verify();
      await transporter.sendMail({
        from: `"Crelon Team" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "🎉 Event Registration Successful!",
        html: `<h2>Hi ${user.name}</h2><p>You registered for ${event.title}</p>`,
      });
    } catch (err) {
      console.error("Email failed:", err.message);
    }

    /*******************************
     *  WEBSOCKET: Add user to group
     *******************************/
    const socketId = global.onlineUsers?.get(userId.toString());

    if (socketId) {
      console.log("🔵 User is online → sending WebSocket update");

      // Tell frontend to add group
      global.io?.to(socketId).emit("join_group_success", {
        roomId: event.groupRoomId,
        name: event.title,
      });
    }

    /*******************************
     * FINAL RESPONSE
     *******************************/
    res.status(200).json({
      msg: "Registered successfully!",
      roomId: event.groupRoomId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
