const fs = require('fs');
const express = require('express');
const Web3 = require('web3');

const PORT = Number(valueOrDefault(process.env.PORT, 42069));
const INFURA_API_KEY = process.env.INFURA_API_KEY;

const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);
const AAPX_JSON = JSON.parse(fs.readFileSync('AAPX.json', 'utf8'));
const AAPX_TOKEN_ADDRESS = "0xbfd815347d024f449886c171f78fa5b8e6790811";
const AAPX = new web3.eth.Contract(AAPX_JSON.abi, AAPX_TOKEN_ADDRESS);

const app = express();
app.get('/supply', async (req, res) => {
    let supply = await calculateSupply();
    res.send(supply);
});
app.listen(PORT);

async function calculateSupply() {
    // TODO: Calculate the actual supply here and return!
    return getBalance('0x055E07D76eA9190F324D83C12a48E17cCCdcdeb2');
}

async function getBalance(address) {
    let balanceWei = await AAPX.methods.balanceOf(address).call();
    let balance = await web3.utils.fromWei(balanceWei);
    return balance;
}

function valueOrDefault(value, defaultValue) {
    return (value !== undefined) ? value : defaultValue
}