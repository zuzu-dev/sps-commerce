import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import keys from '../config/keys';

@Injectable()
export class SpsService {

    public async getAccessToken() {
        const config: AxiosRequestConfig = {
            url: "https://auth.spscommerce.com/oauth/token",
            method: 'POST',
            data : {
                "grant_type": "refresh_token",
                "client_id": keys.sps.clientId,
                "client_secret": keys.sps.clientSecret,
                "refresh_token": keys.sps.refreshToken,
            }
        }
        console.log(config)
        const response = await axios(config)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            throw error.response.data
        });
        console.log(response)
        return response.access_token;
    }
}
