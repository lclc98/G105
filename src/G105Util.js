class G105Util {
    static padBufferToLength(a, padLength) {
        return a.concat(G105Util.createPadBuffer(padLength - a.length));
    }

    static createPadBuffer(padLength) {
        let values = [];
        for (let x = 0; x < padLength; x++)
            values.push(0x0);
        return values;
    }

    static keycodeToGKey(key) {
        switch(key){
            case 1:{
                return 1;
            }
            case 2:{
                return 2;
            }
            case 4:{
                return 3;
            }
            case 8:{
                return 4;
            }
            case 16:{
                return 5;
            }
            case 32:{
                return 6;
            }

        }
    }
}

module.exports = G105Util;
