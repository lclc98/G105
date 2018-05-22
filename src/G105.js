const Profile1 = require("./profiles/Profile1");
const G105Util = require("./G105Util");

const HID = require('node-hid');
const robot = require("robotjs");

class G105 {

    discover() {
        const devices = HID.devices();
        const connectedDevices = devices.filter(device => {
            console.log(device);
            return device.vendorId === 0x046d && device.productId === 0xc248 && device.interface == 1;
        });

        if (!connectedDevices.length) {
            throw new Error('No G105s are connected.');
        }
        console.log(connectedDevices);
        this.device = new HID.HID(connectedDevices[0].path);
        this.resetMacroKeys();
    }

    resetMacroKeys() {
        this.device.sendFeatureReport(G105Util.padBufferToLength([0x08], 7));

        // Setups led's and default profile
        const profile = this.device.getFeatureReport(0x06, 2);
        console.log(profile);
        if (profile === 0) {
            this.profile = 0x01;
            this.device.sendFeatureReport([0x06, this.profile]);
        } else {
            this.profile = 0x01;
        }
    }

    handleMediaKeys(key) {
        switch (key) {
            case 64: {
                robot.keyTap("audio_mute");
                break;
            }
            case 32: {
                robot.keyTap("audio_vol_down");
                break;
            }
            case 16: {
                robot.keyTap("audio_vol_up");
                break;
            }
            case 8: {
                robot.keyTap("audio_play");
                break;
            }
            case 4: {
                robot.keyTap("audio_stop");
                break;
            }
            case 2: {
                robot.keyTap("audio_prev");
                break;
            }
            case 1: {
                robot.keyTap("audio_next");
                break;
            }
        }
    }

    handleGKeys(data) {
        const key = G105Util.keycodeToGKey(data[1]);
        if (key) {
            if (this.profile === 0x01) {
                new Profile1().press(key);
            }
        }
    }

    handleProfiles(data) {
        this.profile = data[2];
        this.device.sendFeatureReport([0x06, this.profile]);
    }

    handleDevice() {
        this.device.on('data', data => {
            const keyType = data[0];

            if (keyType === 2) {
                this.handleMediaKeys(data[1])
            }

            if (keyType === 3) {
                if (data[1] !== 0) {
                    this.handleGKeys(data);
                }
                if (data[2] !== 0) {
                    this.handleProfiles(data);
                }
            }
        });

        this.device.on('error', err => {
            console.log('error', err);
        });
    }
}

module.exports = G105;
