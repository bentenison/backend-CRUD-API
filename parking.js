const router = require("express").Router();
const auth = require("../middleware/auth");
const Parking = require("../models/ParkingModel");

router.post("/book", auth, async (req, res) => {
  try {
    let { type, Lotnumber, date_from, date_to, plate_no } = req.body;
    if (!type || !Lotnumber || !plate_no || !date_from || !date_to)
      res.status(400).json({ msg: "All fields are Mandatory.." });
    const existing = await Parking.findOne({ Lotnumber: Lotnumber });
    if (existing)
      res
        .status(400)
        .json({ msg: "This Lot is Already Booked.Try booking another Slot." });
    else {
      const Newbooking = new Parking({
        type,
        Lotnumber,
        date_from,
        date_to,
        plate_no,
        status: true,
        userId: await req.user,
      });
      const Savedbooking = await Newbooking.save();
      res.json(Savedbooking);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/Unbook", auth, async (req, res) => {
  try {
    const unbooked = await Parking.findOneAndDelete({ userId: req.user });
    res.json(unbooked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/all",async (req, res) => {
  try {
    const filter = {}
    const all = await Parking.find(filter)
    res.json(all)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
