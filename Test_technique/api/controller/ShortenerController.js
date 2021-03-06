const validator = require("validator");

const Url = require("../model/url");

const Redirect = async (req, res) => {
  const { shortId } = req.params;

  if (!shortId) return res.status(400).json({ msg: "id not provided" });

  try {
    const URL = await Url.findOne({ shortId });
    if (!URL) return res.status(400).json({ msg: "invalid url id" });
    return res.redirect(URL.url);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "some error occured" });
  }
};

const AddUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ msg: "url not provided" });

  if (
    !validator.isURL(url, {
      require_protocol: true,
    })
  )
    return res.status(400).json({ msg: "invalid url" });

  try {
    let URL = await Url.findOne({ url });
    if (!URL) {
      let newURL = new Url({ url });
      await newURL.save();
      return res.status(201).json({ shortId: newURL.shortId, url });
    }

    return res.status(200).json({ shortId: URL.shortId, url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "some error occured" });
  }
};

module.exports = {
  Redirect,
  AddUrl,
};