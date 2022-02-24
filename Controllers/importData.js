import execute from "child_process";
const exec = execute.exec;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const exportParams = "mongoexport --uri mongodb+srv://dicproject:dic12345@smartforestappcluster.hx2d5.mongodb.net/forestApp_DB --collection users --out C:/Users/user/Desktop/userData.json";

//Define the spawn function
const childSpawn = () => {
    //Get the export parameters

    // MongoDB dump child process
    const mongoDump = exec(exportParams, (error, stdout, stderr) => {
        if(!error){
            console.log("Imported Successfully");
        }
        if (error) {
            console.log(error.stack);
            console.log('Child MONGO Error code: ' + error.code);
            console.log('Child MONGO Signal received: ' + error.signal);
        }
        console.log('Child MONGO Process STDOUT: ' + stdout);
        console.log('Child MONGO Process STDERR: ' + stderr);
        
    });

    mongoDump.on('exit', (code) => {
        console.log('MONGO Child process exited with exit code ' + code);
    });
};

export default childSpawn;