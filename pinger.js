const https = require('https') 

let args = process.argv.slice(2); 
let reg = new RegExp('^[0-9]+$');

const url = args[0];  

const countKey = args[1].split("=")[0];
let count = args[1].split("=")[1];
const N = count;
const secondKey = args[2].split("=")[0]; 
const second = args[2].split("=")[1]; 

let countValidation = reg.test(count);   
let secondValidation = reg.test(second);   

let isFirstSendRequest = true;  
let isFirstFailError = true;  

function validation(){
    return (countKey == 'N' || countKey == 'n') && (secondKey == 'K' || secondKey == 'k');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
async function main(){ 
    if(countValidation && secondValidation && validation()){ 
            await ping(url,count,second);  
    }
    else{
        validation() ? 
            console.log(`count or second can be only number`) :
            console.log(`Parameters should be N and K`)
    }
}

async function ping(url, count, second) { 
   await sleep(second * 1000);
    const options = {
        hostname: url,
    }   
    if(count != 0) { 
        const req = await https.request(options, res => {
            if(res.statusCode == '200') {
                if(!isFirstFailError) {
                    console.log(`service is up again`)
                }
                else {
                    console.log(`STATUS OK : service up and running`)
                }
                ping(url,N,second)
            }
            else {  
                if(isFirstFailError) {
                    console.error("STATUS  FAIL : error")
                    isFirstFailError = false;
                }
                isFirstSendRequest = false;
                ping(url,count-1,second)
            }
        }) 
        req.on('error', error => {
            console.error("Something is wrong like unexpected host and no connection \n\n", error)
        }) 
        req.end()
    } 
    else { 
        console.log(`service is down`) 
    }
}

main();