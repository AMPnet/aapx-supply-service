const fs = require('fs');
const express = require('express');
const cors = require('cors');
const Web3 = require('web3');

const PORT = Number(valueOrDefault(process.env.PORT, 42069));
const INFURA_API_KEY = process.env.INFURA_API_KEY;

const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);
const AAPX_JSON = JSON.parse(fs.readFileSync('AAPX.json', 'utf8'));
const AAPX_TOKEN_ADDRESS = "0xbfd815347d024f449886c171f78fa5b8e6790811";
const AAPX = new web3.eth.Contract(AAPX_JSON.abi, AAPX_TOKEN_ADDRESS);

const TOTAL_SUPPLY = "7000000";
const TOTAL_SUPPLY_WEI = web3.utils.toBN(web3.utils.toWei(TOTAL_SUPPLY));

const BIG_WALLET = "0x055E07D76eA9190F324D83C12a48E17cCCdcdeb2";
const VESTING_01 = "0x09f04D692F4C97D0b86fb57f81cE2346D161eA88";
const VESTING_02 = "0xd40E97C8eE6f3F0905F20f782f5407b543CFB7eD";
const VESTING_03 = "0x2A707746959dCBefFAb19F1488E936d2b688bA87";
const VESTING_04 = "0x093B53EdCD2Dc76166Ca66ED33FE472C45C5A80F";
const VESTING_05 = "0x29573e8Ef5a4446F4167c7a41e418e5CC4d65a21";
const VESTING_06 = "0x8154D878DA0Bf4a6694Eedc722809cEF92fe8c04";
const VESTING_07 = "0xf6494a61E66618B70C87A664FB69F002DF29cF53";
const VESTING_08 = "0x0d87f41be645fb600de129f91e9ccad9e3b2688d";
const VESTING_09 = "0x96748459e1af603421caefd7665ed5d08a15027a";
const VESTING_10 = "0xb560d231e606f547793699cea81a019513308be3";
const VESTING_11 = "0x7a084e2318be17f9fc98171ca93107f3d9546030";
const VESTING_12 = "0x6fc1d12c203e34c024e13768314bf5539cdc5c73";

const app = express();
app.use(cors({
    origin: '*'
}));
app.get('/supply', async (req, res) => {
    try {
        let supply = await calculateSupply()
        res.json(supply)
    } catch (err) {
        res.json({
            error: "server error"
        })
    }

});
app.listen(PORT);

async function calculateSupply() {
   const lockedSupplyWei = (await Promise.all([
        getBalance(BIG_WALLET),
        getBalance(VESTING_01),
        getBalance(VESTING_02),
        getBalance(VESTING_03),
        getBalance(VESTING_04),
        getBalance(VESTING_05),
        getBalance(VESTING_06),
        getBalance(VESTING_07),
        getBalance(VESTING_08),
        getBalance(VESTING_09),
        getBalance(VESTING_10),
        getBalance(VESTING_11),
        getBalance(VESTING_12)
    ])).reduce((a, b) => a.add(b));
    const lockedSupply = web3.utils.fromWei(lockedSupplyWei);
    const circulatingSupplyWei = TOTAL_SUPPLY_WEI.sub(lockedSupplyWei);
    const circulatingSupply = web3.utils.fromWei(circulatingSupplyWei);
    return {
        contract_address: AAPX_TOKEN_ADDRESS,
        total_supply: roundToTwo(TOTAL_SUPPLY),
        total_supply_wei: TOTAL_SUPPLY_WEI.toString(),
        locked_supply: roundToTwo(lockedSupply),
        locked_supply_wei: lockedSupplyWei.toString(),
        circulating_supply: roundToTwo(circulatingSupply),
        circulating_supply_wei: circulatingSupplyWei.toString()
    }
}

async function getBalance(address) {
    const balance = web3.utils.toBN(
        await AAPX.methods.balanceOf(address).call()
    )
    return balance
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function valueOrDefault(value, defaultValue) {
    return (value !== undefined) ? value : defaultValue
}
