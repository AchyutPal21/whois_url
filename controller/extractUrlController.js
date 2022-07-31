const whois = require("whois-json");
const tldjs = require("tldjs");

const UrlsInfo = require("../models/UrlsInfo");

function renderPage(req, res, next) {
  res.status(200).render("index");
}

async function whoisInfo(url) {
  const data = await whois(url);
  const {
    domainName: domain,
    updatedDate: updated_date,
    creationDate: creation_date,
    registrarRegistrationExpirationDate: expiration_date,
    registrar,
    registrantCountry: reg_country,
  } = data;

  return {
    domain,
    updated_date,
    creation_date,
    expiration_date,
    registrar,
    reg_country,
  };
}

async function saveToDb(tld) {
  const {
    domain,
    updated_date,
    creation_date,
    expiration_date,
    registrar,
    reg_country,
  } = await whoisInfo(tld.domain);
  const saveURL = new UrlsInfo(
    tld.hostname,
    domain,
    updated_date,
    creation_date,
    expiration_date,
    registrar,
    reg_country
  );

  await saveURL.save();
}

async function urlExtractor(req, res, next) {
  try {
    const { url } = req.body;
    const tldData = tldjs.parse(url);
    const findAndSend = async (tld) => {
      const result = await UrlsInfo.findUrl(tld.hostname, tld.domain);
      if (result.length) {
        return res.status(200).send({
          ...result[0],
          id: undefined,
        });
      } else {
        await saveToDb(tldData);
        await findAndSend(tldData);
      }
    };

    if (!tldData.tldExists) {
      return res.status(400).send({ message: "Could not find url" });
    }

    // Sending from stored db
    if (tldData.tldExists) {
      return findAndSend(tldData);
    }
  } catch (error) {
    res.status(404).send({
      message: error.message + "",
    });
  }
}

module.exports = { urlExtractor, renderPage };
