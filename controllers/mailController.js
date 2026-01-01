import { sendMail } from "../utils/mailer.js";

export const sendNotification = async (req, res) => {
  const { to, subject, message } = req.body;
  try {
    await sendMail(to, subject, message);
    res.status(200).json({ msg: "Mail sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
