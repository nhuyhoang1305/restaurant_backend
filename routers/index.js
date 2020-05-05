var API_KEY = 1305;

var express = require('express');
var moment = require('moment');

var router = express.Router();

// GET
router.get('/', function(req, res, next){
    res.send('Hello World');
});

/*===============================================================
USER TABLE
GET/POST
================================================================*/

router.get('/user', function(req, res, next){
    if (req.query.key == API_KEY){

        var fbid = req.query.fbid;

        if (fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT userPhone, name, address, fbid FROM User WHERE fbid=?', [fbid], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.post('/user', function(req, res, next){
    console.log(req.body);
    if (req.body.key == API_KEY){

        var fbid = req.body.fbid;
        var user_phone = req.body.userPhone;
        var user_name = req.body.userName;
        var user_address = req.body.userAddress;


        if (fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('INSERT INTO User(FBID, UserPhone, Name, Address) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE Name=?, Address=?', [fbid, user_phone, user_name, user_address, user_name, user_address], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.affectedRows > 0){
                            res.send(JSON.stringify({success: true, message: "Success"}));
                        }  
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing fbid in body'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
FAVORITE TABLE
GET/POST/DELETE
================================================================*/

router.get('/favorite', function(req, res, next){
    if (req.query.key == API_KEY){

        var fbid = req.query.fbid;

        if (fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT fbid, foodId, restaurantId, restaurantName, foodName, foodImage, price FROM Favorite WHERE fbid=?', [fbid], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.get('/favoriteByRestaurant', function(req, res, next){
    if (req.query.key == API_KEY){

        var fbid = req.query.fbid;
        var restaurant_id = req.query.restaurantId;
        if (fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT fbid, foodId, restaurantId, restaurantName, foodName, foodImage, price FROM Favorite WHERE fbid=? AND RestaurantId=?', [fbid, restaurant_id], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.post('/favorite', function(req, res, next){
    console.log(req.body);
    if (req.body.key == API_KEY){

        var fbid = req.body.fbid;
        var food_id = req.body.foodId;
        var restaurant_id = req.body.restaurantId;
        var restaurant_name = req.body.restaurantName;
        var food_name = req.body.foodName;
        var food_image = req.body.foodImage;
        var food_price = req.body.price;


        if (fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('INSERT INTO Favorite(FBID, FoodId, RestaurantId, RestaurantName, FoodName, FoodImage, Price) VALUES(?, ?, ?, ?, ?, ?, ?)', [fbid, food_id, restaurant_id, restaurant_name, food_name, food_image, food_price], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.affectedRows > 0){
                            res.send(JSON.stringify({success: true, message: "Success"}));
                        }  
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing fbid in body'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.delete('/favorite', function(req, res, next){
    if (req.query.key == API_KEY){

        var fbid = req.query.fbid;
        var food_id = req.query.foodId;
        var restaurant_id = req.query.restaurantId;

        if (fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('DELETE FROM Favorite WHERE fbid=? AND FoodId=? AND RestaurantId=?', [fbid, food_id, restaurant_id], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.affectedRows > 0){
                            res.send(JSON.stringify({success: true, message: "Success"}));
                        }
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Miss fbid'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
RESTAURANT TABLE
GET
================================================================*/

router.get('/restaurant', function(req, res, next){
    if (req.query.key == API_KEY){

        req.getConnection(function(error, conn){
            conn.query('SELECT id, name, address, phone, lat, lng, userOwner, image, paymentUrl FROM Restaurant', function(err, rows, fields){

                if (err){
                    res.status(500);
                    res.send(JSON.stringify({success: false, message: err.message}));
                }
                else {
                    if (rows.length > 0){
                        res.send(JSON.stringify({success: true, result: rows}));
                    }
                    else{
                        res.send(JSON.stringify({success: false, message: "Empty"}));
                    }
                }   

            });
        });
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.get('/restaurantById', function(req, res, next){
    if (req.query.key == API_KEY){
        var restaurant_id = req.query.restaurantId;
        //console.log(restaurant_id);
        if (restaurant_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, name, address, phone, lat, lng, userOwner, image, paymentUrl FROM Restaurant WHERE id=?', [restaurant_id], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing restaurant id'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.get('/nearByRestaurant', function(req, res, next){
    console.log(req.query);
    if (req.query.key == API_KEY){
        if (req.query.lat != undefined && req.query.lng != undefined && req.query.distance != undefined){
            var user_lat = parseFloat(req.query.lat);
            var user_lng = parseFloat(req.query.lng);
            var distance = parseFloat(req.query.distance);
            req.getConnection(function(error, conn){
                conn.query('SELECT * FROM (SELECT id, name, address, phone, lat, lng, userOwner, image, paymentUrl,' 
                + 'ROUND(111.045 * DEGREES(ACOS(COS(RADIANS(?)) * COS(RADIANS(lat))'
                + '* COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?))'
                + '* SIN(RADIANS(lat)))), 2) AS distance_in_km FROM Restaurant) tempTable WHERE distance_in_km < ?', [user_lat, user_lng, user_lat, distance], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: "Missing something"}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
MENU TABLE
GET
================================================================*/

router.get('/menu', function(req, res, next){
    if (req.query.key == API_KEY){
        var restaurant_id = req.query.restaurantId;
        //console.log(restaurant_id);
        if (restaurant_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, name, description, image FROM Menu WHERE id in (SELECT menuId FROM Restaurant_Menu WHERE restaurantId = ?)', [restaurant_id], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing restaurant id'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
FOOD TABLE
GET
================================================================*/

router.get('/food', function(req, res, next){
    if (req.query.key == API_KEY){
        var menu_id = req.query.menuId;
        //console.log(restaurant_id);
        if (menu_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, name, description, image, price, CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'False\' END as isSize, '
                +'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'False\' END as isAddon, '
                +'discount FROM Food WHERE id in (SELECT foodId FROM Menu_Food WHERE menuId = ?)'
                , [menu_id], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing menuId'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});
router.get('/foodById', function(req, res, next){
    if (req.query.key == API_KEY){
        var food_id = req.query.foodId;
        //console.log(restaurant_id);
        if (food_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, name, description, image, price, CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'False\' END as isSize, '
                +'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'False\' END as isAddon, '
                +'discount FROM Food WHERE id = ?'
                , [food_id], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing foodId'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});
router.get('/searchFood', function(req, res, next){
    if (req.query.key == API_KEY){
        var search_query = '%' + req.query.foodName + '%';
        //console.log(restaurant_id);
        if (search_query != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, name, description, image, price, CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'False\' END as isSize, '
                +'CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'False\' END as isAddon, '
                +'discount FROM Food WHERE name LIKE ?'
                , [search_query], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing search_query'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
SIZE TABLE
GET
================================================================*/

router.get('/size', function(req, res, next){
    if (req.query.key == API_KEY){
        var food_id = req.query.foodId;
        //console.log(restaurant_id);
        if (food_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, description, extraPrice FROM Size WHERE id in (SELECT sizeId FROM Food_Size WHERE foodId = ?)', [food_id]
                , function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing foodId'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
ADDON TABLE
GET
================================================================*/

router.get('/addon', function(req, res, next){
    if (req.query.key == API_KEY){
        var food_id = req.query.foodId;
        //console.log(restaurant_id);
        if (food_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT id, description, extraPrice FROM Addon WHERE id in (SELECT addonId FROM Food_Addon WHERE foodId = ?)', [food_id]
                , function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing foodId'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
ORDER TABLE
GET / POST
================================================================*/

router.get('/order', function(req, res, next){
    if (req.query.key == API_KEY){
        var order_fbid = req.query.orderFBID;
        //console.log(restaurant_id);
        if (order_fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT OrderId, OrderFBID, OrderPhone, OrderName, OrderAddress, OrderStatus, OrderDate,'
                + 'RestaurantId, TransactionId, '
                + 'CASE WHEN COD = 1 THEN \'TRUE\' ELSE \'FALSE\' END as COD,'
                + 'TotalPrice, NumOfItem FROM `order` WHERE OrderFBID = ? AND NumOfitem > 0'
                + ' ORDER BY OrderId DESC'
                , [order_fbid]
                , function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing order_fbid'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.post('/createOrder', function(req, res, next){
    console.log(req.body);
    if (req.body.key == API_KEY){

        var order_phone = req.body.orderPhone;
        var order_name = req.body.orderName;
        var order_address = req.body.orderAddress;
        var order_date = moment(req.body.orderDate, "MM/DD/YYYY").format("YYYY-MM-DD");
        var restaurant_id = req.body.restaurantId;
        var transaction_id = req.body.transactionId;
        var cod = req.body.cod;
        var total_price = req.body.totalPrice;
        var num_of_item = req.body.numOfItem;
        var order_fbid = req.body.orderFBID;



        if (order_fbid != undefined){
            req.getConnection(function(error, conn){
                conn.query('INSERT INTO `order`(OrderFBID, OrderPhone, OrderName, OrderAddress, OrderStatus, OrderDate, RestaurantId' 
                + ',TransactionId, COD, TotalPrice, NumOfIteam) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                , [order_fbid, order_phone, order_name, order_address, 0, order_date, restaurant_id, transaction_id, cod, total_price, num_of_item], function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        conn.query('SELECT OrderId as orderNumber FROM `order` WHERE OrderFBID = ? AND NumOfItem > 0' 
                        + ' ORDER BY orderNumber DESC LIMIT 1', [order_fbid], function(err, rows, fields){
                            if (err){
                                res.status(500);
                                res.send(JSON.stringify({success: false, message: err.message}));
                            }
                            else{
                                res.send(JSON.stringify({success: true, result: rows}));
                            }
                        });

                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing orderFBID in body'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

/*===============================================================
ORDERDETAIL TABLE
GET / POST
================================================================*/

router.get('/orderDetail', function(req, res, next){
    if (req.query.key == API_KEY){
        var order_id = req.query.orderId;
        //console.log(restaurant_id);
        if (order_id != undefined){
            req.getConnection(function(error, conn){
                conn.query('SELECT OrderId, itemId, quantity, discount, extraPrice, size, addOn FROM OrderDetail WHERE orderId=?'
                , [order_id]
                , function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        if (rows.length > 0){
                            res.send(JSON.stringify({success: true, result: rows}));
                        }
                        else{
                            res.send(JSON.stringify({success: false, message: "Empty"}));
                        }
                    }   

                });
            });
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing orderId'}));
        }
    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

router.post('/updateOrder', function(req, res, next){
    console.log(req.body);
    if (req.body.key == API_KEY){

        var order_id = req.body.orderId;
        var order_detail;

        try {
            order_detail = JSON.parse(req.body.orderDetail);
        }
        catch (err){
            res.status(500);
            res.send(JSON.stringify({success: false, message: err.message}));
        }



        if (order_id != undefined && order_detail != undefined){

            var data_insert = [];
            for (var i = 0; i < order_detail.length; ++i){
                data_insert[i] = [
                    parseInt(order_id),
                    order_detail[i]["foodId"],
                    order_detail[i]["foodQuantity"],
                    order_detail[i]["foodPrice"],
                    0, // discount
                    order_detail[i]["foodSize"],
                    order_detail[i]["foodAddon"],
                    parseFloat(order_detail[i]["foodExtraPrice"])
                ]
            }
            //console.log(data_insert[0][6]);
            req.getConnection(function(error, conn){
                conn.query('INSERT INTO OrderDetail(OrderId, ItemId, Quantity, Price, Discount, Size, Addon, ExtraPrice) VALUE (?) '
                , data_insert, function(err, rows, fields){

                    if (err){
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}));
                    }
                    else {
                        res.send(JSON.stringify({success: true, message: "update success"}));
                    }   

                })
            })
        }
        else{
            res.send(JSON.stringify({success: false, message: 'Missing something in body'}));
        }

    }
    else{
        res.send(JSON.stringify({success: false, message: 'Wrong API key'}));
    }
});

module.exports = router;
