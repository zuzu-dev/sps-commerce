import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import keys from '../config/keys';
import xml2js, { Parser } from 'xml2js';


@Injectable()
export class SpsService {

    public async get(type: string) {
        if(type == "orders") { return await this.getFilesOfADirectory('out', 'PO'); }
    }

    private async sendRequest(config: AxiosRequestConfig, isUrlDirectoryPath = false) {
        const response = await axios(config)
            .then(response => {
                if(isUrlDirectoryPath) { return response.data.slice(1); }
                else { return response.data; }
            })
            .catch(error => {
                throw error;
            });
        return response;
    }

    private async getFilesOfADirectory(inOrOut: string, type: string) {
        const accessToken = await this.getAccessToken();
        const req = this.formSpsRequest(accessToken, inOrOut, type, '*');
        const purchaseOrderPaths = await this.sendRequest(req, true);
        const numOfOrders = purchaseOrderPaths.length;

        const SpsOrders = [];
        let i = 0;
        let j = 10;
        while (i < numOfOrders) {
            let purchaseOrderPathsBatch = purchaseOrderPaths.slice(i, i+j);
            await Promise.all(purchaseOrderPathsBatch.map(async orderPath => {
                const pathElements: string[] = orderPath.key.split('/');
                const request = this.formSpsRequest(accessToken, pathElements[0], pathElements[1], pathElements[2]);
                const result = await this.sendRequest(request);
                const order = await this.xml2JSON(result);
                //TODO map order fields here or in ordersService. also map the processed order numbers.
                SpsOrders.push(order);
            }));
            i+=j;
        }
        return SpsOrders;

    }

    private formSpsRequest(accessToken: string, inOrOut: string, type: string, path: string) {
        const url = `https://api.spscommerce.com/transactions/v2/${inOrOut}/${type}/${path}`;
        const request: AxiosRequestConfig = {
            url: url,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        }
        return request;
    }

    private async getAccessToken() {
        const config: AxiosRequestConfig = {
            url: "https://auth.spscommerce.com/oauth/token",
            method: 'POST',
            data: {
                "grant_type": "refresh_token",
                "client_id": keys.sps.clientId,
                "client_secret": keys.sps.clientSecret,
                "refresh_token": keys.sps.refreshToken,
            }
        }
        const response = await axios(config)
            .then(res => { return res.data; })
            .catch(error => { throw error.response.data; });
        return response.access_token;
    }
    
    private async xml2JSON(xml: XMLDocument) {
        const parser = new Parser({explicitArray: false});
        const jsonObject: Object = parser.parseStringPromise(xml)
            .then(function (result) { return result; })
            .catch(function (error) { throw error; });
        return jsonObject;
    }

    public async json2xml(jsonObject: Object) {
        try {
            let builder = new xml2js.Builder();
            let xml = builder.buildObject(jsonObject);
            return xml;
        } catch (error) {
            throw error;
        }
    }
}
