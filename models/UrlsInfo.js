const db = require("../config/db");

class UrlsInfo {
  constructor(
    url,
    domain,
    updatedDate,
    creationDate,
    expirationDate,
    registrar,
    regCountry
  ) {
    this.url = url;
    this.domain = domain;
    this.updatedDate = updatedDate;
    this.creationDate = creationDate;
    this.expirationDate = expirationDate;
    this.registrar = registrar;
    this.regCountry = regCountry;
  }

  async save() {
    try {
      let sql = `
        INSERT INTO savedurls (
            url,
            domain,
            updateddate,
            creationdate,
            expirationdate,
            registrar,
            regcountry
            )
            VALUES (
                "${this.url}", 
                "${this.domain}", 
                "${this.updatedDate}", 
                "${this.creationDate}", 
                "${this.expirationDate}", 
                "${this.registrar}", 
                "${this.regCountry}"
            );`;

      const result = await db.execute(sql);
      return result[0];
    } catch (error) {
      console.log("🔥 SAVE INTO DB error", error.message);
      throw error;
    }
  }

  static async findUrl(url, domain) {
    try {
      let sql = `
        SELECT *
        FROM savedurls
        WHERE url="${url}" OR domain="${domain}";
        `;

      const [result] = await db.query(sql);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UrlsInfo;
