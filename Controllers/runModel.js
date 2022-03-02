// Node.js is calling pyScript.py file using child processes
import spawn from "child_process"

function runModel(file) {
    const py=spawn('python3',['pyScript.py',file]);
    py.stdout.on('data',(data)=>{
        console.log("output received");
    })
    py.on('close',(code)=>{
        console.log(`child process exited with code ${code}`);
    })


};
export default runModel;
