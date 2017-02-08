"use strict";
const dgram = require('dgram');

class Beacon {

    constructor (options){
        if(!options){
            options = {}
        }
        this.port = options.port || 8088;
        this.broadcastAddress = options.broadcastAddress || '230.185.192.108';
       
    }

    listen () {
        var self=this;
        this.client = dgram.createSocket('udp4');
        this.server = dgram.createSocket('udp4');
        let client = this.client;
        let server = this.server;
        
        client.on('listening', function () {
            var address = client.address();
            console.log('UDP Client listening on ' + address.address + ":" + address.port);
            client.setBroadcast(true)
            client.setMulticastTTL(128); 
            client.addMembership( self.broadcastAddress);
        });

        client.on('message', function (message, remote) {   
            console.log('A: Epic Command Received. Preparing Relay.');
            console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
        });

        server.on('listening', () => {
        var address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
            server.setBroadcast(true)
            server.setMulticastTTL(128);
            server.addMembership( self.broadcastAddress);   
        });

        this.beaconInterval = setInterval(broadcastNew, 3000);

        function broadcastNew() {
            
            var message = new Buffer("I'm here!");
            server.send(message, 0, message.length, self.port,  self.broadcastAddress);
            console.log("Sent " + message + " to the wire...");
        }

        server.bind();
        client.bind(this.port);

    }

    stop () {
        clearInterval(this.beaconInterval);
        this.server.close();
        this.client.close();
    }
}

module.exports = function(options){
    return new Beacon(options)
};