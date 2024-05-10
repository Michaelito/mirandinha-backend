const axios = require("axios");
const xmlJson = require("xml-js");
const xml2js = require('xml2js')
// import File System Module 

  
// import xml2js Module 
const parseString = require("xml2js");  




// Retrieve all from the database.
exports.findAll = (req, res) => {
  res.status(400).send({
    message: "Content can not be empty!",
  });
};

exports.createClient = (req, res) => {
  var options = {
    method: "POST",
    url: "http://exsammirandinha.ddns.com.br:7780/Web.Api",
    headers: {
      "Content-Type": "application/xml",
      Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
    },
    data:
      '<?xml version="1.0" encoding="UTF-8"?>' +
      "<cliente><cnpjf>3148374fg8863</cnpjf>" +
      "<nome>faquere faquere</nome>" +
      "<cep>0928sdfgsdf0360</cep>" +
      "<endereco>RUA FORTUNATA NAZARO</endereco>" +
      "<endnum>68</endnum>" +
      "<endcpl>BL.XYZ</endcpl>" +
      "<bairro>PONTE GRANDE</bairro>" +
      "<id_cidade>3518800</id_cidade>" +
      "<cidade>GUARULHOS</cidade>" +
      "<uf>SP</uf>" +
      "<email>suporte@exsam.com.br</email>" +
      "<ddd1>11</ddd1>" +
      "<fone1>242514555523</fone1>" +
      "<ddd2></ddd2>" +
      "<fone2></fone2>" +
      "<id_fpagto>15</id_fpagto>" +
      "<id_pagto>30</id_pagto>" +
      "</cliente >",
  };

  axios
    .request(options)
    .then(function (response) {
      res.send({
        status: true,
        data: response.data,
      });
    })
    .catch(function (error) {
      console.error(error);
      res.send({
        status: false,
        message: error,
      });
    });
};



exports.updateData = (req, res) => {


  
  var axios = require("axios").default;

  var options = {
    method: 'GET',
    url: 'http://exsammirandinha.ddns.com.br:7780/Web.Api',
    params: {nsu: '0'},
    headers: {Authorization: 'Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7'}
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);

    const xml = response.data

    // convert XML to JSON
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        throw err
      }

      // `result` is a JavaScript object
      // convert it to a JSON string
      const json = JSON.stringify(result, null, 4)

      // log JSON string
      console.log(json)
      res.send(json)
    })





  }).catch(function (error) {
    console.error(error);
  });


};