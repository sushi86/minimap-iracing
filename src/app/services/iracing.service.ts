import { ElectronService } from "../core/services";
import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class IracingService {

    public running: boolean = false;
    public driveEvent: EventEmitter<any> = new EventEmitter();

    constructor(
        private electronService: ElectronService,
    ) { }

    start() {

        if (!this.running) {
            let sp = this.electronService.childProcess.spawn("C:\\Users\\sasch\\code\\minimap-iracing\\src\\assets\\node-iracing.exe");

            this.running = true;

            sp.on('error', (err) => {
                console.error('failed to start process', err);
                this.running = false;
            });
            sp.on('exit', (code, signal) => {
                console.error(`child process exited with code ${code}`);
                this.running = false;
            });
            sp.stderr.on('data', function (data) {
                //console.error(data.toString());
            });
            sp.stdout.on('data', function (data) {
                console.log(data.toString());
            });
        } else {
            console.log("Already running!");
        }

    }

    connect() {
        const socket = new WebSocket("ws://localhost:27300");

        socket.onopen = () => {
            console.log("opened");
        }

        socket.onerror = (error) => {
            console.error(error);
        }

        socket.onclose = () => {
            console.error("closed");
        }

        socket.onmessage = event => {
            //console.log(data);
            const realData = JSON.parse(event.data);
            if (typeof realData.values != 'undefined' && typeof realData.values.LapDistPct != 'undefined') {
                this.driveEvent.emit(realData.values.LapDistPct);
            }
        }

    }
}