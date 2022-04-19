const Geocoder = {
    //定义decode解码方法
    decode: function(json) {
        if(typeof json == 'string'){
            alert('请传入json对象');
            return;
        }
        if (!json.UTF8Encoding) {
            return json;
        }
        const features = json.features;

        for (let f = 0; f < features.length; f++) {
            const feature = features[f];
            const geometry = feature.geometry;
            const coordinates = geometry.coordinates;
            const encodeOffsets = geometry.encodeOffsets;

            for (let c = 0; c < coordinates.length; c++) {
                const coordinate = coordinates[c];

                if (geometry.type === 'Polygon') {
                    coordinates[c] = Geocoder.decodePolygon(
                        coordinate,
                        encodeOffsets[c]
                    );
                }
                else if (geometry.type === 'MultiPolygon') {
                    for (let c2 = 0; c2 < coordinate.length; c2++) {
                        const polygon = coordinate[c2];
                        coordinate[c2] = Geocoder.decodePolygon(
                            polygon,
                            encodeOffsets[c][c2]
                        );
                    }
                }
            }
        }
        // Has been decoded
        json.UTF8Encoding = false;
        return json;
    },
    decodePolygon: function (coordinate, encodeOffsets) {
        const result = [];
        let prevX = encodeOffsets[0];
        let prevY = encodeOffsets[1];

        for (let i = 0; i < coordinate.length; i += 2) {
            let x = coordinate.charCodeAt(i) - 64;
            let y = coordinate.charCodeAt(i + 1) - 64;
            // ZigZag decoding
            x = (x >> 1) ^ (-(x & 1));
            y = (y >> 1) ^ (-(y & 1));
            // Delta deocding
            x += prevX;
            y += prevY;

            prevX = x;
            prevY = y;
            // Dequantize
            result.push([x / 1024, y / 1024]);
        }

        return result;
    },
    //定义encode压码方法
    encode: function (json) {
        if(typeof json == 'string'){
            alert('请传入json对象');
            return;
        }
        json.UTF8Encoding = true;
        const features = json.features;
        if (!features) {
            return;
        }
        features.forEach(function (feature){
            const encodeOffsets = feature.geometry.encodeOffsets = [];
            const coordinates = feature.geometry.coordinates;
            if (feature.geometry.type === 'Polygon') {
                coordinates.forEach(function (coordinate, idx){
                    coordinates[idx] = Geocoder.encodePolygon(
                        coordinate, encodeOffsets[idx] = []
                    );
                });
            } else if(feature.geometry.type === 'MultiPolygon') {
                coordinates.forEach(function (polygon, idx1){
                    encodeOffsets[idx1] = [];
                    polygon.forEach(function (coordinate, idx2) {
                        coordinates[idx1][idx2] = Geocoder.encodePolygon(
                            coordinate, encodeOffsets[idx1][idx2] = []
                        );
                    });
                });
            }
        });
        return json;
    },
    encodePolygon: function (coordinate, encodeOffsets) {
        let result = '';

        let prevX = Geocoder.quantize(coordinate[0][0]);
        let prevY = Geocoder.quantize(coordinate[0][1]);
        // Store the origin offset
        encodeOffsets[0] = prevX;
        encodeOffsets[1] = prevY;

        for (let i = 0; i < coordinate.length; i++) {
            const point = coordinate[i];
            result+=Geocoder.encodePoint(point[0], prevX);
            result+=Geocoder.encodePoint(point[1], prevY);

            prevX = Geocoder.quantize(point[0]);
            prevY = Geocoder.quantize(point[1]);
        }

        return result;
    },
    quantize: function (val) {
        return Math.ceil(val * 1024);
    },
    encodePoint: function (val, prev) {
        // Quantization
        val = Geocoder.quantize(val);
        // var tmp = val;
        // Delta
        val = val - prev;

        if (((val << 1) ^ (val >> 15)) + 64 === 8232) {
            //WTF, 8232 will get syntax error in js code
            val--;
        }
        // ZigZag
        val = (val << 1) ^ (val >> 15);
        // add offset and get unicode
        return String.fromCharCode(val+64);
    }
};

export default Geocoder