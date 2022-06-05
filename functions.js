import dotenv from 'dotenv'
import https from 'https'
import moment from 'moment'
import ChartJSImage from 'chart.js-image';
import {MessageEmbed} from 'discord.js'

dotenv.config()

export default async function getCurrencyHistory(fromCurrency, toCurrency){   

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);

    var query = fromCurrency + '_' + toCurrency;
    var endDate = moment().format().slice(0,10);
    var startDate = moment().subtract(7, 'days').format().slice(0,10);
    var url = 'https://free.currconv.com/api/v7/convert?q=' +
        query +
        '&compact=ultra&date=' +
        startDate +
        '&endDate=' +
        endDate +
        '&apiKey=' +
        process.env.API_KEY;
    var imgURL = null;
    var err = null;
    let p = new Promise((resolve,reject) =>{
        https.get(url, async (res) => {
            var body = '';

            res.on('data', (chunk) => {
                body += chunk;
            });

            res.on('error', (e) => {
                err = e;
                resolve(err)
            });

            res.on('end', async () => {
                    var jsonObj = JSON.parse(body);
                    if(jsonObj[query] != null){
                        imgURL = await createChart(Object.keys(jsonObj[query]), Object.values(jsonObj[query]),fromCurrency,toCurrency);
                        resolve(Object.values(jsonObj[query]));    
                    }else{
                        resolve(err);
                    }                
                                         
            });
        });
    });

    let vals = await p;
    
    if(imgURL != null)
        return new MessageEmbed().setImage(imgURL).setTitle('Current exchange rate: 1 ' + fromCurrency + ' = ' + vals[7] + ' ' + toCurrency);
    else if(err != null)
        return new MessageEmbed().setTitle(err);
    else
        return new MessageEmbed().setTitle("Something is wrong");

}

async function createChart(dates,values,fromCurrency,toCurrency){
    const width = 800;
    const height = 600;
    const configuration = {
        type: 'line',
        data:{
            labels: dates,
            datasets:[
                {
                    label: fromCurrency + toCurrency + ' Graph',
                    data: values,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)'
                }
            ]
        }
    }

    const chartNode = ChartJSImage()
        .chart(configuration)
        .backgroundColor('transparent')
        .width(width)
        .height(height);
    const imgURL = await chartNode.toURL();

    return imgURL;   

}