const axios = require("axios");
const { response } = require("express");

class ClienteService {


  constructor() {
    this.baseUrl = "http://exsammirandinha.ddns.com.br:7780/Web.Api";
    this.headers = {
      "Content-Type": "application/xml",
      Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
    };
  }

  async createClienteExsam(cliente) {
    try {
      const options = {
        method: "POST",
        url: this.baseUrl,
        headers: this.headers,
        // data:
        //   '<?xml version="1.0" encoding="UTF-8"?>' +
        //   "<cliente><cnpjf>3148374fg8863</cnpjf>" +
        //   "<nome>faquere faquere</nome>" +
        //   "<cep>0928sdfgsdf0360</cep>" +
        //   "<endereco>RUA FORTUNATA NAZARO</endereco>" +
        //   "<endnum>68</endnum>" +
        //   "<endcpl>BL.XYZ</endcpl>" +
        //   "<bairro>PONTE GRANDE</bairro>" +
        //   "<id_cidade>3518800</id_cidade>" +
        //   "<cidade>GUARULHOS</cidade>" +
        //   "<uf>SP</uf>" +
        //   "<email>suporte@exsam.com.br</email>" +
        //   "<ddd1>11</ddd1>" +
        //   "<fone1>242514555523</fone1>" +
        //   "<ddd2></ddd2>" +
        //   "<fone2></fone2>" +
        //   "<id_fpagto>15</id_fpagto>" +
        //   "<id_pagto>30</id_pagto>" +
        //   "</cliente >",

        data:
          '<?xml version="1.0" encoding="UTF-8"?>' +
          "<cliente><cnpjf>" + cliente.cnpj + "</cnpjf>" +
          "<nome>" + cliente.nome + "</nome>" +
          "<cep>" + cliente.cep + "</cep>" +
          "<endereco>" + cliente.endereco + "</endereco>" +
          "<endnum>" + cliente.endnum + "</endnum>" +
          "<endcpl>" + cliente.endcpl + "</endcpl>" +
          "<bairro>" + cliente.bairro + "</bairro>" +
          "<id_cidade>" + cliente.id_cidade + "</id_cidade>" +
          "<cidade>" + cliente.cidade + "</cidade>" +
          "<uf>" + cliente.uf + "</uf>" +
          "<email>" + cliente.email + "</email>" +
          "<ddd1>" + cliente.ddd1 + "</ddd1>" +
          "<fone1>" + cliente.fone1 + "</fone1>" +
          "<ddd2>" + cliente.ddd2 + "</ddd2>" +
          "<fone2>" + cliente.fone2 + "</fone2>" +
          "<id_fpagto>" + cliente.id_fpagto + "</id_fpagto>" +
          "<id_pagto>" + cliente.id_pagto + "</id_pagto>" +
          "</cliente>",
      };
      const response = await axios.request(options);
      return {
        status: true,
        data: response.data,
        message: "Cliente criado com sucesso na api!",
      };
    } catch (error) {
      throw error.message;
    }
  }
}
module.exports = new ClienteService();
