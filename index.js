const WebSocket = require("ws");
const redis = require("redis");
const todosInitial = require("./todos");

const main = async () => {

    const redisClient = redis.createClient({ url: 'redis://redis:6379' });

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    redisClient.connect();

    const wss = new WebSocket.Server({port: 3000});
    
    // Charger les todos initiaux dans Redis au démarrage de l'application
    await redisClient.set("todos", JSON.stringify(todosInitial), (err) => {
        if (err) {
            console.error("Erreur lors de la sauvegarde des todos initiaux dans Redis :", err);
        }
    });
    
    let todos = todosInitial;
    
    let users = new Set();
    
    const socketManagment = (socket) => {

        users.add(socket);
        socket.send(JSON.stringify(todos));
    
        socket.on("message", (event) =>{
            const data = JSON.parse(event);
            todos = data;
            users.forEach((user) => {
                user.send(JSON.stringify(todos));
            });
    
            redisClient.set("todos", JSON.stringify(todos), (err) => {
                if (err) {
                    console.error("Erreur lors de la sauvegarde des todos dans Redis :", err);
                }
            });
        });
    
        socket.on("close", () => {
            users.delete(socket);
        });
    }

    wss.on("connection", socketManagment);
}

main();

