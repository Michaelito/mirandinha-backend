const axios = require("axios");
const { response } = require("express");

class PedidoService {


    constructor() {
        this.baseUrl = "http://exsammirandinha.ddns.com.br:7780/Web.Api";
        this.headers = {
            "Content-Type": "application/xml",
            Authorization: "Key ZZ3qxtMGPQFXBFm8qtZbACiumpzhsjJ7",
        };
    }

    async createPedidoExsam(pedido, itensArray) {
        try {
            const options = {
                method: "POST",
                url: this.baseUrl,
                headers: this.headers,
                data:
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    "<pedido>" +
                    "<id> </id>" +
                    "<cnpjf>" + pedido.cnpjf + "</cnpjf>" +
                    "<nome>" + pedido.nome + "</nome>" +
                    "<cep>" + pedido.cep + "</cep>" +
                    "<endereco>" + pedido.endereco + "</endereco>" +
                    "<endnum>" + pedido.endnum + "</endnum>" +
                    "<endcpl>" + pedido.endcpl + "</endcpl>" +
                    "<bairro>" + pedido.bairro + "</bairro>" +
                    "<id_cidade>" + pedido.id_cidade + "</id_cidade>" +
                    "<cidade>" + pedido.cidade + "</cidade>" +
                    "<uf>" + pedido.uf + "</uf>" +
                    "<email>" + pedido.email + "</email>" +
                    "<ddd1>" + pedido.ddd1 + "</ddd1>" +
                    "<fone1>" + pedido.fone1 + "</fone1>" +
                    "<dh_mov>" + pedido.dh_mov + "</dh_mov>" +
                    "<id_fpagto>" + pedido.id_fpagto + "</id_fpagto>" +
                    "<id_pagto>" + pedido.id_pagto + "</id_pagto>" +
                    "<id_vended1>" + pedido.id_vended1 + "</id_vended1>" +
                    "<id_transp>" + pedido.id_transp + "</id_transp>" +
                    "<id_frete>" + pedido.id_frete + "</id_frete>" +
                    "<prazo>" + pedido.prazo + "</prazo>" +
                    "<peso_bru>" + pedido.peso_bru + "</peso_bru>" +
                    "<peso_liq>" + pedido.peso_liq + "</peso_liq>" +
                    "<total>" + pedido.total + "</total>" +
                    "<frete>" + pedido.frete + "</frete>" +
                    "<desconto>" + pedido.desconto + "</desconto>" +
                    "<total_geral>" + pedido.total_geral + "</total_geral>" +
                    "<itens>" +
                    "<item>" +
                    "<id_produto>" + itensArray[0].id_produto + "</id_produto>" +
                    "<produto>" + itensArray[0].produto + "</produto>" +
                    "<preco>" + itensArray[0].preco + "</preco>" +
                    "<qtde>" + itensArray[0].qtde + "</qtde>" +
                    "<total>" + itensArray[0].total + "</total>" +
                    "<peso>" + itensArray[0].peso + "</peso>" +
                    "</item>" +
                    "</itens>" +
                    "</pedido>"
            };
            console.log(options.data);
            const response = await axios.request(options);
            return {
                status: true,
                data: options.data,
                response: response.data,
                message: "Pedido criado com sucesso na api!",
            };
        } catch (error) {
            throw error.message;
        }
    }
}
module.exports = new PedidoService();