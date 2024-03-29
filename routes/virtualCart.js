const express = require('express');
const router = express.Router();

const { getProductsByRFID } = require('../utils/productUtils')

// const io = require("socket.io")();
// const socketapi = {
//     io: io
// };

// return function (db) {
//     const ref = db.ref('ids/current/ids');

//     // ref.on('value', (snapshot) => {
//     //     console.log(snapshot.val());
//     // }, (errorObject) => {
//     //     console.log('The read failed: ' + errorObject.name);
//     // });
//     // console.log("Here")
//     io.sockets.on("connection", function (socket) {
//         // Everytime a client logs in, display a connected message
//         console.log("Server-Client Connected!");

//         socket.on('connected', function (data) {
//             //listen to event at anytime (not only when endpoint is called)
//             //execute some code here
//             console.log("Connected")
//         });

//         socket.on('ping', data => {
//             //calling a function which is inside the router so we can send a res back
//             console.log("ping")
//         })
//     });
//     //pickedUser is one of the connected client
//     var pickedUser = "JZLpeA4pBECwbc5IAAAA";
//     // io.to(pickedUser).emit('taskRequest', req.body);

//     // });

//     // return router;

// };
module.exports = (io) => {
    // const ref = db.ref('ids/current/ids');
    io.on('connection', socket => {
        let { id } = socket;
        console.log('new connection iddddd:', id);

        socket.on('disconnect', socket => {
            console.log('disconnect id:', id);
        });

        // ref.on('value', (snapshot) => {
        //     console.log(snapshot.val());
        //     socket.emit('change', snapshot.val())
        // }, (errorObject) => {
        //     console.log('The read failed: ' + errorObject.name);
        // });
        socket.on('valuefromsocket', async val => {
            let productsArray = []
            for (const v of val?.ids || []) {
                let text = v.split("*")[1]
                let product = await getProductsByRFID(text);
                product.tagData = v
                console.log("product: "+ product?.name)
                if(product?._id){
                    productsArray.push(product)
                }
            }
            socket.broadcast.emit('change', productsArray)
        });
    });

    return router;
}